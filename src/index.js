const EventSource = require("eventsource");
const HashMap = require("hashmap");

let oneMinuteDomainData = {};
let oneMinuteUserDataParticularDomain = {};
// var url = "https://stream.wikimedia.org/v2/stream/revision-create";
// const eventSource = new EventSource(url);
// eventSource.onmessage = function (event) {
//   // event.data will be a JSON string containing the message event.

//   console.log(JSON.parse(event.data));
// };

eventsource = new EventSource(
  "https://stream.wikimedia.org/v2/stream/revision-create"
);
// eventsource.onopen = function () {};
// eventsource.onerror = function (msg) {};
eventsource.onmessage = function (event) {
  const data = JSON.parse(event.data);
  if (oneMinuteDomainData[data.meta.domain]) {
    oneMinuteDomainData[data.meta.domain]++;
    if (data.performer.user_is_bot !== false)
      oneMinuteUserDataParticularDomain[data.performer.user_text] =
        data.performer.user_id;
  } else {
    oneMinuteDomainData[data.meta.domain] = 1;
    if (data.performer.user_is_bot !== false)
      oneMinuteUserDataParticularDomain[data.performer.user_text] =
        data.performer.user_id;
  }
};

setInterval((event) => {
  // const data = JSON.parse(event.data);
  const keys = Object.keys(oneMinuteDomainData);
  const users = Object.keys(oneMinuteUserDataParticularDomain);
  keys.forEach((key) => {
    console.log("\n DOMAINS REPORT:");
    console.log(key + " : " + oneMinuteDomainData[key]);
    console.log("\n USER REPORT OF THIS DOMAIN: " + key);
    users.forEach((user) => {
      console.log(user + " : " + oneMinuteUserDataParticularDomain[user]);
    });
  });
  oneMinuteDomainData = {};
  oneMinuteUserDataParticularDomain = {};
  // console.log(keys + " : " + keys.length);
}, 1 * 1000 * 60);
