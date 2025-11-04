import { useState, useEffect } from 'react'
import { Button, Input, Space, message, Modal, Select, Upload, Tag, Typography, Divider } from 'antd'
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
  const [pendingFilters, setPendingFilters] = useState<{ state?: string; category?: string; shippingType?: string }>({})
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
    setPendingFilters(filters)
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

  const handleDownloadTemplate = () => {
    const headers = [
      'name',
      'price',
      'category',
      'subcategory',
      'description',
      'shippingType',
      'state',
      'imageUrl',
      'finalPrice',
      'cid',
    ]
    const csv = headers.join(',') + '\n'
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'product_bulk_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const appliedFilterCount = ['state', 'category', 'shippingType'].filter((k) => (filters as any)[k]).length

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
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>Add Filter</span>
            {appliedFilterCount > 0 && (
              <Tag color="#6f7f3f" style={{ marginLeft: 4, marginRight: 0, color: '#fff' }}>{appliedFilterCount}</Tag>
            )}
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
        centered
        width={420}
        footer={[
          <Button key="reset" onClick={() => setPendingFilters({})}>
            Reset
          </Button>,
          <Button
            key="apply"
            type="primary"
            onClick={() => {
              setFilters(pendingFilters)
              setIsFilterOpen(false)
            }}
            style={{ backgroundColor: '#6f7f3f', borderColor: '#6f7f3f' }}
          >
            Apply Filters
          </Button>,
        ]}
      >
        <div style={{ color: '#4b5563' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {(pendingFilters.state || pendingFilters.category || pendingFilters.shippingType) ? (
            <Space wrap size={[6, 6]}>
              {pendingFilters.state && (
                <Tag
                  closable
                  color="green"
                  onClose={(e) => {
                    e.preventDefault()
                    setPendingFilters((f) => ({ ...f, state: undefined }))
                  }}
                >
                  State: {pendingFilters.state}
                </Tag>
              )}
              {pendingFilters.category && (
                <Tag
                  closable
                  color="geekblue"
                  onClose={(e) => {
                    e.preventDefault()
                    setPendingFilters((f) => ({ ...f, category: undefined }))
                  }}
                >
                  Category: {pendingFilters.category}
                </Tag>
              )}
              {pendingFilters.shippingType && (
                <Tag
                  closable
                  color="purple"
                  onClose={(e) => {
                    e.preventDefault()
                    setPendingFilters((f) => ({ ...f, shippingType: undefined }))
                  }}
                >
                  Shipping: {pendingFilters.shippingType}
                </Tag>
              )}
            </Space>
          ) : (
            <div style={{ fontSize: 12, color: '#6b7280' }}>Choose one or more filters</div>
          )}

          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>State</div>
            <Select
              showSearch
              allowClear
              placeholder="Select state"
              optionFilterProp="label"
              style={{ width: '100%' }}
              options={[
                { label: 'PUBLISHED', value: 'PUBLISHED' },
                { label: 'PUBLISH_FAILED', value: 'PUBLISH_FAILED' },
                { label: 'DRAFT', value: 'DRAFT' },
              ]}
              value={pendingFilters.state}
              onChange={(v) => setPendingFilters((f) => ({ ...f, state: v }))}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Category</div>
            <Select
              showSearch
              allowClear
              placeholder="Select category"
              optionFilterProp="label"
              style={{ width: '100%' }}
              options={[
                { label: 'CAKE', value: 'CAKE' },
                { label: 'APPARELS', value: 'APPARELS' },
                { label: 'ACCESSORIES', value: 'ACCESSORIES' },
              ]}
              value={pendingFilters.category}
              onChange={(v) => setPendingFilters((f) => ({ ...f, category: v }))}
            />
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>Shipping Type</div>
            <Select
              showSearch
              allowClear
              placeholder="Select shipping type"
              optionFilterProp="label"
              style={{ width: '100%' }}
              options={[
                { label: 'COURIER', value: 'COURIER' },
                { label: 'EXPRESS', value: 'EXPRESS' },
              ]}
              value={pendingFilters.shippingType}
              onChange={(v) => setPendingFilters((f) => ({ ...f, shippingType: v }))}
            />
          </div>
        </Space>
        </div>
      </Modal>

      <Modal
        title="Bulk Upload (CSV)"
        open={isBulkOpen}
        onCancel={() => setIsBulkOpen(false)}
        centered
        width={520}
        footer={null}
      >
        <div style={{ color: '#4b5563' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Typography.Text type="secondary" style={{ margin: 0 }}>
              Include at least <b>name</b>, <b>price</b>, <b>category</b> columns.
            </Typography.Text>
            <Button size="small" onClick={handleDownloadTemplate} style={{ borderRadius: 6 }}>Download template</Button>
          </div>

          <Upload.Dragger
            {...uploadProps}
            maxCount={1}
            showUploadList={false}
            style={{
              borderColor: '#e5e7eb',
              background: '#fafafa',
              borderRadius: 10,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 8 }}>📄</div>
            <div style={{ fontWeight: 600, color: '#374151' }}>Click or drag CSV to upload</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>Only .csv files are accepted</div>
          </Upload.Dragger>

          <Divider style={{ margin: '12px 0' }} />
          <Space direction="vertical" size={6} style={{ width: '100%' }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Optional columns: <b>subcategory</b>, <b>description</b>, <b>shippingType</b>, <b>state</b>, <b>imageUrl</b>, <b>finalPrice</b>, <b>cid</b>
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Values for <b>shippingType</b> and <b>state</b> should match the expected options.
            </Typography.Text>
          </Space>
        </div>
      </Modal>
    </div>
  )
}

export default ProductList
