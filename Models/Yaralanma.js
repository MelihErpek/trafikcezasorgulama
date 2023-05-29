import mongoose from 'mongoose'
const Schema = mongoose.Schema
const yaralanmaSchema = new Schema({
    kazaturu: {
        type: String
    },
    kazatarihi: {
        type: Date
    },
    kusurdurumu: {
        type: String
    },
    maluliyetdurumu: {
        type: String
    },
    dogumyili: {
        type: Number
    },
    cinsiyet: {
        type: String
    },
    gelir: {
        type: Number
    },
    telno: {
        type: String
    },
    il: {
        type: String
    },
    name: {
        type: String
    },
})
export default mongoose.model('Yaralanma', yaralanmaSchema)
