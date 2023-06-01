import { dirname } from '@isomorphic-git/lightning-fs/src/path';
import { Accessor, createSignal } from 'solid-js';
import type { Repository } from './Repository';
import {
  fileExists,
  getFileContent,
  mkdirRecursive,
  removeFile,
  writeFileContent,
} from './internals/fs';
import type {
  FileContent,
  FileFullPath,
  FileHeader,
  FileMimeType,
} from './types';

const cache = new Map<FileFullPath, WeakRef<RepoFile>>();

export class RepoFile {
  static get(repo: Repository, fullpath: FileFullPath): RepoFile {
    const cached = cache.get(fullpath)?.deref();
    if (cached) return cached;

    const file = new RepoFile(repo, fullpath);
    cache.set(fullpath, new WeakRef(file));
    return file;
  }

  // static above
  // instance below

  #fetching: Promise<FileContent> | null = null;
  #content: Accessor<FileContent | null>;
  #setContent: (content: FileContent | null) => void;

  get content() {
    const content = this.#content();
    if (content == null) this.fetchContent();
    return content;
  }

  private constructor(
    public readonly repo: Repository,
    public readonly path: FileFullPath
  ) {
    const [content, setContent] = createSignal<FileContent | null>(null);
    this.#content = content;
    this.#setContent = setContent;
  }

  exists() {
    return fileExists(this.path);
  }

  async fetchContent() {
    if (this.#fetching) return this.#fetching;

    this.#fetching = getFileContent(this.path) as Promise<FileContent>;
    const content = await this.#fetching;

    this.setDraft(content);
    this.#fetching = null;
    return content;
  }

  async getContent() {
    const content = this.#content();
    return content == null ? this.fetchContent() : content;
  }

  async setContent(content: FileContent) {
    const prev = this.#content();

    try {
      this.setDraft(content);
      await mkdirRecursive(dirname(this.path));
      await writeFileContent(this.path, content);
      this.repo.fileChanged(this);
    } catch (e) {
      this.setDraft(prev);
      throw e;
    }
  }

  setDraft(content: FileContent | null) {
    if (this.#content() == content) {
      this.#setContent(content);
    }
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
