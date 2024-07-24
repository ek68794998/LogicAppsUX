import type { LexicalEditor } from 'lexical';

export type ButtonName =
  | 'undo'
  | 'redo'
  | 'fontStyle'
  | 'fontFamily'
  | 'fontSize'
  | 'formatBold'
  | 'formatItalic'
  | 'formatUnderline'
  | 'formatFgColor'
  | 'formatBgColor'
  | 'formatLink'
  | 'toggleView';
export type GroupName = 'undoRedo' | 'fontAppearance' | 'textStyle' | 'toggleView';
export type ToolbarItemRenderMode = 'menu-item' | 'toolbar-item';

export interface FormatItemCommonProps {
  activeEditor: LexicalEditor;
  as: ToolbarItemRenderMode;
  readonly: boolean;
}
