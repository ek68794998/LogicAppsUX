import { Popover, PopoverSurface, PopoverTrigger } from '@fluentui/react-components';
import chevronDownDark from './../../icons/dark/chevron-down.svg';
import chevronDownLight from './../../icons/light/chevron-down.svg';
import { useTheme } from '@fluentui/react';
import type { LexicalCommand, LexicalEditor } from 'lexical';
import { COMMAND_PRIORITY_CRITICAL, createCommand } from 'lexical';
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

export const CLOSE_DROPDOWN_COMMAND: LexicalCommand<undefined> = createCommand();

interface DropdownProps {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconSrc?: string;
  buttonLabel?: string;
  children: ReactNode;
  stopCloseOnClickSelf?: boolean;
  editor: LexicalEditor;
}

export const DropDown = ({
  disabled = false,
  buttonLabel,
  buttonAriaLabel,
  buttonClassName,
  buttonIconSrc,
  children,
  stopCloseOnClickSelf,
  editor,
}: DropdownProps): JSX.Element => {
  const { isInverted } = useTheme();
  const intl = useIntl();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showDropDown, setShowDropDown] = useState(false);

  const handleClose = () => {
    setShowDropDown(false);
    if (buttonRef?.current) {
      buttonRef.current.focus();
    }
  };

  useEffect(() => {
    editor.registerCommand<boolean>(
      CLOSE_DROPDOWN_COMMAND,
      () => {
        if (showDropDown) {
          handleClose();
        }

        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, showDropDown]);

  useEffect(() => {
    const button = buttonRef.current;
    const dropDown = dropDownRef.current;

    if (showDropDown && button !== null && dropDown !== null) {
      const { top, left } = button.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${Math.min(left, window.innerWidth - dropDown.offsetWidth - 20)}px`;
    }
  }, [dropDownRef, buttonRef, showDropDown]);

  const altTextForButtonIcon = intl.formatMessage({
    defaultMessage: 'alt text for button icon',
    id: '34Nt/B',
    description: 'alt text for button icon',
  });

  const altTextForChevronDown = intl.formatMessage({
    defaultMessage: 'Alt text for down chevron',
    id: '+Uvo/p',
    description: 'Alt text for down chevron',
  });

  return (
    <Popover
      closeOnScroll={true}
      onOpenChange={(e, { open }) => {
        setShowDropDown(open);
      }}
      open={showDropDown}
      positioning="below"
    >
      <PopoverTrigger disableButtonEnhancement>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          disabled={disabled}
          aria-label={buttonAriaLabel || buttonLabel}
          className={buttonClassName}
          ref={buttonRef}
        >
          {buttonIconSrc ? <img src={buttonIconSrc} alt={altTextForButtonIcon} /> : null}
          {buttonLabel && <span className="text dropdown-button-text">{buttonLabel}</span>}
          <img className="chevron-down" src={isInverted ? chevronDownDark : chevronDownLight} alt={altTextForChevronDown} />
        </button>
      </PopoverTrigger>
      <PopoverSurface
        className="msla-html-editor-dropdown-items-container"
        onClick={() => {
          if (!stopCloseOnClickSelf) {
            handleClose();
          }
        }}
        style={{ padding: '4px' }}
      >
        {children}
      </PopoverSurface>
    </Popover>
  );
};
