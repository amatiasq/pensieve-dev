import { editor } from 'monaco-editor';
import { theme } from './monacoConfiguration';

import BuiltinTheme = editor.BuiltinTheme;
import ITokenThemeRule = editor.ITokenThemeRule;

export function extendMonacoTheme(
  base: BuiltinTheme,
  rules: ITokenThemeRule[]
) {
  editor.defineTheme(theme, {
    base,
    inherit: true,
    colors: {},
    rules,
  });
}
