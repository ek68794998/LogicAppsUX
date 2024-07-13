import type { PanelContainerNodeData } from "@microsoft/designer-ui";
import { useNodeDisplayName, useNodeMetadata } from "../../../core";
import { ErrorLevel } from "../../../core/state/operation/operationMetadataSlice";
import { useIconUri, useOperationErrorInfo } from "../../../core/state/operation/operationSelector";
import { useOperationQuery } from "../../../core/state/selectors/actionMetadataSelector";
import { useNodeDescription, useRunData } from "../../../core/state/workflow/workflowSelectors";

export const usePanelNodeData = (nodeId: string | undefined): PanelContainerNodeData | undefined => {
  const nonNullNodeId = nodeId ?? '';

  const comment = useNodeDescription(nonNullNodeId);
  const displayName = useNodeDisplayName(nonNullNodeId);
  const errorInfo = useOperationErrorInfo(nonNullNodeId);
  const iconUri = useIconUri(nonNullNodeId);
  const nodeMetaData = useNodeMetadata(nonNullNodeId);
  const runData = useRunData(nonNullNodeId);

  const opQuery = useOperationQuery(nonNullNodeId);

  if (!nodeId) {
    return undefined;
  }

  return {
    comment,
    displayName,
    errorMessage: errorInfo?.message,
    iconUri,
    isError: errorInfo?.level === ErrorLevel.Critical || opQuery?.isError,
    isLoading: nodeMetaData?.subgraphType ? false : opQuery.isLoading,
    nodeId,
    runData,
  };
};
