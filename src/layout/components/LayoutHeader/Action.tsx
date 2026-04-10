import Avatar from './Avatar'
import Language from './Language'
import Screen from './Screen'
import Setting from './Setting'

interface ActionProps {
  isMobile: boolean
  isTablet: boolean
}

export default function Action({ isMobile, isTablet }: ActionProps) {
  const showLanguage = !isMobile
  const showSetting = !isMobile
  const showScreen = !isMobile && !isTablet

  return (
    <div className="flex items-center">
      {showLanguage && <Language />}
      {showScreen && <Screen />}
      {showSetting && <Setting />}
      <Avatar isMobile={isMobile} />
    </div>
  )
}
