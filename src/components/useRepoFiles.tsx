import { batch, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { GitRepository } from '../tools/GitRepository';
import { Repository } from '../tools/Repository';

export function useRepoFiles(repo: Repository) {
  const patchArray = (array: string[]) => Object.assign(array, { isCloning });
  type FileList = ReturnType<typeof patchArray>;

  const [isCloning, setIsCloning] = createSignal<boolean | null>(null);
  const [files, setFiles] = createStore<FileList>(patchArray([]));

  function setCleanFiles(value: string[]) {
    const clean = value.map((x) => x.replace(`${repo.path}/`, ''));
    return setFiles(patchArray(clean));
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

  return files;
}
