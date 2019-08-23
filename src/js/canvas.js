import spectrogram from './spectrogram.js'

const start = document.querySelector('#start')

start.addEventListener('click', event => {
  start.style.display = 'none'
  spectrogram()
})
