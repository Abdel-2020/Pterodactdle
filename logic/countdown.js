exports.timeLeft = () => {
  let now = new Date();
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0)
  midnight.setDate(midnight.getDate() + 1)
  let remainingTimeInMs = midnight - now;
  return remainingTimeInMs;
}


