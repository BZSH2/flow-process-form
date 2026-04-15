import { Resizable } from 're-resizable'

export default function PromotionCreateCustom() {
  return (
    <Resizable
      defaultSize={{ width: 200, height: '100%' }}
      minWidth={60}
      maxWidth="320"
      // 只允许水平拖拽
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
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
      <div>11111111111111</div>
    </Resizable>
  )
}
