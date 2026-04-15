import type { DragEvent } from 'react'
import { useState } from 'react'
import { generateUniqueId } from '@/utils/index'
import ViewsComponents from './ViewsComponents'

export default function PromotionCreateViews() {
  // 视图列表
  const [views, setViews] = useState<Form.Item[]>([])
  const [selectedId, setSelectedId] = useState<string>()

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const templateItem: Form.Item = JSON.parse(event.dataTransfer.getData('templateItem'))
    templateItem.id = generateUniqueId('view-')
    setViews((prev) => [...prev, templateItem])
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
