const SlackError = require('./lib/index');
const slackerr = new SlackError('https://hooks.slack.com/services/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', {channel: "#pullme-dev", username: "test user", icon_emoji: ":boom:", color: '#439FE0'})

try{
    throw new Error("test")
}catch(err){
    slackerr.report(err, {username: {value: 'test', short: true}})
}