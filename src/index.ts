import 'dotenv/config';
const { RTMClient } = require('@slack/rtm-api');

const token = process.env.SLACK_TOKEN;

const rtm = new RTMClient(token);

rtm.on('message', (event: any) => {
  if(event.text.includes('점심')) {
    console.log('wwwwwwwwww');
  }
  console.log(event);
});

(async () => {
  // Connect to Slack
  const { self, team } = await rtm.start();
})();