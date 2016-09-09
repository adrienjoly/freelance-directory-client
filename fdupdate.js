(function(){

  function appendCoucouToUser(token, userId) {
    fetchContact(token, userId, function(err, json) {
      console.log('appendCoucouToUser 1 =>', err || json);
      if (err) return;
      json.entry.content.$t += '\ncoucou!';
      console.log('new user data:', json.entry);
      updateContact(token, userId, json, function(err, res) {
        console.log('appendCoucouToUser 2 =>', err || res);
      });
    });
  }

  function parseFdUpdateParam(fdupdate) {
    var RE_FDUPDATE = /^[^\:]+\:([^\/]+)\/(.+)$/;
    var parts = RE_FDUPDATE.exec(fdupdate);
    return {
      email: parts[1],
      updUrl: parts[2]
        .replace('github.com', 'https://api.github.com/repos')
        .replace('/commit/', '/commits/')
        .replace(/\/$/, '') // remove trailing slash
    };
  }

  function fetchUpdateContent(commitUrl, callback) {
    console.log('GET ' + commitUrl + '...');
    query({
      url: commitUrl,
      dataType: 'jsonp'
    }, function(err, json) {
      if (err) return callback(err);
      var dataUrl = json.data.files[0].contents_url;
      console.log('GET ' + dataUrl + '...');
      query(dataUrl, function(err, json) {
        var profileInfo = !err && atob(json.content);
        callback(err, profileInfo);
      });
    });
  }

  var fdupdate = decodeURIComponent(window.location.href.split(/[\?\&]fdupdate=/)[1] || '');
  console.log('fdupdate parameter:', fdupdate);
  if (fdupdate) {
    var update = parseFdUpdateParam(fdupdate);
    $('h1').text('Fetching update...');
    fetchUpdateContent(update.updUrl, function(err, profileInfo){
      if (err) {
        $('h1').text('Oops, I did not find a commit for this fdupdate!');
        console.error(err);
      } else {
        $('h1').text('Store update?');
        $('pre').text(profileInfo);
      }
    });
    // TODO: if user accepts => store update in corresponding google contact
    /*
    auth(function(err, token){
      document.getElementById('fetch').onsubmit = function(evt) {
        evt.preventDefault();
        var contactId = document.getElementById('fetchContactId').value;
        fetchUser(token, contactId, function(err, res){
          console.log(arguments);
          appendEntries(document.getElementById('results'), [ res.entry ]);
        });
      };

      document.getElementById('append').onsubmit = function(evt) {
        evt.preventDefault();
        var contactId = document.getElementById('appendContactId').value;
        appendCoucouToUser(token, contactId);
      };
    });
    */
  } else {
    $('h1').text('Oops, I can\'t find a valid fdupdate in this URL!');
  }

})();
