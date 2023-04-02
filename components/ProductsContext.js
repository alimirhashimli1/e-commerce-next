import React from 'react';
import { useState } from 'react';
import { createContext } from 'react';
import useLocalStorageState from 'use-local-storage-state';

export const ProductsContext = createContext({})

const ProductsContextProvider = ({children}) => {
    const [selectedProducts, setSelectedProducts] = useLocalStorageState("cart", {defaultValue: []});


  return (
    <ProductsContext.Provider value={{selectedProducts, setSelectedProducts}}>{children}</ProductsContext.Provider>
  )
}

export default ProductsContextProvider