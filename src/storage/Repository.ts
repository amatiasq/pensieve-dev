import { emitter } from '@amatiasq/emitter';
import { Accessor, batch, createSignal, Setter } from 'solid-js';
import { getAllFiles } from './internals/fs';
import { GitRepository } from './internals/GitRepository';
import { RepoFile } from './RepoFile';
import { FilePath } from './types';

const join = (...paths: string[]) => paths.join('/').replace(/\/+/g, '/');

export class Repository {
  readonly #onChange = emitter<FilePath>();
  readonly filePaths: Accessor<FilePath[]>;
  readonly isCloning: Accessor<boolean | null>;

  get path() {
    return '/' + join(this.user, this.name);
  }

  get url() {
    return `https://github.com${this.path}`;
  }

  constructor(public readonly user: string, public readonly name: string) {
    const [isCloning, setIsCloning] = createSignal<boolean | null>(null);
    const [files, setFiles] = createSignal<FilePath[]>([]);

    this.isCloning = isCloning;
    this.filePaths = files;

    initialize(this, isCloning, setIsCloning, setFiles);
  }

  onChange(fn: (path: FilePath) => void) {
    return this.#onChange.subscribe(fn);
  }

  getFiles() {
    return getAllFiles(this.path);
  }

  getFile(path: FilePath) {
    const fullpath = join(this.path, path);
    return RepoFile.get(fullpath);
  }

  hasFile(path: FilePath) {
    return this.getFile(path).exists();
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
