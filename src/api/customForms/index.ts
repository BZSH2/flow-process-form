import type { RequestConfig } from '@/utils/request'
import { del, get, patch, post } from '@/utils/request'

export const CustomFormsApi = {
  list: { method: 'GET', url: '/custom-forms' },
  getByCode: { method: 'GET', url: '/custom-forms/code/:code' },
  getDetail: { method: 'GET', url: '/custom-forms/:id' },
  create: { method: 'POST', url: '/custom-forms' },
  update: { method: 'PATCH', url: '/custom-forms/:id' },
  remove: { method: 'DELETE', url: '/custom-forms/:id' },
} as const

export type CustomFormFieldType = Form.FieldType
export type CustomFormFieldValue = Form.FieldValue
export type CustomFormSchema = Array<CustomFormItem>

export interface CustomFormSerializedPattern {
  source: string
  flags?: string
}

export interface CustomFormOption extends Form.Option {}

export interface CustomFormRule extends Omit<Form.Rule, 'pattern' | 'validator'> {
  pattern?: string | RegExp | CustomFormSerializedPattern
  validator?: unknown
}

export interface CustomFormItem<ValueType = CustomFormFieldValue>
  extends Omit<Form.Item<ValueType>, 'rules'> {
  rules?: CustomFormRule[]
}

export interface CustomFormQuery {
  page?: number
  pageSize?: number
  keyword?: string
}

export type QueryCustomFormDto = CustomFormQuery

export interface CustomFormSavePayload {
  code: string
  name: string
  remark?: string | null
  schema: CustomFormSchema
}

export type CreateCustomFormPayload = CustomFormSavePayload
export type UpdateCustomFormPayload = Partial<CustomFormSavePayload>
export type CreateCustomFormDto = CreateCustomFormPayload
export type UpdateCustomFormDto = UpdateCustomFormPayload

export interface CustomFormDetail {
  id: string
  code: string
  name: string
  schema: CustomFormSchema
  remark?: string | null
  createdAt: string
  updatedAt: string
}

export interface CustomFormListResult {
  items: CustomFormDetail[]
  total: number
  page: number
  pageSize: number
}

export type CustomFormListData = CustomFormListResult

export interface CustomFormOperationMessage {
  message: string
}

export type OperationMessageDto = CustomFormOperationMessage

function encodePathParam(value: string) {
  return encodeURIComponent(value)
}

/**
 * 分页查询自定义表单
 */
export function getCustomFormsApi(params?: CustomFormQuery, config?: RequestConfig) {
  return get<CustomFormListResult>(CustomFormsApi.list.url, {
    ...config,
    params,
  })
}

export const listCustomForms = getCustomFormsApi

/**
 * 查询自定义表单详情
 */
export function getCustomFormDetailApi(id: string, config?: RequestConfig) {
  return get<CustomFormDetail>(
    CustomFormsApi.getDetail.url.replace(':id', encodePathParam(id)),
    config
  )
}

export const getCustomFormDetail = getCustomFormDetailApi

/**
 * 按编码查询自定义表单
 */
export function getCustomFormByCodeApi(code: string, config?: RequestConfig) {
  return get<CustomFormDetail>(
    CustomFormsApi.getByCode.url.replace(':code', encodePathParam(code)),
    config
  )
}

export const getCustomFormByCode = getCustomFormByCodeApi

/**
 * 创建自定义表单
 */
export function createCustomFormApi(
  payload: CreateCustomFormPayload,
  config?: RequestConfig<CreateCustomFormPayload>
) {
  return post<CustomFormDetail, CreateCustomFormPayload>(CustomFormsApi.create.url, payload, config)
}

export const createCustomForm = createCustomFormApi

/**
 * 更新自定义表单
 */
export function updateCustomFormApi(
  id: string,
  payload: UpdateCustomFormPayload,
  config?: RequestConfig<UpdateCustomFormPayload>
) {
  return patch<CustomFormDetail, UpdateCustomFormPayload>(
    CustomFormsApi.update.url.replace(':id', encodePathParam(id)),
    payload,
    config
  )
}

export const updateCustomForm = updateCustomFormApi

/**
 * 删除自定义表单
 */
export function deleteCustomFormApi(id: string, config?: RequestConfig) {
  return del<CustomFormOperationMessage>(
    CustomFormsApi.remove.url.replace(':id', encodePathParam(id)),
    config
  )
}

export const removeCustomForm = deleteCustomFormApi
