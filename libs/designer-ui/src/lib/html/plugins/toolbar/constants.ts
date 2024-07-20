export const buttonPriorities = {
  undo: 90,
  redo: 90,
  fontStyle: 70,
  fontFamily: 70,
  fontSize: 70,
  formatBold: 80,
  formatItalic: 80,
  formatUnderline: 80,
  formatFgColor: 60,
  formatBgColor: 60,
  formatLink: 50,
  toggleView: 100,
};

export const groupNames = {
  undoRedo: 'undoRedo',
  fontAppearance: 'fontAppearance',
  textStyle: 'textStyle',
  toggleView: 'toggleView',
};

export type ButtonName = keyof typeof buttonPriorities;
export type GroupName = keyof typeof groupNames;
