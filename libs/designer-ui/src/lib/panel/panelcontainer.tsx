import type { ILayerProps } from '@fluentui/react';
import { MessageBar, MessageBarType } from '@fluentui/react';
import { mergeClasses, OverlayDrawer, Spinner } from '@fluentui/react-components';
import type { IPanelHeaderRenderer, IPanelProps } from '@fluentui/react/lib/Panel';
import type { LogicAppsV2 } from '@microsoft/logic-apps-shared';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { EmptyContent } from '../card/emptycontent';
import type { PageActionTelemetryData } from '../telemetry/models';
import { PanelContent } from './panelcontent';
import { PanelHeader } from './panelheader/panelheader';
import type { TitleChangeHandler } from './panelheader/panelheadertitle';
import { PanelResizer } from './panelResizer';
import type { CommonPanelProps, PanelTab } from './panelUtil';
import { PanelLocation, PanelScope, PanelSize } from './panelUtil';

const horizontalPadding = '2rem';

export interface PanelContainerNodeData {
  comment: string | undefined;
  displayName: string;
  errorMessage: string | undefined;
  iconUri: string;
  isError: boolean;
  isLoading: boolean;
  nodeId: string;
  runData: LogicAppsV2.WorkflowRunAction | LogicAppsV2.WorkflowRunTrigger | undefined;
}

export type PanelContainerProps = {
  noNodeSelected: boolean;
  panelScope: PanelScope;
  suppressDefaultNodeSelectFunctionality?: boolean;
  pivotDisabled?: boolean;
  headerMenuItems: JSX.Element[];
  selectedTab?: string;
  selectTab: (tabId: string) => void;
  showCommentBox: boolean;
  readOnlyMode?: boolean;
  tabs: PanelTab[];
  node: PanelContainerNodeData | undefined;
  pinnedNode: PanelContainerNodeData | undefined;
  layerProps?: ILayerProps;
  canResubmit?: boolean;
  resubmitOperation?: () => void;
  trackEvent(data: PageActionTelemetryData): void;
  toggleCollapse: () => void;
  onCommentChange: (panelCommentChangeEvent?: string) => void;
  renderHeader?: (props?: IPanelProps, defaultrender?: IPanelHeaderRenderer, headerTextId?: string) => JSX.Element;
  onTitleChange: TitleChangeHandler;
  onTitleBlur?: (prevTitle: string) => void;
  setCurrWidth: (width: string) => void;
} & CommonPanelProps;

export const PanelContainer = ({
  isCollapsed,
  panelLocation,
  noNodeSelected,
  panelScope,
  suppressDefaultNodeSelectFunctionality,
  headerMenuItems,
  selectedTab,
  selectTab,
  canResubmit,
  resubmitOperation,
  showCommentBox,
  readOnlyMode,
  tabs,
  node,
  pinnedNode,
  width,
  // TODO layerProps,
  toggleCollapse,
  trackEvent,
  renderHeader,
  onCommentChange,
  onTitleChange,
  onTitleBlur,
  setCurrWidth,
  isResizeable,
}: PanelContainerProps) => {
  const intl = useIntl();

  const canResize = isResizeable && !pinnedNode;

  const defaultRenderHeader = useCallback(
    (headerNode: PanelContainerNodeData): JSX.Element => {
      const {
        comment,
        displayName,
        iconUri,
        isError,
        isLoading,
        nodeId,
      } = headerNode;

      return (
        <PanelHeader
          nodeId={nodeId}
          cardIcon={iconUri}
          isCollapsed={isCollapsed}
          headerLocation={panelLocation}
          showCommentBox={showCommentBox}
          noNodeSelected={noNodeSelected}
          panelScope={panelScope}
          suppressDefaultNodeSelectFunctionality={suppressDefaultNodeSelectFunctionality}
          headerMenuItems={headerMenuItems}
          readOnlyMode={readOnlyMode}
          // TODO titleId={headerTextId}
          title={displayName}
          isError={isError}
          isLoading={isLoading}
          comment={comment}
          canResubmit={canResubmit}
          resubmitOperation={resubmitOperation}
          horizontalPadding={horizontalPadding}
          commentChange={onCommentChange}
          toggleCollapse={toggleCollapse}
          onTitleChange={onTitleChange}
          onTitleBlur={onTitleBlur}
        />
      );
    },
    [
      isCollapsed,
      panelLocation,
      showCommentBox,
      noNodeSelected,
      panelScope,
      suppressDefaultNodeSelectFunctionality,
      headerMenuItems,
      readOnlyMode,
      canResubmit,
      resubmitOperation,
      onCommentChange,
      toggleCollapse,
      onTitleChange,
      onTitleBlur,
    ]
  );

  const panelLabel = intl.formatMessage({
    defaultMessage: 'panel',
    id: 'c6XbVI',
    description: 'label for panel component',
  });

  const panelErrorMessage = intl.formatMessage({
    defaultMessage: 'Error loading operation data',
    id: '62Ypnr',
    description: 'label for panel error',
  });

  return (
    <OverlayDrawer
      aria-label={panelLabel}
      className="msla-panel-container"
      modalType="non-modal"
      open={true}
      position={panelLocation === PanelLocation.Right ? "end" : "start"}
      style={{ width: pinnedNode ? PanelSize.DualView : width }}
    >
      {!isCollapsed && (
        <>
          <div className={mergeClasses("msla-panel-container-nested", pinnedNode && "msla-panel-container-nested-dual")}>
            {node ? (
              <div className="left">
                {(renderHeader ?? defaultRenderHeader)(node)}
                {noNodeSelected && panelScope === PanelScope.CardLevel ? (
                  <EmptyContent />
                ) : node.isLoading ? (
                  <div className="msla-loading-container">
                    <Spinner size={'large'} />
                  </div>
                ) : node.isError ? (
                  <MessageBar messageBarType={MessageBarType.error}>{node.errorMessage ?? panelErrorMessage}</MessageBar>
                ) : (
                  <PanelContent tabs={tabs} trackEvent={trackEvent} nodeId={node.nodeId} selectedTab={selectedTab} selectTab={selectTab} />
                )}
              </div>
            ) : null}
            {pinnedNode ? (
              <div className="right">
                {(renderHeader ?? defaultRenderHeader)(pinnedNode)}
                {noNodeSelected && panelScope === PanelScope.CardLevel ? (
                  <EmptyContent />
                ) : pinnedNode.isLoading ? (
                  <div className="msla-loading-container">
                    <Spinner size={'large'} />
                  </div>
                ) : pinnedNode.isError ? (
                  <MessageBar messageBarType={MessageBarType.error}>{pinnedNode.errorMessage ?? panelErrorMessage}</MessageBar>
                ) : (
                  <PanelContent tabs={tabs} trackEvent={trackEvent} nodeId={pinnedNode.nodeId} selectedTab={selectedTab} selectTab={selectTab} />
                )}
              </div>
            ) : null}
          </div>
          {canResize ? <PanelResizer updatePanelWidth={setCurrWidth} /> : null}
        </>
      )}
    </OverlayDrawer>
  );
};
