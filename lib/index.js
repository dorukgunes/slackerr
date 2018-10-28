"use strict"
const Slack = require('slack-node')
const _ = require('lodash')
const availableSlackDefaultColorNames = ['good', 'warning', 'danger']

module.exports = class Slackerr {
  constructor (webhookUri, options = {}) {
    const slack = new Slack()
    slack.setWebhook(webhookUri)
    this.slack = slack
    this.options = options
  }

  report (err, fieldOptions = {}, callback = () => {}) {
    return new Promise((resolve, reject) => {
      if (!err) {
        const error = new Error('You should provide an error.')
        reject(error)
        return callback(error)
      }
      this.slack.webhook({
        channel: this.options.channel,
        username: this.options.username,
        icon_emoji: this.options.icon_emoji,
        attachments: [{
          title: `${err.name}: ${err.message}`,
          text: '```' + err.stack + '```',
          mrkdwn_in: ['text'],
          color: this._isValidColor(this.options.color) ? this.options.color : (err.status < 500) ? 'warning' : 'danger',
          ts: parseInt(Date.now() / 1000),
          fields: this._generateFields(fieldOptions)
        }]
      }, (err, response) => {
        if (err) {
          reject(err)
          return callback(err)
        }
        resolve(response)
        return callback(null, response)
      })
    })
  }

  _generateFields (fieldOptions) {
    fieldOptions = fieldOptions || {}
    const fields = []

    for (const key in fieldOptions) {
      const fieldObj = {
        title: _.startCase(key)
      }; 
      if (typeof fieldOptions[key] === "object"){
        fieldObj.value = fieldOptions[key]['value'];
        fieldObj.short = fieldOptions[key]['short'] 
      }else {
        fieldObj.value = fieldOptions[key]
      }

      // If empty set it true
      fieldObj.short = fieldObj.short == null ? true : fieldObj.short;
      fields.push(fieldObj)
    }

    return fields
  }

  _isHexColor (color){
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  _isValidColor (color){
    return color && (this._isHexColor(color) || availableSlackDefaultColorNames.indexOf(color) !== -1)
  }
}



