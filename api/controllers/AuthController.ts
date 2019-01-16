import RMQBroker from '../helpers/RMQBroker'

export function generateauthtoken(req: any, res: any, next: any) {

    let bus = new RMQBroker();
    let dataToSend = req.body;

    bus.rpc("authProxy.login", dataToSend).then((res_data) => {
        console.log(res_data.toString());
        res.json({"data" : res_data.toString()});
    });

}

/**
 * This is the Service call to login members
 * @param req
 * @param res
 * @param next
 */
export function memberLogin(req:any,res:any,next: any){
    var data = {"headers":req.headers,"param": req.body,"apiPath":req.originalUrl,"method":req.method};
    var bus = new RMQBroker();

    bus.rpc("membersAyopop.login", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });

}