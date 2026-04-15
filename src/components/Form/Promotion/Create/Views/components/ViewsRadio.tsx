import { Radio } from 'antd'

export const type: Form.FieldType = 'radio'

export default function ViewsRadio({
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
      initialValue={item.value}
      rules={rules}
      {...({ onClick } as any)}
    >
      <Radio.Group options={item.options} disabled={item.disabled} {...(item.props as any)} />
    </Form.Item>
  )
}
