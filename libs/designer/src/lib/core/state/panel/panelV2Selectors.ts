import type { RootState } from '../../store';
import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const getPanelState = (state: RootState) => state.panel.panelV2;

export const usePinnedNodeId = () => useSelector(createSelector(getPanelState, (state) => state.operationContent.pinnedNodeId ?? ''));

export const useIsNodePinned = (nodeId: string) => usePinnedNodeId() === nodeId;

/*
export const useIsPanelCollapsed = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.isCollapsed));

export const useFocusReturnElementId = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.focusReturnElementId));

export const useCurrentPanelContent = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.currentContent));

export const useCurrentPanelMode = () => useCurrentPanelContent().panelMode;

export const useReferencePanelContent = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.previousContent));

export const useReferencePanelMode = () => useReferencePanelContent()?.panelMode;

export const useIsAddingTrigger = () => {
  const currentPanelContent = useCurrentPanelContent();
  return currentPanelContent.panelMode === 'Discovery' && currentPanelContent.isAddingTrigger;
};

export const useIsParallelBranch = () => {
  const currentPanelContent = useCurrentPanelContent();
  return currentPanelContent.panelMode === 'Discovery' && currentPanelContent.isParallelBranch;
};

export const useRelationshipIds = () => {
  const currentPanelContent = useCurrentPanelContent();
  return currentPanelContent.panelMode === 'Discovery' ? currentPanelContent.relationshipIds : undefined;
};

export const useSelectedOperationGroupId = () => {
  const currentPanelContent = useCurrentPanelContent();
  return currentPanelContent.panelMode === 'Discovery' ? currentPanelContent.selectedOperationGroupId : undefined;
};

export const useSelectedOperationId = () => {
  const currentPanelContent = useCurrentPanelContent();
  return currentPanelContent.panelMode === 'Discovery' ? currentPanelContent.selectedOperationId : undefined;
};

export const useSelectedNodeId = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.selectedNodes?.[0] ?? ''));

export const useSelectedNodeIds = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.selectedNodes));

export const useIsNodeSelected = (nodeId: string) =>
  useSelector(createSelector(getPanelState, (state: PanelState) => state.selectedNodes.includes(nodeId)));

export const useSelectedPanelTabId = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.selectedTabId));

export const usePanelLocation = () => useSelector(createSelector(getPanelState, (state: PanelState) => state.location));

export const useIsLoadingPanel = () => useSelector(createSelector(getPanelState, (state: PanelState) => !!state.isLoading));

export const useIsCreatingConnection = () => {
  const currentPanelContent = useCurrentPanelContent();
  return currentPanelContent.panelMode === 'Connection' && currentPanelContent.isCreatingConnection;
};

export const useSelectedErrorsPanelTabId = () => {
  const currentPanelContent = useCurrentPanelContent();
  return currentPanelContent.panelMode === 'Error' ? currentPanelContent.selectedTabId : undefined;
};
*/
