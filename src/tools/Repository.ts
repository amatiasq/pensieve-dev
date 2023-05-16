import { emitter } from '@amatiasq/emitter';
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
  readonly #onChange = emitter<string>();
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

  onChange(fn: (path: string) => void) {
    return this.#onChange.subscribe(fn);
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
    await writeFileContent(join(this.path, path), content);
    this.#onChange(path);
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

async function initialize(
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

  const git = new GitRepository(repo);

  if (await repo.hasFile('.git/HEAD')) {
    console.log('PULL');
    // await git.pull();
  } else {
    console.log('CLONE');
    await git.clone();
  }

  const files = await repo.getFiles();

  batch(() => {
    setIsCloning(false);
    setCleanFiles(files);
  });
}
