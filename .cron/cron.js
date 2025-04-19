const cron = require("node-cron");
const { randomDoc } = require("../controllers/controllers");
const dailyDino = null;

//***********************************************************************
cron.schedule("* * * * *", async () => {
  dailyDino = await randomDoc();
  console.log(dailyDino);
});
