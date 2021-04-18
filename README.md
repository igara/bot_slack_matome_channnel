# bot_slack_matome_channnel

## how to use

apply .env.ts  
cp .env.sample.ts .env.ts

```.env.ts
export default {
  SLACK_TEAM: "hoge",
  // see https://api.slack.com/apps
  // Event Subscriptions message.channels Scope: channels:history
  // Scope: chat:write, chat:write, chat:write.customize, chat:write.public, incoming-webhook, team:read, users.profile:read, users:read, users:read.email
  SLACK_ACCESS_TOKEN: "xoxb-xxxxx-xxxxx-xxxxx",
  BOT_SLACK_MATOME_CHANNEL_NAME: "bot_slack_matome_channnel",
  TARGET_CHANNEL_REGEXES: [/^t_\S*/, /^time_\S*/],
  IGNORE_TARGET_CHANNEL_REGEXES: [/^t_ignore_\S*/, /^time_ignore_\S*/],
};

```

```
# login
npx clasp login

# new create spreadsheet & script project & .clasp.json
npm run new name=[spreadsheet & script project name]
## example
npm run new name=hoge

# build
npm run build
# push
npx clasp push
# build & push & watch
npm run watch

# after npx clasp login --creds creds.json or after run gas function on script editor
npx clasp run createSheets
npx clasp run getChannels
npx clasp run getUsers
```

## memo

```
# login for debug
npx clasp login --creds creds.json
link: https://qiita.com/abetomo/items/59379e26679e342ef6e3
mv .clasprc.json ~/

# local run (add projectId clasp.json)
npx clasp run [gas function name]
link: https://qiita.com/jiroshin/items/dcc398285c652554e66a#%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E3%81%8B%E3%82%89gas%E3%82%92%E5%8F%A9%E3%81%8F

# logs
npx clasp logs
https://github.com/google/clasp#logs

# deployments
npx clasp deployments
npx clasp deploy -i [xxxxxxxxx]
```
