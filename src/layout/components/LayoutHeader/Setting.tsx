import ActionBlock from './ActionBlock'
import SettingDrawer, { type SettingDrawerRef } from './SettingDrawer'

export default function Setting() {
  const settingDrawerRef = useRef<SettingDrawerRef | null>(null)
  const onClickSetting = () => {
    settingDrawerRef.current?.showDrawer()
  }
  return (
    <>
      <ActionBlock icon="layout-setting" size={16} title={t('界面设置')} onClick={onClickSetting} />
      <SettingDrawer ref={settingDrawerRef} />
    </>
  )
}
