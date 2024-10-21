# Markdown Plus

<img src="docs/icon.svg" alt="icon" width="256" height="256"/>

Markdown Plus ("M+" or "mdp" for short) is a markdown editor with extra features.

## [Online Demo](https://chuntaoliu.com/markdown-plus/)

![Markdown Plus](screenshot.png)

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

Copyright © 2015 - 2024 [Tyler Liu](https://github.com/tylerlong/)

## Notes

- No [abbreviation](https://michelf.ca/projects/php-markdown/extra/#abbr) support, because prettier will replace "\*" with "\_" which will break abbreviation.

---

## Todo

- Write Playwright tests
- Support mobile devices
  - codemirror support mobile devices
- Replace mermaid with lightweight alternatives
  - elk.js + dynamically render to get element size
- Make an app for ebook authoring
- Upgrade all dependencies to latest version, no exception
- Create a VS Code extension
- Enable react strict mode
  - only after we could properly dispose all side effects
- Release a React library so that everyone can use it easily
  - a few lines of code to embed mdp to their own app
- Download as pdf/png/html/html code
- Add explict typings to most code
- Make it support node.js, means it could run without browser
- Close most GitHub issues
- Just copy its example: https://docs.github.com/en/get-started/writing-on-github
- Evaluate latest version of mermaid
- Every useEffect should have a dispose method
- Why katex can generate size in node.js?
