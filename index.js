const Slack = require('slack-node')
const _ = require('lodash')

class Slackerr {
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
          color: (err.status < 500) ? 'warning' : 'danger',
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
      fields.push({
        title: _.startCase(key),
        value: fieldOptions[key] || 'None',
        short: true
      })
    }
    return fields
  }
}

module.exports = new Slackerr()


