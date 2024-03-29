import FS from '@isomorphic-git/lightning-fs';

export const gitFs = new FS('fs');
const fs = gitFs.promises;

const log = (...args: any) => console.log('[FS]', ...args);

export async function mkdirRecursive(path: string) {
  for (
    let index = path.indexOf('/', 1);
    index != -1;
    index = path.indexOf('/', index + 1)
  ) {
    await mkdirIfDoesntExist(path.substring(0, index + 1));
  }

  await mkdirIfDoesntExist(path);
}

async function mkdirIfDoesntExist(path: string) {
  try {
    const stat = await fs.lstat(path);
    if (stat.isDirectory()) return;
  } catch {}

  await fs.mkdir(path);
}

export async function getAllFiles(path: string): Promise<string[]> {
  try {
    const stat = await fs.lstat(path);

    if (!stat.isDirectory()) return [path];

    const result = [];

    for (const child of await fs.readdir(path)) {
      const children = await getAllFiles(
        `${path}/${child}`.replace(/\/\//, '/')
      );
      result.push(...children);
    }

    return result;
  } catch (error) {
    console.error(`Error listing ${path}`, error);
    throw error;
  }
}

export async function fileExists(path: string) {
  try {
    const stat = await fs.lstat(path);
    return stat.isFile();
  } catch {
    return false;
  }
}

export async function getFileContent(path: string) {
  log('READ', path);
  if (!(await fileExists(path))) return null;

  const content = await fs.readFile(path, 'utf8');

  return typeof content == 'string'
    ? content
    : new TextDecoder().decode(content);
}

export async function writeFileContent(path: string, content: string) {
  log('WRITE', path);
  return fs.writeFile(path, content, 'utf8');
}

export async function removeFile(path: string) {
  log('REMOVE', path);
  return fs.unlink(path);
}
