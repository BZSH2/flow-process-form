import { message } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loginApi, type LoginPayload } from '@/api'
import { setAuthTokens } from '@/utils/auth'

const DEFAULT_LOGIN_FORM: LoginPayload = {
  phoneNumber: '13488888888',
  password: '123456',
}

const HOME_PATH = '/dashboard'

function resolveRedirectPath(rawRedirectPath: string | null) {
  if (!rawRedirectPath) {
    return HOME_PATH
  }
  const decodedPath = decodeURIComponent(rawRedirectPath)
  if (decodedPath.startsWith('/')) {
    return decodedPath
  }
  return HOME_PATH
}

export default function LoginView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: LoginPayload) => {
    try {
      setLoading(true)
      const data = await loginApi(values)
      setAuthTokens(data.accessToken, data.refreshToken)
      message.success('登录成功')

      const redirectPath = resolveRedirectPath(searchParams.get('redirect'))
      navigate(redirectPath, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center px-16px">
      <Card className="w-full max-w-420px shadow-sm">
        <div className="mb-20px text-center">
          <h2 className="m-0 text-22px font-semibold">欢迎登录</h2>
          <p className="m-0 mt-8px text-14px text-[var(--app-text-secondary-color)]">
            请输入账号与密码
          </p>
        </div>

        <Form<LoginPayload>
          layout="vertical"
          initialValues={DEFAULT_LOGIN_FORM}
          onFinish={onFinish}
        >
          <Form.Item
            name="phoneNumber"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '手机号格式不正确' },
            ]}
          >
            <Input placeholder="请输入手机号" autoComplete="username" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少 6 位' },
            ]}
          >
            <Input.Password placeholder="请输入密码" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  )
}
