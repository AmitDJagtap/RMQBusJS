import RMQBroker from '../helpers/RMQBroker'

export function generateToken(req: any, res: any, next: any) {

    let bus = new RMQBroker();
    let dataToSend = req.body;

    bus.rpc("authproxy.generateToken", dataToSend).then((res_data) => {
        res.json({"token" : res_data.toString()});
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

    bus.rpc("members.login", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });

}
/**
 * This is the Service call to members verify account
 * @param req
 * @param res
 * @param next
 */
export function verifyAccount(req:any,res:any,next: any){
    var data = {"headers":req.headers,"param": req.body,"apiPath":req.originalUrl,"method":req.method};
    var bus = new RMQBroker();

    bus.rpc("members.verifyAccount", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });

}

/**
 * This is the Service call to members verify Access Token
 * @param req
 * @param res
 * @param next
 */
export function verifyAccessToken(req:any,res:any,next: any){
    var data = {"headers":req.headers,"param": req.body,"apiPath":req.originalUrl,"method":req.method};
    var bus = new RMQBroker();
    console.log(data);
    bus.rpc("members.verifyAccessToken", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to members verify Access Token
 * @param req
 * @param res
 * @param next
 */
export function verifyOTP(req:any,res:any,next: any){
    var data = {"headers":req.headers,"param": req.body,"apiPath":req.originalUrl,"method":req.method};
    var bus = new RMQBroker();
    console.log(data);
    bus.rpc("members.verifyOTP", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to resend otp
 * @param req
 * @param res
 * @param next
 */
export function resendOTP(req:any,res:any,next: any){
    var data = {"headers":req.headers,"param": req.body,"apiPath":req.originalUrl,"method":req.method};
    var bus = new RMQBroker();
    console.log(data);
    bus.rpc("members.resendOTP", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to resend otp
 * @param req
 * @param res
 * @param next
 */
export function verifyPin(req:any,res:any,next: any){
    var data = {"headers":req.headers,"param": req.body,"apiPath":req.originalUrl,"method":req.method};
    var bus = new RMQBroker();
    console.log(data);
    bus.rpc("members.verifyPin", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to resend otp
 * @param req
 * @param res
 * @param next
 */
export function registerAPI(req:any,res:any,next: any){
    var data = {"headers":req.headers,"param": req.body,"apiPath":req.originalUrl,"method":req.method};
    var bus = new RMQBroker();
    console.log(data);
    bus.rpc("members.registerAPI", data).then((res_data) => {
        console.log(res_data.toString());
        res.json(JSON.parse(res_data.toString()));
    });
}