import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { listCustomForms } from '@/api/customForms'

export default function PromotionForm() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/form/promotionCreate')
  }

  useEffect(() => {
    listCustomForms().then((res) => {
      console.log(res)
    })
  }, [])

  return (
    <div className="h-full">
      <div className="h-44px bg-white flex items-center justify-end px-12px mb-12px">
        <Button type="primary" onClick={() => handleClick()}>
          新建
        </Button>
      </div>
      <div className="h-[calc(100%-56px)] bg-white"></div>
    </div>
  )
}
