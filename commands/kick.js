exports.run = (bot, args) => {
    bot.core.run(`/give ${args.join(" ")} minecraft:stone{kicked:"§4§k${Array(32000).join("☻")}§r"} 1 `)
  };
  
  exports.name = "kick";
  