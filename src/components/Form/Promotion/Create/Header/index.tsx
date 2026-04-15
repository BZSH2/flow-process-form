import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PromotionCreateHeader() {
  const [title, setTitle] = useState('自定义表单')
  const [inEdit, setInEdit] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="h-44px mb-12px bg-white flex items-center justify-between px-12px">
      <div className="w-300px">
        {inEdit ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setInEdit(false)}
          />
        ) : (
          <button type="button" className="button-action" onClick={() => setInEdit(true)}>
            {title}
          </button>
        )}
      </div>
      <div>
        <Button onClick={() => navigate(-1)}>退出</Button>
        <Button type="primary" className="ml-12px">
          保存
        </Button>
      </div>
    </div>
  )
}
