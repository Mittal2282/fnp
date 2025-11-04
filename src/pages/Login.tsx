import { useState } from 'react'
import { Form, Input, Button, Card, message, Tooltip } from 'antd'
import { UserOutlined, LockOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../store/hooks'
import { login } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      dispatch(login(values))
      const isAuthenticated = values.username === 'admin' && values.password === 'password123'
      if (isAuthenticated) {
        messageApi.success({
          content: 'Login successful!',
          duration: 2,
          style: {
            marginTop: '20vh',
          },
        })
        navigate('/products')
      } else {
        messageApi.error({
          content: 'Invalid username or password. Please check your credentials and try again.',
          duration: 3,
          style: {
            marginTop: '20vh',
          },
        })
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="login-split login-page">
      {contextHolder}
      <div
        className="login-illustration"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        <div className="login-illustration-overlay">
          <img src="/fnpLogo.png" alt="FNP" className="login-brand" />
          <div className="login-illustration-caption">
            Thoughtful gifts, delivered with care.
          </div>
        </div>
      </div>
      <div className="login-pane">
        <Card
        title={
          <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: 600, color: '#1a1a1a' }}>
            Login
          </div>
        }
        extra={
          <Tooltip
            placement="left"
            title={
              <div style={{ lineHeight: 1.5 }}>
                <div><strong>Username:</strong> admin</div>
                <div><strong>Password:</strong> password123</div>
              </div>
            }
          >
            <InfoCircleOutlined style={{ color: '#8a9a5b', fontSize: 18 }} />
          </Tooltip>
        }
        style={{
          width: '100%',
          maxWidth: 450,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
      >
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Sign in to access the Product Management System
          </p>
        </div>
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: '40px',
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        </Card>
      </div>
    </div>
  )
}

export default Login

