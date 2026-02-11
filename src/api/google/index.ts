import { request } from '@/utils/request'

export async function postOpenApiJSON(body: {
  code: string
}, options?: any) {
  return request({
    url: '/openApi/postOpenApiJson',
    method: 'POST',
    data: {
      ...body
    },
    ...(options || {}),
  })
}

