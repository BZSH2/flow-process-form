import { Input } from 'antd'

export const type: Form.FieldType = 'input'

export default function ViewsInput({
  item,
  className,
  onClick,
}: {
  item: Form.Item
  className?: string
  onClick?: (e: React.MouseEvent) => void
}) {
  const rules =
    item.rules ?? (item.required ? [{ required: true, message: `请输入${item.label}` }] : undefined)

  return (
    <Form.Item
      className={className}
      label={item.label}
      name={item.name}
      hidden={item.hidden}
      initialValue={item.value}
      rules={rules}
      {...({ onClick } as any)}
    >
      <Input placeholder={item.placeholder} disabled={item.disabled} {...(item.props as any)} />
    </Form.Item>
  )
}
