import { set } from "mongoose"
import { useEffect, useState } from "react"
import { useContext } from "react"
import Layout from "../components/Layout"
import { ProductsContext } from "../components/ProductsContext"

const CheckoutPage = () => {
const {selectedProducts, setSelectedProducts}= useContext(ProductsContext)
  const [productsInfos, setProductsInfos] = useState([]);
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  

  useEffect(() => {
    const uniqueIds = [...new Set(selectedProducts)]
    fetch("/api/products?ids=" + uniqueIds.join(","))
    .then(response => response.json())
    .then(json => setProductsInfos(json))
  }, [selectedProducts]);

  function moreOfThisProduct (id){
    setSelectedProducts(prev => [...prev, id])
  } 

  function lessOfThisProduct (id){
    const pos = selectedProducts.indexOf(id);
    if(pos !== -1) {
      setSelectedProducts(prev => {
        return prev.filter((value, index) => index !== pos)
      })
    }
    
  } 

  const deliveryPrice = 5;
  let subtotal = 0;
  if(selectedProducts?.length) {
    for (let id of selectedProducts) {
      const price = productsInfos.find(p => p._id === id)?.price || 0;
      
      subtotal += price
    }
  }

  const total = subtotal + deliveryPrice
  


  return (
    <Layout>
        {!productsInfos.length && (
          <div>No products in your shopping cart</div>
        )}
        {
          productsInfos.length && productsInfos.map(productsInfo => {
            const amount = selectedProducts.filter(id => id === productsInfo._id).length;
            if(amount === 0) return;
            return (
            <div key={productsInfo._id} className="flex mb-5">
              <div className="bg-gray-100 p-3 rounded-xl shrink-0">
                <img className="w-24 h-24" src={productsInfo.picture} alt={productsInfo.name} />
              </div>
              <div className="pl-4">
                <h3 className="font-bold text-lg">{productsInfo.name}</h3>
                <p className="text-sm leading-4 text-gray-500">{productsInfo.description}</p>
              <div className="flex">
                <div className="grow">${productsInfo.price}</div>
                <div>
                  <button onClick={() => lessOfThisProduct(productsInfo._id)} className="border border-orange-500 px-2 rounded-lg text-orange-400">-</button>
                  <span className="px-2 ">
                  {selectedProducts.filter(id => id === productsInfo._id).length}
                  </span>
                  <button onClick={() => moreOfThisProduct(productsInfo._id)} className="bg-orange-500 px-2 rounded-lg text-white">+</button>
                </div>
              </div>
                </div>
            </div>
          )})
        }
          <form action="/api/checkout" method="POST">

        <div className="mt-4">
          <input required name="address" value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Street, address, number"/>
          <input required name="city" value={city} onChange={e => setCity(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="City and Postal Code"/>
          <input required name="name" value={name} onChange={e => setName(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Your name"/>
          <input required name="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="email" placeholder="Email address"/>
        </div>
        <div className="mt-4">
        <div className="flex my-3 border-dashed">
          <h3 className="grow font-bold text-gray-400">Subtotal:</h3>
          <h3 className="font-bold">€{subtotal}</h3>
        </div>
        <div className="flex my-3 border-dashed">
          <h3 className="grow font-bold text-gray-400">Delivery:</h3>
          <h3 className="font-bold">€{deliveryPrice}</h3>
        </div>
        <div className="flex my-3 border-t pt-3 border-dashed border-orange-500">
          <h3 className="grow font-bold text-gray-400">Total:</h3>
          <h3 className="font-bold">€{total}</h3>
        </div>
        </div>
        <input type="hidden" name="products" value={selectedProducts.join(",")} />
        <button type="submit" className="bg-orange-400 text-white w-full px-5 py-2 rounded-xl font-bold my-4 shadow-orange-200 shadow-lg">Pay </button>
        </form>
    </Layout>
  )
}

export default CheckoutPage