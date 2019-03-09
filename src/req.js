const request = require('request');
const url = require('./url');

const req = sn =>
  new Promise((resolve, reject) => {
    request(url(sn), function(error, response, body) {
      if (error) {
        reject(error);
        return;
      }
      resolve(body);
    });
  });

module.exports = req;
