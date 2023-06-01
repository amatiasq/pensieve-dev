import { emitter } from '@amatiasq/emitter';
import { dirname } from '@isomorphic-git/lightning-fs/src/path';
import {
  fileExists,
  getFileContent,
  mkdirRecursive,
  removeFile,
  writeFileContent,
} from './internals/fs';
import { FileContent, FileHeader, FileMimeType } from './types';

const cache = new Map<string, WeakRef<RepoFile>>();

export class RepoFile {
  static get(fullpath: string): RepoFile {
    const cached = cache.get(fullpath)?.deref();
    if (cached) return cached;

    const file = new RepoFile(fullpath);
    cache.set(fullpath, new WeakRef(file));
    return file;
  }

  // static above
  // instance below

  readonly #onChange = emitter();
  #draft = null as FileContent | null;

  private constructor(public readonly path: string) {}

  onChange(fn: (file: RepoFile) => void) {
    return this.#onChange.subscribe(fn);
  }

  exists() {
    return fileExists(this.path);
  }

  async fetchContent() {
    const content = (await getFileContent(this.path)) as FileContent;
    this.setDraft(content);
    return content;
  }

  async getContent() {
    return this.#draft == null ? this.fetchContent() : this.#draft;
  }

  async setContent(content: FileContent) {
    const prev = this.#draft;

    try {
      this.setDraft(content);
      await mkdirRecursive(dirname(this.path));
      await writeFileContent(this.path, content);
    } catch (e) {
      this.setDraft(prev);
      throw e;
    }
  }

  setDraft(content: FileContent | null) {
    if (this.#draft === content) return;
    this.#draft = content;
    this.#onChange(content);
  }

  async peekContent(lines = 5) {
    const content = await this.getContent();
    return content.split('\n').slice(0, lines).join('\n') as FileHeader;
  }

  async asBlob(type: FileMimeType) {
    const content = await this.getContent();
    if (content == null) throw new Error('File not found');
    return new Blob([content], { type });
  }

  async import<T = unknown>(): Promise<T> {
    const blob = await this.asBlob('text/javascript');
    const url = URL.createObjectURL(blob);
    const module = await import(/* @vite-ignore */ url);
    URL.revokeObjectURL(url);
    return module;
  }

  async remove() {
    await removeFile(this.path);
    this.setDraft(null);
  }
}
