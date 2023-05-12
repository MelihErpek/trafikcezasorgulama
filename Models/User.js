import mongoose from 'mongoose'
const Schema = mongoose.Schema
const userSchema = new Schema({
    Name: {
        type: String
    },
    PhoneNumber: {
        type: String
    },
    Mail: {
        type: String
    }
})
export default mongoose.model('User', userSchema)