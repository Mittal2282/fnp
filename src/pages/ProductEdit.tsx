import { useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { useAppSelector } from '../store/hooks'

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const products = useAppSelector((state) => state.product.products)
  const product = products.find((p) => p.id === id)

  const handleSuccess = () => {
    navigate('/products')
  }

  if (!product) {
    return (
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>Product Not Found</h1>
        <p style={{ color: '#666', marginTop: '8px' }}>The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
      }}
    >
      <h1 style={{ marginBottom: 24, fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>
        Edit Product
      </h1>
      <ProductForm productId={id} onSuccess={handleSuccess} />
    </div>
  )
}

export default ProductEdit

