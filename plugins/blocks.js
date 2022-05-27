const Vec3 = require('vec3')

function inject (bot) {
  const { blocksByStateId } = require('minecraft-data')(bot.version)

  bot.on('block_change', packet => {
    const block = blocksByStateId[packet.type]

    bot.emit('block_change', { block, location: packet.location })
  })
  bot.on('multi_block_change', packet => {
    const decodedRecords = packet.records.map(decodeRecord)

    bot.emit('multi_block_change', decodedRecords)

    function decodeRecord (record) {
      const stateId = record >> 12

      return {
        stateId,
        block: blocksByStateId[stateId],
        position: new Vec3(
          packet.chunkCoordinates.x,
          packet.chunkCoordinates.y,
          packet.chunkCoordinates.z
        ).scale(16).offset(
          (record >> 8) & 0x0f,
          record & 0x0f,
          (record >> 4) & 0x0f
        )
      }
    }
  })
}

module.exports = { inject }
