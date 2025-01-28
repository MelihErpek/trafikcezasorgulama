import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "./Models/User.js";
import Yaralanma from "./Models/Yaralanma.js";
import Vefat from "./Models/Vefat.js";
import MaddiHasar from "./Models/MaddiHasar.js";
import nodemailer from "nodemailer";
import google from "googleapis";

import keys from "./tth.json";
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
  res.send("working");
});

const client = new google.auth.JWT(keys.client_email, null, keys.private_key, [
  "https://www.googleapis.com/auth/spreadsheets",
]);

client.authorize(function (err, tokens) {
  if (err) {
    console.error("Error authorizing Google Sheets:", err);
    return;
  }
  console.log("Connected to Google Sheets API");
});

app.get("/addData", (req, res) => {
  const sheets = google.sheets({ version: "v4", auth: client });

  let data = [
    // Örnek veri
    ["John", "Doe", "johndoe@gmail.com"],
  ];

  const sheetId = "1FYRiPUEyWEfsNRim6ijJcDFNamtc6sQev1wvfuUqJ74"; // Google Sheets URL'inden alabilirsiniz
  sheets.spreadsheets.values.append(
    {
      spreadsheetId: sheetId,
      range: "A1", // Hangi hücreden başlayacağını belirtin
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: data,
      },
    },
    (err, result) => {
      if (err) {
        console.error("Error writing to Google Sheets:", err);
        res.status(500).send("Google Sheets Error");
      } else {
        res.status(200).send("Data added to Google Sheets");
      }
    }
  );
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
      to: "trafiktazminathesapla@gmail.com",
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
        res.json({ success: true });

      }
    });
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
      to: "trafiktazminathesapla@gmail.com",
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
        res.json({ success: true });

      }
    });
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
      to: "trafiktazminathesapla@gmail.com",
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
        res.json({ success: true });
      }
    });
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
      "Selam, bu bir Node.js mail gönderme testidir.222222222222" +
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
      "</p><p>Araç Marka2222222222222222: " +
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
      res.json({ success: true });
    }
  });
});
app.listen(5000, () => console.log("5000 portunda çalışıyor"));
