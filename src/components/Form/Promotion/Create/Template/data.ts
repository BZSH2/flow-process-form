/**
 * 表单控件模板（用于左侧组件库/初始化模板）
 * - 每一项表示一种控件类型
 * - label 使用控件名称，便于直接展示“文本框/多选框”等
 */
const DEFAULT_TEMPLATE: Form.Schema = [
  {
    type: 'input',
    label: '文本框',
    name: 'textInput',
    value: '',
    placeholder: '请输入内容',
    required: false,
    props: {
      clearable: true,
    },
  },
  {
    type: 'textarea',
    label: '多行文本框',
    name: 'textareaInput',
    value: '',
    placeholder: '请输入多行内容',
    props: {
      rows: 3,
    },
  },
  {
    type: 'select',
    label: '下拉选择框',
    name: 'selectInput',
    value: null,
    options: [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' },
      { label: '选项三', value: 'option3' },
    ],
  },
  {
    type: 'radio',
    label: '单选框',
    name: 'radioInput',
    value: 'option1',
    options: [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' },
    ],
  },
  {
    type: 'checkbox',
    label: '多选框',
    name: 'checkboxInput',
    value: ['option1'],
    options: [
      { label: '选项一', value: 'option1' },
      { label: '选项二', value: 'option2' },
      { label: '选项三', value: 'option3' },
    ],
  },
  {
    type: 'switch',
    label: '开关',
    name: 'switchInput',
    value: false,
  },
  {
    type: 'date',
    label: '日期选择器',
    name: 'dateInput',
    value: null,
  },
  {
    type: 'number',
    label: '数字输入框',
    name: 'numberInput',
    value: 0,
    props: {
      min: 0,
      step: 1,
    },
  },
]

export default DEFAULT_TEMPLATE
