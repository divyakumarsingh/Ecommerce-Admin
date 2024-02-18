import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "models/Products";
import multiparty from "multiparty";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from 'fs';
import mime from 'mime-types';

const bucketName = 'ecommercenextjssite';

async function getRawBody(req) {
    const contentType = req.headers['content-type'];
    if (contentType?.includes('application/json')) {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        req.body = JSON.parse(Buffer.from(Buffer.concat(chunks)).toString('utf8'));
    }

    if (contentType?.includes('multipart/form-data')) {
        let form = new multiparty.Form();
        let { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err)
                resolve({ fields, files })
            });
        });
        req.files = files;
        req.body = {};
        Object.keys(fields).forEach((key) => { req.body[key] = fields[key][0] });
    }
}

const client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    },
    region: 'us-east-2'
});

export default async function (req, res) {
    const { method, query } = req;
    await mongooseConnect();
    await getRawBody(req);
    switch (method) {
        case 'GET': {
            if (query?.id) {
                res.json(await Product.findOne({ _id: query?.id }));
            } else {
                res.json(await Product.find());
            }
            break;
        }

        case 'POST': {
            const { name, description, price } = req.body;
            const files = req.files;
            const links = [];
            if (files?.image) {
                for (const file of files?.image) {
                    const newFilename = Date.now() + '.' + file.originalFilename.split('.').pop();
                    await client.send(new PutObjectCommand({
                        Bucket: bucketName,
                        Key: newFilename,
                        Body: fs.readFileSync(file.path),
                        ACL: 'public-read',
                        ContentType: mime.lookup(file.path),
                    }));
                    links.push(`https://${bucketName}.s3.amazonaws.com/${newFilename}`);
                }
            }
            const productDoc = await Product.create({ name, description, price, images: links });
            res.json(productDoc);
            break;
        }

        case 'PUT': {
            const files = req.files;
            const links = [];
            if (files?.image) {
                for (const file of files.image) {
                    const newFilename = Date.now() + '.' + file.originalFilename.split('.').pop();
                    await client.send(new PutObjectCommand({
                        Bucket: bucketName,
                        Key: newFilename,
                        Body: fs.readFileSync(file.path),
                        ACL: 'public-read',
                        ContentType: mime.lookup(file.path),
                    }));
                    links.push(`https://${bucketName}.s3.amazonaws.com/${newFilename}`);
                }
            }
            const { _id, name, description, price } = req.body;
            await Product.findOneAndUpdate({ _id }, {
                name,
                description,
                price,
                $push: {
                    images: {
                        $each: [...links]
                    }
                }
            });
            res.json(true);
            break;
        }

        case 'DELETE': {
            const { id } = req.query;
            const { images } = await Product.findOne({ _id: id });
            for (const file of images) {
                console.log({
                    Bucket: bucketName,
                    Key: file?.split('/')?.pop()
                });
                await client.send(new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: file?.split('/')?.pop()
                }));
            }
            await Product.deleteOne({ _id: id });
            res.json(true);
            break;
        }
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};