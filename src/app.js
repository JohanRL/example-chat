// importando express
const express = require("express");

// destruturación de Server socket.
const  { Server } = require("socket.io");

// importando handlebars
const handlebars = require('express-handlebars');

// importamos el router
const viewsRouter = require ('./routes/views.router.js');

// express
const app = express();
const PORT = process.env.PORT||8080;
const server = app.listen(PORT,()=>console.log(`Listen on port ${PORT}`));

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine','handlebars');

app.use(express.json());
app.use(express.static(__dirname+'/public'))

// configurar router
app.use('/',viewsRouter);

const io = new Server(server);
// iniciamos array vacio donde recibimos los mensajes
const messages= [];

io.on('connection',socket=>{
    console.log("Socket connected");

    socket.on('message',data=>{
        messages.push(data);
        io.emit('messageLogs',messages);
    })
    
    socket.on('authenticated',data=>{
        socket.broadcast.emit('newUserConnected',data);
    })
})