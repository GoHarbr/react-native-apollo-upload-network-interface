'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UploadNetworkInterface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createNetworkInterface;

var _apolloClient = require('apollo-client');

var _networkInterface = require('apollo-client/networkInterface');

var _reactNativeFetchBlob = require('react-native-fetch-blob');

var _reactNativeFetchBlob2 = _interopRequireDefault(_reactNativeFetchBlob);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createNetworkInterface(opts) {
    var uri = opts.uri;

    return new UploadNetworkInterface(uri, opts);
}

var UploadNetworkInterface = exports.UploadNetworkInterface = function (_HTTPFetchNetworkInte) {
    _inherits(UploadNetworkInterface, _HTTPFetchNetworkInte);

    function UploadNetworkInterface() {
        _classCallCheck(this, UploadNetworkInterface);

        return _possibleConstructorReturn(this, (UploadNetworkInterface.__proto__ || Object.getPrototypeOf(UploadNetworkInterface)).apply(this, arguments));
    }

    _createClass(UploadNetworkInterface, [{
        key: 'getFormData',
        value: function getFormData(_ref, query) {
            var request = _ref.request;

            return [{
                name: 'operationName',
                data: request.operationName
            }, {
                name: "variables",
                data: JSON.stringify(_lodash2.default.omit(request.variables, [request.variables.input.blobFieldName, 'fileName']))
            }, {
                filename: request.variables.fileName,
                type: request.variables[request.variables.input.blobFieldName].split(";")[0].split(":")[1],
                name: request.variables.input.blobFieldName,
                data: request.variables[request.variables.input.blobFieldName].split(",")[1]
            }, {
                name: 'query',
                data: query
            }];
        }
    }, {
        key: 'fetchFromRemoteEndpoint',
        value: function fetchFromRemoteEndpoint(req) {
            var options = this.getJSONOptions(req);
            if (this.isUpload(req)) {
                this.performUploadMutation(req);
            }
            return fetch(this._uri, options);
        }
    }, {
        key: 'performUploadMutation',
        value: function performUploadMutation(req) {
            var query = (0, _apolloClient.printAST)(req.request.query);
            var data = this.getFormData(req, query);
            return _reactNativeFetchBlob2.default.fetch('POST', this._uri, {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*'
            }, data).catch(function (err) {});
        }
    }, {
        key: 'isUpload',
        value: function isUpload(_ref2) {
            var request = _ref2.request;

            if (request.variables) {
                for (var key in request.variables.input) {
                    if (key == 'blobFieldName') {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        key: 'getJSONOptions',
        value: function getJSONOptions(_ref3) {
            var request = _ref3.request,
                options = _ref3.options;

            console.log('jsonreq');
            return Object.assign({}, this._opts, {
                body: JSON.stringify((0, _networkInterface.printRequest)(request)),
                method: 'POST'
            }, options, {
                headers: Object.assign({}, {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                }, options.headers)
            });
        }
    }]);

    return UploadNetworkInterface;
}(_networkInterface.HTTPFetchNetworkInterface);
