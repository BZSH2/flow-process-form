import type { ShapeItem } from '@logicflow/extension'

export const processDndPanelItems: ShapeItem[] = [
  {
    type: 'start-rect',
    text: '发起申请',
    label: '发起人',
  },
  {
    type: 'rect',
    text: '审批节点',
    label: '审批人',
  },
  {
    type: 'rect',
    text: '抄送节点',
    label: '抄送人',
  },
  {
    type: 'diamond',
    text: '条件判断',
    label: '条件',
  },
  {
    type: 'circle',
    text: '流程结束',
    label: '结束',
  },
]
