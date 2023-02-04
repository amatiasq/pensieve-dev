import { mkdirRecursive } from './fs';
import { add, clone, commit, log, push, status } from './git';
import type { Repository } from './Repository';

export class GitRepository {
  get user() {
    return this.repo.user;
  }

  get path() {
    return this.repo.path;
  }

  constructor(public readonly repo: Repository) {}

  async clone() {
    console.log('Create dir', this.path);
    await mkdirRecursive(this.path);

    console.log('Clone', this.path, `https://github.com${this.path}`);
    await clone({
      dir: this.path,
      url: `https://github.com${this.path}`,
      singleBranch: true,
      depth: 1,
      onAuth: () => getCredentials(this.user) ?? { cancel: true },
    });

    console.log('Done', this.path);
  }

  log() {
    return log({ dir: this.path });
  }

  status() {
    return status({ dir: this.path, filepath: '.' });
  }

  add() {
    return add({ dir: this.path, filepath: '.' });
  }

  commit(message: string, { author }: { author?: string } = {}) {
    return commit({
      dir: this.path,
      message,
      author: { name: author },
    });
  }

  push() {
    return push({
      dir: this.path,
      remote: 'origin',
      onAuth: () => getCredentials(this.user) ?? { cancel: true },
    });
  }
}

function getCredentials(user: string) {
  const key = 'pensieve.auth';
  const stored = localStorage.getItem(key);

  if (stored) return JSON.parse(stored);

  const username = prompt('Enter username or Github Access Token', user);
  const auth = {
    username,
    password: username?.startsWith('ghp_') ? '' : prompt('Enter password'),
  };

  localStorage.setItem(key, JSON.stringify(auth));
  return auth;
}
