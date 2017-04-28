"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slack = require('slack-node');
var _ = require('lodash');

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
            color: err.status < 500 ? 'warning' : 'danger',
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
        fields.push({
          title: _.startCase(key),
          value: fieldOptions[key] || 'None',
          short: true
        });
      }
      return fields;
    }
  }]);

  return Slackerr;
}();
