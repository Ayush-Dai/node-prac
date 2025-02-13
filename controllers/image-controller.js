const Image = require('../Models/Image');
const { uploadToCloudinary } = require('../helpers/CloudinaryHelper');
const fs = require('fs');
const cloudinary = require('../Config/Cloudinary');
const uploadImageController = async (req, res) => {
    try {
        // chedck if file is missing in req object
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload an image'
            })
        }
        //upload to cloudinary
        const { url, publicId } = await uploadToCloudinary(req.file.path);

        //strore the image url and public id along with the uploaded user id in database
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await newlyUploadedImage.save();

        //delete the file from local storage
        fs.unlinkSync(req.file.path); //doesn't store in localstorage

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            Image: newlyUploadedImage
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: ' Something went wrong pleaes try again'
        })
    }
}


//fetch images  controller
const fetchImagesController = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totlaImages = await Image.countDocuments();
        const totalPages = Math.ceil(totlaImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
        if (images) {
            res.status(200).json({
                currentPage: page,
                totalPages: totalPages,
                totalImages: totlaImages,
                success: true,
                data: images,
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: ' Something went wrong pleaes try again'
        })
    }
}

//delete the images
const deleteImageController = async (req, res) => {
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            })
        }

        //check if this image is uploaded by the current user who is trying to delete the user
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image'
            })
        }

        //delete this image first form the cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        //delete this image form mongodb database
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: ' Something went wrong pleaes try again'
        })
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}