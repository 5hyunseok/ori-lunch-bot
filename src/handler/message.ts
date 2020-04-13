import { randNumBetween } from '.';

interface msg {
  username: string,
  icon_url: string,
  blocks: any[],
  channel: any
}

function generateMsg(username: string, iconUrl: string, channel: any, filteredRestaurants: any[], keywords: string[]): msg {
  let result: msg = {
    username: username,
    icon_url: iconUrl,
    blocks: [],
    channel: channel
  };
  
  result.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `${keywords.join(',')}에 해당하는 총 *${filteredRestaurants.length}개* 의 결과 중 제 추천은`
    }
  });

  // push divider
  result.blocks.push({
    "type": "divider"
  });

  const suggestion = filteredRestaurants[randNumBetween(0, filteredRestaurants.length-1)]
  
  result.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `*${suggestion.name}* ${suggestion.emoji}\n`
      //${suggestion.emoji}
    }
  });

  result.blocks.push({
    "type": "context",
    "elements": [
      {
        "type": "image",
        "image_url": "https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png",
        "alt_text": "Location Pin Icon"
      },
      {
        "type": "mrkdwn",
        "text": `${suggestion.address}`
      }
    ]
  })


  return result;
}

export { generateMsg };


