exports.run = (client, message, args) => {
  let up = 'Uptime: ';
  const totalSeconds = process.uptime();
  const days = Math.floor((totalSeconds % 31536000) / 86400);
  const hours = parseInt(totalSeconds / 3600) % 24;
  const minutes = parseInt(totalSeconds / 60) % 60;
  const seconds = Math.floor(totalSeconds % 60);
  up += days >= 1 ? `${days}d ` : '';
  up += hours < 10 ? `0${hours}:` : `${hours}:`;
  up += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  up += seconds < 10 ? `0${seconds}` : `${seconds}`;
  message.channel.send(up);

}
