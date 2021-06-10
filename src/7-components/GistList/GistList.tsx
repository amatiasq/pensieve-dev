import './GistList.scss';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { registerCommand } from '../../1-core/commands';
import { isMobile } from '../../1-core/isMobile';
import { createAndNavigateToGist } from '../../3-gist/createAndNavigateToGist';
import { Gist } from '../../3-gist/Gist';
import { useNotesList } from '../../6-hooks/useNoteList';
import { useSetting } from '../../6-hooks/useSetting';
import { Note } from '../../entities/Note';
import StringComparer from '../../util/StringComparer';
import { Action } from '../atoms/Action';
import { Resizer } from '../atoms/Resizer';
import { FilterBox } from './FilterBox';
import { GistItem } from './GistItem';

export function GistList() {
  const [filter, setFilter] = useState<StringComparer | null>(null);

  const [isVisible, setIsVisible] = useSetting('sidebarVisible');
  const [size, setSize] = useSetting('sidebarWidth');

  const history = useHistory();
  const list = useNotesList();
  const filtered = filter ? applyFilter(list, filter) : list;

  registerCommand('newNote', () => createAndNavigateToGist(history));
  registerCommand('hideSidebar', () => setIsVisible(!isVisible));

  const content = filtered.length ? (
    filtered.map(gist => <GistItem key={gist.id} gist={gist} />)
  ) : filter ? (
    <li className="gist-list--empty">No Results</li>
  ) : (
    <li className="gist-list--empty">No gists</li>
  );

  return (
    <aside style={{ width: size, display: isMobile || isVisible ? '' : 'none' }}>
      <ul className="gist-list" onScroll={onScroll}>
        <li className="filter">
          <FilterBox onChange={setFilter} />
          <Action name="add-gist" icon="plus" onClick={() => createAndNavigateToGist(history)} />
        </li>

        {content}
      </ul>
      <Resizer size={size} onChange={setSize} />
    </aside>
  );

  function onScroll(event: React.UIEvent<HTMLElement, UIEvent>) {
    const SCROLL_OFFSET = 50;

    const { scrollTop, scrollHeight, clientHeight } = event.target as HTMLElement;

    const isNearBottom = clientHeight + scrollTop + SCROLL_OFFSET > scrollHeight;

    if (isNearBottom) {
      setLoadMore(true);
    }
  }
}

function applyFilter(list: Note[], comparer: StringComparer) {
  return list.filter(gist => comparer.matches(gist.title || ''));
}
