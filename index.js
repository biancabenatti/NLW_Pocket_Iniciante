const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3L de água por dia',
    checked: false,
}

let metas = [ meta ]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:"})

    if(meta.length == 0) {
        console.log('A meta não pode ser vazia.')
        return
    }

    metas.push(
        { value: meta, checked: false }
    )
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas], // Depositando todas as metas em "escolhas"
        instructions: false, // Retirar as instruçoes padroes 
    })

    if(respostas.length == 0) {
        console.log("Nenhuma meta selecionada!")
        return
    }

    metas.forEach((m) => { 
        m.checked = false
    })

    respostas.forEach((resposta) => { // Vou pegar as respostas (metas selecionadas) e (forEach = para cada )  vai executar uma função que eu denominei resposta que fara  {const meta = metas.find((m) => { return m.value == resposta})
        const meta = metas.find((m) => { //find() = procurar 
            return m.value == resposta
        }) // Entao a resposta = a opção que selecionei e o m sera todas as opçoes, e no return ele ira comparar se o "valor/nome/string" da opçaõ que elecionei é igual a alguma de todas as minhas opçoes 

        meta.checked = true
    })

    console.log('Meta(s) marcadas como concluída(s)')

}


const start = async () => {
    while(true){
        
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
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                break
            case "sair":
                console.log('Até a próxima!')
                return
        }
    }
}

start();