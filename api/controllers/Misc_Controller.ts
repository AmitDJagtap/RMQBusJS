 import util from "util";
 import RMQBroker from '../helpers/RMQBroker'
import { func } from "joi";

 export function pingCheck(req: any, res: any, next: any) {

   var name = req.swagger.params.name.value || '4';
   var param = parseInt(name);
   var bus = new RMQBroker();

   bus.rpc("ayosaldo.ping", {
     data: param
   }).then((res_data) => {
     console.log(res_data.toString());
     res.json({
       "message": res_data.toString()
     });
   });

 }

 export function membersPingCheck(req: any, res: any, next: any) {
   var name = req.swagger.params.name.value || '4';
   var param = parseInt(name);
   var bus = new RMQBroker();

   bus.rpc("members.ping", {
     data: param
   }).then((res_data) => {
     console.log(res_data.toString());
     res.json({
       "message": res_data.toString()
     });
   });
 }

 export function greet(req:any,res:any, next :any) {
  var name = req.swagger.params.name.value || 'Jessie';
  var bus = new RMQBroker();

  bus.rpc("members.sayhi", {
    data: name
  }).then((res_data) => {
    console.log(res_data.toString());
    res.json({
      "message": res_data.toString()
    });
  });
 }