import { useNavigate } from 'react-router-dom'

export default function PromotionForm() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/form/promotionCreate')
  }
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
