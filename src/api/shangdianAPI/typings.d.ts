declare namespace shangdianAPI {
  /** 宠物商店中的动物信息。 */
  type Pet = {
    id?: number
    category?: Category
    name?: string
    photoUrls?: string[]
    tags?: Tag[]
    status?: 'available' | 'pending' | 'sold'
  }

  /** 宠物所属分类。 */
  type Category = { id?: number; name?: string }

  /** 通用 API 响应模型。 */
  type ApiResponse = { code?: number; type?: string; message?: string }

  /** 与宠物关联的标签。 */
  type Tag = { id?: number; name?: string }
}
