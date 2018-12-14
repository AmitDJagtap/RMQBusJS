 import util from "util";
 
export function sayHello (req:any, res:any, next:any) {

    var name = req.swagger.params.name.value || 'stranger';
    var hello = util.format('Hello, %s!', name);
    res.json({
      "code": 0,
      "type": "string",
      "message": "hey"
    });
}