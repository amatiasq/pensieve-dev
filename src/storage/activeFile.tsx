import { createSignal } from 'solid-js';
import { activeRepo } from './activeRepo';
import { FilePath } from './types';

const [route, setRoute] = createSignal(getFilePathFromUrl());

window.addEventListener('hashchange', () => setRoute(getFilePathFromUrl()));

export function activeFile() {
  const filePath = route();
  return filePath && activeRepo().file(filePath);
}

function getFilePathFromUrl() {
  return location.hash.substring(1) as FilePath;
}
