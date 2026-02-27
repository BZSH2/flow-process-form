declare namespace qiyejiAPIguanlixitong {
  /** 所有实体的基础模型 */
  interface BaseEntity {
    id: string | number
    createdAt: string | Date
    updatedAt: string | Date
    /** 乐观锁版本号 */
    version?: number
    /** 扩展元数据 */
    metadata?: Record<string, string>
  }

  enum UserStatus {
    active = 'active',
    inactive = 'inactive',
    suspended = 'suspended',
    pending = 'pending',
    deactivated = 'deactivated',
  }

  enum UserType {
    standard = 'standard',
    admin = 'admin',
    moderator = 'moderator',
    supervisor = 'supervisor',
    external = 'external',
  }

  interface UserProfile {
    firstName?: string
    lastName?: string
    displayName?: string
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    birthDate?: string | Date
    avatar?: Image
    bio?: string
    nationality?: string
    identification?: Identification
  }

  interface GeoCoordinates {
    latitude: number
    longitude: number
    accuracy?: number
    altitude?: number
  }

  interface Address {
    street: string
    street2?: string
    city: string
    state?: string
    postalCode?: string
    country: string
    coordinates?: GeoCoordinates
    type?: 'home' | 'work' | 'billing' | 'shipping'
  }

  interface ContactInfo {
    phone?: string
    alternatePhone?: string
    email?: string
    alternateEmail?: string
    address?: Address
    emergencyContact?: EmergencyContact
  }

  interface UserPreferences {
    language?: string
    timezone?: string
    currency?: string
    dateFormat?: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'
    notificationSettings?: NotificationSettings
    privacySettings?: {
      profileVisible?: boolean
      searchable?: boolean
      dataSharing?: Record<string, boolean>
    }
  }

  interface AccountSettings {
    twoFactorEnabled?: boolean
    loginNotifications?: boolean
    /** 会话超时时间（分钟） */
    sessionTimeout?: number
    passwordPolicy?: {
      expiryDays?: number
      historySize?: number
    }
  }

  type User = BaseEntity & {
    username: string
    email: string
    status: UserStatus
    userType?: UserType
    profile?: UserProfile
    contact?: ContactInfo
    preferences?: UserPreferences
    accountSettings?: AccountSettings
    relationships?: {
      manager?: UserReference
      directReports?: UserReference[]
      teams?: TeamReference[]
    }
    statistics?: {
      loginCount?: number
      lastLogin?: string | Date
      totalSpent?: number
    }
  }

  interface UserDetailResponse {
    code?: 200
    message?: string
    data?: User
    relatedData?: {
      recentActivities?: Activity[]
      subscriptions?: Subscription[]
      orders?: {
        recent?: OrderSummary[]
        stats?: OrderStatistics
      }
    }
  }

  interface Price {
    amount: number
    currency: string
    compareAtAmount?: number
    formatted?: string
  }

  type Product = BaseEntity & {
    name: string
    description?: string
    sku: string
    price: Price
    cost?: Price
    status: 'draft' | 'active' | 'inactive' | 'discontinued' | 'archived'
    categories?: CategoryReference[]
    tags?: string[]
    attributes?: Record<string, string | number | boolean | any>
    inventory?: InventoryInfo
    variants?: ProductVariant[]
    media?: MediaItem[]
    specifications?: Specification[]
    relatedProducts?: ProductReference[]
    metadata?: Record<string, any>
  }

  interface ProductSearchRequest {
    /** 全文搜索查询 */
    query?: string
    filters?: SearchFilter[]
    sort?: SortCriteria[]
    pagination?: PaginationParams
    /** 需要返回的分面字段 */
    facets?: string[]
    aggregations?: Record<string, Aggregation>
  }

  interface ProductSearchResponse {
    results?: Product[]
    total?: number
    facets?: Record<string, Facet[]>
    aggregations?: Record<string, AggregationResult>
    suggestions?: string[]
  }

  interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages?: number
    hasNext?: boolean
    hasPrev?: boolean
    nextPage?: number
    prevPage?: number
  }

  interface PaginatedResponse {
    code?: 200
    message?: string
    data?: any[]
    pagination?: PaginationInfo
  }

  interface ApiError {
    code: string
    message: string
    details?: ErrorDetail[]
    timestamp?: string | Date
    traceId?: string
  }

  type ValidationError = ApiError & {
    code?: string
    validationErrors?: FieldError[]
  }

  interface JsonPatchOperation {
    op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test'
    path: string
    value?: any
    from?: string
  }

  interface WebhookEvent {
    event: 'user.created' | 'user.updated' | 'order.created' | 'payment.processed'
    data: any
    timestamp?: string | Date
    /** 事件签名 */
    signature?: string
  }
}
