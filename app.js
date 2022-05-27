const readline = require("readline");
const path = require("path");
const fs = require("fs");
const Bot = require("./bot_handler");
const reload = require("require-reload");

const prefix = ".";

const options = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var settings = {
  username: "",
  IP: "",
  Port: "",
};

options.question("Username: ", (name) => {
  settings.username = name;

  options.question("IP: ", (IP) => {
    settings.IP = IP;

    options.question("Port: ", (Port) => {
      settings.Port = Port;
      options.close();
      client();
    });
  });
});

function client() {
  const bot = new Bot({
    host: settings.IP,
    port: settings.port,
    username: settings.username,
  });

  bot._client.on("login", () => {
    const commands = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));
    for (const file of commands) {
      const commandName = file.split(".")[0];
      const command = require(`./commands/${file}`);

      bot.collection.set(commandName, command);
      bot.commands.push(commandName);
    }

    console.clear();
    loadPlugins("/plugins/", bot);
    bot.createCore();

    console.log(`Successfuly logged into ${settings.IP}:${settings.Port}!`);
    bot.core.run(
      `/tellraw @a "§8[§b${settings.username}§9 logged in using EChat! A minecraft console client!§8]§r"`
    );

    const cli = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const log = global.console.log;

    global.console.log = (...args) => {
      cli.output.write("\x1b[0m \x1b[2K\r");
      log.apply(console, Array.prototype.slice.call(args));
      cli._refreshLine();
    };

    setInterval(() => {
      cli.output.write("\x1b[0m \x1b[2K\r");
      cli._refreshLine();
    }, 100);

    cli.on("line", (data) => {
      if (data.indexOf(prefix) !== 0) {
        bot.chat(data);
        return;
      }

      const args = data.substring(1).split(" ");

      const command = args.shift().toLowerCase();

      const cmd = bot.collection.get(command);

      if (!cmd) {
        console.log(`Invalid command! Try ${prefix}help for help!`);
        return;
      }

      if (cmd >= undefined) return;

      cmd.run(bot, args);
    });

    bot.on("parsed_chat", (data) => {
      if (data.clean.startsWith("Teleporting...")) return;
      if (data.clean.startsWith("Command set:")) return;
      if (data.clean.startsWith("No blocks were filled")) return;
      console.log(data.ansi);
    });
  });

  bot.on("end", (reason) => {
    console.log(`Client exited with: ${reason}, attempting reconnection`)
    bot._client.end()
    const bot = new Bot({
        host: settings.IP,
        port: settings.Port,
        username: settings.username,
      });
  });
}

function loadPlugins(directory, bot) {
  for (const filename of fs.readdirSync(path.join(__dirname, directory))) {
    const fullpath = path.join(__dirname, directory, filename);

    let plugin;

    try {
      plugin = reload(fullpath);

      plugin.inject(bot);
    } catch (error) {
      console.error(`[${filename}] ${error}`);
    }
  }
}