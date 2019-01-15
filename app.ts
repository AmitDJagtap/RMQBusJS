'use strict';
import nconf from "nconf";
import path from "path";
import express from "express";
var SwaggerExpress = require('swagger-express-mw');
import RMQBroker from "./api/helpers/RMQBroker";
import bodyParser from 'body-parser';
let app = express();


let config = {
  appRoot: __dirname
};

nconf.argv()
  .env()
  .file({
    file: path.join(__dirname, 'config/config.json')
  });

let rabbitmqConf = nconf.get("rabbitmq");
if (typeof rabbitmqConf === "string") {
  rabbitmqConf = JSON.parse(rabbitmqConf);
}
new RMQBroker().init(rabbitmqConf).then(() => {

  SwaggerExpress.create(config, function (err: any, swaggerExpress: any) {
    if (err) {
      throw err;
    }
    let port = process.env.port || 8585;
    app.use(bodyParser.urlencoded({
      extended: false
    }))
    app.use(bodyParser.json());
    swaggerExpress.register(app);
    app.listen(port);

    if (Object.keys(swaggerExpress.runner.swagger.paths).length > 1) {
      console.log('API Gateway Started.');
      console.log("Paths Registered : \n\t");
      Object.keys(swaggerExpress.runner.swagger.paths).forEach(key => {
        console.log(key);
        console.log("________________________________________\n\t");
      });
    }
  });

});