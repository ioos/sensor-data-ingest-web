This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


## Available Scripts
Install the dependencys by running `npm install`
In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Open [http://localhost:3000/Orono.WX2.Airmar](http://localhost:3000/Orono.WX2.Airmar) to view the dashboard.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!


## Build Setup
### Changing Node.js versions
You may install an older version of Node.js by installing *nvm* from this repo.
``` bash
https://github.com/creationix/nvm
```

Or on Mac with Homebrew http://dev.topheman.com/install-nvm-with-homebrew-to-use-multiple-versions-of-node-and-iojs-easily/
```bash
brew install nvm
mkdir ~/.nvm
nano ~/.bash_profile
```

Add the following in the shell profile configuration
```bash
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```

Reload the terminal session and test by running
```bash
echo $NVM_DIR
```

Install a version of Node.js

You may specify a less specific version of node : `nvm install 12`
```bash
nvm install 12.4.0
```

Make a note of the version installed so that you're able to set the default version using the command below

Set the default version of Node
```bash
nvm alias default 12.4.0
```

 __Other notes:__
 There may be value in running:
 
Clear npm cache
```bash
npm cache clear
 ```

Get rid of unused packages
```bash
npm prune
 ```
 
