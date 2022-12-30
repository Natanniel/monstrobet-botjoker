
// AXIOS API ==============================
const axios = require("axios");
//var host = "http://localhost:3001";
var host = "http://159.89.188.245:3001";
const api = axios.create({
    baseURL: host,
    headers: { "Content-Type": "application/json" }
});


// Servidor socket =============
const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

io.on('connection', client => {
    console.log('conectado')
    client.emit("limparJogo")
});

// Prizes ================
let prizes = [
    {
        nome: 'Copas',
        numero: 37
    },
    {
        nome: 'Espadas',
        numero: 38
    },
    {
        nome: 'Paus',
        numero: 39
    },
    {
        nome: 'Ouros',
        numero: 40
    },
    {
        nome: 'Joker',
        numero: 41
    },
    {
        nome: 'Jackpot',
        numero: 42
    }
]

let hardreset = () => {
    setTimeout(function () {
        main()
    }, 10000)
}

let jackpot = 0

let main = async () => {
    try {
        let dados;

        await sleep(1)
        io.emit("reportarTempo", 1)
        console.log("1")
        await sleep(1)
        io.emit("reportarTempo", 2)
        console.log("2")
        await sleep(1)
        io.emit("reportarTempo", 3)
        console.log("3")
        await sleep(1)
        io.emit("reportarTempo", 4)
        console.log("4")
        await sleep(1)
        io.emit("reportarTempo", 5)
        console.log("5")
        await sleep(1)
        io.emit("reportarTempo", 6)
        console.log("5")
        await sleep(1)
        io.emit("reportarTempo", 7)
        console.log("5")
        await sleep(1)
        io.emit("reportarTempo", 8)
        console.log("5")
        await sleep(1)
        io.emit("reportarTempo", 9)
        console.log("5")
        await sleep(1)
        io.emit("reportarTempo", 10)
        console.log("5")
        await sleep(1)
        
        // Obtem apostas e encerra apostas
        dados = await api.get("jokercommand/obterapostas")

        io.emit("encerrarApostas")
        await sleep(1)

        // Definindo ganhadores ========
        let apostas = dados.data
        let localJackpot = parseInt((jackpot / 20000) * 100)
        console.log(localJackpot)
        console.log(jackpot)
        let resultado = definirPercentualDeResultado(prizes, apostas, localJackpot)

        let resultadoDefinitivo = []
        for (let i = 0; i < resultado.length; i++) {
            if (resultado[i] == "Copas")
                resultadoDefinitivo.push(37)

            if (resultado[i] == "Espadas")
                resultadoDefinitivo.push(38)

            if (resultado[i] == "Paus")
                resultadoDefinitivo.push(39)

            if (resultado[i] == "Ouros")
                resultadoDefinitivo.push(40)

            if (resultado[i] == "Joker")
                resultadoDefinitivo.push(41)

            if (resultado[i] == "Jackpot")
                resultadoDefinitivo.push(42)
        }
        
        io.emit("girarRoleta", resultadoDefinitivo)
        await sleep(13)
        console.log(resultado)

        dado = await api.post("jokercommand/calculaganhadores",resultado)
        jackpot = dado.data.jackpot

        await api.post("jokercommand/abrirapostas")
        // Limpar o jogo
        io.emit("limparJogo")
        
        hardreset()
    } catch (e) {
        console.log("erro")
        console.log(e)
        hardreset()
    }
    /*
     
    
        /*
            
          
           
            setTimeout(function(){
                limparJogo()
            },15000)*/
}


let abrirApostas = () => {

}

let limparJogo = (array) => {
    console.log("Limpar jogo")

    setTimeout(function () {
        main()
    }, 20000)
}

let definirPercentualDeResultado = (prizes, apostas, jackpot) => {

    let prizesASortear = []
    let contadorMaximoPrizes = 100

    console.log("Chance jackpot" + jackpot)

    // Calcular jackpot %
    for (let i = 0; i < jackpot; i++) {
        var jackpotSort = ['Jackpot', 'Jackpot', 'Joker'];
        jackpotSort = embaralhar(jackpotSort)
        jackpotSort = embaralhar(jackpotSort)
        jackpotSort = embaralhar(jackpotSort)
        jackpotSort = embaralhar(jackpotSort)

        if (jackpotSort[0] == "Jackpot")
            prizesASortear.push("Jackpot")
        else
            prizesASortear.push("Joker")
        contadorMaximoPrizes--;
    }



    // verifica o prize mais apostado 
    let PrizeMaisApostado = {}
    let PrizesParaApostar = []
    for (let i = 0; i < apostas.length; i++)
        if (PrizeMaisApostado.nome == null || PrizeMaisApostado.nome == undefined)
            PrizeMaisApostado = apostas[i]
        else
            if (apostas[i].total > PrizeMaisApostado.total)
                PrizeMaisApostado = apostas[i]


    // Define os prizes para apostar 
    PrizesParaApostar.push("Joker")
    for (let i = 0; i < apostas.length; i++) {
        if (apostas[i].nome != PrizeMaisApostado.nome)
            PrizesParaApostar.push(apostas[i].nome)
    }


    while (contadorMaximoPrizes > 0) {

        PrizesParaApostar = embaralhar(PrizesParaApostar)
        PrizesParaApostar = embaralhar(PrizesParaApostar)
        PrizesParaApostar = embaralhar(PrizesParaApostar)
        PrizesParaApostar = embaralhar(PrizesParaApostar)
        PrizesParaApostar = embaralhar(PrizesParaApostar)
        prizesASortear.push(PrizesParaApostar[0])
        contadorMaximoPrizes--;
    }

    // Definir ganhadores
    let resultado = []

    // Ganhador 3X ==================================
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    resultado.push(prizesASortear[0])

    // Ganhador 2
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    resultado.push(prizesASortear[0])

    // Ganhador 3
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    prizesASortear = embaralhar(prizesASortear)
    resultado.push(prizesASortear[0])

    return resultado
    // Percentual de assertividade do Jackpot 


}

let embaralhar = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms * 1000);
    });
}

server.listen(3005);

console.log("rodando")
main()

