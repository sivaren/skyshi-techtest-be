const runningApp = require('./app');

test('running app', () => {
  expect(runningApp(3030)).toBe(true);
});
