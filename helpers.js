const cheerio = require('cheerio');
const moment = require('moment');

let today     = moment(new Date());
let tomorrow  = moment(new Date()).add(1,'days');
let yesterday = moment(new Date()).add(-1, 'days');

function extractWodsFromHTML (html) {
  const $ = cheerio.load(html);
  var wods = {};
  var posts = $('.category-wod');
  console.log("Found " + posts.length + " posts")
  posts.each(function(i, elem) {
    var title = $(elem).find('.entry-title')
    var splitFirst = title.text().split(' ')
        dayOfWeek = splitFirst[0];
        date = splitFirst[1];

        if (date !== undefined) {
          splitSecond = date.split('.');
          month = splitSecond[0];
          day = splitSecond[1];
          year = splitSecond[2];

          var wodData = $(elem).find('.post-content')
          var parsedDate = new Date(("20" + year), (month - 1), day)
          if (parsedDate.getDate() === today.date()) {
            wods[today.date()] = parseWod($, wodData)
          } else if (parsedDate.getDate() === tomorrow.date()) {
            wods[tomorrow.date()] = parseWod($, wodData)
          } else if (parsedDate.getDate() === yesterday.date()) {
            wods[yesterday.date()] = parseWod($, wodData)
          }
        }
  });
  return wods
}

function formatResponse(response) {
  return {
    version: '1.0',
    response: {
      outputSpeech: {
        type: 'SSML',
        ssml: response,
      },
      shouldEndSession: true,
    },
  };

}

function parseWod($, wodData) {
  var parsed = {
    title: undefined,
    wod: []
  };
  $(wodData).find('p').each(function(i, elem) {
    parsed.wod = parsed.wod.concat($(elem).text().split('\n').map(function(x){
      return x.replace(/#/g, ' pounds'); x.replace(/&/g, ' and')}));
  })
  // to get rid of the caption on the image
  parsed.wod.shift();
  // to get the title off the wod
  parsed.title = parsed.wod.shift();
  // to cut off the "box brief"
  var deletionIndex = parsed.wod.length;
  parsed.wod.forEach(function(word, index){
    if(word.match(/[C|c]omments/g)){
        deletionIndex = index;
    }
  });
  parsed.wod = parsed.wod.slice(0, deletionIndex);

  return parsed;
}

module.exports = {
  extractWodsFromHTML, formatResponse
};
