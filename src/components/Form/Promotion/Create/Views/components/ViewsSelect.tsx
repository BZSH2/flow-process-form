import { Form as AntdForm, Select } from 'antd'

export const type: Form.FieldType = 'select'

export default function ViewsSelect({
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
      <Select
        placeholder={item.placeholder}
        disabled={item.disabled}
        options={item.options}
        {...(item.props as any)}
      />
    </AntdForm.Item>
  )
}
