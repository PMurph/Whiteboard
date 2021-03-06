# Whiteboard
A shared whiteboard application to facilitate the sharing of ideas.

## Technologies
* Node.js (using Express)
* MongoDB
* Backbone (with Marionette)
* Jasmine
* socket.io

## Dev Setup

### Requirements
* [Node.js](http://nodejs.org/)
* [MongoDB](http://www.mongodb.org/) (Must add to PATH on Windows)
* Bower (front end library management)
* Grunt-CLI (handy dev tasks simplified)
* Jasmine (Testing framework and runner)

### Windows
Must run shell (command prompt, git bash) as administrator for grunt script to execute server and database. This is becuase mongoDB is run as a background service and only an administrator can start and stop them.

### Useful dev tools/commands
Clean node modules:
```
rm -rf node_modules/
npm install
```
Run JS Lint test and Tests
```
grunt
```
Start node.js web server and mongoDB
```
grunt run
```

#### General Setup 
```
// After Node.js is installed and is in your $PATH
npm install bower -g
npm install grunt-cli -g
npm install jasmine -g
```
#### Setup Web Client
```
cd client/web/
npm install
bower install
```

#### Setup Web/App Server
```
cd server/
npm install
```

#### iOS App
Must have ruby installed and in PATH
```
sudo gem install cocoapods
cd client/ios/WhiteboardiOS/
pod install
open WhiteboardiOS.xcworkspace
```

####Acceptance Tests 
Web(client/tests/acceptance/*.html)
```
open Selenium IDE
File > Add test case
Select all html file under client/tests/acceptance
Click Play entire suite case
```

iOS(client/ios/WhiteboardiOS/WhiteboardiOSTests/acceptance/*.trace)
```
open WhiteboardiOS.xcworkspace
Product > Profile (cmd+I)
Select Automation

Open .trace file
    -or-
Open .js file in text editor
Copy script into automation script area

Click play button at very button of script
```
