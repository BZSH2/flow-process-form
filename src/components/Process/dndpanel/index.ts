import type { LogicFlow } from '@logicflow/core'
import { DndPanel, type ShapeItem } from '@logicflow/extension'
import { processDndPanelItems } from './items'

type LogicFlowWithDndPanel = LogicFlow & {
  setPatternItems?: (shapeList: ShapeItem[]) => void
}

export const processDndPanelPlugin = DndPanel

export function setupProcessDndPanel(lf: LogicFlow) {
  ;(lf as LogicFlowWithDndPanel).setPatternItems?.(processDndPanelItems)
}
