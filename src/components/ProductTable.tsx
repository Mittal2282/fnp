import { Table, Button, Popconfirm, Space, Image, Typography } from 'antd'
import { EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { deleteProduct, updateProduct, type Product } from '../store/slices/productSlice'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table'

const { Text } = Typography

interface ProductTableProps {
  searchQuery?: string
  filters?: {
    state?: string
    category?: string
    shippingType?: string
  }
  onEdit?: (product: Product) => void
}

const ProductTable = ({ searchQuery = '', filters, onEdit }: ProductTableProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const allProducts = useAppSelector((state) => state.product.products)

  // Filter products based on search query + optional filters
  const filteredProducts = allProducts.filter((product) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      product.name?.toLowerCase().includes(query) ||
      product.cid?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  })

  const filteredBySelection = filteredProducts.filter((product) => {
    if (!filters) return true
    const matchesState = filters.state ? (product.state || '').toUpperCase() === filters.state : true
    const matchesCategory = filters.category ? (product.category || '').toUpperCase() === filters.category : true
    const matchesShipping = filters.shippingType ? (product.shippingType || '').toUpperCase() === filters.shippingType : true
    return matchesState && matchesCategory && matchesShipping
  })

  const handleDelete = (id: string) => {
    dispatch(deleteProduct(id))
  }

  const handleEdit = (product: Product) => {
    if (onEdit) {
      onEdit(product)
    } else {
      navigate(`/products/edit/${product.id}`)
    }
  }

  const handleRetrySync = (product: Product) => {
    // Simulate retry sync
    dispatch(
      updateProduct({
        ...product,
        imageSyncFailed: false,
      })
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: 'short' })
    const year = date.getFullYear()
    const hours = date.getHours() % 12 || 12
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM'
    return `${day}-${month}-${year} at ${hours}:${minutes} ${ampm}`
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'Action',
      key: 'action',
      width: 70,
      fixed: 'left',
      render: (_: unknown, record: Product) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            style={{ padding: 0 }}
            title="Edit"
          />
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              style={{ padding: 0 }}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl: string, record: Product) => (
        <Image
          width={50}
          height={50}
          src={imageUrl || '/placeholder-image.png'}
          alt={record.name}
          style={{
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #f0f0f0',
          }}
          fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4="
        />
      ),
    },
    {
      title: 'CID',
      dataIndex: 'cid',
      key: 'cid',
      width: 140,
      render: (cid: string, record: Product) => (
        <div>
          <div>{cid || '-'}</div>
          {record.imageSyncFailed && (
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text type="danger" style={{ fontSize: '11px' }}>
                Sync Failed
              </Text>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => handleRetrySync(record)}
                size="small"
                style={{
                  backgroundColor: '#faf9f6',
                  border: '1px solid #8a9a5b',
                  color: '#556b2f',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  fontSize: '11px',
                  height: 'auto',
                  padding: '2px 8px',
                }}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: 'Final Price',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      width: 110,
      render: (finalPrice: number, record: Product) => {
        const price = finalPrice || record.price
        return price ? `₹${price.toFixed(2)}` : '-'
      },
      sorter: (a: Product, b: Product) => {
        const priceA = a.finalPrice || a.price || 0
        const priceB = b.finalPrice || b.price || 0
        return priceA - priceB
      },
    },
    {
      title: 'Shipping Type',
      dataIndex: 'shippingType',
      key: 'shippingType',
      width: 120,
      render: (shippingType: string) => shippingType || '-',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (createdAt: string) => formatDate(createdAt),
      sorter: (a: Product, b: Product) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      width: 140,
      render: (state: string) => {
        const stateValue = (state || 'DRAFT').toUpperCase()
        return <span>{stateValue}</span>
      },
      filters: [
        { text: 'PUBLISHED', value: 'PUBLISHED' },
        { text: 'PUBLISH_FAILED', value: 'PUBLISH_FAILED' },
        { text: 'DRAFT', value: 'DRAFT' },
      ],
      onFilter: (value, record) => record.state === value,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => {
        const categoryValue = (category || '').toUpperCase()
        return <span>{categoryValue || '-'}</span>
      },
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
      width: 140,
      render: (subcategory: string) => subcategory || '-',
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredBySelection}
        rowKey="id"
        size="small"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Total ${total} items`,
          size: 'small',
        }}
        style={{
          backgroundColor: '#fff',
        }}
        scroll={{ x: 1200, y: '67vh' }}
        sticky
      />
    </div>
  )
}

export default ProductTable
