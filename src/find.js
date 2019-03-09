const cheerio = require('cheerio');
const req = require('./req');

const selectors = {
  cover:
    'body > div.container > div.row.movie > div.col-md-9.screencap > a > img',
  info: 'body > div.container > div.row.movie > div.col-md-3.info',
  sampleImages: '#sample-waterfall > a > div > img',
};

const keywords = {
  sn: '識別碼:',
  publishDate: '發行日期:',
  length: '長度:',
  director: '導演: ',
  producer: '製作商:',
  publisher: '發行商:',
  series: '系列:',
  genres: '類別:',
  actors: '演員:',
};

const fns = {
  img: ($, $node) => $node.attr('src'),
  info: ($, $node) => {
    const info = {
      sn: null,
      publishDate: null,
      length: null,
      director: null,
      producer: null,
      publisher: null,
      series: null,
      genres: null,
      actors: null,
    };
    const blockProperties = ['genres', 'actors'];
    $node.children('p').each((i, dom) => {
      const $node = $(dom);
      const text = $node.text().trim();
      for (const name in keywords) {
        const keyword = keywords[name];
        if (text.indexOf(keyword) === 0) {
          if (!blockProperties.includes(name)) {
            info[name] = text.substr(keyword.length);
          } else {
            switch (name) {
              case 'genres':
                info[name] = getArray($, $node.next().find('.genre'));
                break;
              case 'actors':
                info[name] = getArray(
                  $,
                  $node
                    .next()
                    .next()
                    .find('.genre')
                );
            }
          }
          break;
        }
      }
    });
    return info;
  },
};

const getValue = ($, selector, fn = ($, $node) => $node.text().trim()) =>
  fn($, $(selector));

const getArray = ($, selector, fn = ($, $node) => $node.text().trim()) => {
  const arr = [];
  $(selector).each((i, genreDom) => arr.push(fn($, $(genreDom))));
  return arr;
};

const find = async sn => {
  const res = await req(sn);
  const $ = cheerio.load(res);
  if (
    $.text()
      .trim()
      .toLowerCase()
      .indexOf('not found') >= 0
  ) {
    return null;
  }
  const cover = getValue($, selectors.cover, fns.img);
  const info = getValue($, selectors.info, fns.info);
  const sampleImages = getArray($, selectors.sampleImages, fns.img);
  return {
    cover,
    ...info,
    sampleImages,
  };
};

module.exports = find;
