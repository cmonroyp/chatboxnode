"use strict";

// Libreria express para crear un api rest
const express = require("express");
const bodyParser = require("body-parser");

// Para hacer peticiones http de forma simple
const request = require("request");

// Para usar express dentro de Node
const app = express();

// Definimos el puerto
const port = process.env.PORT || 8899;

// Traducción en tiempo real
const translate = require("google-translate-api");

// Middleware de análisis del cuerpo de Node.js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Métodos de ruta (VERBOS HTTP: POST, GET, PUT, DELETE, etc...). Endpoint
app.post("/api/tiempo", (req, res) => {
  // JSON QUE ENVIA DIALOGFLOW
  //para probrar desde postman
  //let ubicacion = req.body.ciudad;

  // desde dialogflow
  //let ubicacion = "Bogota";
  let ubicacion = req.body.queryResult.parameters.ciudad;
  // URL del API para la consulta de la temperatura por la posición geográfica
  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${ubicacion}&APPID=3701495810aabdcb2bb362781c3edf2f`;

  getWeatherCity(url)
    .then(resp => {
      console.log("respuesta que llego", resp);
      res.status(resp.cod).send(resp);
    })
    .catch(err => {
      console.log("Error en la Consulta", err);
    });
});

function getWeatherCity(url) {
  return new Promise((resolve, reject) => {
    request(url, function(error, response, body) {
      let kelvin = 273.15;
      // Convertimos a JSON, la respuesta del servicio
      let _body = JSON.parse(body);

      // Que no de error el servicio externo
      if (_body.cod === "200") {
        // Pequeñas conversiones
        let meses = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre"
        ];
        let mesTxt =
          meses[parseInt(_body.list[0].dt_txt.split(" ")[0].split("-")[1]) - 1];
        let fecha = `${
          _body.list[0].dt_txt.split(" ")[0].split("-")[2]
        } de ${mesTxt} de ${_body.list[0].dt_txt.split(" ")[0].split("-")[0]}`;
        let temperatura = _body.list[0].main.temp - kelvin;

        // Formamos la respuesta que enviaremos a Dialogflow
        let _response = new Object();

        // DEFAULT RESPONSE EN DIALOGFLOW
        _response.fulfillmentText = `La temperatura prevista para el día ${fecha} (${
          _body.list[0].dt_txt.split(" ")[1]
        }) en ${_body.city.name} es de ${temperatura.toFixed(1)} grados `;

        _response.cod = _body.cod;
        _response.source = "webhook";
        resolve(_response);
      } else {
        // ERROR!!!
        translate(_body.message, { to: "es" })
          .then(resTra => {
            let _response = new Object();
            _response.fulfillmentText = resTra.text;
            _response.source = "webhook";
            res.status(200).send(_response);
          })
          .catch(err => {
            let _response = new Object();
            _response.fulfillmentText = "No existe la Ciudad!.";
            res.status(200).send(_response);
            console.error(err);
          });
      }
    });
  });
}
// Escuchando nuestro servidor Node
app.listen(port, () => {
  console.log(`API REST en el puerto: http://localhost:${port}`);
});
