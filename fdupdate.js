(function(){

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

  function makeAccumulator(callback, data) {
    var allItems = [];
    return function accumulate(items) {
      if (!items) {
        callback(null, allItems, data);
      } else {
        allItems = allItems.concat(items);
      }
    };
  }

  function searchContactByEmail(email, callback) {
    console.log('auth to google contacts...');
    auth(function(err, token){
      console.log('search by email:', email, '...');
      searchFullContacts(token, email, makeAccumulator(callback, token));
    });
  }

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
        searchContactByEmail(update.email, function(err, contacts, token){
          if (!contacts || !contacts.length) {
            alert('warning: found no matching contact for this email address...');
            // TODO: allow user to select contact manually (or to add it?)
          } else if (contacts.length > 1) {
            alert('warning: more than one contact matches this email address...');
            // TODO: allow user to select contact manually (or to add it?)
          } else {
            console.log('=>contact:', contacts);
            /*
            var contactEmail = contacts[0].feed.id.$t;
            fetchContactByEmail(token, contactEmail, function(err, res){
              console.log('=>contact:', res);
              console.log('=>entries:', res.feed.entry.map(function(entry){
                var name = (entry.title || {}).$t;
                var notes = ((entry.content || {}).$t || '').replace(/\n/g, ' // ');
                return name || notes ? name + ' : ' + notes + '\n' : '';
              }).join(''));
            });
            */
            // TODO: if user accepts => store update in corresponding google contact
          }
        });
      }
    });
  } else {
    $('h1').text('Oops, I can\'t find a valid fdupdate in this URL!');
  }

})();
