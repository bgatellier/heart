# Change Log - @scodi/api

## 5.0.0

### Major Changes

- 9772c5a: Changed the package scope and name to use the @scodi scope

### Minor Changes

- abc69b2: Add compatibility with Node.js versions 21 and 22

### Patch Changes

- Updated dependencies [9772c5a]
- Updated dependencies [abc69b2]
- Updated dependencies [abc69b2]
- Updated dependencies [6727016]
  - @scodi/common@5.0.0
  - @scodi/cli@5.0.0

This log was last generated on Sun, 08 Oct 2023 13:58:00 GMT and should not be manually modified.

## 4.0.0

Sun, 08 Oct 2023 13:58:00 GMT

### Breaking changes

- Add compatibility with Node.js versions 18, 19 and 20
- Node.js 18 LTS is now required: the previous Node.js version used (14) reached end-of-life
- Improve the API specifications: they are more scalable and consistent with the CLI options
- Add the service logo URL to the JSON response
- Fix the JSON response to always show every properties (make the undefined properties null)
- Move to ES packages mechanism

### Minor changes

- Improve performances and extensibility by replacing the Express framework by fastify
- Add the except_listeners and only_listeners keys to the body, to reduce the list of listeners packages triggered after an analysis. Both keys accept an array of module IDs (e.g. greenit)

### Updates

- Update issues and repository URLs

## 3.2.0

Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Make the module compatible with the threshold feature introduced with @scodi/cli 3.3.0
- HTTP CORS headers can now be set
- Add input validation: a 400 HTTP status code and a detailed body response are now send if the configuration or the threshold have an unexpected format

### Patches

- Remove a useless dependency

### Updates

- Updated the homepage field to redirect to the heart website and not to the gitlab repository. Changed the link "Read more about" of the README to redirect to the README of the repository. The old link redirected to an article that do not exist anymore.
- Updating dependency @scodi/core from `^3.1.1` to `^3.2.0`

## 3.1.1

Wed, 27 Jul 2022 13:43:15 GMT

### Patches

- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.1.0

Thu, 16 Jan 2020 14:51:38 GMT

### Minor changes

- Initial release of automated tests

### Patches

- Update the link to the purpose of Scodi in the README, to redirect to the fabernovel.com website instead of the wiki

## 3.0.1

Fri, 19 Jul 2019 09:43:15 GMT

### Patches

- Fix an issue where the binary was not packaged when published to NPM

## 3.0.0

Fri, 19 Jul 2019 08:17:11 GMT

### Breaking changes

- Add Scodi CLI as a peer dependency: it must be installed to make this module usable
- Upgrade the minimum required version of Node.js to the active LTS: from >=8.0.0 to >=10.13.0
- Improve compatibility: starting from this version, every Scodi module shares the same major version number

### Minor changes

- Improve the module installation: it can now be installed as a devDependency

### Patches

- Remove the contributing guide and the license: they are now available in the Scodi repository
- Remove unnecessary dependencies and scripts from package.json
- Update the readme to reflect the changes introduced by this major release
