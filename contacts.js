(function(){

  // used for displaying resulting contacts after a search
  function appendEntries(div, entries) {  
    div.innerHTML = div.innerHTML + entries.map(function(entry){
      var name = (entry.title || {}).$t;
      var notes = ((entry.content || {}).$t || '').replace(/\n/g, '<br />\n');
      return name || notes ? '<h3>' + name + '</h3>\n<p>' + notes + '</p>\n' : '';
    }).join('');
  }

  // used by the "backup" feature for rendering contacts in JSON
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

  // used for displaying contacts on the page
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

  // binds functions to UI elements
  function bindUI(token) {
    var resultsDiv = document.getElementById('results');
    var exportDiv = document.getElementById('export');
    document.getElementById('logged').style.display = 'block';
    document.getElementById('btnFetchAll').onclick = function(){
      fetchAllContacts(token, makeAppender(resultsDiv));
    };
    document.getElementById('btnBackup').onclick = function(){
      backupAllContacts(token, makeAppender(exportDiv, appendJsonEntries));
    };
    document.getElementById('search').onsubmit = function(evt) {
      evt.preventDefault();
      var q = document.getElementById('query').value;
      searchContacts(token, q, makeAppender(resultsDiv));
    };
  }

  // inits the contacts API and UI on page load
  window.onload = function() {
    console.log('√ onload');
    document.getElementById('btnRegisterProtocol').onclick = function() {
      var url = window.location.href.replace(/contacts\.html.*/, 'fdupdate.html') + '?fdupdate=%s';
      console.log('btnRegisterProtocol:', url);
      // /!\ this may not work from localhost
      navigator.registerProtocolHandler('web+fdupdate', url, 'Freelance Directory Update');
    }
    auth(function(err, token){
      if (err) {
        console.error('auth =>', err);
        // TODO: redirect to home page, for login, or at least display feedback
      } else {
        console.log('√ auth');
        bindUI(token);
      }
    });
  };

})();
