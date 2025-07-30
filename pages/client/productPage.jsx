import { useEffect, useState } from "react"
import axios from "axios"
import ProductCard from "./ProductCard.jsx" 

export default function ProductPage(){
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (isLoading) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products").then((res) => {
                setProducts(res.data)
                setIsLoading(false)
            }).catch((error) => {
                console.error("Error fetching products:", error)
                setIsLoading(false)
            })
        }
    }, [isLoading])

    return (
        <div className="w-full h-full flex flex-wrap justify-center items-center gap-4 p-4">
            {
                products.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))
            }
        </div>
    )
}
