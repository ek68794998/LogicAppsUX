import { useTheme } from '@fluentui/react';
import { MenuItem, mergeClasses, ToolbarButton } from '@fluentui/react-components';
import { isApple } from '@microsoft/logic-apps-shared';
import type { ToolbarItemRenderMode } from '../types';

export interface FormatButtonProps {
  as: ToolbarItemRenderMode;
  icons: {
    dark: string;
    label: string;
    light: string;
  };
  isToggledOn: boolean;
  onClick: () => void;
  readonly: boolean;
  strings: {
    label?: string;
    labelMac?: string;
    title: string;
    titleMac?: string;
  };
}

export const FormatButton: React.FC<FormatButtonProps> = (props) => {
  const {
    as,
    icons: { dark: iconDark, label: iconLabel, light: iconLight },
    isToggledOn,
    onClick,
    readonly,
    strings: { label, labelMac, title, titleMac },
  } = props;

  const { isInverted } = useTheme();

  const buttonTitle = isApple() && titleMac ? titleMac : title;
  const buttonLabel = (isApple() && labelMac ? labelMac : label) || buttonTitle;
  const icon = <img className="format" src={isInverted ? iconDark : iconLight} alt={`${iconLabel} icon`} />;

  if (as === 'menu-item') {
    console.log(readonly);
    return (
      <MenuItem aria-label={buttonLabel} disabled={readonly} icon={icon} onClick={onClick}>
        {buttonTitle}
      </MenuItem>
    );
  }

  return (
    <ToolbarButton
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={mergeClasses('toolbar-item', 'spaced', isToggledOn && 'active')}
      title={buttonTitle}
      aria-label={buttonLabel}
      disabled={readonly}
      icon={icon}
    />
  );
};
