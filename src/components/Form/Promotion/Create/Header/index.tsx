import { Button, Input } from 'antd'

export default function PromotionCreateHeader({
  title,
  code,
  saving,
  onTitleChange,
  onCodeChange,
  onSave,
  onBack,
}: {
  title: string
  code: string
  saving?: boolean
  onTitleChange: (value: string) => void
  onCodeChange: (value: string) => void
  onSave: () => void
  onBack: () => void
}) {
  return (
    <div className="h-56px mb-12px bg-white flex items-center justify-between px-12px gap-12px">
      <div className="flex items-center gap-12px flex-1 min-w-0">
        <Input
          value={title}
          placeholder="请输入表单名称"
          className="max-w-280px"
          onChange={(event) => onTitleChange(event.target.value)}
        />
        <Input
          value={code}
          placeholder="请输入表单编码，如 interview-feedback"
          className="max-w-320px"
          onChange={(event) => onCodeChange(event.target.value)}
        />
      </div>

      <div className="flex items-center gap-8px shrink-0">
        <Button onClick={onBack}>返回</Button>
        <Button type="primary" loading={saving} onClick={onSave}>
          保存
        </Button>
      </div>
    </div>
  )
}
