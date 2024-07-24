import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useIntl } from 'react-intl';
import boldDark from '../../icons/dark/type-bold.svg';
import boldLight from '../../icons/light/type-bold.svg';
import { FormatButton } from './FormatButton';
import type { FormatButtonCommonProps } from './types';

export const FormatBoldButton: React.FC<FormatButtonCommonProps> = (props) => {
  const { activeEditor, as, isToggledOn, readonly } = props;

  const intl = useIntl();

  const boldTitleMac = intl.formatMessage({
    defaultMessage: 'Bold (⌘B)',
    id: 'ciLkfU',
    description: 'Command for bold text for Mac users',
  });
  const boldTitleMacAriaLabel = intl.formatMessage({
    defaultMessage: 'Format text as bold. Shortcut: ⌘B',
    id: 'S138/4',
    description: 'label to make bold text for Mac users',
  });
  const boldTitleNonMac = intl.formatMessage({
    defaultMessage: 'Bold (Ctrl+B)',
    id: 'Lnqh6h',
    description: 'Command for bold text for non-mac users',
  });
  const boldTitleNonMacAriaLabel = intl.formatMessage({
    defaultMessage: 'Format text as bold. Shortcut: Ctrl+B',
    id: 'YR1uWE',
    description: 'label to make bold text for nonMac users',
  });

  return (
    <FormatButton
      as={as}
      icons={{
        dark: boldDark,
        label: 'bold',
        light: boldLight,
      }}
      isToggledOn={isToggledOn}
      onClick={() => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }}
      readonly={readonly}
      strings={{
        label: boldTitleNonMacAriaLabel,
        labelMac: boldTitleMacAriaLabel,
        title: boldTitleNonMac,
        titleMac: boldTitleMac,
      }}
    />
  );
};
