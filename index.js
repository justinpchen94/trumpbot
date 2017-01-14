const SlackBot = require('slackbots');
const dotenv = require('dotenv').load();
const request = require('request');

//initialize bot
let bot = new SlackBot({
    token: process.env.SLACK_API_TOKEN, // put the token
    name: 'trumpbot'
});

//find reference to bot on start
bot.on('start', function() {
    let self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
});

//called whenever a message is being processed
bot.on('message', function(data) {
  if(data.type === 'message' && data.text){

    //check if user is the bot, so bot doesn't talk to itself'
    if(data.user !== this.user.id) {

      request('https://api.whatdoestrumpthink.com/api/v1/quotes/random', function (error, resp, body) {
        if (!error && resp.statusCode == 200) {
          let text = `"${JSON.parse(body).message}"`;
          bot.postMessage(data.channel, text, {as_user: true});
        } 
      })
        
    }
  } 
   
})