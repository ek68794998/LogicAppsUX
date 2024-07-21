import type { toolbarButtons } from './constants';

export type ButtonName = keyof typeof toolbarButtons;
export type GroupName = 'undoRedo' | 'fontAppearance' | 'textStyle' | 'toggleView';
export type ToolbarItemRenderMode = 'menu-item' | 'toolbar-item';
