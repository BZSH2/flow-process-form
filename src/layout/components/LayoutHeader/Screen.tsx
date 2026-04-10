import ActionBlock from './ActionBlock'

export default function Screen() {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement))

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  const onToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      return
    }
    await document.exitFullscreen()
  }

  return (
    <ActionBlock
      title={isFullscreen ? t('退出全屏') : t('全屏')}
      icon={isFullscreen ? 'layout-screenFull' : 'layout-screen'}
      size={16}
      onClick={onToggleFullscreen}
    />
  )
}
