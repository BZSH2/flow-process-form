import type { MenuProps } from 'antd'
import { Avatar as AntdAvatar, Dropdown } from 'antd'
import router from '@/router'
import { clearAuthTokens } from '@/utils/auth'
import ActionBlock from './ActionBlock'

export default function Avatar({ isMobile }: { isMobile: boolean }) {
  const items: MenuProps['items'] = [
    {
      key: 'github',
      label: 'GitHub',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: t('退出登录'),
    },
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'github') {
      window.open('https://github.com', '_blank', 'noopener,noreferrer')
      return
    }
    if (key === 'logout') {
      clearAuthTokens()
      router.navigate('/login')
    }
  }

  return (
    <Dropdown menu={{ items, onClick }} trigger={['hover']}>
      <ActionBlock>
        <AntdAvatar size={22} className="mr-6px">
          A
        </AntdAvatar>
        {!isMobile && <span className="text-xs font-medium text-slate-600">admin</span>}
      </ActionBlock>
    </Dropdown>
  )
}
