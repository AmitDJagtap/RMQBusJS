 import util from "util";
 import LocalBroker from '../helpers/LocalBroker'
 
export function pingCheck(req:any, res:any, next:any) {

    var name = req.swagger.params.name.value || 'stranger';
    var pingCheck = util.format('hello, %s!', name);
    var  bus = new LocalBroker();
    bus.rpc("ayosaldo.ping",{}).then((res)=>{
      res.code(200).json({"message": pingCheck});
    });
    
}