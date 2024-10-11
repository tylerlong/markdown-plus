import $ from 'jquery';

import store from './store';

const getSampleText = (event) => {
  let text = store.editor.getSelection();
  if (text.trim() === '') {
    text = $(event.currentTarget).data('sample');
  }
  return text;
};

export const registerToolBarEvents = () => {
  // h1 - h6 heading
  $('.heading-icon').click((event) => {
    const level = $(event.currentTarget).data('level');
    const cursor = store.editor.getCursor();
    store.editor.setCursor(cursor.line, 0);
    store.editor.replaceSelection('#'.repeat(level) + ' ');
    store.editor.focus();
  });

  // styling icons
  $('.styling-icon').click((event) => {
    const modifier = $(event.currentTarget).data('modifier');
    if (!store.editor.somethingSelected()) {
      const word = store.editor.findWordAt(store.editor.getCursor());
      store.editor.setSelection(word.anchor, word.head);
    }
    store.editor.replaceSelection(
      modifier + store.editor.getSelection() + modifier,
    );
    store.editor.focus();
  });

  // <hr/>
  $('#horizontal-rule').click(() => {
    const cursor = store.editor.getCursor();
    if (cursor.ch === 0) {
      // cursor is at line start
      store.editor.replaceSelection('\n---\n\n');
    } else {
      store.editor.setCursor({ line: cursor.line }); // navigate to end of line
      store.editor.replaceSelection('\n\n---\n\n');
    }
    store.editor.focus();
  });

  // list icons
  $('.list-icon').click((event) => {
    const prefix = $(event.currentTarget).data('prefix');
    const selection = store.editor.listSelections()[0];
    const minLine = Math.min(selection.head.line, selection.anchor.line);
    const maxLine = Math.max(selection.head.line, selection.anchor.line);
    for (let i = minLine; i <= maxLine; i++) {
      store.editor.setCursor(i, 0);
      store.editor.replaceSelection(prefix);
    }
    store.editor.focus();
  });

  $('#link-icon').click((event) => {
    const text = getSampleText(event);
    const url = $(event.currentTarget).data('sample-url');
    store.editor.replaceSelection(`[${text}](${url})`);
    store.editor.focus();
  });

  $('#image-icon').click((event) => {
    const text = getSampleText(event);
    const url = $(event.currentTarget).data('sample-url');
    store.editor.replaceSelection(`![${text}](${url})`);
    store.editor.focus();
  });

  $('#code-icon').click(() => {
    store.editor.replaceSelection(
      `\n\`\`\`\n${store.editor.getSelection()}\n\`\`\`\n`,
    );
    store.editor.focus();
  });

  $('#table-icon').click((event) => {
    const sample = $(event.currentTarget).data('sample');
    const cursor = store.editor.getCursor();
    if (cursor.ch === 0) {
      // cursor is at line start
      store.editor.replaceSelection(`\n${sample}\n\n`);
    } else {
      store.editor.setCursor({ line: cursor.line }); // navigate to line end
      store.editor.replaceSelection(`\n\n${sample}\n`);
    }
    store.editor.focus();
  });

  $('#math-icon').click((event) => {
    const text = getSampleText(event);
    store.editor.replaceSelection(`\n\`\`\`katex\n${text}\n\`\`\`\n`);
    store.editor.focus();
  });

  $('.mermaid-icon').click((event) => {
    const text = getSampleText(event);
    store.editor.replaceSelection(`\n\`\`\`mermaid\n${text}\n\`\`\`\n`);
    store.editor.focus();
  });

  // $('#toggle-toolbar').click(() => {
  //   store.layout.toggle('north');
  // });

  // $('#toggle-editor').click(() => {
  //   if (store.layout.panes.center.outerWidth() < 8) {
  //     // editor is hidden
  //     store.layout.sizePane('east', store.preferences.normalWidth);
  //   } else {
  //     store.layout.sizePane('east', '100%');
  //   }
  // });

  // $('#toggle-preview').click(() => {
  //   if (store.layout.panes.east.outerWidth() < 8) {
  //     // preview is hidden
  //     store.layout.sizePane('east', store.preferences.normalWidth);
  //   } else {
  //     store.layout.sizePane('east', 1);
  //   }
  // });
};
