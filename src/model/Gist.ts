import { ClientStorage } from '@amatiasq/client-storage';

import { RawGist } from '../contracts/RawGist';
import { GistId } from '../contracts/type-aliases';
import { notifyGistChanged } from '../services/cache-invalidation';
import {
  addGileToGist,
  createGist,
  fetchGist,
  removeFileFromGist,
  removeGist,
  renameGistFile,
  setFileContent,
} from '../services/github_api';
import { mergeGist } from '../util/mergeGist';
import { GistFile } from './GistFile';

type Storage = Partial<Record<GistId, RawGist>>;

const storage = new ClientStorage<Storage>('gists.cache', {
  default: {},
});

function getFromStorage(id: GistId) {
  const stored = storage.get() as Storage;
  return id in stored ? new Gist(stored[id] as RawGist) : null;
}

function saveToStorage(raw: RawGist) {
  const stored = storage.get() as Storage;
  const existing = raw.id in stored ? stored[raw.id] : null;
  const newEntry = existing ? mergeGist(existing, raw) : raw;

  storage.set({
    ...stored,
    [raw.id]: compress(newEntry),
  });

  return raw;
}

export class Gist {
  static create() {
    return createGist().then(wrap);
  }

  static getById(id: GistId) {
    return getFromStorage(id);
  }

  private _files: GistFile[] = [];

  get id() {
    return this.raw.id;
  }
  get url() {
    return this.raw.url;
  }
  get htmlUrl() {
    return this.raw.html_url;
  }
  get isPublic() {
    return this.raw.public;
  }
  get createdAt() {
    return new Date(this.raw.created_at);
  }
  get description() {
    return this.raw.description;
  }
  get files() {
    return this._files;
  }

  get date() {
    return this.raw.created_at.split('T')[0];
  }

  get hasContent() {
    return this._files.every(x => x.isContentLoaded);
  }

  constructor(private readonly raw: RawGist) {
    saveToStorage(raw);
    this._files = Object.values(raw.files).map(x => new GistFile(this, x));
  }

  getFileByName(name: string) {
    return this._files.find(x => x.name === name);
  }

  reload() {
    return fetchGist(this.id).then(wrap);
  }

  addFile(name: string, content = 'Empty!') {
    return addGileToGist(this.id, name, content).then(wrap);
  }

  removeFile(file: GistFile): Promise<null | Gist> {
    this.ensureFileIsMine(file);

    return this.files.length === 1
      ? removeGist(this.id).then(() => null)
      : removeFileFromGist(this.id, file.name).then(wrap);
  }

  renameFile(file: GistFile, newName: string) {
    this.ensureFileIsMine(file);
    return renameGistFile(this.id, file.name, newName).then(wrap);
  }

  setFileContent(file: GistFile, content: string) {
    this.ensureFileIsMine(file);
    return setFileContent(this.id, file.name, content).then(wrap);
  }

  toJSON() {
    return this.raw;
  }

  private ensureFileIsMine(file: GistFile) {
    if (!(file.name in this.raw.files)) {
      throw new Error(`File ${file.name} doesn't belong to ${this.id}`);
    }
  }
}

function wrap(raw: RawGist) {
  return new Gist(raw);
}

function compress<T extends RawGist>({
  description,
  files,
  id,
  public: p,
  created_at,
  html_url,
}: T) {
  return {
    description,
    files,
    id,
    public: p,
    created_at,
    html_url,
  } as T;
}