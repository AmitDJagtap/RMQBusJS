'use strict';
import nconf from "nconf";
import path from "path";
import express from "express";
var SwaggerExpress = require('swagger-express-mw');
import   RMQBroker  from "./api/helpers/RMQBroker";
let app = express();


let config = {
  appRoot: __dirname // required config
};
nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../config/config.json') });

nconf.load((err: Error) => {

  new RMQBroker().init().then(()=>{

    SwaggerExpress.create(config, function(err:any, swaggerExpress:any) {
        if (err) { throw err; }
      
        // install middleware
        swaggerExpress.register(app);
      
        var port = process.env.PORT || 10010;
        app.listen(port);
      
        if (swaggerExpress.runner.swagger.paths['/ping']) {
          console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
        }
      });
      
    });
});
