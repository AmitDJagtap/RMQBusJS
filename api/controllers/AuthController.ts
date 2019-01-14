import RMQBroker from '../helpers/RMQBroker'

export function generateauthtoken(req: any, res: any, next: any) {

    let bus = new RMQBroker();
    let dataToSend = req.body;

    bus.rpc("authProxy.login", dataToSend).then((res_data) => {
        console.log(res_data.toString());
        res.json({"token" : res_data.toString()});
    });

}