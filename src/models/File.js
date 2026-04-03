import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    mimeType: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: Number,
        required: true,
        min: 0
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    checksum: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
});

const File = mongoose.model("File", fileSchema);

export default File;