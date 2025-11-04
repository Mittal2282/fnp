import { useState, useEffect } from 'react'
import { Button, Input, Space, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ProductTable from '../components/ProductTable'
import { useAppSelector } from '../store/hooks'

const ProductList = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const products = useAppSelector((state) => state.product.products)

  const placeholderTexts = [
    'Search by product name...',
    'Search by CID...',
    'Search by category...',
    'Search components...',
  ]

  useEffect(() => {
    if (searchQuery) {
      setAnimatedPlaceholder('')
      return
    }

    let charIndex = 0
    let timeoutId: ReturnType<typeof setTimeout>
    
    const typeText = () => {
      const currentText = placeholderTexts[placeholderIndex]
      
      if (charIndex < currentText.length) {
        setAnimatedPlaceholder(currentText.substring(0, charIndex + 1))
        charIndex++
        timeoutId = setTimeout(typeText, 100)
      } else {
        // Wait 2 seconds after typing completes, then fade out and switch to next text
        timeoutId = setTimeout(() => {
          setAnimatedPlaceholder('')
          charIndex = 0
          setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length)
        }, 2000)
      }
    }

    typeText()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholderIndex, searchQuery])

  const handleSearch = () => {
    // Search functionality will be handled by ProductTable
    message.info('Search functionality triggered')
  }

  const handleCheckCount = () => {
    message.info(`Total products: ${products.length}`)
  }

  const handleAddFilter = () => {
    message.info('Filter functionality will be implemented')
  }

  const handleBulkUpload = () => {
    message.info('Bulk upload functionality will be implemented')
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <div
        style={{
          marginBottom: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 200, maxWidth: 400, position: 'relative' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#8a9a5b' }} />}
            placeholder={animatedPlaceholder || ' '}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
            onFocus={() => setAnimatedPlaceholder('')}
            onBlur={() => {
              if (!searchQuery) {
                setAnimatedPlaceholder('')
                setPlaceholderIndex(0)
              }
            }}
            style={{
              borderRadius: '8px',
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              boxShadow: 'none',
              fontFamily: 'Arial, Helvetica, sans-serif',
              height: 36,
              padding: '6px 10px',
            }}
            className="animated-search-input"
          />
        </div>

        <Space wrap size="small">
          <Button
            onClick={handleCheckCount}
            size="middle"
            style={{
              backgroundColor: '#faf9f6',
              border: '1px solid #8a9a5b',
              color: '#556b2f',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 600,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            Check Count
          </Button>
          <Button
            onClick={handleAddFilter}
            size="middle"
            style={{
              backgroundColor: '#faf9f6',
              border: '1px solid #8a9a5b',
              color: '#556b2f',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 600,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            Add Filter
          </Button>
          <Button
            type="primary"
            onClick={() => navigate('/products/create')}
            size="middle"
            style={{
              backgroundColor: '#8a9a5b',
              borderColor: '#8a9a5b',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 600,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            Add New
          </Button>
          <Button
            type="primary"
            onClick={handleBulkUpload}
            size="middle"
            style={{
              backgroundColor: '#8a9a5b',
              borderColor: '#8a9a5b',
              color: '#fff',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 600,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            Bulk Upload
          </Button>
        </Space>
      </div>

      <ProductTable searchQuery={searchQuery} />
    </div>
  )
}

export default ProductList
