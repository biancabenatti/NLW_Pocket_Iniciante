const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}

let mensagem = "Bem vindo ao App de Metas";

let metas = [ meta ]

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8") // Vou tentar pegar os dados que estao no fs e leia o arquivo (QUAL ARQUIVO?, tipo de caracter)
        metas = JSON.parse(dados) // Metas vai receber um JSON e o parse converte para um array de metas  
    }
    catch (erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2)) // Aguardar o fs escrever no arquiv (metas.json, como ela é um array temos que trasformar ela em um json (JSON.stringify) )
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:"})

    if(meta.length == 0) {
        console.log('A meta não pode ser vazia.')
        return
    }

    metas.push(
        { value: meta, checked: false }
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas], // Depositando todas as metas em "escolhas"
        instructions: false, // Retirar as instruçoes padroes 
    })
    metas.forEach((m) => { 
        m.checked = false

    if(respostas.length == 0) {
        console.log("Nenhuma meta selecionada!")
        return
    }

    })

    respostas.forEach((resposta) => { // Vou pegar as respostas (metas selecionadas) e (forEach = para cada )  vai executar uma função que eu denominei resposta que fara  {const meta = metas.find((m) => { return m.value == resposta})
        const meta = metas.find((m) => { //find() = procurar 
            return m.value == resposta
        }) // Entao a resposta = a opção que selecionei e o m sera todas as opçoes, e no return ele ira comparar se o "valor/nome/string" da opçaõ que elecionei é igual a alguma de todas as minhas opçoes 

        meta.checked = true
    })

    mensagem = "'Meta(s) marcada(s) como concluída(s)'"

}

const metasRealizadas = async () => {
    if (metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const realizadas = metas.filter((meta) => { // Das metas sera realizado um filtro e ira pegar uma meta por vez e toda vez que essa meta for true ela armazena na variavel realizadas.
        return meta.checked
    })

    if (realizadas.length == 0) {
        mensagem = 'Não existem metas realizadas! :('
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => { 
    if (metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if (abertas.length == 0) {
        mensagem = 'Não existem metas abertas! :)'
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length, // + abertas.length =  concatenar para aparecer a quantidade de metas abertas 
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const itemsADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itemsADeletar.length == 0) {
        mensagem = "Nenhum item para deletar!"
        return
    }

    itemsADeletar.forEach((item) => { // Vou pegar cada item do meu itensADeletar
        metas = metas.filter((meta) => {  // e filtrar cada meta do meu array metas   
            return meta.value != item // Como aqui sempre retorna true, comparar cada valor meta do meu array de metas e verificar se é diferente do item, pois os itens estao todos marcados 
        })
    })

    mensagem = "Meta(s) deleta(s) com sucesso!"
}

const mostrarMensagem = () => {
    console.clear();

    if (mensagem != "") { // Toda vez que a mensagem é diferente de vazio 
        console.log(mensagem) // Mostrar a mensagem 
        console.log("") // Quebra de linha
        mensagem = "" // Mensagem vazia 
    }
}











const start = async () => {
    await carregarMetas()

    while (true) {
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch (opcao) {
            case "cadastrar":
                await cadastrarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log('Até a próxima!')
                return
        }
    }
}

start();