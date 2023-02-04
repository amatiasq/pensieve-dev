import { dirname } from '@isomorphic-git/lightning-fs/src/path';
import { Accessor, batch, createSignal, Setter } from 'solid-js';
import {
  fileExists,
  getAllFiles,
  getFileContent,
  mkdirRecursive,
  writeFileContent,
} from './fs';
import { GitRepository } from './GitRepository';

const join = (...paths: string[]) => paths.join('/').replace(/\/+/g, '/');

export class Repository {
  readonly files: Accessor<string[]>;
  readonly isCloning: Accessor<boolean | null>;

  get path() {
    return '/' + join(this.user, this.name);
  }

  get url() {
    return `https://github.com${this.path}`;
  }

  constructor(public readonly user: string, public readonly name: string) {
    const [isCloning, setIsCloning] = createSignal<boolean | null>(null);
    const [files, setFiles] = createSignal<string[]>([]);

    this.isCloning = isCloning;
    this.files = files;

    initialize(this, isCloning, setIsCloning, setFiles);
  }

  getFiles() {
    return getAllFiles(this.path);
  }

  hasFile(path: string) {
    return fileExists(join(this.path, path));
  }

  getFileContent(path: string) {
    return getFileContent(join(this.path, path));
  }

  async writeFile(path: string, content: string) {
    await mkdirRecursive(dirname(path));
    return writeFileContent(join(this.path, path), content);
  }

  async getFileAsBlob(path: string, type: 'text/plain' | 'text/javascript') {
    const content = await getFileContent(join(this.path, path));
    return new Blob([content!], { type });
  }

  async importFile(path: string) {
    const blob = await this.getFileAsBlob(path, 'text/javascript');
    const url = URL.createObjectURL(blob);
    const module = await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
    return module;
  }
}

function initialize(
  repo: Repository,
  isCloning: Accessor<boolean | null>,
  setIsCloning: Setter<boolean | null>,
  setFiles: Setter<string[]>
) {
  setIsCloning(null);

  function setCleanFiles(value: string[]) {
    const clean = value.map((x) => x.replace(`${repo.path}/`, ''));
    return setFiles(clean);
  }

  repo
    .getFiles()
    .then((files) =>
      batch(() => {
        if (isCloning() === null) setIsCloning(true);
        setCleanFiles(files);
      })
    )
    .catch(() => setIsCloning(true));

  new GitRepository(repo)
    .clone()
    .then(() => repo.getFiles())
    .then((files) =>
      batch(() => {
        setIsCloning(false);
        setCleanFiles(files);
      })
    );
}
