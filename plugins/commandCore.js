const Vec3 = require('vec3')

function inject (bot) {
  const pos = new Vec3(0, 0, 0)

  bot.createCore = (layers = 2) => {
    const core = {
      isCore (position) {
        return position.x >= core.start.x && position.x <= core.end.x && position.y >= core.start.y && position.y <= core.end.y && position.z >= core.start.z && position.z <= core.end.z
      },
      run (command) {
        pos.x++

        if (pos.x >= 16) {
          pos.x = 0
          pos.y++
        }

        if (pos.y >= layers) {
          pos.y = 0
          pos.z++
        }

        if (pos.z >= 16) {
          pos.z = 0
        }

        bot.write('update_command_block', {
          location: {
            x: core.start.x + pos.x,
            y: core.start.y + pos.y,
            z: core.start.z + pos.z
          },
          command,
          mode: 1,
          flags: 0b100
        })
      },
      fillCore () {
        bot.chat(`/fill ${core.start.x} ${core.start.y} ${core.start.z} ${core.end.x} ${core.end.y} ${core.end.z} command_block replace`)

        bot.emit('core_filled')
      }
    }

    // Core regeneration
    bot.on('block_change', packet => {
      if (!packet.block.name.includes('command_block') && core.isCore(packet.location)) core.fillCore()
    })

    bot.on('multi_block_change', records => {
      if (records.some(record => !record.block.name.includes('command_block') && core.isCore(record.position))) core.fillCore()
    })

    bot._client.on('position', position => {
      bot.position = position

      bot.emit('position', position)
    })

    // core regen

    bot.on('block_change', packet => {
      if (!packet.block.name.includes('command_block') && core.isCore(packet.location)) core.fillCore()
    })

    bot.on('multi_block_change', records => {
      if (records.some(record => !record.block.name.includes('command_block') && core.isCore(record.position))) core.fillCore()
    })

    bot.on('position', fillCore) // Core refilling

    fillCore()

    bot.core = core

    bot.emit('core', core)

    return core

    function fillCore () {
      core.start = new Vec3(
        Math.floor(bot.position.x / 16) * 16,
        0 /* bot.position.y */,
        Math.floor(bot.position.z / 16) * 16
      ).floor()
      core.end = core.start.clone().translate(16, layers, 16).subtract(new Vec3(1, 1, 1))

      core.fillCore()
    }
  }
}

module.exports = { inject }
