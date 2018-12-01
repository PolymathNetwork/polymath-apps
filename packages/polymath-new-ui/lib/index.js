
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics = function(d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function(d, b) {
            d.__proto__ = b;
          }) ||
        function(d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var react_1 = __importStar(require('react'));
var test_module_1 = require('./components/test-module');
exports.Foo = test_module_1.Foo;
var ImportedTestComponent = /** @class */ (function(_super) {
  __extends(ImportedTestComponent, _super);
  function ImportedTestComponent() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  ImportedTestComponent.prototype.render = function() {
    return react_1.default.createElement('p', null, this.props.text);
  };
  return ImportedTestComponent;
})(react_1.Component);
exports.ImportedTestComponent = ImportedTestComponent;
//# sourceMappingURL=index.js.map
