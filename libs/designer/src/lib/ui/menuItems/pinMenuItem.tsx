import { MenuItem } from '@fluentui/react-components';
import { bundleIcon, Pin24Filled, Pin24Regular } from '@fluentui/react-icons';
import { LogEntryLevel, LoggerService } from '@microsoft/logic-apps-shared';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

const PinIcon = bundleIcon(Pin24Filled, Pin24Regular);

export interface PinMenuItemProps {
  onClick: (e: unknown) => void;
}

export const PinMenuItem = (props: PinMenuItemProps) => {
  const { onClick } = props;

  const intl = useIntl();

  const pinAction = intl.formatMessage({
    defaultMessage: 'Pin Action',
    id: 'yy7jg4',
    description: 'Text indicating a menu button to pin an action to the side panel',
  });

  const handleClick = useCallback<PinMenuItemProps['onClick']>(
    (e) => {
      onClick(e);
      LoggerService().log({
        area: 'PinMenuItem:handleClick',
        level: LogEntryLevel.Verbose,
        message: 'Action pinned.',
      });
    },
    [onClick]
  );

  return (
    <MenuItem
      key={pinAction}
      icon={<PinIcon />}
      onClick={handleClick}
      data-automation-id={'msla-pin-menu-option'}
    >
      {pinAction}
    </MenuItem>
  );
};
