import mongoose from 'mongoose'
const Schema = mongoose.Schema
const vefatSchema = new Schema({
    kazaturu: {
        type: String
    },
    kazatarihi: {
        type: Date
    },
    kusurdurumu: {
        type: String
    },
    dogumyili: {
        type: Number
    },
    dogumyiliHakSahibi: {
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
    yakinlik: {
        type: String
    },
})
export default mongoose.model('Vefat', vefatSchema)
