import { Drawer } from 'antd'
import { forwardRef, useImperativeHandle, useState } from 'react'

export interface SettingDrawerRef {
  showDrawer: () => void
}

export default forwardRef<SettingDrawerRef>(function SettingDrawer(_, ref) {
  const [open, setOpen] = useState(false)

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
    <Drawer title={t('界面设置')} open={open} onClose={onClose}>
      <div>11111</div>
    </Drawer>
  )
})
