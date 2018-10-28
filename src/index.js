"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slack = require('slack-node');
var _ = require('lodash');
var availableSlackDefaultColorNames = ['good', 'warning', 'danger'];

module.exports = function () {
  function Slackerr(webhookUri) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Slackerr);

    var slack = new Slack();
    slack.setWebhook(webhookUri);
    this.slack = slack;
    this.options = options;
  }

  _createClass(Slackerr, [{
    key: 'report',
    value: function report(err) {
      var _this = this;

      var fieldOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      return new Promise(function (resolve, reject) {
        if (!err) {
          var error = new Error('You should provide an error.');
          reject(error);
          return callback(error);
        }
        _this.slack.webhook({
          channel: _this.options.channel,
          username: _this.options.username,
          icon_emoji: _this.options.icon_emoji,
          attachments: [{
            title: err.name + ': ' + err.message,
            text: '```' + err.stack + '```',
            mrkdwn_in: ['text'],
            color: _this._isValidColor(_this.options.color) ? _this.options.color : err.status < 500 ? 'warning' : 'danger',
            ts: parseInt(Date.now() / 1000),
            fields: _this._generateFields(fieldOptions)
          }]
        }, function (err, response) {
          if (err) {
            reject(err);
            return callback(err);
          }
          resolve(response);
          return callback(null, response);
        });
      });
    }
  }, {
    key: '_generateFields',
    value: function _generateFields(fieldOptions) {
      fieldOptions = fieldOptions || {};
      var fields = [];

      for (var key in fieldOptions) {
        var fieldObj = {
          title: _.startCase(key)
        };
        if (_typeof(fieldOptions[key]) === "object") {
          fieldObj.value = fieldOptions[key]['value'];
          fieldObj.short = fieldOptions[key]['short'];
        } else {
          fieldObj.value = fieldOptions[key];
        }

        // If empty set it true
        fieldObj.short = fieldObj.short == null ? true : fieldObj.short;
        fields.push(fieldObj);
      }

      return fields;
    }
  }, {
    key: '_isHexColor',
    value: function _isHexColor(color) {
      return (/^#[0-9A-F]{6}$/i.test(color)
      );
    }
  }, {
    key: '_isValidColor',
    value: function _isValidColor(color) {
      return color && (this._isHexColor(color) || availableSlackDefaultColorNames.indexOf(color) !== -1);
    }
  }]);

  return Slackerr;
}();
