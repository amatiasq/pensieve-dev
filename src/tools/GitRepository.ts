import { AuthCallback, PushResult } from 'isomorphic-git';
import { mkdirRecursive } from './fs';
import { add, clone, commit, log, pull, push, status } from './git';
import type { Repository } from './Repository';

export class GitRepository {
  #onAuth: AuthCallback;

  get user() {
    return this.repo.user;
  }

  get path() {
    return this.repo.path;
  }

  constructor(public readonly repo: Repository) {
    this.#onAuth = () => getCredentials(this.user) ?? { cancel: true };
  }

  async clone() {
    console.log('Create dir', this.path);
    await mkdirRecursive(this.path);

    console.log('Clone', this.path, `https://github.com${this.path}`);
    await clone({
      dir: this.path,
      url: `https://github.com${this.path}`,
      singleBranch: true,
      depth: 1,
      onAuth: this.#onAuth,
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

  pull() {
    return pull({ dir: this.path });
  }

  push(): Promise<PushResult> {
    return push({
      dir: this.path,
      remote: 'origin',
      onAuth: this.#onAuth,
      onAuthFailure: () => {
        console.log('Auth failed');
        localStorage.removeItem('pensieve.auth');
        return this.push();
      },
      onAuthSuccess: () => {
        console.log('Auth success');
      },
      onMessage: (message) => {
        console.log('Push message', message);
      },
      onProgress: (progress) => {
        console.log('Push progress', progress);
      },
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
