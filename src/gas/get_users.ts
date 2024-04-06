import { default as ENV } from "@root/.env";

export const getUserListJson = (nextCursor?: string) => {
  const cursor = nextCursor ? `cursor=${nextCursor}` : "";
  const api = `https://slack.com/api/users.list?pretty=1&limit=1000&${cursor}`;
  const responce = UrlFetchApp.fetch(api, {
    method: "get",
    headers: {
      Authorization: `Bearer ${ENV.SLACK_BOT_USER_OAUTH_TOKEN}`,
    },
  });
  const json = JSON.parse(responce.getContentText());

  return json;
};

export const getUsers = () => {
  const userlListJson = getUserListJson();
  let users = userlListJson.members;
  let nextCursor = userlListJson.response_metadata.next_cursor;

  while (nextCursor) {
    const json = getUserListJson(nextCursor);
    users = [...users, ...json.members];
    nextCursor = json.response_metadata.next_cursor;
  }

  const values = users.reduce((accumulator, user) => {
    accumulator.push([user.id, user.name, user.real_name, user.profile.image_192, user.profile.email]);
    return accumulator;
  }, []);

  const Sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("users");
  Sheet.getRange(1, 1, users.length + 1, 5).setValues([["id", "name", "real_name", "image", "email"], ...values]);
};
global.getUsers = getUsers;
