import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const { productId } = router.query;

    useEffect(() => {
        if (!productId?.[0]) {
            return;
        }

        axios.get('/api/products?id=' + productId[0]).then((response) => {
            setProductInfo(response.data)
        });
    }, [productId])

    return <Layout>
        <h1>Edit Product</h1>
        {
            productInfo && <ProductForm {...productInfo} />
        }
    </Layout>
}