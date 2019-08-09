'use strict'

var express = require("express");
var app = express();

// Configuración de Express detrás de Proxies
app.set('trust proxy', 'loopback');


app.get("/node/old-browser", function(req, res) {
  res.send("<div id='old-browser'><div id='old-browser-text-container'><p>Ups! Parece que tu navegador es demasiado viejo.</p><p>Por favor, actualízalo o utiliza otro para acceder a los contenidos de esta página.</p></div></div>");
});


app.listen(3000, 'localhost', function() {
    console.log("Servidor corriendo en http://localhost:3000/");
});