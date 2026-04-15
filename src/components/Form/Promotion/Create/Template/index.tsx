import { Resizable } from 're-resizable'
import { useState } from 'react'
import DEFAULT_TEMPLATE from './data'
import TemplateItem from './TemplateItem'
import { Debounce } from '@/utils/index'

export default function PromotionCreateTemplate() {
  const [width, setWidth] = useState(200)

  const setWidthDebounce = Debounce(setWidth, 300)
  return (
    <Resizable
      defaultSize={{ width, height: '100%' }}
      onResize={(_e, _dir, ref) => {
        setWidthDebounce(ref.offsetWidth)
      }}
      minWidth={60}
      maxWidth="320"
      // 只允许水平拖拽
      enable={{
        top: false,
        right: true,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      handleStyles={{
        right: {
          width: '10px',
          right: '-5px',
          cursor: 'col-resize',
        },
      }}
      className="bg-white relative p-12px "
    >
      <Row gutter={12}>
        {DEFAULT_TEMPLATE.map((item) => (
          <TemplateItem key={item.name} item={{ ...item }} width={width} />
        ))}
      </Row>
    </Resizable>
  )
}
