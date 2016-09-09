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

## Sample usage from [adrienjoly.com/freelance-directory-client](http://adrienjoly.com/freelance-directory-client/)

- When opening the page, give permission to access your Google Contacts. (*don't worry, I can't store any personal data because this app has no back-end server!*)
- The "list contacts" button appends all your contacts on the page, to make sure that the app is connected to your Google Contacts account.
- Click "backup contacts" button to generates a JSON export of your contacts, and appends it on the page. Then keep that JSON data safely in a file, just in case. :-)
- Enter a word to search for contacts whose description contain that word.
- Display a contact by id. (e.g. the first one's id is 0)
- Append "Coucou" to that contact (i.e. use its id)
- Display that contact again, to realize that the app has stored "Coucou" in the corresponding Google Contacts directory. => It's still displayed if you refresh the app.
- You can now search for contacts that contain "Coucou"

## Forking instructions

- After forking, don't forget to set your own Google Client id in `contacts.js`
