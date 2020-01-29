import 'dotenv/config';
import { randNumBetween }  from './handlers';

const { RTMClient } = require('@slack/rtm-api');
const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);

const sendReply = async (msg: string, channel: string) => {
  await rtm.sendMessage(msg, channel);
}

import { loadData } from './googleSheetLoader';
let restaurants: any;
const main = async () => {
  restaurants = await loadData();

  rtm.on('message', (event: any) => {
    if(event.text.includes('점심') || event.text.includes('저녁') || event.text.includes('회식') || event.text.includes('뭐먹지') || event.text.includes('페이코')) {
      let filteredRestaurants = restaurants;
      if(event.text.includes('점심')) {
        filteredRestaurants = filteredRestaurants.filter((restaurant: { isLunch: any; }) => restaurant.isLunch);
      }
      if(event.text.includes('저녁')) {
        filteredRestaurants = filteredRestaurants.filter((restaurant: { isDinner: any; }) => restaurant.isDinner);
      }
      if(event.text.includes('회식')) {
        filteredRestaurants = filteredRestaurants.filter((restaurant: { isDining: any; }) => restaurant.isDining);
      }
      if(event.text.includes('페이코')) {
        filteredRestaurants = filteredRestaurants.filter((restaurant: { isPayco: any; }) => restaurant.isPayco);
      }
      const suggestion = filteredRestaurants[randNumBetween(0, filteredRestaurants.length-1)];
  
      sendReply(`${suggestion.name} 가시져`, event.channel);
    }
  });
  
  (async () => {
    // Connect to Slack
    const { self, team } = await rtm.start();
  })();
};

main();
setInterval(() => {
  (async () => {
    restaurants = await loadData();
  })();
}, 180000);