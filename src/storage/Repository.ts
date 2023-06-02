import { Accessor, batch, createSignal, Setter } from 'solid-js';
import { getAllFiles } from './internals/fs';
import { GitRepository } from './internals/GitRepository';
import { RepoFile } from './RepoFile';
import { FileFullPath, FilePath } from './types';

const join = (...paths: string[]) => paths.join('/').replace(/\/+/g, '/');

export class Repository {
  readonly isCloning: Accessor<boolean | null>;
  readonly #files: Accessor<FilePath[]>;
  readonly #setFiles: (files: FilePath[]) => void;
  #fetching: Promise<FilePath[]> | null = null;

  get path() {
    return '/' + join(this.user, this.name);
  }

  get url() {
    return `https://github.com${this.path}`;
  }

  get files() {
    const files = this.#files();
    if (files.length === 0) this.fetchFiles();
    return files;
  }

  constructor(public readonly user: string, public readonly name: string) {
    const [isCloning, setIsCloning] = createSignal<boolean | null>(null);
    const [files, setFiles] = createSignal<FilePath[]>([]);

    this.isCloning = isCloning;
    this.#files = files;
    this.#setFiles = setFiles;

    initialize(this, isCloning, setIsCloning, setFiles);
  }

  async fetchFiles() {
    if (this.#fetching) return this.#fetching;

    this.#fetching = getAllFiles(this.path) as Promise<FilePath[]>;
    const filePaths = await this.#fetching;

    this.#setFiles(filePaths);
    this.#fetching = null;
    return filePaths;
  }

  async getFiles() {
    const files = this.#files();
    return files.length === 0 ? this.fetchFiles() : files;
  }

  hasFile(path: FilePath) {
    return this.getFile(path).exists();
  }

  getFile(path: FilePath) {
    const fullpath = join(this.path, path) as FileFullPath;
    return RepoFile.get(this, fullpath);
  }

  fileChanged(file: RepoFile) {
    this.#setFiles([...this.#files()]);
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

  if (await repo.hasFile('.git/HEAD' as FilePath)) {
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
