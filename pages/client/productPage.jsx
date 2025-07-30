import { useEffect, useState } from "react"

export default function ProductPage(){
    const [products,setProducts] = useState([])
    const [isLoading,setIsLoading] = useState(true)

    useEffect(
        () => {
            if(isLoading){
                axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products").then(
                    (res) => {
                        setProducts(res.data)
                        setIsLoading(false)
                    }
                )
            }
        },[isLoading]
    )

    return(
        <div className="w-full h-full flex flex-wrap jsutify-center items-center">
            {
                products.map((product) => {
                    return(
                        <ProductCard key={product.productId} product={product}/>
                    )
                })
            }
        </div>
    )
    
}