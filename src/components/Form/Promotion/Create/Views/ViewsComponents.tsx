const modules = import.meta.glob('./components/*.tsx', {
  eager: true,
  import: '*', // 关键配置
})

export default function ViewsComponents({
  views,
  selectedId,
  setSelectedId,
}: {
  views: Form.Item[]
  selectedId?: string
  setSelectedId: (id: string) => void
}) {
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      autoComplete="off"
    >
      {views.map((item) => {
        // 遍历 modules 找到导出的 type 与当前 item.type 相等的模块
        const moduleMatch: any = Object.values(modules).find((mod: any) => mod.type === item.type)

        // 如果未找到匹配组件，或者该模块没有 default 导出，则忽略渲染
        if (!moduleMatch || !moduleMatch.default) {
          return null
        }

        const Component = moduleMatch.default
        const renderKey = `${item.id || item.name}-${JSON.stringify(item)}`
        return (
          <Component
            key={renderKey}
            item={item}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault()
              if (item.id) {
                setSelectedId(item.id)
              }
            }}
            className={`p-6px m-6px rounded-8px border border-dashed ${selectedId === item.id ? 'border-[#007bff]' : 'border-[#ccc]'}`}
          />
        )
      })}
    </Form>
  )
}
