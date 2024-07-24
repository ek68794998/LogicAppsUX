import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useIntl } from 'react-intl';
import underlineDark from '../../icons/dark/type-underline.svg';
import underlineLight from '../../icons/light/type-underline.svg';
import { FormatButton } from './FormatButton';
import type { FormatButtonCommonProps } from './types';

export const FormatUnderlineButton: React.FC<FormatButtonCommonProps> = (props) => {
  const { activeEditor, as, isToggledOn, readonly } = props;

  const intl = useIntl();

  const underlineTitleMac = intl.formatMessage({
    defaultMessage: 'Underline (⌘U)',
    id: 'KYX5Do',
    description: 'Command for underline text for Mac users',
  });
  const underlineTitleMacAriaLabel = intl.formatMessage({
    defaultMessage: 'Format text as underline. Shortcut: ⌘U',
    id: 'qBkxGU',
    description: 'label to make underline text for Mac users',
  });
  const underlineTitleNonMac = intl.formatMessage({
    defaultMessage: 'Underline (Ctrl+U)',
    id: 'lwlg2K',
    description: 'Command for underline text for non-mac users',
  });
  const underlineTitleNonMacAriaLabel = intl.formatMessage({
    defaultMessage: 'Format text as underline. Shortcut: Ctrl+U',
    id: 'YJlS8E',
    description: 'label to make underline text for nonMac users',
  });

  return (
    <FormatButton
      as={as}
      icons={{
        dark: underlineDark,
        label: 'underline',
        light: underlineLight,
      }}
      isToggledOn={isToggledOn}
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      }}
      readonly={readonly}
      strings={{
        label: underlineTitleNonMacAriaLabel,
        labelMac: underlineTitleMacAriaLabel,
        title: underlineTitleNonMac,
        titleMac: underlineTitleMac,
      }}
    />
  );
};
