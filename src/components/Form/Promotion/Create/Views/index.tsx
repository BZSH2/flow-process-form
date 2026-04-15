import type { DragEvent } from 'react'
import ViewsComponents from './ViewsComponents'

export default function PromotionCreateViews({
  views,
  selectedId,
  setSelectedId,
  onAddView,
}: {
  views: Form.Item[]
  selectedId?: string
  setSelectedId: (id: string) => void
  onAddView: (item: Form.Item) => void
}) {
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const templateItem: Form.Item = JSON.parse(event.dataTransfer.getData('templateItem'))
    onAddView(templateItem)
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="h-full flex-1 bg-white mx-12px" onDrop={onDrop} onDragOver={onDragOver}>
      <ViewsComponents views={views} selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  )
}
