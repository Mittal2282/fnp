import { Form, Input, InputNumber, Select, Upload, Button, message } from 'antd'
import {
  UploadOutlined,
  AppstoreOutlined,
  TagsOutlined,
  PartitionOutlined,
  AppstoreAddOutlined,
  SlidersOutlined,
  TrademarkCircleOutlined,
  BarsOutlined,
  BorderOutlined,
  BgColorsOutlined,
  PercentageOutlined,
  DollarCircleOutlined,
  NumberOutlined,
  ApartmentOutlined,
  GoldOutlined,
  FileTextOutlined,
  BulbOutlined,
  BarcodeOutlined,
  PaperClipOutlined,
  FundOutlined,
  AimOutlined,
  LineChartOutlined,
  UsergroupAddOutlined,
  RiseOutlined,
  FlagOutlined,
  PictureOutlined,
  CarOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons'
import type { UploadFile } from 'antd/es/upload/interface'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addProduct, updateProduct, type Product } from '../store/slices/productSlice'
import { useState, useEffect } from 'react'

const { TextArea } = Input

interface ProductFormProps {
  productId?: string
  onSuccess?: () => void
}

const ProductForm = ({ productId, onSuccess }: ProductFormProps) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const products = useAppSelector((state) => state.product.products)
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const isEditMode = !!productId
  const product = isEditMode ? products.find((p) => p.id === productId) : null

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        finalPrice: product.finalPrice,
        category: product.category,
        subcategory: product.subcategory,
        shippingType: product.shippingType,
        state: product.state,
        type: product.type,
        subtype: product.subtype,
        brand: product.brand,
        uom: product.uom,
        shape: product.shape,
        color: product.color,
        gstGroupCode: product.gstGroupCode,
        purchasePrice: product.purchasePrice,
        hsnSacCode: product.hsnSacCode,
        department: product.department,
        material: product.material,
        purpose: product.purpose,
        skuCode: product.skuCode,
        attachableQuantity: product.attachableQuantity,
        totalPoValue: product.totalPoValue,
        tentativeWpRange: product.tentativeWpRange,
        avgDrr: product.avgDrr,
        partnersPlanned: product.partnersPlanned,
        projectedSaleValue: product.projectedSaleValue,
        tier: product.tier,
      })
      if (product.imageMetadata) {
        setFileList([
          {
            uid: '-1',
            name: product.imageMetadata.name,
            status: 'done',
            size: product.imageMetadata.size,
            type: product.imageMetadata.type,
          } as UploadFile,
        ])
      }
    }
  }, [product, form])

  const handleSubmit = (values: Partial<Product>) => {
    if (isEditMode && product) {
      dispatch(
        updateProduct({
          ...product,
          ...values,
          imageMetadata: fileList[0]
            ? {
                name: fileList[0].name || 'image',
                size: fileList[0].size || 0,
                type: fileList[0].type || 'image/png',
              }
            : product.imageMetadata,
        })
      )
      message.success('Product updated successfully!')
    } else {
      const payload = {
        name: values.name || '',
        description: values.description || '',
        price: values.price || 0,
        finalPrice: values.finalPrice,
        category: values.category || '',
        subcategory: values.subcategory,
        shippingType: values.shippingType,
        state: values.state,
        type: values.type,
        subtype: values.subtype,
        brand: values.brand,
        uom: values.uom,
        shape: values.shape,
        color: values.color,
        gstGroupCode: values.gstGroupCode,
        purchasePrice: values.purchasePrice,
        hsnSacCode: values.hsnSacCode,
        department: values.department,
        material: values.material,
        purpose: values.purpose,
        skuCode: values.skuCode,
        attachableQuantity: values.attachableQuantity,
        totalPoValue: values.totalPoValue,
        tentativeWpRange: values.tentativeWpRange,
        avgDrr: values.avgDrr,
        partnersPlanned: values.partnersPlanned,
        projectedSaleValue: values.projectedSaleValue,
        tier: values.tier,
        imageMetadata: fileList[0]
          ? {
              name: fileList[0].name || 'image',
              size: fileList[0].size || 0,
              type: fileList[0].type || 'image/png',
            }
          : undefined,
      } as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

      dispatch(addProduct(payload))
      message.success('Product created successfully!')
      form.resetFields()
      setFileList([])
    }
    if (onSuccess) {
      onSuccess()
    }
  }

  const handleFileChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList)
    // In a real app, you would upload the file here
    // For now, we just store the metadata
  }

  const beforeUpload = () => {
    // Prevent actual upload - we're just storing metadata
    return false
  }

  const iconLabel = (text: string, IconCmp: React.ComponentType): React.ReactNode => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {/* @ts-ignore - icon components share same signature */}
      <IconCmp style={{ color: '#8a9a5b' }} />
      <span>{text}</span>
    </span>
  )

  const submitWithState = (stateValue: 'PUBLISHED' | 'DRAFT') => {
    form.setFieldsValue({ state: stateValue })
    form.submit()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      style={{ width: '100%' }}
      className="compact-form"
    >
      {/* 3-column layout like the reference */}
      <div className="form-card grid-3">
        <Form.Item label={iconLabel('Component Name', AppstoreOutlined)} name="name" rules={[{ required: true, message: 'Please enter component name!' }]}>
          <Input placeholder="Enter component name" />
        </Form.Item>
        <Form.Item label={iconLabel('Category', TagsOutlined)} name="category" rules={[{ required: true, message: 'Select category' }]}>
          <Select placeholder="Select Category">
            <Select.Option value="CAKE">CAKE</Select.Option>
            <Select.Option value="APPARELS">APPARELS</Select.Option>
            <Select.Option value="ACCESSORIES">ACCESSORIES</Select.Option>
            <Select.Option value="Electronics">Electronics</Select.Option>
            <Select.Option value="Clothing">Clothing</Select.Option>
            <Select.Option value="Food">Food</Select.Option>
            <Select.Option value="Books">Books</Select.Option>
            <Select.Option value="Home & Garden">Home & Garden</Select.Option>
            <Select.Option value="Sports">Sports</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={iconLabel('Subcategory', PartitionOutlined)} name="subcategory" rules={[{ required: true, message: 'Select subcategory' }]}>
          <Select placeholder="Select Sub-Category" options={[
            { value: 'FNP Luxe', label: 'FNP Luxe' },
            { value: 'Fashion & Lifestyle', label: 'Fashion & Lifestyle' },
          ]} />
        </Form.Item>

        <Form.Item label={iconLabel('Type', AppstoreAddOutlined)} name="type">
          <Select placeholder="Select Type" options={[
            { value: 'Gift', label: 'Gift' },
            { value: 'Accessory', label: 'Accessory' },
          ]} />
        </Form.Item>
        <Form.Item label={iconLabel('Subtype', SlidersOutlined)} name="subtype">
          <Select placeholder="Select Sub-Type" options={[
            { value: 'Standard', label: 'Standard' },
            { value: 'Premium', label: 'Premium' },
          ]} />
        </Form.Item>
        <Form.Item label={iconLabel('Brand', TrademarkCircleOutlined)} name="brand">
          <Input placeholder="Enter Brand" />
        </Form.Item>

        <Form.Item label={iconLabel('UOM', BarsOutlined)} name="uom">
          <Select placeholder="Select UOM" options={[
            { value: 'PCS', label: 'PCS' },
            { value: 'KG', label: 'KG' },
            { value: 'LTR', label: 'LTR' },
          ]} />
        </Form.Item>
        <Form.Item label={iconLabel('Shape', BorderOutlined)} name="shape">
          <Select mode="multiple" placeholder="Select Shape(s)" options={[
            { value: 'Round', label: 'Round' },
            { value: 'Square', label: 'Square' },
            { value: 'Heart', label: 'Heart' },
          ]} />
        </Form.Item>
        <Form.Item label={iconLabel('Color', BgColorsOutlined)} name="color">
          <Select mode="multiple" placeholder="Select Color(s)" options={[
            { value: 'Red', label: 'Red' },
            { value: 'Blue', label: 'Blue' },
            { value: 'Green', label: 'Green' },
            { value: 'Black', label: 'Black' },
          ]} />
        </Form.Item>

        <Form.Item label={iconLabel('GST Group Code', PercentageOutlined)} name="gstGroupCode">
          <Select placeholder="Select GST Group Code" options={[
            { value: 'GST_0', label: 'GST_0' },
            { value: 'GST_5', label: 'GST_5' },
            { value: 'GST_12', label: 'GST_12' },
          ]} />
        </Form.Item>
        <Form.Item label={iconLabel('Purchase Price', DollarCircleOutlined)} name="purchasePrice">
          <InputNumber style={{ width: '100%' }} placeholder="Enter Purchase Price" prefix="₹" min={0} step={0.01} />
        </Form.Item>
        <Form.Item label={iconLabel('HSN/SAC Code', NumberOutlined)} name="hsnSacCode">
          <Input placeholder="Enter HSN/SAC Code" />
        </Form.Item>

        <Form.Item label={iconLabel('Department', ApartmentOutlined)} name="department">
          <Select placeholder="Select Department" options={[
            { value: 'Gifting', label: 'Gifting' },
            { value: 'Fashion', label: 'Fashion' },
          ]} />
        </Form.Item>
        <Form.Item label={iconLabel('Material', GoldOutlined)} name="material">
          <Input placeholder="Enter Material" />
        </Form.Item>
        <Form.Item label={iconLabel('Description', FileTextOutlined)} name="description" rules={[{ required: true, message: 'Please enter description!' }]}>
          <TextArea rows={1} placeholder="Enter Description" />
        </Form.Item>
        <Form.Item label={iconLabel('Purpose', BulbOutlined)} name="purpose">
          <Input placeholder="Enter Purpose" />
        </Form.Item>
        <Form.Item label={iconLabel('SKU Code', BarcodeOutlined)} name="skuCode">
          <Input placeholder="Enter SKU Code" />
        </Form.Item>
        <Form.Item label={iconLabel('Attachable Quantity', PaperClipOutlined)} name="attachableQuantity">
          <InputNumber style={{ width: '100%' }} placeholder="Enter Attachable Quantity" min={0} />
        </Form.Item>
        <Form.Item label={iconLabel('Total PO Value', FundOutlined)} name="totalPoValue">
          <InputNumber style={{ width: '100%' }} placeholder="Enter Total PO Value" prefix="₹" min={0} step={0.01} />
        </Form.Item>
        <Form.Item label={iconLabel('Tentative WP Range', AimOutlined)} name="tentativeWpRange">
          <Input placeholder="Enter Tentative WP Range" />
        </Form.Item>
        <Form.Item label={iconLabel('Avg DRR', LineChartOutlined)} name="avgDrr">
          <InputNumber style={{ width: '100%' }} placeholder="Enter Avg DRR" min={0} step={0.01} />
        </Form.Item>
        <Form.Item label={iconLabel('Partners Planned', UsergroupAddOutlined)} name="partnersPlanned">
          <InputNumber style={{ width: '100%' }} placeholder="Enter Partners Planned" min={0} />
        </Form.Item>
        <Form.Item label={iconLabel('Projected Sale Value', RiseOutlined)} name="projectedSaleValue">
          <InputNumber style={{ width: '100%' }} placeholder="Enter Projected Sale Value" prefix="₹" min={0} step={0.01} />
        </Form.Item>
        <Form.Item label={iconLabel('State', FlagOutlined)} name="state" initialValue="PUBLISHED">
          <Select placeholder="Select state">
            <Select.Option value="PUBLISHED">PUBLISHED</Select.Option>
            <Select.Option value="PUBLISH_FAILED">PUBLISH_FAILED</Select.Option>
            <Select.Option value="DRAFT">DRAFT</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label={iconLabel('Product Image', PictureOutlined)} name="image">
          <Upload
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={beforeUpload}
            listType="picture"
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </div>

      <div className="section-title">Shipping And Tier Details</div>

      <div className="form-card grid-3">
        <Form.Item label={iconLabel('Shipping Method', CarOutlined)} name="shippingType" initialValue="EXPRESS">
          <Select placeholder="Select Shipping Method">
            <Select.Option value="COURIER">Courier</Select.Option>
            <Select.Option value="EXPRESS">Express</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={iconLabel('Tier', DeploymentUnitOutlined)} name="tier">
          <Select placeholder="Select Tier" options={[
            { value: 'A', label: 'A' },
            { value: 'B', label: 'B' },
            { value: 'C', label: 'C' },
          ]} />
        </Form.Item>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <Button
          type="primary"
          onClick={() => submitWithState('PUBLISHED')}
          style={{
            backgroundColor: '#8a9a5b',
            borderColor: '#8a9a5b',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            borderRadius: 8,
          }}
          size="small"
        >
          Save & Raise Request
        </Button>
        <Button
          onClick={() => submitWithState('DRAFT')}
          style={{
            backgroundColor: '#faf9f6',
            borderColor: '#8a9a5b',
            color: '#556b2f',
            borderWidth: 1,
            borderStyle: 'solid',
            borderRadius: 8,
          }}
          size="small"
        >
          Save As Draft
        </Button>
        <Button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#f5f5f5',
            borderColor: '#d9d9d9',
            color: '#595959',
            borderRadius: 8,
          }}
          size="small"
        >
          Cancel
        </Button>
      </div>
    </Form>
  )
}

export default ProductForm

