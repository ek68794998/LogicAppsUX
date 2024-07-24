import { useTheme } from '@fluentui/react';
import { mergeClasses } from '@fluentui/react-components';
import paintBucketSvgDark from '../../icons/dark/paint-bucket.svg';
import paintBucketSvgLight from '../../icons/light/paint-bucket.svg';
import { DropdownColorPicker } from '../DropdownColorPicker';
import type { FormatItemCommonProps } from '../types';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';
import { applyStyles } from '../helper/functions';

interface FormatBgColorPickerProps extends FormatItemCommonProps {
  colorValue: string;
}

export const FormatBgColorPicker: React.FC<FormatBgColorPickerProps> = (props) => {
  const { activeEditor, colorValue, readonly } = props;

  const { isInverted } = useTheme();
  const intl = useIntl();

  const backgroundColorTitle = intl.formatMessage({
    defaultMessage: 'Background Color',
    id: 'r7ZizR',
    description: 'label to set background color',
  });

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyles(activeEditor, { 'background-color': value });
    },
    [activeEditor]
  );

  return (
    <DropdownColorPicker
      editor={activeEditor}
      disabled={readonly}
      buttonClassName={mergeClasses('toolbar-item', 'color-picker')}
      buttonAriaLabel="Formatting background color"
      buttonIconSrc={isInverted ? paintBucketSvgDark : paintBucketSvgLight}
      color={colorValue}
      onChange={onBgColorSelect}
      title={backgroundColorTitle}
    />
  );
};
