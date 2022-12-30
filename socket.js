const server = require('http').createServer();


const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});


io.on('connection', client => {

    console.log('conectado')

    client.on("monstroBetSendRoullettePrizes",(args) => {
        client.emit("girarRoleta", args)
    })

    //console.log(client)
    //client.emit("limparJogo")
});

server.listen(3005)

console.log("rodando")