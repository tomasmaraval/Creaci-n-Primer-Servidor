var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON

const MySql = require('./modulos/mysql.js');

var app = express(); //Inicializo express
var port = process.env.PORT || 3000; //Ejecuto el servidor en el puerto 3000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('GET Home route working fine!')
});

app.get('/jugadores', async function(req, res){
    let jugadores = await MySql.realizarQuery("select * from Jugadores;");
    res.send(jugadores)
});

app.get('/equipos', async function(req, res){
    let equipos = await MySql.realizarQuery("select * from Equipos;");
    res.send(equipos)
});

app.get('/federaciones', async function(req, res){
    let federaciones = await MySql.realizarQuery("select * from Federaciones;");
    res.send(federaciones)
});

app.get('/nombreFederacion', async function(req, res){
    let nombreFederacion = await MySql.realizarQuery(`select * from Federaciones where Nombre = '${req.query.nombre}';`);
    res.send(nombreFederacion)
});

app.get('/nombreEquipo', async function(req, res){
    let nombreEquipo = await MySql.realizarQuery(`select * from Equipos where Nombre = '${req.query.nombre}';`);
    res.send(nombreEquipo)
});

app.get('/nombreJugadores', async function(req, res){
    let nombreJugadores = await MySql.realizarQuery(`select * from Jugadores where Nombre = '${req.query.nombre}';`);
    res.send(nombreJugadores)
});

/**
 * req = request. en este objeto voy a tener todo lo que reciba del cliente
 * res = response. Voy a responderle al cliente
 */

app.get('/saludo', function(req,res){
    console.log(req.query) //Los pedidos get reciben los datos del req.query
    res.send(`Hola ${req.query.nombre}, que tal?`)
})

app.post('/nombreDelPedido', function(req,res) {
    console.log(req.body) //Los pedidos post reciben los datos del req.body
    res.send("ok")
})

app.post('/addFederacion', async function(req,res) {
    let federacion = await MySql.realizarQuery(`select * from Federaciones where Nombre = '${req.body.Nombre}'`);
    if (federacion.length != 0) {
        res.send("ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO Federaciones (Nombre, Presidente, Ligas)
        VALUES ('${req.body.Nombre}', '${req.body.Presidente}', ${req.body.Ligas})`);
        res.send("ok");     
    }
})

app.post('/addEquipo', async function(req,res) {
    let equipo = await MySql.realizarQuery(`select * from Equipos where Nombre = '${req.body.Nombre}'`);
    if (equipo.length != 0) {
        res.send("ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO Equipos (Nombre, Títulos, Id_federación)
        VALUES ('${req.body.Nombre}', ${req.body.Títulos}, ${req.body.Id_federación})`);
        res.send("ok");     
    }
})

app.post('/addJugador', async function(req,res) {
    let jugador = await MySql.realizarQuery(`select * from Jugadores where Nombre = '${req.body.Nombre}'`);
    if (jugador.length != 0) {
        res.send("ya existe");
    } else {
        await MySql.realizarQuery(`INSERT INTO Jugadores (Nombre, Número, Id_equipo)
        VALUES ('${req.body.Nombre}', ${req.body.Número}, ${req.body.Id_equipo})`);
        res.send("ok");     
    }
})


app.put('/changeFederacion', async function(req, res){
    await MySql.realizarQuery(`UPDATE Federaciones SET Nombre = '${req.body.Nombre}' WHERE Id = '${req.body.Id}'`);
    res.send("ok");
})

app.put('/changeEquipo', async function(req, res){
    await MySql.realizarQuery(`UPDATE Equipos SET Nombre = '${req.body.Nombre}' WHERE Id = '${req.body.Id}'`);
    res.send("ok");
})

app.put('/changeJugador', async function(req, res){
    await MySql.realizarQuery(`UPDATE Jugadores SET Nombre = '${req.body.Nombre}' WHERE Id = '${req.body.Id}'`);
    res.send("ok");
})


app.delete('/deleteJugador', async function(req, res){
    await MySql.realizarQuery(`DELETE FROM Jugadores WHERE Id = '${req.body.Id}'`);
    res.send("ok");
})

//Pongo el servidor a escuchar
app.listen(port, function(){
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log('   [GET] http://localhost:3000/');
    console.log('   [GET] http://localhost:3000/saludo');
    console.log('   [POST] http://localhost:3000/nombreDelPedido');
    console.log('   [POST] http://localhost:3000/equipos');
    console.log('   [POST] http://localhost:3000/federaciones');
    console.log('   [POST] http://localhost:3000/jugadores');
    console.log('   [POST] http://localhost:3000/nombreEquipos');
    console.log('   [POST] http://localhost:3000/nombreFederaciones');
    console.log('   [POST] http://localhost:3000/nombreJugadores');
    console.log('   [POST] http://localhost:3000/addFederacion');
    console.log('   [POST] http://localhost:3000/addEquipo');
    console.log('   [POST] http://localhost:3000/addJugador');
    console.log('   [POST] http://localhost:3000/changeFederacion');
    console.log('   [POST] http://localhost:3000/changeEquipo');
    console.log('   [POST] http://localhost:3000/changeJugador');
    console.log('   [POST] http://localhost:3000/deleteJugador');
});