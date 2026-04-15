import { Form as AntdForm, Switch } from 'antd'

export const type: Form.FieldType = 'switch'

export default function ViewsSwitch({
  item,
  className,
  onClick,
}: {
  item: Form.Item
  className?: string
  onClick?: (e: React.MouseEvent) => void
}) {
  return (
    <AntdForm.Item
      className={className}
      label={item.label}
      name={item.name}
      hidden={item.hidden}
      initialValue={item.value}
      valuePropName="checked"
      {...({ onClick } as any)}
    >
      <Switch disabled={item.disabled} {...(item.props as any)} />
    </AntdForm.Item>
  )
}
