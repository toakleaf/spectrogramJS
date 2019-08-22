function processAudio(stream, actx, analyser) {
  const source = actx.createMediaStreamSource(stream)
  source.connect(analyser)
}

module.exports = { processAudio }
