'use strict';
import nconf from "nconf";
import path from "path";
import express from "express";
var SwaggerExpress = require('swagger-express-mw');
import LocalBroker from "./api/helpers/LocalBroker"
let app = express();


let config = {
  appRoot: __dirname // required config
};
nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../config/config.json') });

nconf.load((err: Error) => {

    SwaggerExpress.create(config, function(err:any, swaggerExpress:any) {
        if (err) { throw err; }
      
        // install middleware
        swaggerExpress.register(app);
      
        var port = process.env.PORT || 10010;
        app.listen(port);
      
        if (swaggerExpress.runner.swagger.paths['/hello']) {
          console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
        }
        new LocalBroker().init();
      });

});
