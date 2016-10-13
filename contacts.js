(function(){

  function getPhotoUrl(googleContactEntry) {
    for (var i in googleContactEntry.link) {
      var link = googleContactEntry.link[i];
      if (link.rel.indexOf('photo') != -1) {
        return link.href;
      }
    }
  }

  function getJobs(googleContactEntry) {
    return (googleContactEntry.gd$organization || []).map(function(org) {
      return (org.gd$orgTitle || {}).$t + ' @ ' + (org.gd$orgName || {}).$t;
    });
  }

  // used for displaying resulting contacts after a search
  function appendEntries(div, entries) {
    var token = this;  
    div.innerHTML = div.innerHTML + entries.map(function(entry){
      var contactId = (entry.id || {}).$t; 
      var name = (entry.title || {}).$t;
      var email = ((entry.gd$email || [])[0] || {}).address || '';
      var notes = ((entry.content || {}).$t || '').replace(/\n/g, '<br />\n');
      var photoUrl = getPhotoUrl(entry);
      var jobs = getJobs(entry);
      photoUrl = photoUrl ? photoUrl + '&access_token=' + encodeURIComponent(token.access_token) : '';
      return !(name || notes) ? '' : [
        '<div class="contact" data-id="' + contactId + '">',
        '<div class="photo-container">',
        '<div class="photo" style="background-image:url(' + photoUrl + ');">',
        '</div></div>',
        '<h3>' + name + '</h3>',
        '<p><a href="mailto:' + email + '">' + email + '</a></p>', 
        '<ul>' + jobs.map(function(job) { return '<li>' + job + '</li>'; }) + '</ul>',
        '<p>' + notes + '</p>',
        '</div>'
      ].join('\n');
    }).join('\n');
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
        console.log('=>', json.feed.entry);
        appendFct(div, json.feed.entry || []);
      }
    };
  }

  // binds functions to UI elements
  function bindUI(token) {
    var resultsDiv = document.getElementById('results');
    var exportDiv = document.getElementById('export');
    document.getElementById('logged').style.display = 'block';
    document.getElementById('btnFetchAll').onclick = function(){
      fetchAllContacts(token, makeAppender(resultsDiv, appendEntries.bind(token)));
    };
    document.getElementById('btnBackup').onclick = function(){
      backupAllContacts(token, makeAppender(exportDiv, appendJsonEntries));
    };
    document.getElementById('search').onsubmit = function(evt) {
      evt.preventDefault();
      var q = document.getElementById('query').value;
      searchFullContacts(token, q, makeAppender(resultsDiv, appendEntries.bind(token)));
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
        console.log('√ auth', token);
        bindUI(token);
      }
    });
  };

})();
