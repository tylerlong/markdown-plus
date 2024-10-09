import { manage } from 'manate';

class Modal {
  public isOpen = false;
  public open() {
    this.isOpen = true;
  }
  public close() {
    this.isOpen = false;
  }
}

export class Preferences {
  public showToolbar = true;
  public editorVersusPreview = '50%';
  public editorTheme = 'default';
  public editorFontSize = 14;
  public keyBinding = 'default';
  public ganttAxisFormat = '';
  public customCssFiles = '';
  public customJsFiles = '';

  // neither editor or preview is hidden
  public get normalWidth() {
    return this.editorVersusPreview === '100%' ||
      this.editorVersusPreview === '1'
      ? '50%'
      : this.editorVersusPreview;
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
  };

  public preferences = new Preferences();
}

const store = manage(new Store());

export default store;
