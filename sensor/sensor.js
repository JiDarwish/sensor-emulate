const axios = require('axios');

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

setInterval(() => {
  axios.post('http://localhost:3000/new', {
    'timestamp': Date.now(),
    'value': getRandomArbitrary(1, 20)
  }).then(suc => {
    console.log('Sent data')
  }).catch(console.log)
}, 3000)