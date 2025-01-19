### `config/config.common.js`
* In the JSON object for the config, update `.application.name` from `web-application-template` to the name of the application (eg: `my-demo-app`).

### `package.cjson` / `package.json` / `package-lock.json`
* In the JSON object for the package, update `.name` from `web-application-template` to the name of the application (eg: `my-demo-app`).

### `package.cjson` / `package.json`
* Update the URLs for `.homepage`, `.repository.url` and `.bugs.url` to the appropriate values.
* Update the `.author` field to the appropriate value.
* Update the `.license` field to the appropriate value.

### `README.md`
* Update the title of the `README.md` file from `web-application-template` to the name of the application (eg: `My Demo App`).

### `backend/src/server/application.js`
In definition of function `logAndNotifyAboutServer()`, w.r.t. `localIpAddressesAndHostnames`:
* Either change the `preferredEntries` entry from `'web-application-template'` to the mapped name (eg: `'my-demo-app'`) for the local development machine in the hosts file (`/etc/hosts`)
* Or remove that entry (`'web-application-template'`) if it is not required
