import { Form as AntdForm, InputNumber } from 'antd'

export const type: Form.FieldType = 'number'

export default function ViewsNumber({
  item,
  className,
  onClick,
}: {
  item: Form.Item
  className?: string
  onClick?: (e: React.MouseEvent) => void
}) {
  const rules = item.rules ?? (item.required ? [{ required: true, message: `请输入${item.label}` }] : undefined)

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
      <InputNumber
        className="w-full"
        placeholder={item.placeholder}
        disabled={item.disabled}
        {...(item.props as any)}
      />
    </AntdForm.Item>
  )
}
