import { ColorPicker, Divider, Drawer, Segmented, Switch } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useResolvedThemeMode, useTheme } from '@/store/modules/theme'

export interface SettingDrawerRef {
  showDrawer: () => void
}

const presetPrimaryColors = [
  '#1677ff',
  '#2f54eb',
  '#13c2c2',
  '#52c41a',
  '#faad14',
  '#fa8c16',
  '#f5222d',
  '#eb2f96',
] as const

export default forwardRef<SettingDrawerRef>(function SettingDrawer(_, ref) {
  const [open, setOpen] = useState(false)
  const {
    mode,
    primaryColor,
    componentSize,
    changeTheme,
    changePrimaryColor,
    changeComponentSize,
  } = useTheme()
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
    <Drawer title={t('界面设置')} open={open} onClose={onClose} size="default">
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
      <div className="flex items-center justify-between py-12px">
        <span>{t('预选颜色')}</span>
        <div className="flex flex-wrap justify-end gap-8px">
          {presetPrimaryColors.map((color) => {
            const checked = primaryColor.toLowerCase() === color.toLowerCase()
            return (
              <button
                key={color}
                type="button"
                aria-label={`select-${color}`}
                onClick={() => {
                  changePrimaryColor(color)
                }}
                className="h-20px w-20px cursor-pointer rounded-full border-none p-0 outline-none"
                style={{
                  backgroundColor: color,
                  boxShadow: checked
                    ? '0 0 0 2px var(--app-surface-color), 0 0 0 4px var(--app-primary-color)'
                    : '0 0 0 1px rgba(5, 5, 5, 0.12)',
                }}
              />
            )
          })}
        </div>
      </div>
      <Divider>{t('界面尺寸')}</Divider>
      <div className="flex items-center justify-between py-12px">
        <span>{t('组件尺寸')}</span>
        <Segmented
          options={[
            { label: t('紧凑'), value: 'small' },
            { label: t('默认'), value: 'middle' },
            { label: t('宽松'), value: 'large' },
          ]}
          value={componentSize}
          onChange={(value) => {
            changeComponentSize(value as 'small' | 'middle' | 'large')
          }}
        />
      </div>
    </Drawer>
  )
})
