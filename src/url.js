const urlJoin = require('url-join');

const url = sn => {
  const url = urlJoin(process.env.SITE, sn);
  return url;
};

module.exports = url;
