exports.run = (bot, args) => {
    console.log('Client closed connection')
    process.abort('Client exited')
  };
  
  exports.name = "exit";
  