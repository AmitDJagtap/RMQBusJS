import RMQBroker from '../index';

test('My Greeter', () => {
  expect(new RMQBroker()).toBeInstanceOf(RMQBroker);
});