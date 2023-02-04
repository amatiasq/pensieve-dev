import { createEffect, createSignal } from 'solid-js';
import { GitRepository } from '../tools/GitRepository';
import { Scheduler } from '../tools/Scheduler';
import { MonacoEditor } from './MonacoEditor';
import { useActiveFile } from './useActiveFile';
import { useActiveRepo } from './useActiveRepo';

type Content = string | null;

export function Editor(props: { readonly?: boolean }) {
  const repo = useActiveRepo();
  const route = useActiveFile();
  const [content, setContent] = createSignal(null as Content);
  let lastContent = null as Content;

  const myScheduler = new Scheduler(500, commit);

  createEffect(() => {
    const value = route();
    if (value) {
      repo().getFileContent(value).then(setContentFromServer);
    } else {
      setContent('No file selected');
    }
  });

  return (
    <MonacoEditor
      filename={route() || 'none'}
      content={content()}
      onChange={async (userContent) => {
        if (userContent === content()) return;

        const file = route();
        if (!file) return;
        await repo().writeFile(file, userContent);

        console.log({ userContent });
        setContent(userContent);
        myScheduler.restart();
      }}
    />
  );

  function setContentFromServer(updatedContent: Content) {
    if (updatedContent === lastContent) return;

    setContent(updatedContent);
    lastContent = updatedContent;
  }

  async function commit() {
    console.log(
      '[commit.?]',
      lastContent?.substring(0, 50),
      content()?.substring(0, 50)
    );

    if (lastContent === content()) return;

    var git = new GitRepository(repo());

    console.log('[commit.COMMIT]', content());
    await git.commit('Automatic commit from Pensieve 2.0', {
      author: 'Pensieve',
    });

    // const log = await git.log();
    // console.log('[commit.LOG]', log);

    console.log('[commit]', { status: await git.status() });
    console.log('[commit]', { add: await git.add() });
    console.log('[commit]', { status2: await git.status() });

    console.log('[commit]', content());

    console.log('commit', { push: await git.push() });
  }
}
