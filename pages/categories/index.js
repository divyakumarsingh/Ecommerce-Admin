import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EditIcon, TrashIcon } from '@/utils/icons';

export default function Categories() {
    const [parentCategory, setParentCategory] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    async function saveCategory(e) {
        e.preventDefault();
        await axios.post('/api/categories', { categoryName, parentCategory });
        setCategoryName('');
        fetchCategories();
    }

    function fetchCategories() {
        axios('/api/categories').then((res) => {
            setCategories(res.data);
        })
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    return <Layout>
        <h1>Categories</h1>
        <form onSubmit={saveCategory}>
            <label>New category name</label>
            <div className="flex gap-2">
                <input placeholder="Category" className="mb-0" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                <select className="mb-0" value={parentCategory} onChange={(event) => setParentCategory(event.target.value)}>
                    <option>No parent category</option>
                    {
                        categories.map((category) => <option value={category._id}>{category.name}</option>)
                    }
                </select>
                <button type="submit" className="btn-primary">Save</button>
            </div>
        </form>
        <table className="table-auto table-primary">
            <thead>
                <tr>
                    <th>Category Name</th>
                    <th>Parent Category</th>
                    <th></th>
                </tr>
            </thead>
            <tbody >
                {categories.map((category) => (
                    <tr key={category._id}>
                        <td>{category.name}</td>
                        <td>{category?.parent?.name}</td>
                        <td>
                            <button className="btn-primary mr-1">{EditIcon} Edit</button>
                            <button className="btn-primary">{TrashIcon} Delete</button>
                        </td>
                    </tr>))
                }
                {
                    categories.length === 0 ? <tr>
                        <td colSpan={2}>No categories added</td>
                    </tr> : null
                }
            </tbody>
        </table>
    </Layout>
}