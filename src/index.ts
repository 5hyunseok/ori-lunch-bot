import 'dotenv/config';
import { toBool, randNumBetween }  from './handlers';

import { readFileSync } from 'fs';
const csvData = readFileSync('src/data.csv','utf8');
const restaurants = csvData.split('\n').map(line => line.split(',')).map(arr => {
  return {
    'location': arr[0],
    'name': arr[1],
    'isLunch': toBool(arr[2]),
    'isDinner': toBool(arr[3]),
    'isDining': toBool(arr[4]),
    'alcohols': arr[5].split('/'),
    'isPayco': toBool(arr[6])
  }
});

const { RTMClient } = require('@slack/rtm-api');
const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);

const sendReply = async (msg: string, channel: string) => {
  await rtm.sendMessage(msg, channel);
}

rtm.on('message', (event: any) => {
  if(event.text.includes('점심') || event.text.includes('저녁') || event.text.includes('회식') || event.text.includes('뭐먹지') || event.text.includes('페이코')) {
    let filteredRestaurants = restaurants;
    if(event.text.includes('점심')) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.isLunch);
    }
    if(event.text.includes('저녁')) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.isDinner);
    }
    if(event.text.includes('회식')) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.isDining);
    }
    if(event.text.includes('페이코')) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.isPayco);
    }
    const suggestion = filteredRestaurants[randNumBetween(0, filteredRestaurants.length-1)];

    sendReply(`${suggestion.name} 가시져`, event.channel);
  }
});

(async () => {
  // Connect to Slack
  const { self, team } = await rtm.start();
})();