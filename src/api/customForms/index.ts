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

function encodePathParam(value: string) {
  return encodeURIComponent(value)
}

type PlainObject = Record<string, unknown>

export type QueryCustomFormDto = Record<string, string | number | boolean | null | undefined>
export type CreateCustomFormDto = PlainObject
export type UpdateCustomFormDto = PlainObject
export type CustomFormDetail = PlainObject
export type CustomFormListData = PlainObject
export type OperationMessageDto = PlainObject

/**
 * 分页查询自定义表单
 * 可能错误码：403（需要管理员权限）
 */
export function listCustomForms(
  query?: QueryCustomFormDto,
  config?: RequestConfig
): Promise<CustomFormListData> {
  return get<CustomFormListData>(CustomFormsApi.list.url, {
    ...config,
    params: query,
  })
}

/**
 * 按编码查询自定义表单
 * 可能错误码：403（需要管理员权限）、404（自定义表单不存在）
 */
export function getCustomFormByCode(
  code: string,
  config?: RequestConfig
): Promise<CustomFormDetail> {
  return get<CustomFormDetail>(
    CustomFormsApi.getByCode.url.replace(':code', encodePathParam(code)),
    config
  )
}

/**
 * 查询自定义表单详情
 * 可能错误码：403（需要管理员权限）、404（自定义表单不存在）
 */
export function getCustomFormDetail(id: string, config?: RequestConfig): Promise<CustomFormDetail> {
  return get<CustomFormDetail>(
    CustomFormsApi.getDetail.url.replace(':id', encodePathParam(id)),
    config
  )
}

/**
 * 创建自定义表单
 * 可能错误码：400（schema 不合法）、403（需要管理员权限）、409（编码已存在）
 */
export function createCustomForm(
  payload: CreateCustomFormDto,
  config?: RequestConfig<CreateCustomFormDto>
): Promise<CustomFormDetail> {
  return post<CustomFormDetail, CreateCustomFormDto>(CustomFormsApi.create.url, payload, config)
}

/**
 * 更新自定义表单
 * 可能错误码：400（schema 不合法）、403（需要管理员权限）、404（不存在）、409（编码已存在）
 */
export function updateCustomForm(
  id: string,
  payload: UpdateCustomFormDto,
  config?: RequestConfig<UpdateCustomFormDto>
): Promise<CustomFormDetail> {
  return patch<CustomFormDetail, UpdateCustomFormDto>(
    CustomFormsApi.update.url.replace(':id', encodePathParam(id)),
    payload,
    config
  )
}

/**
 * 删除自定义表单
 * 可能错误码：403（需要管理员权限）、404（自定义表单不存在）
 */
export function removeCustomForm(id: string, config?: RequestConfig): Promise<OperationMessageDto> {
  return del<OperationMessageDto>(
    CustomFormsApi.remove.url.replace(':id', encodePathParam(id)),
    config
  )
}
