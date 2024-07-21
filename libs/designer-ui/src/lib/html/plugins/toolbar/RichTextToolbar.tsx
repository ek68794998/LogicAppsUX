import {
  Button,
  Menu,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Overflow,
  Toolbar,
  ToolbarDivider,
  ToolbarGroup,
  useIsOverflowGroupVisible,
  useOverflowMenu,
} from '@fluentui/react-components';
import { MoreHorizontal20Filled } from '@fluentui/react-icons';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import type { ValueSegment } from '@microsoft/logic-apps-shared';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { getChildrenNodes } from '../../../editor/base/utils/helper';
import { parseHtmlSegments, parseSegments } from '../../../editor/base/utils/parsesegments';
import { HtmlViewToggleButton } from './buttons/HtmlViewToggleButton';
import { RedoButton } from './buttons/RedoButton';
import { UndoButton } from './buttons/UndoButton';
import { toolbarButtons, type GroupName } from './constants';
import { BlockFormatDropDown } from './DropdownBlockFormat';
import { Format } from './Format';
import { FontDropDown, FontDropDownType } from './helper/FontDropDown';
import { convertEditorState } from './helper/HTMLChangePlugin';
import { useCloseDropdownOnScroll } from './hooks/useCloseDropdownOnScroll';
import { RichTextToolbarItem } from './RichTextToolbarItem';

export const blockTypeToBlockName = {
  bullet: 'Bullet List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
} as const;
export type blockTypeToBlockName = (typeof blockTypeToBlockName)[keyof typeof blockTypeToBlockName];

interface ToolbarProps {
  isRawText?: boolean;
  isSwitchFromPlaintextBlocked?: boolean;
  readonly?: boolean;
  setIsRawText?: (newValue: boolean) => void;
}

const RichTextToolbarDivider: React.FC<{ groupId: GroupName }> = (props) => {
  const { groupId } = props;
  const groupVisibilityState = useIsOverflowGroupVisible(groupId);

  if (groupVisibilityState === 'hidden') {
    return null;
  }

  return <ToolbarDivider className="msla-toolbar-divider" />;
};

const RichTextToolbarGroup: React.FC<PropsWithChildren> = ({ children }) => (
  <ToolbarGroup className="msla-html-editor-toolbar-group" role="presentation">
    {children}
  </ToolbarGroup>
);

const RichTextToolbarOverflowMenu: React.FC = () => {
  const { isOverflowing, ref } = useOverflowMenu<HTMLButtonElement>();

  if (!isOverflowing) {
    return null;
  }

  const itemIds = Object.keys(toolbarButtons);

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button ref={ref} icon={<MoreHorizontal20Filled />} aria-label="More items" appearance="subtle" />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {itemIds.map((itemId, i) => {
            const isLast = i === itemIds.length - 1;
            return (
              <>
                {itemId} {isLast}
              </>
            );
          })}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export const RichTextToolbar: React.FC<ToolbarProps> = ({ isRawText, isSwitchFromPlaintextBlocked, readonly = false, setIsRawText }) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');

  useCloseDropdownOnScroll(activeEditor);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    // Currently a bug affecting the tool due to $getSelection https://github.com/facebook/lexical/issues/4011
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
        }
      }
      setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
      setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '15px'));
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        TOGGLE_LINK_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_NORMAL
      )
    );
  }, [editor, activeEditor, updateToolbar]);

  const formattingButtonsDisabled = readonly || !!isRawText;

  return (
    <Overflow padding={48}>
      <Toolbar className="msla-html-editor-toolbar">
        <RichTextToolbarGroup>
          <RichTextToolbarItem id="undo">
            <UndoButton activeEditor={activeEditor} disabled={!canUndo || readonly} />
          </RichTextToolbarItem>
          <RichTextToolbarItem id="redo">
            <RedoButton activeEditor={activeEditor} disabled={!canRedo || readonly} />
          </RichTextToolbarItem>
          <RichTextToolbarDivider groupId="undoRedo" />
          <RichTextToolbarItem id="fontStyle">
            <BlockFormatDropDown disabled={formattingButtonsDisabled} blockType={blockType} editor={editor} />
          </RichTextToolbarItem>
          <RichTextToolbarItem id="fontFamily">
            <FontDropDown
              fontDropdownType={FontDropDownType.FONTFAMILY}
              value={fontFamily}
              editor={editor}
              disabled={formattingButtonsDisabled}
            />
          </RichTextToolbarItem>
          <RichTextToolbarItem id="fontSize">
            <FontDropDown
              fontDropdownType={FontDropDownType.FONTSIZE}
              value={fontSize}
              editor={editor}
              disabled={formattingButtonsDisabled}
            />
          </RichTextToolbarItem>
          <RichTextToolbarDivider groupId="fontAppearance" />
          <Format activeEditor={activeEditor} isOverflowEnabled={true} readonly={formattingButtonsDisabled} />
          <RichTextToolbarOverflowMenu />
        </RichTextToolbarGroup>
        {setIsRawText ? (
          <RichTextToolbarGroup>
            <RichTextToolbarItem id="toggleView">
              <HtmlViewToggleButton
                disabled={(readonly || (isRawText && isSwitchFromPlaintextBlocked)) ?? false}
                isPressed={!!isRawText}
                onToggle={() => {
                  const nodeMap = new Map<string, ValueSegment>();
                  activeEditor.getEditorState().read(() => {
                    getChildrenNodes($getRoot(), nodeMap);
                  });
                  convertEditorState(activeEditor, nodeMap, { isValuePlaintext: !!isRawText }).then((valueSegments) => {
                    activeEditor.update(() => {
                      $getRoot().clear().select();
                      if (isRawText) {
                        parseHtmlSegments(valueSegments, { tokensEnabled: true, readonly });
                        setIsRawText(false);
                      } else {
                        parseSegments(valueSegments, { tokensEnabled: true, readonly });
                        setIsRawText(true);
                      }
                    });
                  });
                }}
              />
            </RichTextToolbarItem>
          </RichTextToolbarGroup>
        ) : null}
        <ListPlugin />
        <LinkPlugin />
      </Toolbar>
    </Overflow>
  );
};
