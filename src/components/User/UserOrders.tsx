import React from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'

import { deletetCart } from '../../redux/slices/cart/cartSlice'
import { RootState, AppDispatch } from '../../redux/store'

import UserSidebar from './UserSidebar'

const UserOrders = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { cartItems } = useSelector((state: RootState) => state.cartReducer)

  const handelRemoveFromCart = (_id: string) => {
    dispatch(deletetCart(_id))
  }

  return (
    <div className="container">
      <UserSidebar />
      <div className="main-content">
        <h1> You have - {cartItems.length > 0 ? cartItems.length : 0} - items in the cart</h1>
        <section className="products">
          {cartItems.length > 0 &&
            cartItems.map((cartItem) => {
              const { _id, title, image, price, description } = cartItem
              return (
                <article key={_id} className="product-card">
                  <div className="product">
                    <img src={image} alt={title} />
                    <div className="cart-item-info">
                      <h2 className="product-title">{title}</h2>
                      <p className="product-description">Price: {price} SAR</p>
                      <p className="product-description">
                        Discription:{description.substring(0, 13)}...
                      </p>
                    </div>
                    <button
                      className="text-red-400"
                      onClick={() => {
                        handelRemoveFromCart(cartItem._id)
                      }}>
                      <FaTrashAlt />
                    </button>
                    <br></br>
                    <br></br>
                  </div>
                </article>
              )
            })}
        </section>
      </div>
    </div>
  )
}

export default UserOrders
