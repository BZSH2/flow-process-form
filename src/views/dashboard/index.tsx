import { useTranslation } from 'react-i18next'

function DashboardView() {
  const { t, i18n } = useTranslation()

  // 切换语言函数
  const changeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng)
  }

  return (
    <>
      <div>
        <h2>{t('测试')}</h2>
        <p>this is dashboard page</p>
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
