window.onload = function() {

  console.log('√ onload');

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
  document.getElementById('btnRegisterProtocol').onclick = function() {
    var url = window.location.href.replace(/contacts\.html.*/, 'fdupdate.html') + '?fdupdate=%s';
    console.log('btnRegisterProtocol:', url);
    // /!\ this may not work from localhost
    navigator.registerProtocolHandler('web+fdupdate', url, 'Freelance Directory Update');
  }

  auth(function(err, token){

    if (err) {
      console.error('auth =>', err);
    } else {
      console.log('√ auth');
    }

    var resultsDiv = document.getElementById('results');

    document.getElementById('logged').style.display = 'block';

    document.getElementById('btnFetchAll').onclick = function(){
      fetchAllContacts(token, makeAppender(resultsDiv));
    };

    document.getElementById('btnBackup').onclick = function(){
      backupAllContacts(token, makeAppender(resultsDiv, appendJsonEntries));
    };

    document.getElementById('search').onsubmit = function(evt) {
      evt.preventDefault();
      var q = document.getElementById('query').value;
      searchContacts(token, q, makeAppender(resultsDiv));
    };

    document.getElementById('fetch').onsubmit = function(evt) {
      evt.preventDefault();
      var contactId = document.getElementById('fetchContactId').value;
      fetchContact(token, contactId, function(err, res){
        console.log(arguments);
        appendEntries(resultsDiv, [ res.entry ]);
      });
    };

  });
};