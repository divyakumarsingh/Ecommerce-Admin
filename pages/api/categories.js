import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "models/Categories";

export default async function (req, res) {
    const { method, query } = req;
    await mongooseConnect();
    switch (method) {
        case 'GET': {
            if (query?.id) {
                res.json(await Category.findOne({ _id: query?.id }));
            } else {
                res.json(await Category.find().populate('parent'));
            }
            break;
        }

        case 'POST': {
            const { categoryName, parentCategory } = req.body;
            const categoryDoc = await Category.create({ name: categoryName, parent: parentCategory || undefined });
            res.json(categoryDoc);
            break;
        }
    }
}