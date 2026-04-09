import { useTranslation } from 'react-i18next'
import { useLang } from '../../store'

function DashboardView() {
  const { t } = useTranslation()
  const { lang, changeLanguage } = useLang()

  return (
    <>
      <div>
        <h2>{t('测试')}</h2>
        <p>this is dashboard page</p>
        <p>当前语言: {lang}</p>
      </div>
      <div style={{ marginTop: '20px' }}>
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
