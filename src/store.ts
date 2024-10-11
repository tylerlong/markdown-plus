import { manage } from 'manate';

class Modal {
  public isOpen = false;
  public open() {
    this.isOpen = true;
  }
  public close() {
    this.isOpen = false;
    store.editor?.focus();
  }
}

export class Preferences {
  public showToolbar = true;
  public editorVsPreview = '1fr 6px 1fr';
  public editorTheme = 'default';
  public editorFontSize = 14;
  public keyBinding = 'default';
  public ganttAxisFormat = '';
  public customCssFiles = '';
  public customJsFiles = '';

  // neither editor or preview is hidden
  public get normalEvsP() {
    return this.editorVsPreview.startsWith('0fr ') ||
      this.editorVsPreview.endsWith(' 0fr')
      ? '1fr 6px 1fr'
      : this.editorVsPreview;
  }
}

export class Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public editor: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public layout: any;

  public modals = {
    about: new Modal(),
    help: new Modal(),
    preferences: new Modal(),
    emoji: new Modal(),
    fontAwesome: new Modal(),
  };

  public preferences = new Preferences();
}

const store = manage(new Store());

export default store;
