# Markdown Plus

<img src="docs/icon.svg" alt="icon" width="256" height="256"/>

Markdown Plus ("M+" or "mdp" for short) is a markdown editor with extra features.

![Markdown Plus](screenshot.png)

## Online Demo

[Markdown Plus](https://chuntaoliu.com/markdown-plus/)

## Setup & Run

Optionally :star: this project, then:

```
fork it
git clone to your local
yarn install
yarn serve
open http://localhost:1234/ in your browser
```

## License

MIT

Copyright © 2015 - 2024 [Tyler Liu](https://github.com/tylerlong)

---

## Todo

- Get rid of jQuery
- Write Playwright tests
- Support mobile devices
  - codemirror support mobile devices
- Make it an easy-to-embed library
- Replace mermaid with lightweight alternatives
  - elk.js + dynamically render to get element size
- Make an app for ebook authoring
- Rewrite markdown-core, a mono repo for all the plugins
- Remove support for class diagram since it is not stable
- Upgrade all dependencies to latest version, no exception
- Must have a render finished event
  - mdc.init must be a Promise
- Creat a VS Code extension
- No `eslint-disable`
- Enable react strict mode
  - only after we could properly dispose all side effects
- Update modal forms UI
  - the preferences modal
- gantt diagram x-axis format should be part of the diagram code, not a settings
- Release a React library so that every can use it easily
  - a few lines of code to embed mdp to their own app
- Download as pdf/png/html/html code
- show icon as the first item in toolbar, clicked to show the about modal
- modals should go to separate files in src/components/modals folder
