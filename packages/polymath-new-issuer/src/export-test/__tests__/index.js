
exports.__esModule = true;
var React = require('react');
var renderer = require('react-test-renderer');
var __1 = require('../');
test('renders without crashing', function() {
  var component = renderer.create(
    React.createElement(__1.TestComponent, { text: 'HELLOOOOO' })
  );
  var tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
