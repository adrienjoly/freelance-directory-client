var CLIENT_ID = '847367303310-1cda1v65gotbpoqjehmhcc21dofjc00q.apps.googleusercontent.com';
  // from https://console.developers.google.com/apis/credentials/wizard?api=contacts&project=open-1365

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

function fetchAll(token, url, handle) {
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
      fetchAll(token, next, handle);
    } else {
      handle();
    }
  });
}

function makeAppender(div) {
  div.innerHTML = '';
  return function (json) {
    if (!json) {
      alert('done! :-)');
    } else {
      div.innerHTML = div.innerHTML + (json.feed.entry || []).map(function(entry){
        return '<li>' + (entry.title || {}).$t + ' : ' + (entry.content || {}).$t + '</li>';
      }).join('\n');
    }
  };
}

function fetchAndDisplay(token) {
  var projection = 'property-content'; //'full';
  var url = 'https://www.google.com/m8/feeds/contacts/default/' + projection + '?alt=json&max-results=1000';
  fetchAll(token, url, makeAppender(document.getElementById('results')));
}

function searchAndDisplay(token, q) {
  var projection = 'property-content'; //'full';
  var url = 'https://www.google.com/m8/feeds/contacts/default/' + projection + '?alt=json&max-results=1000&v=3.0&q=' + encodeURIComponent(q);
  console.log(url);
  fetchAll(token, url, makeAppender(document.getElementById('results')));
}
