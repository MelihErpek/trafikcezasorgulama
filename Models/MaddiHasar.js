import mongoose from 'mongoose'
const Schema = mongoose.Schema
const maddiHasarSchema = new Schema({
    kazatarihi: {
        type: Date
    },
    kusurdurumu: {
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
    },
    aracMarka: {
        type: String
    },
    model: {
        type: String
    },
    aciklama: {
        type: String
    }

    
})
export default mongoose.model('MaddiHasar', maddiHasarSchema)
