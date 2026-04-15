import { useState } from 'react'
import PromotionCreateTemplate from './Template'
import PromotionCreateViews from './Views'
import PromotionCreateCustom from './Custom'
import PromotionCreateHeader from './Header'
import { generateUniqueId } from '@/utils/index'

export default function PromotionCreate() {
  const [views, setViews] = useState<Form.Item[]>([])
  const [selectedId, setSelectedId] = useState<string>()

  const selectedItem = views.find((item) => item.id === selectedId)

  const onAddView = (templateItem: Form.Item) => {
    const nextItem = {
      ...templateItem,
      id: generateUniqueId('view-'),
    }

    setViews((prev) => [...prev, nextItem])
    setSelectedId(nextItem.id)
  }

  const onUpdateView = (nextItem: Form.Item) => {
    if (!nextItem.id) {
      return
    }

    setViews((prev) => prev.map((item) => (item.id === nextItem.id ? nextItem : item)))
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <PromotionCreateHeader />
      <div className="flex-1 min-h-0 flex items-stretch justify-between overflow-hidden">
        <PromotionCreateTemplate />
        <PromotionCreateViews
          views={views}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onAddView={onAddView}
        />
        <PromotionCreateCustom item={selectedItem} onChangeItem={onUpdateView} />
      </div>
    </div>
  )
}
