import { useState } from "react"
import { BiTrash } from "react-icons/bi"

export default function CartPage(){
    const [cart,setCart] = useState(getCart())
    return(
        <div className="w-full h-full flex flex-col items-center pt-4 relative">
            {
                cart.map(
                    (item) => {
                        return(
                            <div key={item.productID} className="w-[600px] h-[100px] rounded-tl-3xl rounded-bl-3xl my-4 bg-primary shadow-2xl flex flex-row relative justify-center items-center">
                                <img src={item.image} className="w-[100px] h-[100px] object-cover items-center pl-4"/>
                                <div className="w-[250px] h-full flex flex-col justify-center items-center pl-4">
                                    <h1 className="text-2xl text-secondary font-semibold">{item.name}</h1>
                                    <h1 className="text-md text-gray-600 font-semibold">{item.productID}</h1>
                                    {
                                        item.labelledPrice > item.price?
                                        <div>
                                            <span className="text-md mx-1 text-gray-500 line-through">{item.labelledPrice.toFixed(2)}</span>
                                        </div>:
                                         <span className="text-md mx-1 font-bold text-accent">{item.price.toFixed(2)}</span>
                                    }

                                </div>
                                    <div className="h-full max-w-[100px] w-[100px] flex flex-row justify-evenly items-center">
                                        <button className="text-white font-bold rounded-xl hover:bg-secondary p-2 text-xl cursor-pointer aspect-square bg-accent"><BiMinus/></button>
                                        <h1 className="text-xl text-secondary font-semibold h-full flex items-center">{item.qty}</h1>
                                        <button className="text-white font-bold rounded-xl hover:bg-secondary p-2 text-xl cursor-pointer aspect-square bg-accent"><BiPlus/></button>

                                    </div>
                                    {/*total*/}
                                    <div className="h-full w-[200px] flex flex-col justify-center items-end pr-4">
                                    <h1 className="text-2xl text-secondary font-semibold">Rs.{item.price*item.qty}.toFixed(2)</h1>
                                    </div>
                                    <button className="absolute hover:bg-red-600 hover:text-white rounded-full p-2 right-[-35px] text-red-600 cursor-pointer">
                                        <BiTrash/>
                                    </button>
                            </div>
                        )
                    }
                )
            }
        </div>
    )
}