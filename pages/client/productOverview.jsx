import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


export default function ProductOverviewPage(){
    const params = useParams()
    const productId = params.id
    const [status,setStatus] = useState("loading")//loading,success/error
    const [product,setProdcut] = useState(null)

    useEffect(
        () => {
            axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products/"+productId).then(
                (response) => {
                    console,log(response.data)
                    setProduct(response.data)
                    setStatus("Success")
                }
            ).catch(
                (error) => {
                    console.log(error)
                    setStatus("error")
                    toast.error("Error fetching product details")
                }
            )
        },[]
    )
    return(
        
            <>
            {status == "success" && (
                <div className="w-full h-full flex">
                <div className="w-[50%] h-full flex justify-center items-center ">
                    <ImageSlider images={product.images}/>
                </div>
                <div className="h-full w-[50%]">
                     This is overview page for product {JSON.stringify(product)}
                </div>

            </div>
            )}

            {
                status == "loading" && <Loading/>
            }
            </>
          
    )
}