import type { MenuProps } from 'antd'
import { Avatar as AntdAvatar, Dropdown, message } from 'antd'
import { logoutApi } from '@/api'
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

  const onClick: MenuProps['onClick'] = async ({ key }) => {
    if (key === 'github') {
      window.open('https://github.com', '_blank', 'noopener,noreferrer')
      return
    }

    if (key === 'logout') {
      try {
        await logoutApi({ skipErrorMessage: true })
      } catch {
        // 本地清理仍然可以保证退出态一致性
      } finally {
        clearAuthTokens()
        message.success(t('已退出登录'))
        void router.navigate('/login', { replace: true })
      }
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
