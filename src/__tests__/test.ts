import RMQBroker from '../index';

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