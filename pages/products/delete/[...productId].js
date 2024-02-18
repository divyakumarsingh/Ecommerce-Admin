import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const { productId } = router.query;

    useEffect(() => {
        if (!productId) {
            return;
        }

        axios.get('/api/products?id=' + productId).then((response) => {
            setProductInfo(response.data)
        });
    }, [productId]);

    const deleteProduct = async (event) => {
        event.preventDefault();
        await axios.delete(`/api/products?id=${productId}`);
        router.back();
    }

    return <Layout>
        <div className="flex flex-col items-center">
            <h1>Do you really want to delete "{productInfo?.name}"?</h1>
            <div>
                <div className="flex gap-2">
                    <button className="btn-danger" onClick={deleteProduct}>Yes</button>
                    <button className="btn-default" onClick={router.back}>No</button>
                </div>
            </div>
        </div>
    </Layout>
}