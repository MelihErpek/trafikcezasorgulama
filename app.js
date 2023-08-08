import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "./Models/User.js";
import Yaralanma from "./Models/Yaralanma.js";
import Vefat from "./Models/Vefat.js";
import MaddiHasar from "./Models/MaddiHasar.js";
import nodemailer from "nodemailer";
const app = express();

const url =
  "mongodb+srv://melihnode:meliherpek1@cluster0.g1oel.mongodb.net/Trafik?authSource=admin&replicaSet=atlas-77ie5j-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true";
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000000,
  })
);

app.use(cors());

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      throw err;
    }
    console.log("Mongoose ile bağlantı kuruldu.");
  }
);

app.get("/", (req, res) => {
  res.send("çalışıyor");
});

app.post("/adduser", async (req, res) => {
  const { name, mail, phoneNumber } = req.body;
  console.log(req.body);
  if (!name || !mail || !phoneNumber) {
    res.status(400);
    res.json({
      ErrorType: "Field",
      ErrorMessage: "Bütün alanlar doldurulmalıdır.",
    });
  } else {
    const company = await User.findOne({ Mail: mail });
    if (company) {
      res.status(400);
      res.json({
        ErrorType: "MailExist",
        ErrorMessage: "Bu E-Mail adresi daha önce kullanılmıştır. ",
      });
    } else {
      await User.create({
        Name: name,
        PhoneNumber: phoneNumber,
        Mail: mail,
      });
      res.json({ success: true });
    }
  }
});
app.post("/yaralanma", async (req, res) => {
  const {
    kazaturu,
    kazatarihi,
    kusurdurumu,
    maluliyetdurumu,
    dogumyili,
    cinsiyet,
    gelir,
    telno,
    il,
    name,
  } = req.body;
  if (
    !kazaturu ||
    !kazatarihi ||
    !kusurdurumu ||
    !maluliyetdurumu ||
    !dogumyili ||
    !cinsiyet ||
    !gelir ||
    !telno ||
    !il ||
    !name
  ) {
    res.status(400);
    res.json({
      ErrorType: "Field",
      ErrorMessage: "Bütün alanlar doldurulmalıdır.",
    });
  } else {
    await Yaralanma.create({
      kazaturu,
      kazatarihi,
      kusurdurumu,
      maluliyetdurumu,
      dogumyili,
      cinsiyet,
      gelir,
      telno,
      il,
      name,
    });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
      port: 465, // Port for SMTP (usually 465)
      secure: true, // Usually true if connecting to port 465
      auth: {
        user: "meliherpek26@gmail.com",
        pass: "xjiwwmqazompwlwo",
      },
    });
    const mailOptions = {
      from: "meliherpek26@gmail.com",
      to: "info@trafiktazminathesapla.com",
      subject: "trafiktazminathesapla.com Yeni Kayıt Geldi",
      text: "Yeni kaydın bilgileri aşağıdadır.",
      html:
        "<p>Form Türü: Yaralanma</p>" +
        "<p>Kaza Türü: " +
        kazaturu +
        "</p><p>Kaza Tarihi: " +
        kazatarihi +
        "</p><p>Kusur Durumu: " +
        kusurdurumu +
        "</p><p>Maluliyet Durumu: " +
        maluliyetdurumu +
        "</p><p>Doğum Yılı: " +
        dogumyili +
        "</p><p>Cinsiyet: " +
        cinsiyet +
        "</p><p>Gelir: " +
        gelir +
        "</p><p>Telefon: " +
        telno +
        "</p><p>İl: " +
        il +
        "</p><p>Ad Soyad: " +
        name,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Hata oluştu: ", error);
      } else {
        console.log("E-posta başarıyla gönderildi: " + info.response);
      }
    });
    res.json({ success: true });
  }
});
app.post("/vefat", async (req, res) => {
  const {
    kazaturu,
    kazatarihi,
    kusurdurumu,
    dogumyili,
    cinsiyet,
    gelir,
    yakinlik,
    telno,
    dogumyiliHakSahibi,
    il,
    name,
  } = req.body;
  if (
    !kazaturu ||
    !kazatarihi ||
    !kusurdurumu ||
    !dogumyili ||
    !cinsiyet ||
    !gelir ||
    !telno ||
    !il ||
    !name ||
    !yakinlik ||
    !dogumyiliHakSahibi
  ) {
    res.status(400);
    res.json({
      ErrorType: "Field",
      ErrorMessage: "Bütün alanlar doldurulmalıdır.",
    });
  } else {
    await Vefat.create({
      kazaturu,
      kazatarihi,
      kusurdurumu,
      dogumyili,
      cinsiyet,
      gelir,
      yakinlik,
      telno,
      dogumyiliHakSahibi,
      il,
      name,
    });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
      port: 465, // Port for SMTP (usually 465)
      secure: true, // Usually true if connecting to port 465
      auth: {
        user: "meliherpek26@gmail.com",
        pass: "xjiwwmqazompwlwo",
      },
    });
    const mailOptions = {
      from: "meliherpek26@gmail.com",
      to: "info@trafiktazminathesapla.com",
      subject: "trafiktazminathesapla.com Yeni Kayıt Geldi",
      text: "Yeni kaydın bilgileri aşağıdadır.",
      html:
        "<p>Form Türü: Vefat</p>" +
        "<p>Kaza Türü: " +
        kazaturu +
        "</p><p>Kaza Tarihi: " +
        kazatarihi +
        "</p><p>Kusur Durumu: " +
        kusurdurumu +
        "</p><p>Doğum Yılı: " +
        dogumyili +
        "</p><p>Cinsiyet: " +
        cinsiyet +
        "</p><p>Gelir: " +
        gelir +
        "</p><p>Yakınlık: " +
        yakinlik +
        "</p><p>Telefon: " +
        telno +
        "</p><p>Hak Sahibi Doğum Yılı: " +
        dogumyiliHakSahibi +
        "</p><p>İl: " +
        il +
        "</p><p>Ad Soyad: " +
        name,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Hata oluştu: ", error);
      } else {
        console.log("E-posta başarıyla gönderildi: " + info.response);
      }
    });
    res.json({ success: true });
  }
});
app.post("/maddihasar", async (req, res) => {
  const { kazatarihi, kusurdurumu, telno, name, aracMarka, model, aciklama } =
    req.body;
  if (
    !kazatarihi ||
    !kusurdurumu ||
    !telno ||
    !name ||
    !aracMarka ||
    !model ||
    !aciklama
  ) {
    res.status(400);
    res.json({
      ErrorType: "Field",
      ErrorMessage: "Bütün alanlar doldurulmalıdır.",
    });
  } else {
    await MaddiHasar.create({
      kazatarihi,
      kusurdurumu,
      telno,
      name,
      aracMarka,
      model,
      aciklama,
    });
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
      port: 465, // Port for SMTP (usually 465)
      secure: true, // Usually true if connecting to port 465
      auth: {
        user: "meliherpek26@gmail.com",
        pass: "xjiwwmqazompwlwo",
      },
    });
    const mailOptions = {
      from: "meliherpek26@gmail.com",
      to: "info@trafiktazminathesapla.com",
      subject: "trafiktazminathesapla.com Yeni Kayıt Geldi",
      text: "Yeni kaydın bilgileri aşağıdadır.",
      html:
        "<p>Form Türü: Maddi Hasar</p>" +
        "<p>Kaza Tarihi: " +
        kazatarihi +
        "</p><p>Kusur Durumu: " +
        kusurdurumu +
        "</p><p>Telefon: " +
        telno +
        "</p><p>Ad Soyad: " +
        name +
        "</p><p>Araç Marka: " +
        aracMarka +
        "</p><p>Model: " +
        model +
        "</p><p>Açıklama: " +
        aciklama +
        "</p>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Hata oluştu: ", error);
      } else {
        console.log("E-posta başarıyla gönderildi: " + info.response);
      }
    });
    res.json({ success: true });
  }
});

app.get("/yaralanmaget", async (req, res) => {
  const yaralanma = await Yaralanma.find();
  res.json(yaralanma);
});
app.get("/vefatget", async (req, res) => {
  const vefat = await Vefat.find();
  res.json(vefat);
});
app.get("/maddihasarget", async (req, res) => {
  const maddihasar = await MaddiHasar.find();
  res.json(maddihasar);
});

app.get("/mail", async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
    port: 465, // Port for SMTP (usually 465)
    secure: true, // Usually true if connecting to port 465
    auth: {
      user: "meliherpek26@gmail.com",
      pass: "xjiwwmqazompwlwo",
    },
  });
  const mailOptions = {
    from: "meliherpek26@gmail.com",
    to: "info@trafiktazminathesapla.com",
    subject: "Node.js Mailer Test",
    text:
      "Selam, bu bir Node.js mail gönderme testidir." +
      "Mail:asd@gmail.com" +
      "İsim:Melih",
    html:
      "<p>Kaza Tarihi: " +
      "kazatarihi" +
      "</p><p>Kusur Durumu: " +
      "kusurdurumu" +
      "</p><p>Telefon: " +
      "telno" +
      "</p><p>Ad Soyad: " +
      "name" +
      "</p><p>Araç Marka: " +
      "aracMarka" +
      "</p><p>Model: " +
      "Model" +
      "</p><p>Açıklama: " +
      "aciklama" +
      "</p>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Hata oluştu: ", error);
    } else {
      console.log("E-posta başarıyla gönderildi: " + info.response);
    }
  });
});
app.listen(5000, () => console.log("5000 portunda çalışıyor"));
