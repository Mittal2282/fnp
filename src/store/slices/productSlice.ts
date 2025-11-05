import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Product {
  id: string
  cid?: string // Component ID
  name: string
  description: string
  price: number
  finalPrice?: number // Final Price (can be different from price)
  category: string
  subcategory?: string
  shippingType?: 'COURIER' | 'EXPRESS'
  state?: 'PUBLISHED' | 'PUBLISH_FAILED' | 'DRAFT'
  // Optional extended attributes from detailed create form
  type?: string
  subtype?: string
  brand?: string
  uom?: string
  shape?: string[]
  color?: string[]
  gstGroupCode?: string
  purchasePrice?: number
  hsnSacCode?: string
  department?: string
  material?: string
  purpose?: string
  skuCode?: string
  attachableQuantity?: number
  totalPoValue?: number
  tentativeWpRange?: string
  avgDrr?: number
  partnersPlanned?: number
  projectedSaleValue?: number
  shippingMethod?: 'COURIER' | 'EXPRESS'
  tier?: string
  imageUrl?: string
  imageMetadata?: {
    name: string
    size: number
    type: string
  }
  imageSyncFailed?: boolean // Track if image sync failed
  createdAt: string
  updatedAt: string
}

interface ProductState {
  products: Product[]
}


const createDateString = (daysAgo: number, hour: number, minute: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const initialState: ProductState = {
  products: [
    {
      id: '1',
      cid: 'CAK_508',
      name: 'Strawberry Cake',
      description: 'Delicious strawberry cake with fresh cream',
      price: 150,
      finalPrice: 159,
      category: 'CAKE',
      subcategory: 'FNP Luxe',
      shippingType: 'COURIER',
      state: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
      imageSyncFailed: false,
      createdAt: createDateString(2, 17, 13),
      updatedAt: createDateString(2, 17, 13),
    },
    {
      id: '2',
      cid: 'CAK_509',
      name: 'Vanilla Cupcakes',
      description: 'Soft vanilla cupcakes with buttercream frosting',
      price: 120,
      category: 'CAKE',
      subcategory: 'FNP Luxe',
      shippingType: 'EXPRESS',
      state: 'PUBLISH_FAILED',
      imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=100&h=100&fit=crop',
      imageSyncFailed: true,
      createdAt: createDateString(1, 14, 30),
      updatedAt: createDateString(1, 14, 30),
    },
    {
      id: '3',
      cid: 'APR_60',
      name: 'Red Rose',
      description: 'Beautiful red rose arrangement',
      price: 200,
      category: 'APPARELS',
      subcategory: 'Fashion & Lifestyle',
      shippingType: 'COURIER',
      state: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1518895949257-762f22a0f8a0?w=100&h=100&fit=crop',
      imageSyncFailed: false,
      createdAt: createDateString(3, 10, 45),
      updatedAt: createDateString(3, 10, 45),
    },
    {
      id: '4',
      cid: 'ACC_52',
      name: 'Hamper',
      description: 'Luxury gift hamper with premium items',
      price: 500,
      category: 'ACCESSORIES',
      subcategory: 'FNP Luxe',
      shippingType: 'EXPRESS',
      state: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=100&h=100&fit=crop',
      imageSyncFailed: false,
      createdAt: createDateString(4, 16, 20),
      updatedAt: createDateString(4, 16, 20),
    },
    {
      id: '5',
      cid: 'AUT_1762165319882',
      name: 'AutoComp_1762165319882',
      description: 'Auto-generated component',
      price: 100,
      category: 'ACCESSORIES',
      subcategory: 'Fashion & Lifestyle',
      shippingType: 'COURIER',
      state: 'PUBLISH_FAILED',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop',
      imageSyncFailed: true,
      createdAt: createDateString(5, 9, 15),
      updatedAt: createDateString(5, 9, 15),
    },
    {
      id: '6',
      cid: 'TST_001',
      name: 'Test comp Amrit',
      description: 'Test component created for testing purposes',
      price: 80,
      category: 'APPARELS',
      subcategory: 'Fashion & Lifestyle',
      shippingType: 'EXPRESS',
      state: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1523380744952-b7e00e6e2ffa?w=100&h=100&fit=crop',
      imageSyncFailed: false,
      createdAt: createDateString(6, 11, 30),
      updatedAt: createDateString(6, 11, 30),
    },
    {
      id: '7',
      cid: 'CAK_510',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with ganache',
      price: 180,
      category: 'CAKE',
      subcategory: 'FNP Luxe',
      shippingType: 'COURIER',
      state: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
      imageSyncFailed: false,
      createdAt: createDateString(7, 13, 45),
      updatedAt: createDateString(7, 13, 45),
    },
    {
      id: '8',
      cid: 'APR_61',
      name: 'Denim Jeans',
      description: 'Classic blue denim jeans',
      price: 250,
      category: 'APPARELS',
      subcategory: 'Fashion & Lifestyle',
      shippingType: 'EXPRESS',
      state: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
      imageSyncFailed: false,
      createdAt: createDateString(8, 15, 0),
      updatedAt: createDateString(8, 15, 0),
    },
    {
      id: '9',
      cid: 'ACC_53',
      name: 'Leather Bag',
      description: 'Premium leather handbag',
      price: 350,
      category: 'ACCESSORIES',
      subcategory: 'FNP Luxe',
      shippingType: 'COURIER',
      state: 'PUBLISH_FAILED',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
      imageSyncFailed: true,
      createdAt: createDateString(9, 12, 20),
      updatedAt: createDateString(9, 12, 20),
    },
    {
      id: '10',
      cid: 'CAK_511',
      name: 'Red Velvet Cake',
      description: 'Classic red velvet with cream cheese frosting',
      price: 200,
      category: 'CAKE',
      subcategory: 'FNP Luxe',
      shippingType: 'EXPRESS',
      state: 'PUBLISHED',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop',
      imageSyncFailed: false,
      createdAt: createDateString(10, 8, 10),
      updatedAt: createDateString(10, 8, 10),
    },
  ],
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const timestamp = Date.now()
      const categories = action.payload.category.toUpperCase().split(' ')
      const prefix = categories[0].substring(0, 3) || 'PRD'
      const newProduct: Product = {
        ...action.payload,
        id: timestamp.toString(),
        cid: action.payload.cid || `${prefix}_${Math.floor(Math.random() * 1000)}`,
        state: action.payload.state || 'PUBLISHED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      state.products.push(newProduct)
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload)
    },
  },
})

export const { addProduct, updateProduct, deleteProduct } = productSlice.actions
export default productSlice.reducer

