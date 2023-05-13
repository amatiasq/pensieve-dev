import { emitter } from '@amatiasq/emitter';

const onNavigate = emitter<Route>();

const root = '/';
const create = '/new';
const settings = '/settings';
const note = '/note/:noteId';

class Route {
  get _path() {
    return preserveQueryParams(this.path);
  }

  constructor(readonly path: string = location.pathname) {}

  readonly isNote = acceptNoteOrId(
    (id) => this.path === note.replace(':noteId', id)
  );

  getPageName() {
    if (this.path === '/') return 'home';
    const [, start] = this.path.split('/');
    return start;
  }
}

export class Router {
  readonly root = root;
  readonly create = create;
  readonly settings = settings;
  readonly note = note;

  get _root() {
    return preserveQueryParams(this.root);
  }
  get _create() {
    return preserveQueryParams(this.create);
  }
  get _settings() {
    return preserveQueryParams(this.settings);
  }
  get _note() {
    return preserveQueryParams(this.note);
  }

  #route = new Route();
  get route() {
    return this.#route;
  }
  get path() {
    return this.#route.path;
  }

  constructor() {
    onNavigate.subscribe((x) => (this.#route = x));
  }

  go(target: string) {
    this.#go(target);
  }
  goRoot() {
    this.#go(this._root);
  }
  goSettings() {
    this.#go(this._settings);
  }
  #go(target: string) {
    history.pushState(null, '', target);
  }

  readonly isNote = acceptNoteOrId((id) => this.#route.isNote(id));
  readonly toNote = acceptNoteOrId((id) => this._note.replace(':noteId', id));
  readonly goNote = acceptNoteOrId((id) =>
    this.#go(this._note.replace(':noteId', id))
  );

  getPageName() {
    return this.#route.getPageName();
  }

  #listeners = [] as (() => boolean)[];
  onNavigate(listener: (route: Route) => any) {
    this.#listeners.push(onNavigate.subscribe(listener));
  }
  clearListeners() {
    this.#listeners.forEach((x) => x());
  }
}

function acceptNoteOrId(op: (id: string) => any) {
  return op;
  // return (noteOrId: Note | NoteId) =>
  //   op(typeof noteOrId === 'string' ? noteOrId : noteOrId.id);
}

function preserveQueryParams(url: string) {
  const { search } = location;
  return search && !url.includes(search) ? `${url}${search}` : url;
}
