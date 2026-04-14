import { useLang } from '../../store'

function DashboardView() {
  const { changeLanguage } = useLang()

  return (
    <>
      <div>
        <button
          onClick={() => {
            changeLanguage('zh-CN')
          }}
        >
          中文
        </button>
        <button
          onClick={() => {
            changeLanguage('en-US')
          }}
        >
          English
        </button>
      </div>
    </>
  )
}

export default DashboardView
