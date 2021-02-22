The Navy SEALs live by a motto that captures this repository well: “no one is coming; it’s up to us.”

Good Luck.


## Chrome Extension
At one point based off of this [template](https://github.com/sivertschou/react-typescript-chrome-extension-boilerplate)

## Webapp
Bootstrapped using `yarn create react-app antd-demo-ts --template typescript`

## Electron
Using [Electron-Builder](https://www.electron.build/) to package up the webapp.


### Verify Signing Cheatsheet
- `codesign -vvv --deep --strict out/my-new-app-darwin-x64/my-new-app.app`
- `codesign --display --entitlements :- out/my-new-app-darwin-x64/my-new-app.app` 
- `codesign -dvv out/my-new-app-darwin-x64/my-new-app.app`
- `security cms -D -i /path/to/your.app/Contents/embedded.provisionprofile`
- `codesign --test-requirement="=notarized" --verify --verbose <appname.app>`

Maybe [this](https://snippets.cacher.io/snippet/354a3eb7b0dcbe711383) works

## Weird Gotchas
- Shouldn't need to target a `zip` output for electron, however we need to for [auto-updater to work](https://github.com/electron-userland/electron-builder/issues/2199) 