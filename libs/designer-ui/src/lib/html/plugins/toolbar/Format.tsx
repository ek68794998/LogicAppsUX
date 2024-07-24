import { FormatBoldButton } from './buttons/FormatBoldButton';
import { FormatItalicButton } from './buttons/FormatItalicButton';
import { FormatLinkButton } from './buttons/FormatLinkButton';
import { FormatUnderlineButton } from './buttons/FormatUnderlineButton';
import { sanitizeUrl } from './helper/functions';
import { RichTextToolbarItem } from './RichTextToolbarItem';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import type { LexicalEditor } from 'lexical';
import { COMMAND_PRIORITY_NORMAL, KEY_MODIFIER_COMMAND } from 'lexical';
import { useEffect } from 'react';
import { useFormat } from './hooks/useFormat';
import { FormatFgColorPicker } from './dropdowns/FormatFgColorPicker';
import { FormatBgColorPicker } from './dropdowns/FormatBgColorPicker';

interface FormatProps {
  activeEditor: LexicalEditor;
  readonly: boolean;
}

export const Format: React.FC<FormatProps> = ({ activeEditor, readonly }) => {
  const { bgColor, fontColor, isBold, isItalic, isLink, isUnderline } = useFormat(activeEditor);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink]);

  return (
    <>
      <RichTextToolbarItem id="formatBold">
        <FormatBoldButton activeEditor={activeEditor} as="toolbar-item" isToggledOn={isBold} readonly={readonly} />
      </RichTextToolbarItem>
      <RichTextToolbarItem id="formatItalic">
        <FormatItalicButton activeEditor={activeEditor} as="toolbar-item" isToggledOn={isItalic} readonly={readonly} />
      </RichTextToolbarItem>
      <RichTextToolbarItem id="formatUnderline">
        <FormatUnderlineButton activeEditor={activeEditor} as="toolbar-item" isToggledOn={isUnderline} readonly={readonly} />
      </RichTextToolbarItem>
      <RichTextToolbarItem id="formatFgColor">
        <FormatFgColorPicker activeEditor={activeEditor} as="toolbar-item" colorValue={fontColor} readonly={readonly} />
      </RichTextToolbarItem>
      <RichTextToolbarItem id="formatBgColor">
        <FormatBgColorPicker activeEditor={activeEditor} as="toolbar-item" colorValue={bgColor} readonly={readonly} />
      </RichTextToolbarItem>
      <RichTextToolbarItem id="formatLink">
        <FormatLinkButton activeEditor={activeEditor} as="toolbar-item" isToggledOn={isLink} readonly={readonly} />
      </RichTextToolbarItem>
    </>
  );
};
