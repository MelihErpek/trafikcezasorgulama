import mongoose from 'mongoose'
const Schema = mongoose.Schema
const maddiHasarSchema = new Schema({
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
    cinsiyet: {
        type: String
    },
    
    telno: {
        type: String
    },
    il: {
        type: String
    },
    name: {
        type: String
    }
    
})
export default mongoose.model('MaddiHasar', maddiHasarSchema)
