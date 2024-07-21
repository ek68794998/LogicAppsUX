import { OverflowItem } from '@fluentui/react-components';
import type { PropsWithChildren } from 'react';
import type { ButtonName } from './types';
import { toolbarButtons } from './constants';

export const RichTextToolbarItem: React.FC<PropsWithChildren<{ id: ButtonName }>> = ({ children, id }) => (
  <OverflowItem groupId={toolbarButtons[id].group} id={id} priority={toolbarButtons[id].priority}>
    <div>{children}</div>
  </OverflowItem>
);
