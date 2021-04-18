import { default as ENV } from "@root/.env";

export const getChannelListJson = (nextCursor?: string) => {
  const cursor = nextCursor ? `cursor=${nextCursor}` : "";
  const channelListApi = `https://slack.com/api/conversations.list?pretty=1&limit=1000&${cursor}`;
  const channelListResponce = UrlFetchApp.fetch(channelListApi, {
    method: "get",
    headers: {
      Authorization: `Bearer ${ENV.SLACK_ACCESS_TOKEN}`,
    },
  });
  const channelListJson = JSON.parse(channelListResponce.getContentText());

  return channelListJson;
};

export const getChannels = () => {
  const channelListJson = getChannelListJson();
  let channels = channelListJson.channels;
  let nextCursor = channelListJson.response_metadata.next_cursor;

  while (nextCursor) {
    const json = getChannelListJson(nextCursor);
    channels = [...channels, ...json.channels];
    nextCursor = json.response_metadata.next_cursor;
  }

  const values = channels.reduce((accumulator, channel) => {
    accumulator.push([channel.id, channel.name]);
    return accumulator;
  }, []);

  const Sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("channels");
  Sheet.getRange(1, 1, channels.length + 1, 2).setValues([["id", "name"], ...values]);
};

global.getChannels = getChannels;
