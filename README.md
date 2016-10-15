**WARNING: After you give it your permission, this script edits your Google Contacts**

**=> [backup your contacts](https://www.google.com/contacts/u/0/?cplus=0#contacts), and use at your own risk!**

# Freelance Directory Client

*Problem statement: It's slow and boring to look for relevant (and available) freelancing friends, when we want to forward a mission to them.*

![Freelance Directory Client Screenshot](/about/homepage.png)

Freelance Directory Client is a personal contacts directory in which I can add my freelance friends, look for relevant ones based on technologies, and subscribe to their updates of skills, preferences and availability (in order to update my directory). It's based on Google Contacts.

![Freelance Directory Client Screenshot](/about/search.png)

- You can try it from: [adrienjoly.com/freelance-directory-client](https://adrienjoly.com/freelance-directory-client)
- Sample profile, on GitHub: [adrienjoly/freelance-directory-profile](https://github.com/adrienjoly/freelance-directory-profile) (fork it and put your info!)
- The story behing this project: [Side project #6 - Freelance Directory Client](https://www.getrevue.co/profile/aj-sideprojects/issues/side-project-6-freelance-directory-client-23842)
- Source code: [this repository](https://github.com/adrienjoly/freelance-directory-client)

## FEATURES: Use cases

- Find relevant and available Freelancers quickly from your contacts, based on the stack/skills of the mission that you want to forward **[WORKING]**
- Edit the technical stack / skills, preferences, and availability of your Freelancing contacts, manually **[COMING SOON]**
- Subscribe to your Freelancing contacts, to help you update their info (i.e. stack/skills, prefs, avail.) **[COMING SOON]**
- As a Freelancer, publish your updates (i.e. stack/skills, prefs, avail.), so that your friends can integrate changes into their directory **[WORKING]**

## USAGE: Working features

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

## PRICING: Is this free to use?

Freelance-directory-client is free, and will always be free to use, for several reasons:

- As a tool that promotes sharing between freelancers and eases the process of our clients to find relevant talent, I'm willing to encourage my peers to use it, without financial barrier.
- So far, I don't need to setup and maintain a server/back-end infrastructure for this app, so it costs me nothing (but a bit of time to maintain the code).

So I'm happy to offer this product for free! :-)

...And, if I ever change my mind, you will still be able to fork this repo to keep using it for free!

## API: Syntax of custom update URLs

Syntax: `web+fdupdate:<EMAIL>/github.com/<USERNAME>/<REPONAME>/commit/<COMMIT>`

Sample URL: `web+fdupdate:adri@whyd.com/github.com/adrienjoly/freelance-directory-profile/commit/2987b22c22df618d464af5e44d0d5c32d28e21c2`

The sample URL above informs `freelance-directory-client` that:

- your friend Adrien whose email address is `adri@whyd.com` has updated his freelancing info;
- this update is stored in a commit that can be found there: [github.com/adrienjoly/freelance-directory-profile/commit/2987b22c22df618d464af5e44d0d5c32d28e21c2](http://github.com/adrienjoly/freelance-directory-profile/commit/2987b22c22df618d464af5e44d0d5c32d28e21c2), which contains:

```
<freelance-directory-profile>
#nodejs #vuejs #reactjs #mongodb developer.
rate: 120€/hour
availability: half-time, but only for collaborations (not for paid missions), cf adrienjoly.com/now
preferences: remote work only, cf contact page of adrienjoly.com
</freelance-directory-profile>
```

For instance, this update contains:

- technologies that Adrien works on professionally, in the form of hashtags;
- Adrien's current hourly rate;
- his current availability;
- and his current preferences.

**If you want to publish your freelance profile, fork the [freelance-directory-profile](https://github.com/adrienjoly/freelance-directory-profile) repository in your own Github account, and fill it with your own info.**

## ROADMAP: Next steps

- Actually store updates from custom URLs into the corresponding contact
- Design an actual UI for the product
- Design+copywriting: make an explanatory landing page with a Google Connect button

## SETUP: Forking instructions

- After forking, don't forget to set your own Google Client id in `google-contacts.js`
