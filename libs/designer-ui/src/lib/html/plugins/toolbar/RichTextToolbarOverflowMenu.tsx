import { Button, Menu, MenuList, MenuPopover, MenuTrigger, useIsOverflowItemVisible, useOverflowMenu } from '@fluentui/react-components';
import { MoreHorizontal20Filled } from '@fluentui/react-icons';
import type { LexicalEditor } from 'lexical';
import type { PropsWithChildren } from 'react';
import { FormatBoldButton } from './buttons/FormatBoldButton';
import { FormatItalicButton } from './buttons/FormatItalicButton';
import { FormatLinkButton } from './buttons/FormatLinkButton';
import { FormatUnderlineButton } from './buttons/FormatUnderlineButton';
import { useFormat } from './hooks/useFormat';
import type { ButtonName } from './types';

interface RichTextToolbarOverflowMenuProps {
  activeEditor: LexicalEditor;
  readonly: boolean;
}

const RichTextToolbarOverflowMenuItem: React.FC<PropsWithChildren<{ id: ButtonName }>> = (props) => {
  const { children, id } = props;
  const isVisible = useIsOverflowItemVisible(id);

  if (isVisible) {
    return null;
  }

  return children;
};

export const RichTextToolbarOverflowMenu: React.FC<RichTextToolbarOverflowMenuProps> = (props) => {
  const { activeEditor, readonly } = props;
  const { isOverflowing, ref } = useOverflowMenu<HTMLButtonElement>();

  const { isBold, isItalic, isLink, isUnderline } = useFormat(activeEditor);

  if (!isOverflowing) {
    return null;
  }

  return (
    <Menu hasIcons>
      <MenuTrigger disableButtonEnhancement>
        <Button ref={ref} icon={<MoreHorizontal20Filled />} aria-label="More items" appearance="subtle" />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <RichTextToolbarOverflowMenuItem id="formatBold">
            <FormatBoldButton activeEditor={activeEditor} as="menu-item" isToggledOn={isBold} readonly={readonly} />
          </RichTextToolbarOverflowMenuItem>
          <RichTextToolbarOverflowMenuItem id="formatItalic">
            <FormatItalicButton activeEditor={activeEditor} as="menu-item" isToggledOn={isItalic} readonly={readonly} />
          </RichTextToolbarOverflowMenuItem>
          <RichTextToolbarOverflowMenuItem id="formatUnderline">
            <FormatUnderlineButton activeEditor={activeEditor} as="menu-item" isToggledOn={isUnderline} readonly={readonly} />
          </RichTextToolbarOverflowMenuItem>
          <RichTextToolbarOverflowMenuItem id="formatLink">
            <FormatLinkButton activeEditor={activeEditor} as="menu-item" isToggledOn={isLink} readonly={readonly} />
          </RichTextToolbarOverflowMenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
