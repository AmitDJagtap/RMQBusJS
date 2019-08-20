# RMQBusJS

This is a helper package for providing quick access to some commenly used event based communications interfaces in a microservices architeecture like RPC and Publish & Subscribe. This package also has the boilerplate code to auto register responders and consumers. 
Responders are the function which are bound to RPC call , whereas Consumers are functions which listen to published events.



## Setting up your apigateway 
```
import  RMQBroker  from  "rmqbusjs";

new  RMQBroker()
.init(rabbitmqConf)
.then(() => {
    // Connected to Rabbitmq Server
	// Do your other setup like DB etc
});
```

The `rabbitmqConf` parameter required by init() function is a JSON object which is as follows. 
```
"rabbitmq": {
     "url": "amqp://user:passwd@localhost:5672",
     "app": "apigateway",
     "globalExchangeName" : "myapp"
}
```
The `url` property is the url of your rabbitmq server ( not the managment url) and the `app` property provides a uniqe name to your service which is later used to identify the service and create queue names accordingly. The `globalExchangeName` is used to create a global exchange which is responsible for broadcasting messages to queues in case if you register a global conusmer.

Note - The RMQBuJs in this case is only required to provide functions to perfrom RPC calls or publish calls . And thus in your controller code you can use it like this .



## Setting up your Service

Create 3 folders with names `responders` `consumers` and `globalconsumers` which will have your functions . Each function will be in it's own file e.g `ping.ts`and `getPerson.ts` 

Responder.ts 
```
export interface Responder {

    handleTopic: string;
    /**
     * The execute method called by topic : handleTopic, and executed with req param.
     * Res(response) object will 
     * Res(null) method fail
     */
    executeWithResult(req: any): Promise<any>;
}

```

ping.ts
```
import { Responder } from "../interfaces/Responder";
export class ping implements Responder {
    handleTopic: string = "ping";
    executeWithResult(req: any): Promise < any > {
        return new Promise < any > ((res, rej) => {
            let name = req.data;
            res("Hello " + name);
        });
    }

}
```

Consumer.ts 

```
export interface Consumer {

    eventTopic: string;
    /**
     * The execute method called by topic : handleTopic, and executed with req param.
     * Res(response) object will 
     * Res(null) method fail
     */
    handleEvent(req: any): Promise<any>;
}
```

pingconsumer.ts
```
import {Consumer} from "../interfaces/Consumer"
export class pingconsumer implements Consumer {
    eventTopic: string = "pingconsumer";
    handleEvent(req: any): Promise<any> {
        return new Promise<any>((res, rej) => {
            let name = req.data;
            res("Hello " + name);
        });
    }
}
```

Main.ts
```
import  RMQBroker  from  "rmqbusjs";

new  RMQBroker()
.init(rabbitmqConf)
.then(() => {
	// Connected to Rabbitmq Server
	// Responders and Consumers have been registered
	// Do your other setup like DB etc
});
```


The above code will register all the above functions with respective topics mentioned in the function code as in the examples given above. Post that whenever an event is published or and rpc call is made the function code will be invoked.


Note - The global consumer function can be same as a consumer function and thus implement the same consumer interface.