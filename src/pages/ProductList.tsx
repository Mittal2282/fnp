import { useState, useEffect } from 'react'
import { Button, Input, Space, message, Modal, Select, Upload } from 'antd'
import type { UploadProps } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ProductTable from '../components/ProductTable'
import { useAppSelector } from '../store/hooks'

const ProductList = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [searchQuery, setSearchQuery] = useState('')
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isBulkOpen, setIsBulkOpen] = useState(false)
  const [filters, setFilters] = useState<{ state?: string; category?: string; shippingType?: string }>({})
  const products = useAppSelector((state) => state.product.products)

  const placeholderTexts = [
    'Search by product name...',
    'Search by CID...',
    'Search by category...',
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
    const normalized = {
      state: filters.state,
      category: filters.category,
      shippingType: filters.shippingType,
    }
    const count = products.filter((p) => {
      const matchesState = normalized.state ? (p.state || '').toUpperCase() === normalized.state : true
      const matchesCategory = normalized.category ? (p.category || '').toUpperCase() === normalized.category : true
      const matchesShipping = normalized.shippingType ? (p.shippingType || '').toUpperCase() === normalized.shippingType : true
      const q = searchQuery.trim().toLowerCase()
      const matchesQuery = q
        ? (p.name || '').toLowerCase().includes(q) ||
          (p.cid || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        : true
      return matchesState && matchesCategory && matchesShipping && matchesQuery
    }).length
    messageApi.success(`Matching products: ${count}`)
  }

  const handleAddFilter = () => {
    setIsFilterOpen(true)
  }

  const handleBulkUpload = () => {
    setIsBulkOpen(true)
  }

  const uploadProps: UploadProps = {
    accept: '.csv',
    multiple: false,
    beforeUpload: (file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const text = String(e.target?.result || '')
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
          if (lines.length < 2) {
            messageApi.error('CSV seems empty')
            return
          }
          const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
          const required = ['name', 'price', 'category']
          const hasRequired = required.every((r) => headers.includes(r))
          if (!hasRequired) {
            messageApi.error('CSV must include name, price, category headers')
            return
          }
          const nameIdx = headers.indexOf('name')
          const priceIdx = headers.indexOf('price')
          const categoryIdx = headers.indexOf('category')
          const subcategoryIdx = headers.indexOf('subcategory')
          const descriptionIdx = headers.indexOf('description')
          const shippingIdx = headers.indexOf('shippingtype')
          const stateIdx = headers.indexOf('state')
          const imageUrlIdx = headers.indexOf('imageurl')
          const finalPriceIdx = headers.indexOf('finalprice')
          const cidIdx = headers.indexOf('cid')

          const rows = lines.slice(1)
          const created = [] as any[]
          rows.forEach((row) => {
            const cols = row.split(',')
            const name = (cols[nameIdx] || '').trim()
            const price = Number((cols[priceIdx] || '0').trim())
            const category = (cols[categoryIdx] || '').trim()
            if (!name || !category || Number.isNaN(price)) return
            const payload = {
              name,
              price,
              category: category.toUpperCase(),
              subcategory: subcategoryIdx !== -1 ? (cols[subcategoryIdx] || '').trim() : undefined,
              description: descriptionIdx !== -1 ? (cols[descriptionIdx] || '').trim() : '',
              shippingType: shippingIdx !== -1 ? (cols[shippingIdx] || '').trim().toUpperCase() as any : undefined,
              state: stateIdx !== -1 ? (cols[stateIdx] || '').trim().toUpperCase() as any : undefined,
              imageUrl: imageUrlIdx !== -1 ? (cols[imageUrlIdx] || '').trim() : undefined,
              finalPrice: finalPriceIdx !== -1 ? Number((cols[finalPriceIdx] || '').trim()) : undefined,
              cid: cidIdx !== -1 ? (cols[cidIdx] || '').trim() : undefined,
            }
            // Dispatch addProduct for each row
            window.dispatchEvent(
              new CustomEvent('bulk:addProduct', { detail: payload })
            )
            created.push(payload)
          })
          if (created.length) {
            messageApi.success(`Queued ${created.length} products for upload`)
          } else {
            messageApi.warning('No valid rows found')
          }
        } catch (err) {
          messageApi.error('Failed to parse CSV')
        }
      }
      reader.readAsText(file)
      setIsBulkOpen(false)
      return false // prevent auto upload
    },
  }

  return (
    <div
      className="products-page"
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.04)',
        border: '1px solid #f0f0f0',
      }}
    >
      {contextHolder}
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
              backgroundColor: '#6f7f3f',
              borderColor: '#6f7f3f',
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
              backgroundColor: '#6f7f3f',
              borderColor: '#6f7f3f',
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

      <ProductTable searchQuery={searchQuery} filters={filters} />

      <Modal
        title="Filters"
        open={isFilterOpen}
        onCancel={() => setIsFilterOpen(false)}
        onOk={() => setIsFilterOpen(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Select
            allowClear
            placeholder="State"
            options={[
              { label: 'PUBLISHED', value: 'PUBLISHED' },
              { label: 'PUBLISH_FAILED', value: 'PUBLISH_FAILED' },
              { label: 'DRAFT', value: 'DRAFT' },
            ]}
            value={filters.state}
            onChange={(v) => setFilters((f) => ({ ...f, state: v }))}
          />
          <Select
            allowClear
            placeholder="Category"
            options={[
              { label: 'CAKE', value: 'CAKE' },
              { label: 'APPARELS', value: 'APPARELS' },
              { label: 'ACCESSORIES', value: 'ACCESSORIES' },
            ]}
            value={filters.category}
            onChange={(v) => setFilters((f) => ({ ...f, category: v }))}
          />
          <Select
            allowClear
            placeholder="Shipping Type"
            options={[
              { label: 'COURIER', value: 'COURIER' },
              { label: 'EXPRESS', value: 'EXPRESS' },
            ]}
            value={filters.shippingType}
            onChange={(v) => setFilters((f) => ({ ...f, shippingType: v }))}
          />
          <div>
            <Button onClick={() => setFilters({})}>Clear</Button>
          </div>
        </Space>
      </Modal>

      <Modal
        title="Bulk Upload (CSV)"
        open={isBulkOpen}
        onCancel={() => setIsBulkOpen(false)}
        footer={null}
      >
        <p style={{ marginBottom: 8 }}>Upload a CSV with headers at least: name, price, category.</p>
        <Upload.Dragger {...uploadProps} maxCount={1}>
          <p className="ant-upload-drag-icon">📄</p>
          <p className="ant-upload-text">Click or drag CSV to this area to upload</p>
          <p className="ant-upload-hint">Optional headers: subcategory, description, shippingType, state, imageUrl, finalPrice, cid</p>
        </Upload.Dragger>
      </Modal>
    </div>
  )
}

export default ProductList
