declare namespace Form {
  /**
   * 表单字段类型
   * - custom: 预留给业务自定义渲染组件
   */
  type FieldType =
    | 'input'
    | 'textarea'
    | 'number'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'switch'
    | 'date'
    | 'custom'

  /**
   * 单个字段可接受的值类型（基础版）
   * 说明：后续如需文件上传、级联等复杂类型，可在这里扩展
   */
  type FieldValue = string | number | boolean | Array<string | number> | null

  /** 下拉、单选、复选等选项数据 */
  interface Option {
    /** 选项显示文案 */
    label: string
    /** 选项值 */
    value: string | number | boolean
    /** 是否禁用该选项 */
    disabled?: boolean
  }

  /**
   * 字段校验规则
   * - validator 返回 true 表示通过
   * - 返回 string 表示错误信息
   */
  interface Rule {
    /** 是否必填 */
    required?: boolean
    /** 校验失败提示文案 */
    message?: string
    /** 触发时机 */
    trigger?: 'blur' | 'change' | Array<'blur' | 'change'>
    /** 正则校验 */
    pattern?: RegExp
    /** 最小值/最小长度 */
    min?: number
    /** 最大值/最大长度 */
    max?: number
    /**
     * 自定义校验
     * @param value 当前字段值
     * @param item 当前字段配置
     */
    validator?: (value: FieldValue, item: Item) => boolean | string | Promise<boolean | string>
  }

  /**
   * 字段定义（Schema 节点）
   * @template ValueType 字段值类型，默认使用通用 FieldValue
   */
  interface Item<ValueType = FieldValue> {
    /** 字段类型 */
    type: FieldType
    /** 字段标签 */
    label: string
    /** 字段唯一标识（用于提交值 key） */
    name: string
    /** 默认值 */
    value?: ValueType
    /** 占位提示 */
    placeholder?: string
    /** 是否必填（便捷写法，等价于 rules.required） */
    required?: boolean
    /** 是否禁用 */
    disabled?: boolean
    /** 是否隐藏 */
    hidden?: boolean
    /** 栅格占位（24 栅格体系） */
    span?: number
    /** 可选项（select/radio/checkbox 等） */
    options?: Option[]
    /** 校验规则 */
    rules?: Rule[]
    /** 透传给具体组件的额外配置 */
    props?: Record<string, unknown>
    /** 唯一值 拖拽到视图区域时动态生成 */
    id?: string
  }

  /** 表单 Schema（字段配置数组） */
  type Schema = Item[]

  /** 表单提交值结构（key 为字段 name） */
  type Values = Record<string, FieldValue>

  /** 模板渲染组件入参（当前场景需要宽度） */
  interface TemplateItemProps extends Item {
    width: number
  }
}
