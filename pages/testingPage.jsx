import {useState} from "react";
import mediaUpload from "../utils/mediaUpload.jsx"

export default function TestPage(){
  const [inage,setImage] = useState(null);

  function fileUpload(){
    mediaUpload(inage).then(
      (url) => {
        console.log("Image uploaded successfully:", url);
      }
    ).catch(
      (error) => {
        console.error("Error uploading image:", error);
      }
    )
  }
}

return (
  <div className="w-full h-screen flex items-center justify-center flex-col">
    <input type="file" className="file-input file-input-bordered w-full max-w-xs"  
        onChange={
          (e) => {
            setImage(e.target.files[0]);
          }
        }/>
    <button className="btn btn-primary mt-4" onClick={fileUpload}>Upload Image</button>

  </div>
)