import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL
export type Product = {
  _id: string
  title: string
  slug: string
  price: number
  image: string
  category: string
  description: string
  quantity: number
  sold: number
  shipping: number
  createdAt: string
  updatedAt: string
}

export type ProductState = {
  items: Product[]
  error: null | string
  pagination: {
    totalProducts: number
    totalPage: number
    currentPage: number
  }
  isLoading: boolean
  searchTerm: string
  singlePoduct: Product
  addedProduct: Product | null
}

const initialState: ProductState = {
  items: [],
  error: null,
  pagination: {
    totalProducts: 0,
    totalPage: 1,
    currentPage: 1
  },
  isLoading: false,
  searchTerm: '',
  singlePoduct: {} as Product,
  addedProduct: null
}
export const fetchData = createAsyncThunk('products/fetchData', async () => {
  const response = await axios.get(`${API_BASE_URL}/products`)
  return response.data
})
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        page,
        limit
      }
    })
    return response.data
  }
)
export const deleteproduct = createAsyncThunk('products/deleteProduct', async (slug: string) => {
  await axios.delete(`${API_BASE_URL}/products/${slug}`)
  return slug
})
export const fetchBrainTreeToken = createAsyncThunk('products/fetchBrainTreeToken', async () => {
  const response = await axios.get(`${API_BASE_URL}/products/braintree/token`)
  return response.data
})
export const payWithBraintree = createAsyncThunk(
  'products/payWithBraintree',
  async (data: object) => {
    const response = await axios.post(`${API_BASE_URL}/products/braintree/payment`, data)
    return response.data
  }
)

export const findProductBySlug = createAsyncThunk(
  'products/findProductBySlug',
  async (slug: string) => {
    await axios.get(`${API_BASE_URL}/products/${slug}`)
    return slug
  }
)
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (newProductData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/products`, newProductData)
    console.log(response)
    return response.data
  }
)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (data: { slug: string; formData: FormData }) => {
    const response = await axios.put(`${API_BASE_URL}/products/${data.slug}`, data.formData)
    // return data
    return response.data
  }
)

export const productsReducer = createSlice({
  name: 'products',
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.searchTerm = action.payload
    },
    sortProducts: (state, action) => {
      const sortingCriteria = action.payload

      if (sortingCriteria == 'name') {
        state.items.sort((a, b) => a.title.localeCompare(b.title))
      } else if (sortingCriteria == 'price') {
        state.items.sort((a, b) => a.price - b.price)
      }
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.items = action.payload.payload.products
      state.isLoading = false
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      const { totalPage, currentPage, totalProducts } = action.payload.payload.pagination
      state.pagination = {
        totalProducts: totalProducts,
        totalPage: totalPage,
        currentPage: currentPage
      }
      // // state.pagination = action.payload.payload.pagination
      state.items = action.payload.payload.products
      state.isLoading = false
    })
    builder.addCase(createProduct.fulfilled, (state, action) => {
      toast.success(action.payload.message)
      state.items.push(action.payload.payload)
      state.isLoading = false
    })
    builder.addCase(deleteproduct.fulfilled, (state, action) => {
      state.items = state.items.filter((product) => product.slug !== action.payload)
      state.isLoading = false
    })
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      console.log(action.payload.payload)
      const updatedProduct = action.payload.payload
      console.log(updatedProduct)
      state.items = state.items.map((product) => {
        if (product._id === updatedProduct._id) {
          return { ...product, ...updatedProduct }
        }
        return product
      })
    })
    builder.addCase(findProductBySlug.fulfilled, (state, action) => {
      const slug = action.payload
      const foundProduct = state.items.find((product) => product.slug == slug)
      if (foundProduct) {
        state.singlePoduct = foundProduct
      }
    })
    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.isLoading = true
        state.error = null
      }
    )
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'an error occured'
      }
    )
  }
})
export const { sortProducts, searchProduct } = productsReducer.actions
export default productsReducer.reducer
