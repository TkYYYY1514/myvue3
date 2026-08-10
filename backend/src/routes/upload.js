// src/routes/upload.js

import express from 'express'
import multer from 'multer'  //文件上传中间件
import path from 'path'   //路径处理
import fs from 'fs'  //文件管理
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const router = express.Router()

//  配置 multer 存储
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(_dirname, '../../uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const uniqueName = `image_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`
        cb(null, uniqueName)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})


//POST  /api/upload 上传图片

router.post('/upload',upload.single('image'),(req,res) => {
    if(!req.file){
        return res.status(400).json({
            code:400,
            message:'请选择图片'
        })
    }

    // console.log('📁 实际保存路径:', req.file.path)

    const imageUrl = `/uploads/${req.file.filename}`
    console.log('图片上传成功：',imageUrl)

    res.json({
        code:0,
        data:{
            url:imageUrl,
            filename:req.file.filename
        }
    })
})


export default router