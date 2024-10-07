import $ from 'jquery';

import editor from './editor';
import { getNormalPreviewWidth } from './util';
import layout from './layout';

const getSampleText = (event) => {
  let text = editor.getSelection();
  if (text.trim() === '') {
    text = $(event.currentTarget).data('sample');
  }
  return text;
};

const promptForValue = (key, action) => {
  $(document).on('opened', '#' + key + '-modal', () => {
    $('#' + key + '-code').focus();
  });
  $('#' + key + '-code').keyup((e) => {
    if (e.which === 13) {
      // press enter to confirm
      $('#' + key + '-confirm').click();
    }
  });
  $(document).on('confirmation', '#' + key + '-modal', () => {
    const value = $('#' + key + '-code')
      .val()
      .trim();
    if (value.length > 0) {
      action(value);
      $('#' + key + '-code').val('');
    }
  });
};

const registerToolBarEvents = () => {
  // h1 - h6 heading
  $('.heading-icon').click((event) => {
    const level = $(event.currentTarget).data('level');
    const cursor = editor.getCursor();
    editor.setCursor(cursor.line, 0);
    editor.replaceSelection('#'.repeat(level) + ' ');
    editor.focus();
  });

  // styling icons
  $('.styling-icon').click((event) => {
    const modifier = $(event.currentTarget).data('modifier');
    if (!editor.somethingSelected()) {
      const word = editor.findWordAt(editor.getCursor());
      editor.setSelection(word.anchor, word.head);
    }
    editor.replaceSelection(modifier + editor.getSelection() + modifier);
    editor.focus();
  });

  // <hr/>
  $('#horizontal-rule').click(() => {
    const cursor = editor.getCursor();
    if (cursor.ch === 0) {
      // cursor is at line start
      editor.replaceSelection('\n---\n\n');
    } else {
      editor.setCursor({ line: cursor.line }); // navigate to end of line
      editor.replaceSelection('\n\n---\n\n');
    }
    editor.focus();
  });

  // list icons
  $('.list-icon').click((event) => {
    const prefix = $(event.currentTarget).data('prefix');
    const selection = editor.listSelections()[0];
    const minLine = Math.min(selection.head.line, selection.anchor.line);
    const maxLine = Math.max(selection.head.line, selection.anchor.line);
    for (let i = minLine; i <= maxLine; i++) {
      editor.setCursor(i, 0);
      editor.replaceSelection(prefix);
    }
    editor.focus();
  });

  $('#link-icon').click((event) => {
    let text = getSampleText(event);
    const url = $(event.currentTarget).data('sample-url');
    editor.replaceSelection(`[${text}](${url})`);
    editor.focus();
  });

  $('#image-icon').click((event) => {
    let text = getSampleText(event);
    const url = $(event.currentTarget).data('sample-url');
    editor.replaceSelection(`![${text}](${url})`);
    editor.focus();
  });

  $('#code-icon').click(() => {
    editor.replaceSelection(`\n\`\`\`\n${editor.getSelection()}\n\`\`\`\n`);
    editor.focus();
  });

  $('#table-icon').click((event) => {
    const sample = $(event.currentTarget).data('sample');
    const cursor = editor.getCursor();
    if (cursor.ch === 0) {
      // cursor is at line start
      editor.replaceSelection(`\n${sample}\n\n`);
    } else {
      editor.setCursor({ line: cursor.line }); // navigate to line end
      editor.replaceSelection(`\n\n${sample}\n`);
    }
    editor.focus();
  });

  // emoji icon
  promptForValue('emoji', (value) => {
    if (/^:.+:$/.test(value)) {
      value = /^:(.+):$/.exec(value)[1];
    }
    editor.replaceSelection(`:${value}:`);
  });

  // Font Awesome icon
  promptForValue('fa', (value) => {
    if (value.substring(0, 3) === 'fa-') {
      value = value.substring(3);
    }
    editor.replaceSelection(`:fa-${value}:`);
  });

  $('#math-icon').click((event) => {
    let text = getSampleText(event);
    editor.replaceSelection(`\n\`\`\`katex\n${text}\n\`\`\`\n`);
    editor.focus();
  });

  $('.mermaid-icon').click((event) => {
    let text = getSampleText(event);
    editor.replaceSelection(`\n\`\`\`mermaid\n${text}\n\`\`\`\n`);
    editor.focus();
  });

  $('#toggle-toolbar').click(() => {
    layout.toggle('north');
  });

  $('#toggle-editor').click(() => {
    if (layout.panes.center.outerWidth() < 8) {
      // editor is hidden
      layout.sizePane('east', getNormalPreviewWidth());
    } else {
      layout.sizePane('east', '100%');
    }
  });

  $('#toggle-preview').click(() => {
    if (layout.panes.east.outerWidth() < 8) {
      // preview is hidden
      layout.sizePane('east', getNormalPreviewWidth());
    } else {
      layout.sizePane('east', 1);
    }
  });
};

export { registerToolBarEvents };
