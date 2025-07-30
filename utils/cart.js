export function getCart(){
    let cart = localStorage.getItem("cart")
    cart = JSON.parse(cart);

    if(cart==null){
        cart = []
        localStorage.setItem("cart",JSON.stringify(cart))
    }
    return cart
}