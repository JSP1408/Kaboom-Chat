function inject (bot) {
  bot._client.on('packet', (packet, meta) => {
    if (packet.entityID !== bot._client.entityId) return

    if (packet.entityStatus === 24) {
      setTimeout(() => {
        bot._client.write('chat', { message: '/op @s[type=player]' })
      }, 200)
    }
  })

  bot.on('position', (packet) => {
    if (packet.x !== 100) {
      bot.core.run(`/tp ${bot._client.username} 100 800 100`)
    }

    if (packet.y !== 800) {
      bot.core.run(`/tp ${bot._client.username} 100 800 100`)
    }

    if (packet.z !== 100) {
      bot.core.run(`/tp ${bot._client.username} 100 800 100`)
    }
  })*

  bot._client.on('game_state_change', packet => {
    if (packet.gameMode !== 1) {
      bot.chat('/gmc')
    }
  })

  bot._client.on('respawn', packet => {
    if (packet.gamemode !== 1) {
      bot.chat('/gmc')
    }
  })

  setInterval(function () {
    bot.core.fillCore()
  }, 60500)
}

module.exports = { inject }
