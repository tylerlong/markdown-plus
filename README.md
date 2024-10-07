# Markdown Plus

<img src="docs/icon.svg" alt="icon" width="256" height="256"/>

Markdown Plus ("M+" or "mdp" for short) is a markdown editor with extra features.

![Markdown Plus](screenshot.png)

## Online Demo

[Markdown Plus](https://chuntaoliu.com/markdown-plus/)

## Features

- GitHub flavored markdown
- Live preview with scroll sync
- Source code highlight
- Footnote
- Table of Contents
- Task list
- Abbreviation
- Custom container
- Definition list
- Emoji, Font Awesome icon
- Mathematical formula, AsciiMath
- Mermaid: Flowchart, Sequence diagram, Gantt diagram, Class diagram
- Vim mode, Emacs mode
- [Themes](https://github.com/tylingsoft/markdown-plus-themes)
- [Plugins](https://github.com/tylingsoft/markdown-plus-plugins)
- Chart.js: line, bar, radar, polar area, pie, doughnut and bubble

## Setup & Run

Optionally :star: this project, then:

```
fork it
git clone to your local
yarn install
yarn serve
open http://localhost:1234/ in your browser
```

## How to use Markdown Plus in your projects

Please take `src/index.html` as example.

## License

MIT

Copyright © 2015 - 2024 [Tyler Liu](https://github.com/tylerlong)

---

## Todo

- Replace jQeury Layout with split-grid
- Get rid of jQuery
- Convert to React
- Write Playwright tests
- Support mobile devices
- Make it an easy-to-embed library
- Replace mermaid with lightweight alternatives
  - elk.js + dynamically render to get element size
- Make an app for ebook authoring
- Rewrite markdown-core, a mono repo for all the plugins
- bug: scroll by url hash, source code position is not accurate
- Replace js-cookie with localforage
- Remove support for class diagram since it is not stable
