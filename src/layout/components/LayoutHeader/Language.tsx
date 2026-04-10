import ActionBlock from './ActionBlock'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { languages } from '@/config/lang.config'
import { useLang } from '@/store'

export default function Language() {
  const { changeLanguage, lang } = useLang()
  const items: MenuProps['items'] = languages.map((item) => ({
    label: item.nativeName,
    key: item.code,
  }))
  return (
    <Dropdown
      trigger={['hover']}
      placement="bottom"
      menu={{
        items,
        selectedKeys: [lang],
        selectable: true,
        onClick: ({ key }) => {
          changeLanguage(String(key))
        },
      }}
    >
      <ActionBlock icon="layout-translate" size={16} />
    </Dropdown>
  )
}
