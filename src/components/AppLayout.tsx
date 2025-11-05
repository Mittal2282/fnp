import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd'
import {
  LogoutOutlined,
  ShoppingOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { logout } from '../store/slices/authSlice'
import type { MenuProps } from 'antd'
import fnpLogo from '../assets/fnpLogo.png'

const { Header, Sider, Content } = Layout

const AppLayout = () => {
  // Sidebar starts collapsed; expands on hover as an overlay
  const [hoverOpen, setHoverOpen] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAppSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const menuItems: MenuProps['items'] = [
    {
      key: '/products',
      icon: <ShoppingOutlined />,
      label: 'Products',
    },
    {
      key: '/products/create',
      icon: <PlusOutlined />,
      label: 'Create Product',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ]

  const isOpen = hoverOpen

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={!isOpen}
        collapsedWidth={56}
        width={240}
        style={{
          background: '#fff',
          boxShadow: '1px 0 8px rgba(0,0,0,0.08)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          transition: 'all 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onMouseEnter={() => setHoverOpen(true)}
        onMouseLeave={() => setHoverOpen(false)}
      >
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'flex-start' : 'center',
            padding: isOpen ? '0 20px' : '0',
            borderBottom: '1px solid #f0f0f0',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          {!isOpen ? (
            <img src={fnpLogo} alt="FNP" style={{ height: 32  , width: 32, objectFit: 'contain' }} />
          ) : (
            <img src={fnpLogo} alt="FNP" style={{ height: 28, objectFit: 'contain' }} />
          )}
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{
              border: 'none',
              background: '#fff',
              paddingTop: '8px',
              flex: 1,
              overflow: 'hidden',
            }}
          />
        </div>
        <div
          style={{
            borderTop: '1px solid #f0f0f0',
            padding: '8px 0',
            background: '#fff',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <Menu
            mode="inline"
            items={[
              {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout,
              },
            ]}
            style={{
              border: 'none',
              background: '#fff',
            }}
          />
        </div>
      </Sider>
      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setHoverOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.15)',
            backdropFilter: 'blur(2px)',
            zIndex: 999,
          }}
        />
      )}
      <Layout style={{ marginLeft: 56, transition: 'margin-left 0.2s ease' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            filter: isOpen ? 'blur(1px)' : 'none',
            transition: 'filter 0.2s ease',
          }}
        >
          <div />
          <Space style={{ fontSize: '14px', color: '#595959' }}>
            <span style={{ color: '#8c8c8c' }}>{user?.username}</span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                size="small"
                style={{
                  backgroundColor: '#556b2f',
                  cursor: 'pointer',
                  border: '2px solid #fff',
                }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '12px',
            padding: 0,
            minHeight: 280,
            background: 'transparent',
            filter: isOpen ? 'blur(1.5px)' : 'none',
            transition: 'filter 0.2s ease',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AppLayout

