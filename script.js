document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obter valores do formulário
    const custo_carro = parseFloat(document.getElementById('custo_carro').value);
    const custo_moto = parseFloat(document.getElementById('custo_moto').value);
    const custo_bus = parseFloat(document.getElementById('custo_bus').value);
    const tempo_carro = parseFloat(document.getElementById('tempo_carro').value);
    const tempo_moto = parseFloat(document.getElementById('tempo_moto').value);
    const tempo_bus = parseFloat(document.getElementById('tempo_bus').value);
    const conforto_carro = parseFloat(document.getElementById('conforto_carro').value);
    const conforto_moto = parseFloat(document.getElementById('conforto_moto').value);
    const conforto_bus = parseFloat(document.getElementById('conforto_bus').value);
    const limite_custo = parseFloat(document.getElementById('limite_custo').value);
    const limite_tempo = parseFloat(document.getElementById('limite_tempo').value);

    // Logs de depuração
    console.log('Custo Carro:', custo_carro);
    console.log('Custo Moto:', custo_moto);
    console.log('Custo Ônibus:', custo_bus);
    console.log('Tempo Carro:', tempo_carro);
    console.log('Tempo Moto:', tempo_moto);
    console.log('Tempo Ônibus:', tempo_bus);
    console.log('Conforto Carro:', conforto_carro);
    console.log('Conforto Moto:', conforto_moto);
    console.log('Conforto Ônibus:', conforto_bus);
    console.log('Limite de Custo:', limite_custo);
    console.log('Limite de Tempo:', limite_tempo);

    // Configurar o problema de programação linear
    const problem = {
        name: 'Maximizar Conforto',
        objective: {
            direction: glpk.GLP_MAX,
            name: 'Conforto',
            vars: [
                { name: 'x1', coef: conforto_carro },
                { name: 'x2', coef: conforto_moto },
                { name: 'x3', coef: conforto_bus }
            ]
        },
        subjectTo: [
            {
                name: 'Custo',
                vars: [
                    { name: 'x1', coef: custo_carro },
                    { name: 'x2', coef: custo_moto },
                    { name: 'x3', coef: custo_bus }
                ],
                bnds: { type: glpk.GLP_UP, ub: limite_custo }
            },
            {
                name: 'Tempo',
                vars: [
                    { name: 'x1', coef: tempo_carro },
                    { name: 'x2', coef: tempo_moto },
                    { name: 'x3', coef: tempo_bus }
                ],
                bnds: { type: glpk.GLP_UP, ub: limite_tempo }
            }
        ],
        bounds: [
            { name: 'x1', type: glpk.GLP_LO, lb: 0 },
            { name: 'x2', type: glpk.GLP_LO, lb: 0 },
            { name: 'x3', type: glpk.GLP_LO, lb: 0 }
        ],
        ints: ['x1', 'x2', 'x3']
    };

    // Resolver o problema
    const result = glpk.solve(problem);

    // Mostrar resultados
    document.getElementById('resultado').innerHTML = `
        <p>Status: ${result.result.status}</p>
        <p>Carro Uber: ${result.result.vars.x1} dias</p>
        <p>Moto Uber: ${result.result.vars.x2} dias</p>
        <p>Ônibus: ${result.result.vars.x3} dias</p>
        <p>Conforto Total: ${result.result.z}</p>
    `;

    // Logs de depuração dos resultados
    console.log('Status:', result.result.status);
    console.log('Carro Uber:', result.result.vars.x1);
    console.log('Moto Uber:', result.result.vars.x2);
    console.log('Ônibus:', result.result.vars.x3);
    console.log('Conforto Total:', result.result.z);
});
