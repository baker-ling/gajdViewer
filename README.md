# gajdViewer [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

A Google Maps-based viewer of data from the Grammar Atlas of Japanese Dialects.
This is a project that I originally made as a capstone project for my Masters degree in Japanese Linguistics. I taught myself JavaScript to make this app, and it contains a few hacks to make it work with the limited knowledge I had at the time. (For one, data is loaded by adding script tags dynamically. Thank you JavaScript for supporting sparse arrays!)

Also, one big feature that no longer works is an overlay of Uwano Zendō's (1983) accent map of Japan. I believe I used an outside server

## Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Questions](#questions)
- [License](#license)

## Installation

To run this on your own computer, you will have to do the following:

1. Clone the git repository to your local computer.
2. Obtain a Google Maps JavaScript API key.
3. Replace the API key inside the `src` attribute of `<script>` tag that links to the Google Maps JavaScript API on line 30 of `/gajdviewer.html`.

## Usage

To use the GAJD Viewer, open gajdviwer.html in your web browser.

A live version is deployed here: https://baker-ling.github.io/gajdViewer/gajdviewer.html

Detailed instructions are inside the app, below the controls for the app.

## Contributing

I would be happy to receive contributions in the form of code contributions or advice/suggestions for code cleanup, refactoring, redesign (e.g. to be more responsive), bug fixes (e.g. the overlay of Uwano Zendo's accent map, which no longer works), etc. Just send me an email or use the GitHub issues.

## Questions

If you have any questions, feel free to reach out via one of the following:

- Email: [brian.baker.bdb@gmail.com](mailto:brian.baker.bdb@gmail.com)
- Github: @baker-ling

## License

This code for this application is distributed under the terms of [MIT License](./LICENSE).

The _Grammar Atlas of Japanese Dialects_ and its data are not covered by the terms of this license. Refer to the [National Institute for Japanese Language and Linguistics website](https://www2.ninjal.ac.jp/hogen/dp/dp_index.html) for information about terms and conditions relating to the _Grammar Atlas of Japanese Dialects_.
