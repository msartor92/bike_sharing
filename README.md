## Bike Sharing ##

This project provide a simple and cleaner front-end for toBike service. It loads data by parsing original web page.

To run this project you need to build front-end by execute the following command:

1. npm install --save-dev
2. npm run build
3. npm start

Based on: 

* Node.js
* Express.js
* Grunt
* Angular 1

Continuos Integration Deploy:
To get your production machine always updated to last release

1. configure webhook in your Github.com page
2. into ci-deploy.js set passfrase, request path and port
3. pm2 start ci-depoloy.js
4. push git tag to deploy version on your server


Tested with Node v.4.4.2 and Chrome 57