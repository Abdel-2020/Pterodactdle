function timeLeft() {
  let now = new Date();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0)
  midnight.setDate(midnight.getDate() + 1)
  let remainingTime = midnight - now;
  return remainingTime;
}


module.exports = {timeLeft};