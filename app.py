from flask import Flask, render_template, request
import pulp

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    resultado = None
    if request.method == "POST":
        # Obter valores do formulário
        dados = {
            "custo_carro": float(request.form["custo_carro"]),
            "custo_moto": float(request.form["custo_moto"]),
            "custo_bus": float(request.form["custo_bus"]),
            "tempo_carro": float(request.form["tempo_carro"]),
            "tempo_moto": float(request.form["tempo_moto"]),
            "tempo_bus": float(request.form["tempo_bus"]),
            "conforto_carro": float(request.form["conforto_carro"]),
            "conforto_moto": float(request.form["conforto_moto"]),
            "conforto_bus": float(request.form["conforto_bus"]),
            "limite_custo": float(request.form["limite_custo"]),
            "limite_tempo": float(request.form["limite_tempo"]),
            "min_dias": int(request.form["min_dias"])
        }

        # Definir o problema
        model = pulp.LpProblem("Maximizar_Conforto", pulp.LpMaximize)

        # Variáveis de decisão
        x1 = pulp.LpVariable('carro_uber', lowBound=0, cat='Integer')
        x2 = pulp.LpVariable('moto_uber', lowBound=0, cat='Integer')
        x3 = pulp.LpVariable('bus', lowBound=0, cat='Integer')

        # Função objetivo
        model += dados["conforto_carro"] * x1 + dados["conforto_moto"] * x2 + dados["conforto_bus"] * x3, "Conforto"

        # Restrições
        model += dados["custo_carro"] * x1 + dados["custo_moto"] * x2 + dados["custo_bus"] * x3 <= dados["limite_custo"], "Custo"
        model += dados["tempo_carro"] * x1 + dados["tempo_moto"] * x2 + dados["tempo_bus"] * x3 <= dados["limite_tempo"], "Tempo"
        model += x1 + x2 + x3 >= dados["min_dias"], "Minimo de Dias"
        model += x1 + x2 + x3 <= dados["min_dias"] + 1

        # Resolver o problema
        model.solve()

        # Calcular custo e tempo totais baseados nas variáveis otimizadas
        total_custo = round(dados["custo_carro"] * x1.varValue + dados["custo_moto"] * x2.varValue + dados["custo_bus"] * x3.varValue, 1)
        total_tempo = round(dados["tempo_carro"] * x1.varValue + dados["tempo_moto"] * x2.varValue + dados["tempo_bus"] * x3.varValue, 1)

        # Calcular saldo de tempo e custo
        saldo_tempo = round(dados["limite_tempo"] - total_tempo, 1)
        saldo_custo = round(dados["limite_custo"] - total_custo, 1)

        # Calcular média de conforto
        total_dias = x1.varValue + x2.varValue + x3.varValue
        media_conforto = round(pulp.value(model.objective) / total_dias, 1) if total_dias > 0 else 0

        # Obter resultados
        resultado = {
            "status": pulp.LpStatus[model.status],
            "carro_uber": round(x1.varValue, 1),
            "moto_uber": round(x2.varValue, 1),
            "bus": round(x3.varValue, 1),
            "conforto_total": round(pulp.value(model.objective), 1),
            "custo_total": total_custo,
            "tempo_total": total_tempo,
            "saldo_tempo": saldo_tempo,
            "saldo_custo": saldo_custo,
            "media_conforto": media_conforto,
            "dados_inseridos": dados
        }

    return render_template("index.html", resultado=resultado)

if __name__ == "__main__":
    app.run(debug=True)
