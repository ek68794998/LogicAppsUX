interface ToolbarButton {
  group: GroupName;
  priority: number;
}

export const toolbarButtons: Record<string, ToolbarButton> = {
  undo: {
    group: 'undoRedo',
    priority: 90,
  },
  redo: {
    group: 'undoRedo',
    priority: 90,
  },
  fontStyle: {
    group: 'fontAppearance',
    priority: 70,
  },
  fontFamily: {
    group: 'fontAppearance',
    priority: 70,
  },
  fontSize: {
    group: 'fontAppearance',
    priority: 70,
  },
  formatBold: {
    group: 'textStyle',
    priority: 80,
  },
  formatItalic: {
    group: 'textStyle',
    priority: 80,
  },
  formatUnderline: {
    group: 'textStyle',
    priority: 80,
  },
  formatFgColor: {
    group: 'textStyle',
    priority: 60,
  },
  formatBgColor: {
    group: 'textStyle',
    priority: 60,
  },
  formatLink: {
    group: 'textStyle',
    priority: 50,
  },
  toggleView: {
    group: 'toggleView',
    priority: 100,
  },
};

export type ButtonName = keyof typeof toolbarButtons;
export type GroupName = 'undoRedo' | 'fontAppearance' | 'textStyle' | 'toggleView';
