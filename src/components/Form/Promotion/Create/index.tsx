import { message, Spin } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createCustomFormApi,
  getCustomFormDetailApi,
  updateCustomFormApi,
  type CreateCustomFormPayload,
} from '@/api'
import PromotionCreateCustom from './Custom'
import PromotionCreateHeader from './Header'
import PromotionCreateTemplate from './Template'
import PromotionCreateViews from './Views'
import { generateUniqueId } from '@/utils/index'

const CODE_PATTERN = /^[a-zA-Z0-9._:-]+$/
const OPTION_FIELD_TYPES = new Set<Form.FieldType>(['select', 'radio', 'checkbox'])

function normalizeFieldName(name: string) {
  const trimmedName = name.trim() || 'field'
  const replaced = trimmedName.replace(/[^a-zA-Z0-9_.:-]+/g, '_')
  const normalized = /^[a-zA-Z]/.test(replaced) ? replaced : `field_${replaced}`
  return normalized || 'field'
}

function createUniqueFieldName(baseName: string, views: Form.Item[]) {
  const usedNames = new Set(views.map((item) => item.name))
  const normalizedBaseName = normalizeFieldName(baseName)

  let candidate = normalizedBaseName
  let index = 2

  while (usedNames.has(candidate)) {
    candidate = `${normalizedBaseName}_${index}`
    index += 1
  }

  return candidate
}

function normalizeSchema(views: Form.Item[]): CreateCustomFormPayload['schema'] {
  return views.map((item) => ({
    ...item,
    label: item.label.trim(),
    name: normalizeFieldName(item.name),
    placeholder: item.placeholder?.trim() || undefined,
    options: item.options?.map((option) => ({
      ...option,
      label: String(option.label).trim(),
    })),
  }))
}

function validateSchema(views: Form.Item[]) {
  if (!views.length) {
    message.warning('请至少添加一个字段')
    return false
  }

  const usedNames = new Set<string>()

  for (const item of views) {
    if (!item.label?.trim()) {
      message.warning('存在字段标题为空，请先完善')
      return false
    }

    const normalizedName = normalizeFieldName(item.name)
    if (usedNames.has(normalizedName)) {
      message.warning(`字段名重复：${normalizedName}`)
      return false
    }
    usedNames.add(normalizedName)

    if (OPTION_FIELD_TYPES.has(item.type) && (!item.options || item.options.length === 0)) {
      message.warning(`字段“${item.label}”缺少可选项`)
      return false
    }
  }

  return true
}

export default function PromotionCreate({ formId }: { formId?: string }) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [code, setCode] = useState('')
  const [views, setViews] = useState<Form.Item[]>([])
  const [selectedId, setSelectedId] = useState<string>()
  const [loading, setLoading] = useState(Boolean(formId))
  const [saving, setSaving] = useState(false)

  const selectedItem = useMemo(
    () => views.find((item) => item.id === selectedId),
    [selectedId, views]
  )

  useEffect(() => {
    if (!formId) {
      setTitle('')
      setCode('')
      setViews([])
      setSelectedId(undefined)
      setLoading(false)
      return
    }

    let cancelled = false

    const loadDetail = async () => {
      try {
        setLoading(true)
        const detail = await getCustomFormDetailApi(formId)

        if (cancelled) {
          return
        }

        const nextViews = (detail.schema || []) as Form.Item[]
        setTitle(detail.name || '')
        setCode(detail.code || '')
        setViews(nextViews)
        setSelectedId(nextViews[0]?.id)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadDetail()

    return () => {
      cancelled = true
    }
  }, [formId])

  const onAddView = (templateItem: Form.Item) => {
    const nextItem: Form.Item = {
      ...templateItem,
      id: generateUniqueId('view-'),
      name: createUniqueFieldName(templateItem.name, views),
    }

    setViews((prev) => [...prev, nextItem])
    setSelectedId(nextItem.id)
  }

  const onUpdateView = (nextItem: Form.Item) => {
    if (!nextItem.id) {
      return
    }

    setViews((prev) => prev.map((item) => (item.id === nextItem.id ? nextItem : item)))
  }

  const onSave = async () => {
    const nextTitle = title.trim()
    const nextCode = code.trim()

    if (!nextTitle) {
      message.warning('请输入表单名称')
      return
    }

    if (!nextCode) {
      message.warning('请输入表单编码')
      return
    }

    if (!CODE_PATTERN.test(nextCode)) {
      message.warning('表单编码仅支持字母、数字、点、下划线、中划线和冒号')
      return
    }

    if (!validateSchema(views)) {
      return
    }

    const payload: CreateCustomFormPayload = {
      code: nextCode,
      name: nextTitle,
      remark: null,
      schema: normalizeSchema(views),
    }

    try {
      setSaving(true)
      const detail = formId
        ? await updateCustomFormApi(formId, payload)
        : await createCustomFormApi(payload)

      message.success(formId ? '更新成功' : '创建成功')
      setTitle(detail.name)
      setCode(detail.code)
      setViews((detail.schema || []) as Form.Item[])
      setSelectedId(detail.schema?.[0]?.id)

      if (!formId) {
        navigate(`/form/promotionCreate?id=${detail.id}`, { replace: true })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <PromotionCreateHeader
        title={title}
        code={code}
        saving={saving}
        onTitleChange={setTitle}
        onCodeChange={setCode}
        onSave={onSave}
        onBack={() => navigate('/form/promotion')}
      />

      <Spin spinning={loading} className="flex-1 min-h-0">
        <div className="h-full flex-1 min-h-0 flex items-stretch justify-between overflow-hidden">
          <PromotionCreateTemplate />
          <PromotionCreateViews
            views={views}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onAddView={onAddView}
          />
          <PromotionCreateCustom item={selectedItem} onChangeItem={onUpdateView} />
        </div>
      </Spin>
    </div>
  )
}
