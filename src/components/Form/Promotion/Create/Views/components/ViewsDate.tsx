import { DatePicker } from 'antd'

export const type: Form.FieldType = 'date'

export default function ViewsDate({
  item,
  className,
  onClick,
}: {
  item: Form.Item
  className?: string
  onClick?: (e: React.MouseEvent) => void
}) {
  const rules = item.rules ?? (item.required ? [{ required: true, message: `请选择${item.label}` }] : undefined)

  return (
    <Form.Item
      className={className}
      label={item.label}
      name={item.name}
      hidden={item.hidden}
      initialValue={item.value as any}
      rules={rules}
      {...({ onClick } as any)}
    >
      <DatePicker
        className="w-full"
        placeholder={item.placeholder || '请选择日期'}
        disabled={item.disabled}
        {...(item.props as any)}
      />
    </Form.Item>
  )
}
