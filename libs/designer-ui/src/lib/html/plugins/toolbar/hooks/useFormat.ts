import { useTheme } from '@fluentui/react';
import { $isLinkNode } from '@lexical/link';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import constants from '../../../../constants';
import { getSelectedNode } from '../helper/functions';

interface UseFormatResult {
  bgColor: string;
  fontColor: string;
  isBold: boolean;
  isItalic: boolean;
  isLink: boolean;
  isUnderline: boolean;
}

export const useFormat = (activeEditor: LexicalEditor): UseFormatResult => {
  const { isInverted } = useTheme();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontColor, setFontColor] = useState<string>(isInverted ? constants.INVERTED_TEXT_COLOR : constants.STANDARD_TEXT_COLOR);
  const [bgColor, setBgColor] = useState<string>(
    isInverted ? constants.INVERTED_EDITOR_BACKGROUND_COLOR : constants.STANDARD_EDITOR_BACKGROUND_COLOR
  );
  const [isLink, setIsLink] = useState(false);

  const updateFormat = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', isInverted ? constants.INVERTED_TEXT_COLOR : constants.STANDARD_TEXT_COLOR)
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          isInverted ? constants.INVERTED_EDITOR_BACKGROUND_COLOR : constants.STANDARD_EDITOR_BACKGROUND_COLOR
        )
      );
    }
  }, [isInverted]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateFormat();
        });
      })
    );
  }, [activeEditor, updateFormat]);

  useEffect(() => {
    return activeEditor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload) => {
        updateFormat();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [activeEditor, updateFormat]);

  return {
    bgColor,
    fontColor,
    isBold,
    isItalic,
    isLink,
    isUnderline,
  };
};
