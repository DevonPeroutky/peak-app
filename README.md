The Navy SEALs live by a motto that captures this repository well

> "no one is coming; it’s up to us."

Good Luck.

# Components
## Chrome Extension
At one point based off of this [template](https://github.com/sivertschou/react-typescript-chrome-extension-boilerplate)


### Publishing a new version of the Chrome Extension
1. Merge your PR into main with the version bumped in `scripts/base_manifest.json`
2. Run `yarn extension:publish`
3. Zip the output `/extension-dist` from the previous step  
4. Upload the zip to [Chrome Extension Developer Console](https://chrome.google.com/webstore/devconsole/)


## Webapp
Bootstrapped using `yarn create react-app antd-demo-ts --template typescript`


### Publishing a new version of the Webapp
- Once a PR is merged to main, render will automatically re-deploy the webapp. 


## Backend Server
An elixir project built using Elixir, Phoenix, and Ecto. Also hosted on Render. Source code lives in a private [Gitlab repo](https://gitlab.com/peak1/peak-backend), but will be open-sourced as well as some point.  



#### Publishing a new version of the Backend
- Once a PR is merged to main, render will automatically re-deploy the backend service 



## Electron
Using [Electron-Builder](https://www.electron.build/) to package up the webapp. Originally based off of this [boilerplate](https://github.com/yhirose/react-typescript-electron-sample-with-create-react-app-and-electron-builder)


### Publishing a new version of the Electron App
- Merge the PR to main, with the version bumped in `package.json`. 
- Once merged, rebase off of main
- Run `. ./set-build-secrets.sh` to set the local environment variables necessary to sign, notarize, and publish the app
- `yarn electron:publish`


## Random Things
### Verify Signing Cheatsheet
- `codesign -vvv --deep --strict out/my-new-app-darwin-x64/my-new-app.app`
- `codesign --display --entitlements :- out/my-new-app-darwin-x64/my-new-app.app` 
- `codesign -dvv out/my-new-app-darwin-x64/my-new-app.app`
- `security cms -D -i /path/to/your.app/Contents/embedded.provisionprofile`
- `codesign --test-requirement="=notarized" --verify --verbose <appname.app>`

Maybe [this](https://snippets.cacher.io/snippet/354a3eb7b0dcbe711383) works

## Weird Gotchas
- Shouldn't need to target a `zip` output for electron, however we need to for [auto-updater to work](https://github.com/electron-userland/electron-builder/issues/2199) 
