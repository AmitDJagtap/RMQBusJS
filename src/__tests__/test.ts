import RMQBroker from '../index';
import FunctionRegistry from '../FunctionRegistory';

test('Instantion', () => {
  expect(new RMQBroker()).toBeInstanceOf(RMQBroker);
});

// test('Publish Function', () => {

//   var bus = new RMQBroker();
//   var data = {};
//   bus.publish("test.ping", data).then((res_data) => {
//       var result= JSON.parse(res_data.toString());
//       expect(true).toBe(true);
//   });

// });

// test('RPC Function', () => {

//   var bus = new RMQBroker();
//   var data = {};
//   bus.rpc("test.ping", data).then((res_data) => {
//       var result= JSON.parse(res_data.toString());
//       expect(true).toBe(true);
//   });
// });

test('Test Path fo InitFunction', () => {

  var funcreg = new FunctionRegistry();
  var data;
  data = funcreg.getFunctionPaths();
  console.log(data);
  expect(data.responder).toBeDefined();
});