var CLIENT_ID = '847367303310-1cda1v65gotbpoqjehmhcc21dofjc00q.apps.googleusercontent.com';
  // from https://console.developers.google.com/apis/credentials?project=open-1365

function throwError(err) {
  console.error(err);
  throw err;
}

function authPopup(callback) {
  var config = {
    'client_id': CLIENT_ID,
    'scope': 'https://www.google.com/m8/feeds'
  };
  gapi.auth.authorize(config, function(res) {
    console.log('gapi.auth.authorize =>', res);
    if (res.error) {
      alert(res.error);
      window.location.href = window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1);
    } else {
      callback(null, gapi.auth.getToken());
    }
  });
}

function auth(callback) {
  var config = {
    'immediate': true,
    'client_id': CLIENT_ID,
    'scope': 'https://www.google.com/m8/feeds'
  };
  gapi.auth.authorize(config, function(res) {
    console.log('gapi.auth.authorize =>', res);
    if (res.error) {
      alert(res.error);
      window.location.href = window.location.href.substr(0, window.location.href.lastIndexOf('/') + 1);
    } else {
      callback(null, gapi.auth.getToken());
    }
  });
}

function query(param, callback) {
  $.ajax(param).done(callback);
}

function fetchAll(token, opt, handle) {
  var projection = opt.projection || 'full';
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
    var name = (entry.title || {}).$t;
    var notes = ((entry.content || {}).$t || '').replace(/\n/g, ' // ');
    return name || notes ? name + ' : ' + notes + '\n' : '';
  }).join('');
}

function appendJsonEntries(div, entries) {  
  div.innerHTML = div.innerHTML + entries.map(function(entry){
    var fields = {};
    Object.keys(entry).map(function(field) {
      if (entry[field].$t) {
        fields[field] = entry[field].$t;
      }
    });
    return JSON.stringify(entry, null, '  ') + '\n';
  }).join('');
}

function makeAppender(div, appendFct) {
  div.innerHTML = '';
  return function (json) {
    if (!json) {
      console.info('done! :-)');
    } else {
      (appendFct || appendEntries)(div, json.feed.entry || []);
    }
  };
}

function fetchAndDisplay(token) {
  fetchAll(token, { projection: 'property-content' }, makeAppender(document.getElementById('results')));
}

function searchAndDisplay(token, q) {
  fetchAll(token, { projection: 'property-content', q: q }, makeAppender(document.getElementById('results')));
}

function backupAndDisplay(token) {
  fetchAll(token, { projection: 'full' }, makeAppender(document.getElementById('results'), appendJsonEntries));
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
