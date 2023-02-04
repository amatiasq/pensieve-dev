import type { HttpClient } from 'isomorphic-git';
import { gitFs } from './fs';

const http = (window as any).http as HttpClient;

const defaultProps = {
  fs: gitFs,
  http,
  corsProxy: 'https://cors.isomorphic-git.org',
};

const git = (window as any).git as Pick<IsomorphicGit, keyof Self>;

// don't touch above
//
// Add more methods here as needed
// they will be typed automatically

export const add = wrap('add');
// export const branch = wrap('branch');
// export const checkout = wrap('checkout');
export const clone = wrap('clone');
export const commit = wrap('commit');
// export const currentBranch = wrap('currentBranch');
// export const deleteBranch = wrap('deleteBranch');
// export const listBranches = wrap('listBranches');
export const listFiles = wrap('listFiles');
export const log = wrap('log');
export const pull = wrap('pull');
export const push = wrap('push');
export const remove = wrap('remove');
export const status = wrap('status');

// don't touch below

type Self = typeof import('./git');
type IsomorphicGit = typeof import('isomorphic-git');

type OmitDefaults<T extends (...args: any) => any> = Omit<
  Parameters<T>[0],
  keyof typeof defaultProps
>;

function wrap<
  TName extends keyof typeof git,
  TOperation extends typeof git[TName]
>(name: TName): (options: OmitDefaults<TOperation>) => ReturnType<TOperation> {
  const fn = git[name];
  return (options) => fn({ ...defaultProps, ...options } as any) as any;
}
