
import Image from "next/image"
import { useEffect } from "react";
import { useContext, useState, useCallback } from "react"
import { ProductsContext } from "./ProductsContext"

const Product = ({_id, name, price, description, picture}) => {
  const {setSelectedProducts}  = useContext(ProductsContext);
  const [buttonColor, setButtonColor] = useState("bg-orange-400");
  const [buttonText, setButtonText] = useState("Add to basket")

  const changeButtonColor = (useCallback(() => {
      setButtonColor("bg-green-300");
      setButtonText("Added")
}));

  useEffect(() => {
    const timer = setTimeout(()=> {
      setButtonColor("bg-orange-400")
      setButtonText("Add to basket")
    }, 1000)
    return() => clearTimeout(timer)
  }, [changeButtonColor])


  function addProduct() {
    setSelectedProducts(prev => [...prev, _id]);
  }
  
  return (
    <div className="w-64">
    <div className='bg-cyan-50 p-5 rounded-xl'>
    <img className='' src={picture} alt={name} />
    </div>
    <div className='mt-2'>
      <h3 className='font-bold text-lg'>{name}</h3>
    </div>
    <p className='text-sm mt-2 leading-4 text-gray-500'>{description}</p>
    <div className='flex mt-1'>
      <div className='text-2xl font-bold grow'>€{price}</div>
      <button onClick={() => {addProduct(); changeButtonColor()}}  className={`${buttonColor}  text-white w-32  py-1 px-3 rounded-xl`}>{buttonText}</button>
    </div>
  </div>
  )
}

export default Product