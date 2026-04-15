import PromotionCreateTemplate from './Template'
import PromotionCreateViews from './Views'
import PromotionCreateCustom from './Custom'
import PromotionCreateHeader from './Header'

export default function PromotionCreate() {
  return (
    <div className="h-full flex flex-col">
      <PromotionCreateHeader />
      <div className="flex-1 flex items-center justify-between">
        <PromotionCreateTemplate />
        <PromotionCreateViews />
        <PromotionCreateCustom />
      </div>
    </div>
  )
}
