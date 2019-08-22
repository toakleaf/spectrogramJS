/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/canvas.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/canvas.js":
/*!**************************!*\
  !*** ./src/js/canvas.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var REFRESH_RATE = 100;
var MIN_FREQ = 80;
var MAX_FREQ = 16000;
var FFT_SIZE = 2048; // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768
var NUM_BINS = FFT_SIZE / 2;
var MIN_LOG = Math.log(MIN_FREQ) / Math.log(10);
var MAX_LOG = Math.log(MAX_FREQ) / Math.log(10);
var LOG_RANGE = MAX_LOG - MIN_LOG;

function binSize(numBins, sampleRate) {
  var maxFreq = sampleRate / 2;
  return maxFreq / numBins;
}

function bucketRange(min, max, numBins, binSize) {
  var low = Math.floor(min / binSize) - 1;
  low = low > 0 ? low : 0;
  var high = Math.floor(max / binSize) - 1;

  return {
    low: low,
    high: high,
    range: high - low + 1,
    binSize: binSize
  };
}

function logPosition(freq, minLog, logRange, width) {
  return (Math.log(freq) / Math.log(10) - minLog) / logRange * width;
}

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'hsl(280, 100%, 10%)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Audio
var actx = new AudioContext();
var analyser = actx.createAnalyser();
analyser.fftSize = FFT_SIZE;

//get mic input
navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
  var source = actx.createMediaStreamSource(stream);
  source.connect(analyser);
});
var data = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(data);
var dataBuckets = bucketRange(MIN_FREQ, MAX_FREQ, NUM_BINS, binSize(NUM_BINS, actx.sampleRate));

// Event Listeners
canvas.addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener('resize', function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

canvas.addEventListener('click', function (event) {
  // by default audio context will be suspended until user interaction.
  if (actx.state === 'suspended') {
    actx.resume();
  }
});

// Animation Loop
var refTime = Date.now();
var elapsedTime = 0;
var imageData = void 0;
function animate() {
  // requestAnimationFrame callback aims for a 60 FPS callback rate but doesn’t guarantee it, so manual track elapsed time
  requestAnimationFrame(animate);

  // if (actx.state === 'suspended') {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height)
  //   ctx.fillStyle = '#fff'
  //   ctx.fillText('CLICK TO BEGIN', mouse.x, mouse.y)
  // }

  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height - 1);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imageData, 0, 1);

  elapsedTime = Date.now() - refTime;

  // slow down fft to only run every 200 ms
  if (elapsedTime >= REFRESH_RATE) {
    refTime = Date.now();

    analyser.getByteFrequencyData(data);

    var prevLogPos = 0;
    for (var i = dataBuckets.low; i <= dataBuckets.high; i++) {
      // console.log(prevLogPos)
      var rat = data[i] / 255;
      var hue = Math.round((rat * 120 + 280) % 360);
      var sat = '100%';
      var lit = 10 + 70 * rat;
      ctx.beginPath();
      ctx.strokeStyle = 'hsl(' + hue + ', ' + sat + ', ' + lit + '%)';
      ctx.moveTo(prevLogPos, 0);
      prevLogPos = logPosition(i * dataBuckets.binSize, MIN_LOG, LOG_RANGE, canvas.width);
      ctx.lineTo(prevLogPos, 0);
      ctx.stroke();
      ctx.closePath();
    }

    // // linear
    // for (let i = dataBuckets.low; i <= dataBuckets.high; i++) {
    //   let rat = data[i] / 255
    //   let hue = Math.round((rat * 120 + 280) % 360)
    //   let sat = '100%'
    //   let lit = 10 + 70 * rat
    //   ctx.beginPath()
    //   ctx.strokeStyle = `hsl(${hue}, ${sat}, ${lit}%)`
    //   ctx.moveTo((i * canvas.width) / dataBuckets.range, 0)
    //   // ctx.moveTo(x, H - i * h)
    //   ctx.lineTo(
    //     canvas.width / dataBuckets.range +
    //       (i * canvas.width) / dataBuckets.range,
    //     0
    //   )
    //   // ctx.lineTo(x, H - (i * h + h))
    //   ctx.stroke()
    //   ctx.closePath()
    // }
  } else {
    var topRow = imageData = ctx.getImageData(0, 1, canvas.width, 2);
    ctx.putImageData(imageData, 0, 0);
  }
}

animate();

/***/ })

/******/ });
//# sourceMappingURL=canvas.bundle.js.map