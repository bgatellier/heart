# Change Log - @scodi/greenit

## 5.0.0

### Major Changes

- 9772c5a: Changed the package scope and name to use the @scodi scope

### Minor Changes

- b5f9c58: Add the language option
- abc69b2: Add compatibility with Node.js versions 21 and 22

### Patch Changes

- b5f9c58: Improve the --debug option by adding a log about the path to the browser used to analyze the webpage
- b5f9c58: Improve install size and compatibility: use the same browser as the greenit-cli dependency
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
- Use the grade for the main note, and set the normalized note as the number over 100
- Move to ES modules mechanism

### Patches

- Add a suggestion when the GreenIT Analysis dependency fails with a vague error
- The date and time of the report is now correct

## 3.1.1

Wed, 14 Dec 2022 16:41:26 GMT

### Patches

- Use the correct logo for the GreenIT module

### Updates

- Update issues and repository URLs

## 3.1.0

Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Make the module compatible with the threshold feature introduced with @scodi/cli 3.3.0

### Patches

- Consecutive analysis triggered by Scodi API now send back the correct report instead of always the first
- Hide the messages triggered by GreenIT Analysis during or after an analysis
- The date of the report is now correct

### Updates

- Updated the url used in the example to one who will not trigger a failed analysis. Such urls must be avoided until the issue has been solved.
- Updated the homepage field to redirect to the heart website and not to the gitlab repository. Changed the link "Read more about" of the README to redirect to the README of the repository. The old link redirected to an article that do not exist anymore.
- Updating dependency @scodi/core from `^3.1.1` to `^3.2.0`

## 3.0.0

Wed, 27 Jul 2022 13:43:15 GMT

### Breaking changes

- Initial release of the GreenIT module
