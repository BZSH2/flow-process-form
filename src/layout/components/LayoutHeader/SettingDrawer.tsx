import { ColorPicker, Divider, Drawer, Switch } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useResolvedThemeMode, useTheme } from '@/store/modules/theme'

export interface SettingDrawerRef {
  showDrawer: () => void
}

export default forwardRef<SettingDrawerRef>(function SettingDrawer(_, ref) {
  const [open, setOpen] = useState(false)
  const { mode, primaryColor, changeTheme, changePrimaryColor } = useTheme()
  const resolvedMode = useResolvedThemeMode()
  const followSystem = mode === 'system'
  const darkModeEnabled = resolvedMode === 'dark'

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  useImperativeHandle(ref, () => ({
    showDrawer,
  }))

  return (
    <Drawer title={t('界面设置')} open={open} onClose={onClose} width={360}>
      <Divider>{t('主题模式')}</Divider>
      <div className="flex items-center justify-between py-12px">
        <span>{t('深色模式')}</span>
        <Switch
          checked={darkModeEnabled}
          disabled={followSystem}
          onChange={(checked) => {
            changeTheme(checked ? 'dark' : 'light')
          }}
        />
      </div>
      <div className="flex items-center justify-between py-12px">
        <span>{t('跟随系统')}</span>
        <Switch
          checked={followSystem}
          onChange={(checked) => {
            if (checked) {
              changeTheme('system')
              return
            }
            changeTheme(resolvedMode)
          }}
        />
      </div>
      <Divider>{t('主题色')}</Divider>
      <div className="flex items-center justify-between py-12px">
        <span>{t('当前生效')}</span>
        <ColorPicker
          value={primaryColor}
          showText
          onChangeComplete={(value) => {
            changePrimaryColor(value.toHexString())
          }}
        />
      </div>
    </Drawer>
  )
})
