import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import User from "./Models/User.js"

const app = express();


const url = "mongodb+srv://melihnode:meliherpek1@cluster0.g1oel.mongodb.net/Trafik?authSource=admin&replicaSet=atlas-77ie5j-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 100000000 }));

app.use(cors());

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
},
    (err) => { if (err) { throw err } console.log("Mongoose ile bağlantı kuruldu.") })

app.get("/", (req, res) => {
    res.send("çalışıyor")
})

app.post("/adduser", async (req, res) => {
    const { name, mail, phoneNumber } = req.body;
    console.log(req.body)
    if (!name || !mail|| !phoneNumber ) {
        res.status(400);
        res.json({ ErrorType: 'Field', ErrorMessage: 'Bütün alanlar doldurulmalıdır.' })
    }
    else {
        const company = await User.findOne({ Mail: mail })
        if (company) {
            res.status(400);
            res.json({ ErrorType: 'MailExist', ErrorMessage: 'Bu E-Mail adresi daha önce kullanılmıştır. ' })
        }
        else {

            await User.create({
                Name: name,
                PhoneNumber: phoneNumber,
                Mail: mail,
            })
            res.json({ success: true });

        }
    }
})

app.get("/users", async (req, res) => {
    const companys = await User.find();
    res.json(companys);

})
app.listen(5000, () => console.log("5000 portunda çalışıyor"))
