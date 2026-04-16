import { useSearchParams } from 'react-router-dom'
import PromotionCreate from '@/components/Form/Promotion/Create'

export default function PromotionCreateForm() {
  const [searchParams] = useSearchParams()
  const formId = searchParams.get('id') || undefined

  return <PromotionCreate formId={formId} />
}
