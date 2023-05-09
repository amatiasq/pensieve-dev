/* @refresh reload */
import { render } from 'solid-js/web';
import { App } from './components/App';
import './index.css';
import { rootClassName } from './shoelace';

const root = document.getElementById('root')!;
root.classList.add(rootClassName);

render(() => <App />, root);
