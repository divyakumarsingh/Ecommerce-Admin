import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EditIcon, TrashIcon } from '@/utils/icons'

export default function Products() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios('/api/products').then((res) => {
            setProducts(res.data);
        })
    }, []);

    return <Layout>
        <Link className="btn-primary" href={'/products/new'}>Add new product</Link>
        <table className="table-auto table-primary">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>
                            <Link className="btn-primary" href={'/products/edit/' + product._id}>{EditIcon} Edit</Link>
                            <Link className="btn-primary" href={'/products/delete/' + product._id}>{TrashIcon} Delete</Link>
                        </td>
                    </tr>))
                }
            </tbody>
        </table>
    </Layout>
}