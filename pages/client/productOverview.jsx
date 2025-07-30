import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import ImageSlider from "../components/imageSlider.jsx"; // adjust path as needed
import Loading from "../components/loading.jsx"; // adjust path as needed
import { addToCart, getCart } from "../utils/cart.jsx"; // make sure these are imported correctly

export default function ProductOverviewPage() {
  const navigate = useNavigate();
  const params = useParams();
  const productId = params.id;

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
        setStatus("success");
      })
      .catch((error) => {
        console.log(error);
        setStatus("error");
        toast.error("Error fetching product details");
      });
  }, [productId]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "error") {
    return (
      <div className="w-full h-full flex justify-center items-center text-red-500 text-lg">
        Failed to load product details.
      </div>
    );
  }

  return (
    <>
      {status === "success" && product && (
        <div className="w-full h-full flex flex-col md:flex-row p-4">
          <div className="md:w-1/2 w-full h-full flex justify-center items-center">
            <ImageSlider images={product.images} />
          </div>
          <div className="md:w-1/2 w-full h-full flex flex-col justify-center items-center px-6">
            <h1 className="text-4xl text-secondary font-semibold text-center">
              {product.name}
              {product.altNames &&
                product.altNames.map((altName, index) => (
                  <span key={index} className="text-4xl text-gray-600 mx-2">
                    | {altName}
                  </span>
                ))}
            </h1>
            <h2 className="text-md text-gray-600 font-semibold mt-2">
              Product ID: {product.productId}
            </h2>
            <p className="text-md text-gray-600 font-semibold my-4 text-center">
              {product.description}
            </p>
            <div className="text-center my-4">
              {product.labelledPrice > product.price ? (
                <>
                  <span className="text-2xl text-gray-500 line-through mx-2">
                    ${product.labelledPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-accent mx-2">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-accent">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  console.log("old cart");
                  console.log(getCart());

                  addToCart(product, 1);

                  console.log("new cart");
                  console.log(getCart());
                  toast.success("Added to cart");
                }}
                className="w-[200px] bg-accent text-white py-2 rounded-2xl hover:bg-accent/80 transition-all duration-300"
              >
                Add To Cart
              </button>
              <button className="w-[200px] bg-accent text-white py-2 rounded-2xl hover:bg-accent/80 transition-all duration-300"
              onClick={
                () => {
                  navigate("/cheackout",{
                    state:{
                      cart:[
                        {
                          productId:product.productId,
                          name:product.name,
                          image:product.images[0],
                          price:product.price,
                          labelledPrice:product.labelledPrice,
                          qty:1
                        }
                      ]
                    }
                  })
                }
              }>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
