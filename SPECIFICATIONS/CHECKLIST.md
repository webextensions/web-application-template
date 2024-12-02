# CHECKLIST

## `.html` file(s)
* [ ] The `.html` file(s) should contain an attribute `data-app-version` in the `<html>` element which should be the version of the application project

## `webpack` bundling
* [ ] The `webpack` bundling should be configured to generate a sourcemap file for debugging purposes
  * [ ] The sourcemap file should be generated only in the development mode
  * [ ] It should be possible to generate a "nosources" sourcemap which may be utilized in the production mode
