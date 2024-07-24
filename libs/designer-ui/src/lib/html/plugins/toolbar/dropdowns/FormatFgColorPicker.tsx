import { useTheme } from '@fluentui/react';
import { mergeClasses } from '@fluentui/react-components';
import fontColorSvgDark from '../../icons/dark/font-color.svg';
import fontColorSvgLight from '../../icons/light/font-color.svg';
import { DropdownColorPicker } from '../DropdownColorPicker';
import type { FormatItemCommonProps } from '../types';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';
import { applyStyles } from '../helper/functions';

interface FormatFgColorPickerProps extends FormatItemCommonProps {
  colorValue: string;
}

export const FormatFgColorPicker: React.FC<FormatFgColorPickerProps> = (props) => {
  const { activeEditor, colorValue, readonly } = props;

  const { isInverted } = useTheme();
  const intl = useIntl();

  const textColorTitle = intl.formatMessage({
    defaultMessage: 'Text Color',
    id: 'ZVB4NL',
    description: 'label to set text color',
  });

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyles(activeEditor, { color: value });
    },
    [activeEditor]
  );

  return (
    <DropdownColorPicker
      editor={activeEditor}
      disabled={readonly}
      buttonClassName={mergeClasses('toolbar-item', 'color-picker')}
      buttonAriaLabel="Formatting text color"
      buttonIconSrc={isInverted ? fontColorSvgDark : fontColorSvgLight}
      color={colorValue}
      onChange={onFontColorSelect}
      title={textColorTitle}
    />
  );
};
