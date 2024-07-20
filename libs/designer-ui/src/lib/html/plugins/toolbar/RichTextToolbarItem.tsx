import { OverflowItem } from '@fluentui/react-components';
import type { PropsWithChildren } from 'react';
import { buttonPriorities, type ButtonName, type GroupName } from './constants';

export const RichTextToolbarItem: React.FC<PropsWithChildren<{ groupId: GroupName; id: ButtonName }>> = ({ children, groupId, id }) => (
  <OverflowItem groupId={groupId} id={id} priority={buttonPriorities[id]}>
    <div>{children}</div>
  </OverflowItem>
);
