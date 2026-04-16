import { Col } from 'antd'
import type { CSSProperties, DragEvent } from 'react'

export default function TemplateItem({ item, width }: { item: Form.Item; width: number }) {
  const labelStyle: CSSProperties = {
    border: '1px solid var(--app-border-color)',
    borderRadius: '8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  const onDragStart = (event: DragEvent<HTMLDivElement>, currentItem: Form.Item) => {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('templateItem', JSON.stringify(currentItem))
  }

  return (
    <Col span={width > 150 ? 12 : 24}>
      <div
        style={labelStyle}
        draggable
        onDragStart={(event) => {
          onDragStart(event, item)
        }}
      >
        {item.label}
      </div>
    </Col>
  )
}
