import 'dotenv/config';
import { randNumBetween, loadData, generateMsg }  from './handler';

const { RTMClient } = require('@slack/rtm-api');
const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);

const { WebClient } = require('@slack/web-api');
const web = new WebClient(token);

const username = 'ori-lunch-bot';
const iconUrl = 'https://avatars.slack-edge.com/temp/2020-01-30/931243167398_8363806b940c1c570395.png';

const sendReply = async (filteredRestaurants: any[], channel: string, keywords: string[]) => {
  await web.chat.postMessage(generateMsg(username, iconUrl, channel, filteredRestaurants, keywords));
  // await rtm.sendMessage(msg, channel);
}

const keywords = [
  {
    keyword: '점심',
    filter: ['isLunch'],
    filterBoolean: true
  },
  {
    keyword: '저녁',
    filter: ['isDinner'],
    filterBoolean: true
  },
  {
    keyword: '뭐먹지',
    filter: [],
    filterBoolean: true
  },
  {
    keyword: '페이코',
    filter: ['isPayco'],
    filterBoolean: true
  }
];

let restaurants: any;
const main = async () => {
  restaurants = await loadData();

  rtm.on('message', (event: any) => {

    let hasKeyword = keywords.some(v => event.text.includes(v.keyword));

    if(hasKeyword) {
      console.log(`${event.channel}: ${event.text}`);
      let keywords = [];
      let filteredRestaurants = restaurants;
      // keywords.map((v) => {
      //   if(event.text.includes(v.keyword)) {
      //     const flag = v.filterBoolean;
      //     console.log(`${flag} flag!`);
      //     v.filter.map((filter) => {
      //       filteredRestaurants = filteredRestaurants.filter((restaurant: any) => flag == restaurant[filter]); 
      //     })
      //   }
      // })

      // 기본 필터
      // 점심
      if(event.text.includes('저녁')) {
        filteredRestaurants = filteredRestaurants.filter((restaurant: any) => restaurant.isDinner);
        keywords.push('저녁');
      } else {
        filteredRestaurants = filteredRestaurants.filter((restaurant: any) => restaurant.isLunch);
        keywords.push('점심');
      }
      
      // 페이코
      if(event.text.includes('페이코')) {
        filteredRestaurants = filteredRestaurants.filter((restaurant: any) => restaurant.isPayco);
        keywords.push('페이코');
      } else {
        // random 으로 페이코 넣고 안넣고
        // if (Math.random() > 0.5) {
        //   filteredRestaurants = filteredRestaurants.filter((restaurant: any) => restaurant.isPayco);
        //   keywords.push('페이코');
        // }
      }
      
      sendReply(filteredRestaurants, event.channel, keywords);
    }
    

    // if(event.text.includes('점심') || event.text.includes('저녁') || event.text.includes('회식') || event.text.includes('뭐먹지') || event.text.includes('페이코')) {
    //   let filteredRestaurants = restaurants;
    //   if(event.text.includes('점심')) {
    //     filteredRestaurants = filteredRestaurants.filter((restaurant: { isLunch: any; }) => restaurant.isLunch);
    //   }
    //   if(event.text.includes('저녁')) {
    //     filteredRestaurants = filteredRestaurants.filter((restaurant: { isDinner: any; }) => restaurant.isDinner);
    //   }
    //   if(event.text.includes('회식')) {
    //     filteredRestaurants = filteredRestaurants.filter((restaurant: { isDining: any; }) => restaurant.isDining);
    //   }
    //   if(event.text.includes('페이코')) {
    //     filteredRestaurants = filteredRestaurants.filter((restaurant: { isPayco: any; }) => restaurant.isPayco);
    //   }
    //   const suggestion = filteredRestaurants[randNumBetween(0, filteredRestaurants.length-1)];

    //   sendReply(filteredRestaurants, event.channel);
    // }
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