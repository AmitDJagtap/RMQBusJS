import RMQBroker from '../helpers/RMQBroker'
import {array} from "joi";

export function generateToken(req: any, res: any, next: any) {

    let bus = new RMQBroker();
    let dataToSend = req.body;

    bus.rpc("authproxy.generateToken", dataToSend).then((res_data) => {
        res.json({
            "token": res_data.toString()
        });
    });

}

/**
 * This is the Service call to login members
 * @param req
 * @param res
 * @param next
 */
export function memberLogin(req:any,res:any,next: any){
    var data =  getRequestData(req);
    var bus = new RMQBroker();

    bus.rpc("members.login", data).then((res_data) => {

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
    var data =  getRequestData(req);
    var bus = new RMQBroker();

    bus.rpc("members.verifyAccount", data).then((res_data) => {

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
    var data =  getRequestData(req);
    var bus = new RMQBroker();
    bus.rpc("members.verifyAccessToken", data).then((res_data) => {
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
    var data =  getRequestData(req);
    var bus = new RMQBroker();
    bus.rpc("members.verifyOTP", data).then((res_data) => {
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to resend otp
 * @param req
 * @param res
 * @param next
 */
export function resendOTP(req: any, res: any, next: any) {
    var data = {
        "headers": req.headers,
        "param": req.body,
        "apiPath": req.originalUrl,
        "method": req.method
    };
    var bus = new RMQBroker();

    bus.rpc("members.resendOTP", data).then((res_data) => {
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to resend otp
 * @param req
 * @param res
 * @param next
 */
export function verifyPin(req: any, res: any, next: any) {
    var data = {
        "headers": req.headers,
        "param": req.body,
        "apiPath": req.originalUrl,
        "method": req.method
    };
    var bus = new RMQBroker();

    bus.rpc("members.verifyPin", data).then((res_data) => {
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to resend otp
 * @param req
 * @param res
 * @param next
 */
export function registerAPI(req: any, res: any, next: any) {
    var data = {
        "headers": req.headers,
        "param": req.body,
        "apiPath": req.originalUrl,
        "method": req.method
    };
    var bus = new RMQBroker();

    bus.rpc("members.registerAPI", data).then((res_data) => {
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * This is the Service call to resend otp
 * @param req
 * @param res
 * @param next
 */
export function forgotPin(req: any, res: any, next: any) {
    var data = {
        "headers": req.headers,
        "param": req.body,
        "apiPath": req.originalUrl,
        "method": req.method
    };
    var bus = new RMQBroker();

    bus.rpc("members.forgotPin", data).then((res_data) => {
        res.json(JSON.parse(res_data.toString()));
    });
}

/**
 * Function will generate the request data for members service
 * @param req
 * @returns {{headers: *, param: *, apiPath: string | *, method: *}}
 */
function getRequestData(req:any){
    var headers = req.headers;
    headers["apiPath"] = req.originalUrl;
    headers["method"] = req.method;
    headers["requestIp"] = req.connection.remoteAddress;
    var data = { "headers": req.headers, "param": req.body, "apiPath": req.originalUrl, "method": req.method,"requestIp":req.connection.remoteAddress};
    return data;
}