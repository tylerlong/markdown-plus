import { manage } from 'manate';

class Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public editor: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public layout: any;
}

const store = manage(new Store());

export default store;
