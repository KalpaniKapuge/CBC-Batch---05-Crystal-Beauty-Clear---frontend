import axios from "axios";
import toast from "react-hot-toast";

export default function AddProductPage(){
    const[productId,setProductId] = useState("");
    const[name,setName] = useState("");
    const[altNames,setAltNames] = useState("");
    const[images,setImages] = useState([]);
    const[labelledPrice,setLabelledPrice] = useState(0);   
    const[price,setPrice] = useState(0);
    const[stock,setStock] = useState("");
    const[description,setDescription] = useState(0);

    const navigate = useNavigate();

    async function AddProduct(){
        const token = localStorage.getItem("token");
        if(token==null){
            toast.error("You must be logged in to add a product");
            return;
        }
        if(images<=0){
            toast.error("Please upload at least one image");
            return;
        }
        const promissArray = [];

        for(let i=0;i<images.length;i++){
            promissArray[i] = mediaUpload(images[i]);
        }
        try{
            const imagesUrls = await Promise.all(promissArray);
            console.log(imagesUrls);

            const altNamesArray = altNames.split(",")

            const product = {
                productId: productId,
                name: name,
                altNames: altNamesArray,
                images: imagesUrls,
                labelledPrice: labelledPrice,
                price: price,
                stock: stock,
                description: description
            }
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/products`, product, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(() => {
                toast.success("Product added successfully");
                navigate("/admin/products");
            }).catch((err) => {
                toast.error(e.response.data.message)
        })
        }catch(err){
            toast.error("Error uploading images: " + err.message);
        }
    }
}

return(
    <div className="w-full h-full flex items-center justify-center ">

            <input 
            type="text"
            placeholder="Product ID"
            className="input input-borderd w-full max-w-xs"
            value={productId} 
            onChange={(e) => {
                setProductId(e.target.value);
            }}/>

            <input 
            type="text"
            placeholder="Name"
            className="input input-bordered w-full max-w-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <input 
            type="text"
            placeholder="Alt Names (comma separated)"
            className="input input-bordered w-full max-w-xs"
            value={altNames}
            onChange={(e) => setAltNames(e.target.value)}
            />

            <textarea 
            placeholder="Description"
            className="textarea textarea-bordered w-full max-w-xs"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />

            <input 
            type="file"
            placeholder="Upload Images"
            multiple
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={(e) => setImages(e.target.files)}
            />

            <input 
            type="number"
            placeholder="Labelled Price"
            className="input input-bordered w-full max-w-xs"
            value={labelledPrice}
            onChange={(e) => setLabelledPrice(e.target.value)}
            />

            <input 
            type="number"
            placeholder="Price"
            className="input input-bordered w-full max-w-xs"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />

            <input 
            type="number"
            placeholder="Stock"
            className="input input-bordered w-full max-w-xs"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            />

        <div className="w-full flex justify-center mt-4 items-center flex-row">
            <Link 
                to = "/admin/products"
                className="btn btn-secondary mr-4">
            Cancel
            </Link>
            <button className="bg-pink-500 text-white font-bold py-2 px-4 rounded" 
            onClick={AddProduct}>
                Add Product
            </button>

        </div>

    </div>
)