import { useActiveRepo } from '../hooks/ActiveRepoProvider';

const separator = '  ';

export function setPageTitle(name?: string) {
  const repo = useActiveRepo();

  const appTitle =
    repo()
      .name.replace(/\W+/gi, ' ')
      .replace(/\s+/g, ' ')
      .replace(/(?<= )(\w)/g, (x) => x[0].toUpperCase())
      .replace(/^(\w)/g, (x) => x[0].toUpperCase())
      .replace('Pensieve', '')
      .replace('Data', '')
      .trim() || 'Pensieve';

  const app = `✏️${separator}${appTitle}`;
  const section = name?.trim();
  const full = section ? `${section}${separator}${app}` : app;

  if (document.title !== full) {
    document.title = full;
  }
}
