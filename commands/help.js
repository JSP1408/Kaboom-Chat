exports.run = (bot, args) => {
  const commands = bot.collection;

  if (args.length > 0) {
    const cmd = args[0];
    const info = commands.get(`${cmd}`);

    if (info === undefined) {
      console.log(`Unknown command: ${cmd}!`);
      return;
    } else {
      console.log(`Name: ${info.name}`);
      return;
    }
  }

  //console.log(`${commands.map((cmd) => `${cmd.name}`).join(", ")}`);
  console.log(JSON.stringify(bot.commands).replace(/"/g,' '))
};

exports.name = "help";
