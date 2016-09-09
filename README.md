**WARNING: After you give it your permission, this script edits your Google Contacts**

**=> [backup your contacts](https://www.google.com/contacts/u/0/?cplus=0#contacts), and use at your own risk!**

##Tech stack

- Google Contacts API
- Github API

##Problem statement

It's slow and boring to look for relevant (and available) freelancing friends when we want to forward a mission to them

##Pitch

A personal directory in which I can add my freelance friends, look for relevant ones based on technologies, and subscribe to their updates of skills, preferences and availability (in order to update my directory)

##Project URLs

- https://www.getrevue.co/profile/aj-sideprojects/issues/side-project-6-freelance-directory-client-23842
- client: https://github.com/adrienjoly/freelance-directory-client
- server: TODO

##Use cases

- Find relevant and available Freelancers quickly from your contacts, based on the stack/skills of the mission that you want to forward
- Edit the technical stack / skills, preferences, and availability of your Freelancing contacts, manually
- Subscribe to your Freelancing contacts, to help you update their info (i.e. stack/skills, prefs, avail.)
- As a Freelancer, publish your updates (i.e. stack/skills, prefs, avail.), so that your friends can integrate changes into their directory

## Working features / Sample usage from [adrienjoly.com/freelance-directory-client](http://adrienjoly.com/freelance-directory-client/)

1. Display and backup your contacts

    + When opening the page, give permission to access your Google Contacts. (*don't worry, I can't store any personal data because this app has no back-end server!*)
    + The "list contacts" button appends all your contacts on the page, to make sure that the app is connected to your Google Contacts account.
    + Click "backup contacts" button to generates a JSON export of your contacts, and appends it on the page. Then keep that JSON data safely in a file, just in case. :-)
    + Enter a word to search for contacts whose description contain that word.
    + Display a contact by id. (e.g. the first one's id is 0)

2. Update a contact's description

    + Append "Coucou" to that contact (i.e. use its id)
    + Display that contact again, to realize that the app has stored "Coucou" in the corresponding Google Contacts directory. => It's still displayed if you refresh the app.
    + You can now search for contacts that contain "Coucou"

3. Receive contact updates from external sources

    + Click the "Register protocol" button, so that `web+fdupdate://` URLs are transmitted to this app, at this URL.
    + Copy the URL of the "Test custom protocol handler" link.
    + Close the app's tab.
    + Open the copied URL (`web+fdupdate://...`) in a new tab => the app should open and display the content of the incoming update (a github commit)
    + In the future, you will be able to append up-to-date availability information from a freelancing friend into your corresponding Google Contact. This information will be stored in a Github commit, and pushed to you by email, in the form of a `web+fdupdate://...` link. :-)

## Syntax of custom update URLs

Syntax: `web+fdupdate:<EMAIL>/github.com/<USERNAME>/<REPONAME>/commit/<COMMIT>`

Sample URL: `web+fdupdate:scott@whyd.com/github.com/adrienjoly/freelance-directory-client/commit/58525a4a026f25d3a116eef2f0e73ed62c81da10`

The sample URL above informs `freelance-directory-client` that:

- your friend Scott whose email address is `scott@whyd.com` has updated his freelancing info;
- this update is stored in a commit that can be found there: [github.com/adrienjoly/freelance-directory-client/commit/58525a4a026f25d3a116eef2f0e73ed62c81da10](http://github.com/adrienjoly/freelance-directory-client/commit/58525a4a026f25d3a116eef2f0e73ed62c81da10), which contains:

```
<freelance-directory-profile>
#nodejs #meteorjs #reactjs #mongodb developer.
rate: 120€/hour
availability: half-time starting in mid-august
preferences: remote work only
</freelance-directory-profile>
```

For instance, this update contains:

- technologies that Scott works on professionally, in the form of hashtags;
- Scott's current hourly rate;
- his current availability;
- and his current preferences.

## Next steps

- Actually store updates from custom URLs into the corresponding contact
- Design an actual UI for the product
- Design+copywriting: make an explanatory landing page with a Google Connect button

## Forking instructions

- After forking, don't forget to set your own Google Client id in `contacts.js`
