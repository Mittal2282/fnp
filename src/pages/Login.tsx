import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../store/hooks'
import { login } from '../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      dispatch(login(values))
      const isAuthenticated = values.username === 'admin' && values.password === 'password123'
      if (isAuthenticated) {
        message.success({
          content: 'Login successful!',
          duration: 2,
          style: {
            marginTop: '20vh',
          },
        })
        navigate('/products')
      } else {
        message.error({
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: '24px',
      }}
    >
      <Card
        title={
          <div style={{ textAlign: 'center', fontSize: '28px', fontWeight: 600, color: '#1a1a1a' }}>
            Login
          </div>
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
                backgroundColor: '#556b2f',
                borderColor: '#556b2f',
                height: '40px',
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            padding: '16px',
            background: '#fafafa',
            borderRadius: '6px',
            border: '1px solid #f0f0f0',
          }}
        >
          <p style={{ margin: 0, color: '#666', fontSize: '13px', fontWeight: 500 }}>
            Demo credentials:
          </p>
          <div style={{ marginTop: '8px', color: '#666', fontSize: '13px' }}>
            <p style={{ margin: '4px 0' }}>
              <strong>Username:</strong> admin
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Password:</strong> password123
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login

