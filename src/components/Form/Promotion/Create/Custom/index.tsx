import { Resizable } from 're-resizable'
import { Button, Divider, Empty, Input, InputNumber, Switch } from 'antd'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'

const OPTION_FIELD_TYPES: Form.FieldType[] = ['select', 'radio', 'checkbox']
const PLACEHOLDER_FIELD_TYPES: Form.FieldType[] = ['input', 'textarea', 'select', 'date', 'number']

export default function PromotionCreateCustom({
  item,
  onChangeItem,
}: {
  item?: Form.Item
  onChangeItem: (item: Form.Item) => void
}) {
  const updateItem = <K extends keyof Form.Item>(key: K, value: Form.Item[K]) => {
    if (!item) {
      return
    }

    onChangeItem({
      ...item,
      [key]: value,
    })
  }

  const updateProps = (patch: Record<string, unknown>) => {
    if (!item) {
      return
    }

    onChangeItem({
      ...item,
      props: {
        ...(item.props || {}),
        ...patch,
      },
    })
  }

  const updateOption = (
    index: number,
    key: keyof Form.Option,
    value: Form.Option[keyof Form.Option]
  ) => {
    if (!item) {
      return
    }

    const options = [...(item.options || [])]
    options[index] = {
      ...options[index],
      [key]: value,
    }

    onChangeItem({
      ...item,
      options,
    })
  }

  const addOption = () => {
    if (!item) {
      return
    }

    const nextIndex = (item.options?.length || 0) + 1
    onChangeItem({
      ...item,
      options: [
        ...(item.options || []),
        {
          label: `选项${nextIndex}`,
          value: `option${nextIndex}`,
        },
      ],
    })
  }

  const removeOption = (index: number) => {
    if (!item) {
      return
    }

    onChangeItem({
      ...item,
      options: (item.options || []).filter((_, currentIndex) => currentIndex !== index),
    })
  }

  return (
    <Resizable
      defaultSize={{ width: 200, height: '100%' }}
      minWidth={60}
      maxWidth="320"
      // 只允许水平拖拽
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      handleStyles={{
        right: {
          width: '10px',
          right: '-5px',
          cursor: 'col-resize',
        },
      }}
      className="bg-white relative h-full min-h-0 overflow-hidden flex flex-col"
    >
      <OverlayScrollbarsComponent
        defer
        className="flex-1 min-h-0"
        options={{
          scrollbars: {
            autoHide: 'leave',
            autoHideDelay: 300,
          },
        }}
      >
        {!item && (
          <div className="h-full p-12px flex items-center justify-center">
            <Empty description="请选择中间画布中的控件" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        )}

        {item && (
          <div className="p-12px">
            <div className="text-16px font-600">{item.label}</div>
            <div className="mt-4px text-12px text-[#999]">控件类型：{item.type}</div>

            <Divider>基础配置</Divider>

            <div className="mb-12px">
              <div className="mb-6px text-12px text-[#666]">标题</div>
              <Input
                value={item.label}
                onChange={(event) => updateItem('label', event.target.value)}
              />
            </div>

            <div className="mb-12px">
              <div className="mb-6px text-12px text-[#666]">字段名</div>
              <Input
                value={item.name}
                onChange={(event) => updateItem('name', event.target.value)}
              />
            </div>

            {PLACEHOLDER_FIELD_TYPES.includes(item.type) && (
              <div className="mb-12px">
                <div className="mb-6px text-12px text-[#666]">占位提示</div>
                <Input
                  value={item.placeholder}
                  onChange={(event) => updateItem('placeholder', event.target.value)}
                />
              </div>
            )}

            {item.type !== 'switch' && (
              <div className="mb-12px">
                <div className="mb-6px text-12px text-[#666]">默认值</div>
                <Input
                  value={item.value === null || item.value === undefined ? '' : String(item.value)}
                  onChange={(event) => updateItem('value', event.target.value)}
                />
              </div>
            )}

            {item.type === 'switch' && (
              <div className="mb-12px flex items-center justify-between">
                <span className="text-12px text-[#666]">默认选中</span>
                <Switch
                  checked={Boolean(item.value)}
                  onChange={(checked) => updateItem('value', checked)}
                />
              </div>
            )}

            <div className="mb-12px flex items-center justify-between">
              <span className="text-12px text-[#666]">必填</span>
              <Switch
                checked={Boolean(item.required)}
                onChange={(checked) => updateItem('required', checked)}
              />
            </div>

            <div className="mb-12px flex items-center justify-between">
              <span className="text-12px text-[#666]">禁用</span>
              <Switch
                checked={Boolean(item.disabled)}
                onChange={(checked) => updateItem('disabled', checked)}
              />
            </div>

            <div className="mb-12px flex items-center justify-between">
              <span className="text-12px text-[#666]">隐藏</span>
              <Switch
                checked={Boolean(item.hidden)}
                onChange={(checked) => updateItem('hidden', checked)}
              />
            </div>

            {item.type === 'textarea' && (
              <>
                <Divider>多行文本配置</Divider>
                <div className="mb-12px">
                  <div className="mb-6px text-12px text-[#666]">行数</div>
                  <InputNumber
                    className="w-full"
                    min={1}
                    value={Number(item.props?.rows || 3)}
                    onChange={(value) => updateProps({ rows: value || 3 })}
                  />
                </div>
              </>
            )}

            {item.type === 'number' && (
              <>
                <Divider>数字配置</Divider>
                <div className="mb-12px">
                  <div className="mb-6px text-12px text-[#666]">最小值</div>
                  <InputNumber
                    className="w-full"
                    value={typeof item.props?.min === 'number' ? item.props.min : 0}
                    onChange={(value) => updateProps({ min: value || 0 })}
                  />
                </div>
                <div className="mb-12px">
                  <div className="mb-6px text-12px text-[#666]">步长</div>
                  <InputNumber
                    className="w-full"
                    min={1}
                    value={typeof item.props?.step === 'number' ? item.props.step : 1}
                    onChange={(value) => updateProps({ step: value || 1 })}
                  />
                </div>
              </>
            )}

            {OPTION_FIELD_TYPES.includes(item.type) && (
              <>
                <Divider>选项配置</Divider>
                <div className="mb-12px">
                  {(item.options || []).map((option, index) => (
                    <div
                      key={`${item.id}-option-${index}`}
                      className="mb-8px rounded-8px border border-[#eee] p-8px"
                    >
                      <div className="mb-8px">
                        <div className="mb-6px text-12px text-[#666]">选项名称</div>
                        <Input
                          value={String(option.label)}
                          onChange={(event) => updateOption(index, 'label', event.target.value)}
                        />
                      </div>
                      <div className="mb-8px">
                        <div className="mb-6px text-12px text-[#666]">选项值</div>
                        <Input
                          value={String(option.value)}
                          onChange={(event) => updateOption(index, 'value', event.target.value)}
                        />
                      </div>
                      <Button danger block onClick={() => removeOption(index)}>
                        删除选项
                      </Button>
                    </div>
                  ))}
                  <Button type="dashed" block onClick={addOption}>
                    新增选项
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </OverlayScrollbarsComponent>
    </Resizable>
  )
}
