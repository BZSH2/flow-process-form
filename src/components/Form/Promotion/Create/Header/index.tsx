import { useState } from 'react'

export default function PromotionCreateHeader() {
  const [title, setTitle] = useState('自定义表单')
  const [inEdit, setInEdit] = useState(false)

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
          <button
            type="button"
            className="cursor-pointer button-action"
            onClick={() => setInEdit(true)}
          >
            {title}
          </button>
        )}
      </div>

      <Button type="primary">保存</Button>
    </div>
  )
}
