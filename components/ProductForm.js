import { UploadIcom } from "@/utils/icons";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    _id, name: existingName, description: existingDescription, price: existingPrice, images: existingImages
}) {
    const [name, setName] = useState(existingName || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages?.map((image) => ({ path: image, file: null })) || []);
    const router = useRouter();
    const saveProduct = async (event) => {
        event.preventDefault();
        let formdata = new FormData();
        const data = { _id, name, description, price };
        Object.keys(data).map((key) => { if (data[key]) { formdata.append(key, data[key]) } });
        images?.forEach((image) => formdata.append(`image`, image?.file));
        if (_id) {
            await axios.put('/api/products', formdata);
        } else {
            await axios.post('/api/products', formdata);
        }
        router.push('/products');
    }

    const onFileSelected = (event) => {
        const files = event.target?.files;
        if (files?.length) {
            setImages([...images, { path: URL.createObjectURL(files[0]), file: files[0] }]);
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input placeholder="Product name" value={name} onChange={(event) => setName(event.target.value)} />
            <label>Photos</label>
            <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                    {
                        images?.map((image, index) => (
                            <img key={index} className="h-28 w-28 rounded-lg bg-gray-300 flex justify-center items-center" src={image?.path} />
                        ))
                    }
                    <label className="h-28 w-28 rounded-lg bg-gray-300 flex justify-center items-center">
                        {UploadIcom}
                        <div>Upload</div>
                        <input type="file" className="hidden" onChange={onFileSelected} />
                    </label>
                </div>
                {
                    !images?.length && (<div>No image added for this product</div>)
                }
            </div>
            <label>Description</label>
            <textarea placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
            <label>Price</label>
            <input placeholder="Price" value={price} onChange={(event) => setPrice(event.target.value)} />
            <div className="flex gap-4">
                <button type="submit" className="btn-primary">Save</button>
                <button className="btn-primary" onClick={router.back} >Back</button>
            </div>
        </form>
    )
}