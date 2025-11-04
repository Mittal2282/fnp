import { useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm'

const ProductCreate = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/products')
  }

  return (
    <div className="page-full">
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Create New Product Component</h1>
        <div style={{ color: '#6a6a6a', fontSize: 13 }}>Fill out the details below. Mandatory fields are marked.</div>
      </div>
      <div>
        <ProductForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}

export default ProductCreate

