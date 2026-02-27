declare namespace petsAPI {
  /** 宠物所属分类。 */
  interface Category {
    /** 类别唯一 ID。 */
    id?: number
    /** 类别名称。 */
    name?: string
  }

  /** 与宠物关联的标签。 */
  interface Tag {
    /** 标签唯一 ID。 */
    id?: number
    /** 标签值。 */
    name?: string
  }

  /** 宠物商店中的动物信息。 */
  interface Pet {
    /** 唯一宠物标识。 */
    id?: number
    category?: Category
    /** 宠物名称 */
    name?: string
    /** 宠物图片 URL 列表。 */
    photoUrls?: string[]
    /** 宠物关联标签。 */
    tags?: Tag[]
    /** 宠物在商店中的状态 */
    status?: 'available' | 'pending' | 'sold'
  }

  /** 通用 API 响应模型。 */
  interface ApiResponse {
    /** 响应时返回的应用码。 */
    code?: number
    /** 响应类型/分类。 */
    type?: string
    /** 响应的人类可读信息。 */
    message?: string
  }
}
