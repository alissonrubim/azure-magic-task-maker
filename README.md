# Azure Magic Task Maker


## For developers

If you wanna start install it as a developer, you must go to `chrome://extension`, click on `Lock unpacked` and then choose the `source` folder inside this project.

On here you must configure your PAT Token to work with the project. Click on the extensions icon on Chrome, choose the installed extension and go to option page.

## How to deploy

You head over https://chrome.google.com/webstore/devconsole and select the project. You must pack the extension first using the `npm run build` command inside the `source` folder.

The command will create a dist.zip file that can be used to upload to the chrome extension store.