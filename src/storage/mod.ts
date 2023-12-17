import { Accessor, Signal, createSignal } from 'solid-js';
import { FileContent, FilePath } from '../../src.bak3/storage/types';

const join = (...paths: string[]) => paths.join('/').replace(/\/+/g, '/');

class RepositoryFile {
  readonly #content = createSignal('' as FileContent | null);

  get content() {
    return this.#content[0]();
  }

  set content(newContent: FileContent | string | null) {
    const value = newContent === null ? null : FileContent(newContent);
    this.#content[1](value);
  }

  get exists() {
    return this.content !== null;
  }

  constructor(
    public readonly repo: Repository,
    public readonly path: FilePath
  ) {}
}

class Repository {
  #files: Map<string, Signal<RepositoryFile>> = new Map();

  get path() {
    return '/' + join(this.user, this.name);
  }

  constructor(public readonly user: string, public readonly name: string) {}

  file(path: FilePath) {
    if (this.#files.has(path)) {
      return this.#files.get(path)!;
    }

    const file = new RepositoryFile(this, path);
    this.#files.set(path, createSignal(file));
    return this.#files.get(path)!;
  }
}

const [activeRepository, setActiveRepository] = createSignal<Repository | null>(
  null
);

export function useActiveRepository(): Accessor<Repository | null> {
  return activeRepository;
}

export function useFile(path: FilePath | string): Accessor<RepositoryFile> {
  const [repo] = useActiveRepository();

  if (!repo) {
    throw new Error('No active repository');
  }

  return repo.file(FilePath(path));
}

export function useFileContent(): Signal<FileContent | null> {
  const [file] = useFile();

  if (!file()) return [() => null, () => {}];

  return useFile()?.content;
}

// readonly isCloning: Accessor<boolean | null>;
//   readonly #files: Accessor<FilePath[]>;
//   readonly #setFiles: (files: FilePath[]) => void;
//   #fetching: Promise<FilePath[]> | null = null;

//   get path() {
//     return '/' + join(this.user, this.name);
//   }

//   get url() {
//     return `https://github.com${this.path}`;
//   }

//   get files() {
//     const files = this.#files();
//     if (files.length === 0) this.fetchFiles();
//     return files;
//   }

//   constructor(public readonly user: string, public readonly name: string) {
//     const [isCloning, setIsCloning] = createSignal<boolean | null>(null);
//     const [files, setFiles] = createSignal<FilePath[]>([]);

//     this.isCloning = isCloning;
//     this.#files = files;
//     this.#setFiles = setFiles;

//     initialize(this, isCloning, setIsCloning, setFiles);
//   }

//   async fetchFiles() {
//     if (this.#fetching) return this.#fetching;

//     this.#fetching = getAllFiles(this.path) as Promise<FilePath[]>;
//     const filePaths = await this.#fetching;

//     this.#setFiles(filePaths);
//     this.#fetching = null;
//     return filePaths;
//   }

//   async getFiles() {
//     const files = this.#files();
//     return files.length === 0 ? this.fetchFiles() : files;
//   }

//   hasFile(path: FilePath) {
//     return this.file(path).exists();
//   }

//   fileChanged(file: RepoFile) {
//     this.#setFiles([...this.#files()]);
//   }
// }

// async function initialize(
//   repo: Repository,
//   isCloning: Accessor<boolean | null>,
//   setIsCloning: Setter<boolean | null>,
//   setFiles: Setter<string[]>
// ) {
//   setIsCloning(null);

//   function setCleanFiles(value: string[]) {
//     const clean = value.map((x) => x.replace(`${repo.path}/`, ''));
//     return setFiles(clean);
//   }

//   repo
//     .getFiles()
//     .then((files) =>
//       batch(() => {
//         if (isCloning() === null) setIsCloning(true);
//         setCleanFiles(files);
//       })
//     )
//     .catch(() => setIsCloning(true));

//   const git = new GitRepository(repo);

//   if (await repo.hasFile('.git/HEAD' as FilePath)) {
//     console.log('PULL');
//     // await git.pull();
//   } else {
//     console.log('CLONE');
//     await git.clone();
//   }

//   const files = await repo.getFiles();

//   batch(() => {
//     setIsCloning(false);
//     setCleanFiles(files);
//   });
// }
