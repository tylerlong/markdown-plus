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

export class Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public editor: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public layout: any;

  public modals = {
    about: new Modal(),
    help: new Modal(),
  };
}

const store = manage(new Store());

export default store;
