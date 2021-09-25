"use strict";

var _express = _interopRequireDefault(require("express"));

var _router = _interopRequireDefault(require("./router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use('/', _router["default"]);
app.listen(1212, function () {
  console.log("Example app listening at http://localhost:".concat(1212));
});