var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var http = require('http');

function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

function leftPad(str, count) {
  return Array(Math.max(0, count - ('' + str).length + 1)).join(0) + str;
}

function curDate() {
  var date = new Date();
  return leftPad(date.getFullYear(), 4) + 
        leftPad(date.getMonth() + 1, 2) +
        leftPad(date.getDate(), 2) +
        leftPad(date.getHours(), 2) +
        leftPad(date.getMinutes(), 2) +
        leftPad(date.getSeconds(), 2);
}

var showapiRequest = function(mainUrl, appId, appParams) {
  return new Promise(function(resolve, reject) {
    var url = new String(mainUrl + '?');
    var params = {
      showapi_appid: appId,
      showapi_timestamp: curDate(),
      showapi_sign_method: 'md5',
      showapi_res_gzip: 1
    };

    appParams = appParams || {};
    for (var appParam in appParams) {
      params[appParam] = appParams[appParam];
    }

    var keys = [];
    for (var param in params) {
      keys.push(param);
    }

    keys.sort();
    var sortResult = '';
    keys.map(function(value) {
      sortResult = sortResult + value + params[value];
    });
    var secret = '21b693f98bd64e71a9bdbb5f7c76659c';
    var sign = md5(sortResult + secret);
    keys.map(function(value) {
      url = url + value + '=' + params[value] + '&';
    });
    url = url + 'showapi_sign=' + sign;
    console.log('url:' + url);
    http.get(url, (saRes) => {
      var saData = '';
      saRes.on('data', (chunk) => {
        saData = saData + chunk;
      });
      saRes.on('end', () => {
        var json = JSON.parse(saData);
        resolve(json);
      });
    }).on('error', (saErr) => {
      reject(saErr);
    });
  });
};

var g_typeList = [];
var g_pagebean = {};
function getTypeList() {
  return new Promise(function(resolve, reject) {
      if (g_typeList.length == 0) {
        showapiRequest('http://route.showapi.com/582-1', 17262, {}).then(function(json) {
            if (json.showapi_res_code == 0) {
              g_typeList = json.showapi_res_body.typeList;
              resolve();
            } else {
              reject(json.showapi_res_error);
            }
        }).catch(function(err) {
          reject(err);
        });
      } else {
        resolve();
      }
  });
}

function getArticleList(appParams) {
  return new Promise(function(resolve, reject) {
    if (typeof g_pagebean != 'undefined' &&  g_pagebean.contentlist &&
        g_pagebean.contentlist.length > 0 && g_pagebean.contentlist[0].typeId == appParams.typeId) {
        resolve();
    } else {
      console.log(appParams);
      showapiRequest('http://route.showapi.com/582-2', 17262, appParams).then(function(json) {
        if (json.showapi_res_code == 0) {
          g_pagebean = json.showapi_res_body.pagebean;
          resolve();
        } else {
          reject(json.showapi_res_error);
        }
      }).catch(function(err) {
        reject(err);
      })
    }
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/category', function(req, res, next) {
  res.redirect('/category/0');
});

router.get('/category/:tid', function(req, res, next) {
  var typeId = req.params.tid;
  Promise.all([getTypeList(), getArticleList({typeId: typeId})]).then(function() {
    res.render('category', {title: 'Category', typeList: g_typeList, pagebean: g_pagebean});
  }).catch(function(err) {
    console.log(err);
  });
});

module.exports = router;

