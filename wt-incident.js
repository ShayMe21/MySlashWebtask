module.exports = (ctx, cb) => {
  const {
    WebClient,
    ErrorCode
  } = require('@slack/web-api');

  console.log(ctx.body);

  sync_response(cb, `:hourglass: Creating an Incident Channel...`);

  // Create Slack channel
  var today = new Date();
  var fullYear = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();

  // Prefix day and month with a 0
  if (month < 10) {
    month = "0".concat(String(month));
  }

  if (day < 10) {
    day = "0".concat(String(day));
  }

  var date = `${fullYear}${month}${day}`;

  // TODO: Check if channel name already exists

  const web = new WebClient(ctx.secrets.slackApiKey);

  (async () => {
    try {
      var res = await web.conversations.create({
        name: `postmortem-${date}`,
        is_private: false
      });

    } catch (err) {
      if (err.code === ErrorCode.PlatformError) {
        async_response(ctx, `PlatformError: ${err.data.error}`);
      } else if (err.code === ErrorCode.RequestError) {
        async_response(ctx, `RequestError: ${err.data.error}`);
      } else if (err.code === ErrorCode.HTTPError) {
        async_response(ctx, `HttpError: ${err.data.error}`);
      } else if (err.code === ErrorCode.RateLimitedError) {
        async_response(ctx, `RateLimitedError: ${err.data.error}`);
      } else {
        async_response(ctx, `Unexpected Error.`);
      }
    }
    async_response(ctx, `:white_check_mark: <#${res.channel.id}>`);

  })();

  // Create new Confluence Postmortem Template


  // Create and share Google hangout link


  // Invite On-call people to the channel

  cb(null, {
    text: `Finished.`,
    "response_type": "in_channel"
  });
}

function async_response(ctx, text, only_caller) {
  require('superagent').post(ctx.body.response_url)
    .send({
      text: text,
      response_type: only_caller ? 'emphemeral' : 'in_channel'
    })
    .end();
}

function sync_response(cb, text, only_caller) {
  cb(null, {
    text: text,
    response_type: only_caller ? 'emphemeral' : 'in_channel'
  });
}
