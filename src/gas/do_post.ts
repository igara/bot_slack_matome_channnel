import { default as ENV } from "@root/.env";

export const doPost = (e: GoogleAppsScript.Events.DoPost) => {
  const postData = JSON.parse(e.postData.contents);

  // Event Subscriptionsに必要な部分
  if (postData.type == "url_verification") return ContentService.createTextOutput(postData.challenge);

  if (postData.event.type !== "message") return;
  // 削除されたとき
  if (postData.event.hidden) return;
  // リアクションの処理
  if (postData.event.reactions) return;
  // ピンの処理
  if (postData.event.pinned_to) return;
  // 星の処理
  if (postData.event.is_starred) return;
  // リマインド、BOTのとき
  if (postData.event.bot_id) return;
  // チャンネル参加の通知はオフ
  if (postData.event.subtype === "channel_join") return;
  // callの通知はオフ
  if (postData.event.subtype === "sh_room_created") return;

  // slackの3秒タイムアウトリトライ対策
  const cache = CacheService.getScriptCache();
  if (cache.get(postData.event.client_msg_id) == "done") {
    return ContentService.createTextOutput();
  } else {
    cache.put(postData.event.client_msg_id, "done", 600);
  }

  const channelID = postData.event.channel;
  const userID = postData.event.user;
  const text = postData.event.text;

  const ChannelsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("channels");
  const channelsSheetDataRangeValues = ChannelsSheet.getDataRange().getValues();
  const channelsSheetColumnNames = channelsSheetDataRangeValues[0];
  const channelsSheetIDColumnNumber = channelsSheetColumnNames.indexOf("id");
  const channelsSheetNameColumnNumber = channelsSheetColumnNames.indexOf("name");

  let botSlackMatomeChannelID = "";
  for (let rowNumber = 0; rowNumber < channelsSheetDataRangeValues.length; rowNumber++) {
    const cell = channelsSheetDataRangeValues[rowNumber][channelsSheetNameColumnNumber];
    if (cell === ENV.BOT_SLACK_MATOME_CHANNEL_NAME) {
      botSlackMatomeChannelID = channelsSheetDataRangeValues[rowNumber][channelsSheetIDColumnNumber];
    }
  }
  if (!botSlackMatomeChannelID) return;

  let channelName = "";
  for (let rowNumber = 0; rowNumber < channelsSheetDataRangeValues.length; rowNumber++) {
    const cell = channelsSheetDataRangeValues[rowNumber][channelsSheetIDColumnNumber];
    if (cell === channelID) {
      channelName = channelsSheetDataRangeValues[rowNumber][channelsSheetNameColumnNumber];
    }
  }
  if (!channelName) return;

  let isIgnorePost = false;
  // 対象チャンネルか検索
  const targetChannelRegexes: RegExp[] = ENV.TARGET_CHANNEL_REGEXES;
  targetChannelRegexes.forEach((regex) => {
    if (regex.test(channelName)) isIgnorePost = true;
  });
  // 対象チャンネルでも無視するとき
  const ignoreTargetChannelRegexes: RegExp[] = ENV.IGNORE_TARGET_CHANNEL_REGEXES;
  ignoreTargetChannelRegexes.forEach((regex) => {
    if (regex.test(channelName)) isIgnorePost = false;
  });
  if (!isIgnorePost) return;

  console.info(postData);

  const UsersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
  const usersSheetDataRangeValues = UsersSheet.getDataRange().getValues();
  const usersSheetColumnNames = usersSheetDataRangeValues[0];
  const userSheetIDColumnNumber = usersSheetColumnNames.indexOf("id");
  const userSheetNameColumnNumber = usersSheetColumnNames.indexOf("name");
  const userSheetImageColumnNumber = usersSheetColumnNames.indexOf("image");

  let userName = "";
  let userImage = "";
  for (let rowNumber = 0; rowNumber < usersSheetDataRangeValues.length; rowNumber++) {
    const cell = usersSheetDataRangeValues[rowNumber][userSheetIDColumnNumber];
    if (cell === userID) {
      userName = usersSheetDataRangeValues[rowNumber][userSheetNameColumnNumber];
      userImage = usersSheetDataRangeValues[rowNumber][userSheetImageColumnNumber];
    }
  }
  if (!userName || !userImage) return;

  const fetch = UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", {
    method: "post",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${ENV.SLACK_BOT_USER_OAUTH_TOKEN}`,
    },
    payload: JSON.stringify({
      text: `<#${channelID}>
https://${ENV.SLACK_TEAM}.slack.com/archives/${channelID}/p${String(postData.event.ts).replace(".", "")} より`,
      channel: botSlackMatomeChannelID,
      username: userName,
      icon_url: userImage,
      unfurl_links: true,
    }),
  });
  const json = JSON.parse(fetch.getContentText());
  console.info(json);
};
global.doPost = doPost;
