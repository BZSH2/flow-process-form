import { Checkbox, Form as AntdForm } from 'antd'

export const type: Form.FieldType = 'checkbox'

export default function ViewsCheckbox({
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
    <AntdForm.Item
      className={className}
      label={item.label}
      name={item.name}
      hidden={item.hidden}
      initialValue={item.value}
      rules={rules}
      {...({ onClick } as any)}
    >
      <Checkbox.Group options={item.options} disabled={item.disabled} {...(item.props as any)} />
    </AntdForm.Item>
  )
}
