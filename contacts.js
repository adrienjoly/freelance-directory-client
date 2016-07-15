var CLIENT_ID = '847367303310-1cda1v65gotbpoqjehmhcc21dofjc00q.apps.googleusercontent.com';
  // from https://console.developers.google.com/apis/credentials/wizard?api=contacts&project=open-1365

function throwError(err) {
  console.error(err);
  throw err;
}

function auth(callback) {
  var config = {
    'client_id': CLIENT_ID,
    'scope': 'https://www.google.com/m8/feeds'
  };
  gapi.auth.authorize(config, function() {
    callback(null, gapi.auth.getToken());
  });
}

function query(param, callback) {
  $.ajax(param).done(callback);
}

function fetchAll(token, opt, handle) {
  var projection = 'property-content'; //'full';
  var path = '/m8/feeds/contacts/default/' + projection;
  // jquery-based implementation:
  var prefix = 'https://www.google.com';
  var url = opt.url || (prefix + path + '?alt=json&max-results=1000&v=3.0&q=' + (opt.q ? encodeURIComponent(opt.q) : ''))
  query({
    url: url,
    dataType: 'jsonp',
    data: token
  }, function(json) {
    var next;
    json.feed.link.map(function(link){
      if (link.rel == 'next') {
        next = link.href;
      }
    });
    handle(json);
    if (next) {
      fetchAll(token, { url: next }, handle);
    } else {
      handle();
    }
  });
  /*
  // this implementation does not require jquery but is a bit slower:
  gapi.client.request(opt.url || {
    'path': path,
    'params': {
      'alt': 'json',
      'max-results': 1000,
      'v': '3.0',
      'q': opt.q ? encodeURIComponent(opt.q) : undefined
    }
  }).then(function(res){
    var json = res.result;
    var next;
    json.feed.link.map(function(link){
      if (link.rel == 'next') {
        next = link.href;
      }
    });
    handle(json);
    if (next) {
      fetchAll(token, { url: next }, handle);
    } else {
      handle();
    }
  }, throwError);
  */
}

function appendEntries(div, entries) {  
  div.innerHTML = div.innerHTML + entries.map(function(entry){
    return '<li>' + (entry.title || {}).$t + ' : ' + (entry.content || {}).$t + '</li>';
  }).join('\n');
}

function makeAppender(div) {
  div.innerHTML = '';
  return function (json) {
    if (!json) {
      console.info('done! :-)');
    } else {
      appendEntries(div, json.feed.entry || []);
    }
  };
}

function fetchAndDisplay(token) {
  fetchAll(token, {}, makeAppender(document.getElementById('results')));
}

function searchAndDisplay(token, q) {
  fetchAll(token, { q: q }, makeAppender(document.getElementById('results')));
}

function fetchUser(token, userId, callback) {
  var url = '/m8/feeds/contacts/default/full/' + encodeURIComponent('' + (userId || 0));
  gapi.client.request({
    'path': url,
    'params': {'alt': 'json'}
  }).then(function(json){
    callback(null, json.result);
  }, callback || throwError);
}

function updateUser(token, userId, json, callback) {
  // use a PUT request to the same URL with updated json data to update the user
  // cf https://developers.google.com/google-apps/contacts/v3/?csw=1#Updating
  var url = '/m8/feeds/contacts/default/full/' + encodeURIComponent('' + (userId || 0));
  // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientrequest
  gapi.client.request({
    'path': url,
    'method': 'PUT',
    'params': {'alt': 'json'},
    'headers': {'ETag': '*', 'If-Match': '*'}, // needed to avoid error 400 Missing resource version ID
    'body': json
  }).then(function(json){
    callback(null, json.result);
  }, callback || throwError);
}

function appendCoucouToUser(token, userId) {
  fetchUser(token, userId, function(err, json) {
    console.log('appendCoucouToUser 1 =>', err || json);
    if (err) return;
    json.entry.content.$t += '\ncoucou!';
    console.log('new user data:', json.entry);
    updateUser(token, userId, json, function(err, res) {
      console.log('appendCoucouToUser 2 =>', err || res);
    });
  });
}
