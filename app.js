import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import User from "./Models/User.js";
import Yaralanma from "./Models/Yaralanma.js";
import Vefat from "./Models/Vefat.js";
import MaddiHasar from "./Models/MaddiHasar.js";
import nodemailer from "nodemailer";
import { google } from "googleapis";

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
const client = new google.auth.JWT("trafik-tazminat@trafiktazminat.iam.gserviceaccount.com", null, "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDK+uMl+mE9CA8v\nBfjaZXl/JLriQjz7p9VrlhLCY6vcjpQyOu1HI11CLEGdf61630+VJaW0xRwTHC0S\nWbJ3Luy6w8LX7t4al5T7AZNVwPeK1HnkYBw+EHkdy6oCCoXAXH2rUExyBBxJb25N\n6PANmqIClwgPLe48YucNlW/YIuFpoIT4t2knSWrchKIorXRuymVShtS6xPew2je6\n9Mtp49FLQGm83fo5RBw7ZuaNP81Nvz/LKQxfaAc78VRl8OuTC3b8Jbu+6FPG1CCo\n43Q0dw7y0Snf3sh48zQdXc8X1T5xHjv8QGCHha41gy320OAAwPC6OeMLgiXglpXy\nDQPO6SjNAgMBAAECggEAGz2Q2vGvd5Sbjwy+4TZxl//aqc9IZmCXioT9NwPP1n13\nA4e3fM7Q7vbIBoZSRpVuFX7ULn6ufh0PqnEJu6d7QzRO85I90fVKW+ZR+tX3ErVh\nt2WznJuy2W4R/oyhdxeikOlpnPqSvkM7Wy7Z+oVoXS8eOIVKPeXrCr5loGzL8hQI\n1z6arEeGTTvG/PGHevN2+d8xE1Vk2zsKaRqXMFfssf4CrtlpXwQMOiFWlRe/O5ei\nAFiqmvst8Fp9dhmT5+YsYoVQI9LGvD62kqXwlhSmjZ/AsKhFvmkZM1Leh22x10J9\nAe3GsbvUOo1MkovFufth71heScrMC1nm05LMFc7bSQKBgQDd1mqfqlpnIdan5vXZ\nG1BgHKD5cm4Up8dasXQ3IyN/Ho2trVVI0GuRnFxSygRJtji4JDwANj1fvbNdlgYH\nK2oSUz3hAJBZKCtLj4KlyvzY7ko14MvumLhFX/zMCnNwxM5g9tqtFAc2buZyZp2K\nrsS8qoiujjxrSKG3h50C78JqRQKBgQDqPQsS8SSzCcRrarTDh7mBBw95KdYoROmh\nOeCfXi+hf/V+KYm4ScFM0MDm84wSWZkJ+kDaqSPf7+uGZljBRhcMZyIt8Np2Vjqr\nTloRjZldoY5FhPU5Mdtmw191gWFFivI4E83XRD0eCUtxCHOmpruyv55L4Q3+lROX\ny+tUsDuw6QKBgCBRuL8CRqF34Jodn/u9avxVr24oKbmAqB6ic9gEmotOnD2NXzt4\ngfN44Ep/fBhxH9pUDRnKzS5BqPwde0tYG+AHmKBLQLx8ibI8ekBFTokcTluDILLm\nNRKGZYIkk6T+R0MBM+K7ZEGd7p0ELjeiNq91+OvVdR/8OPNQIqPm4mAxAoGABWAh\nQO4HyZQPzedE/re+qhdfY4hyQbpTIkARx5aBwVMObzbE0lXe+cRQqPwt2r3zpSb5\nFguLpzf6T7tJjiXtoXs8bZF5cf3ImuXRa1W0j1GF0lKazhU208ToC+pMMSxfIqpR\nrv8B6A6OjKmE/e4VoKSFHXisuYrySCmF3QuuUwECgYBW7XLI4qbWyNTDSMv3g0vJ\nh6YsbNA2VZKXmpabzOGIEaN/B5wpsWW5Pyd1EacTCFjMdYAd2ksva/0sT2hd0we8\nJ0INp9xaryMTHUzwhz90N3giBCDe2xSrrUicFf/iYg22EqFV8bOuel7Ya9Azcpvb\nqV7fMbyyAAh5Nx48hhTd1Q==\n-----END PRIVATE KEY-----\n", [
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
  const range = "Yaralanmalı" + "!A2";

  const sheetId = "1ler1J9DEjfmiAvaFihzI7_vqHH-5qiCLZykC-azKkGE"; // Google Sheets URL'inden alabilirsiniz
  sheets.spreadsheets.values.append(
    {
      spreadsheetId: sheetId,
      range: range, // Hangi hücreden başlayacağını belirtin
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
    const sheets = google.sheets({ version: "v4", auth: client });
    const now = new Date(Date.now());

    // Türkiye'nin saat diliminde tarihi ve saati al
    const turkiyeZamani = now.toLocaleString("tr-TR", {
      timeZone: "Europe/Istanbul",
    });
    let data = [
      // Örnek veri
      [
        kazatarihi,
        kusurdurumu,
        maluliyetdurumu,
        dogumyili,
        cinsiyet,
        gelir,
        name,
        telno,
        il,
        turkiyeZamani,
      ],
    ];
    const range = "Yaralanmalı" + "!A2";

    const sheetId = "1ler1J9DEjfmiAvaFihzI7_vqHH-5qiCLZykC-azKkGE"; // Google Sheets URL'inden alabilirsiniz
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: sheetId,
        range: range, // Hangi hücreden başlayacağını belirtin
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
        }
      }
    );
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
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
    //   port: 465, // Port for SMTP (usually 465)
    //   secure: true, // Usually true if connecting to port 465
    //   auth: {
    //     user: "meliherpek26@gmail.com",
    //     pass: "xjiwwmqazompwlwo",
    //   },
    // });
    // const mailOptions = {
    //   from: "meliherpek26@gmail.com",
    //   to: "info@trafiktazminathesapla.com",
    //   subject: "trafiktazminathesapla.com Yeni Kayıt Geldi",
    //   text: "Yeni kaydın bilgileri aşağıdadır.",
    //   html:
    //     "<p>Form Türü: Yaralanma</p>" +
    //     "<p>Kaza Türü: " +
    //     kazaturu +
    //     "</p><p>Kaza Tarihi: " +
    //     kazatarihi +
    //     "</p><p>Kusur Durumu: " +
    //     kusurdurumu +
    //     "</p><p>Maluliyet Durumu: " +
    //     maluliyetdurumu +
    //     "</p><p>Doğum Yılı: " +
    //     dogumyili +
    //     "</p><p>Cinsiyet: " +
    //     cinsiyet +
    //     "</p><p>Gelir: " +
    //     gelir +
    //     "</p><p>Telefon: " +
    //     telno +
    //     "</p><p>İl: " +
    //     il +
    //     "</p><p>Ad Soyad: " +
    //     name,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log("Hata oluştu: ", error);
    //   } else {
    //     res.json({ success: true });
    //   }
    // });
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
    const sheets = google.sheets({ version: "v4", auth: client });
    const now = new Date(Date.now());

    // Türkiye'nin saat diliminde tarihi ve saati al
    const turkiyeZamani = now.toLocaleString("tr-TR", {
      timeZone: "Europe/Istanbul",
    });
    let data = [
      // Örnek veri
      [
        kazatarihi,
        kusurdurumu,
        dogumyili,
        cinsiyet,
        gelir,
        yakinlik,
        name,
        telno,
        dogumyiliHakSahibi,
        il,
        turkiyeZamani,
      ],
    ];
    const range = "Ölümlü" + "!A2";

    const sheetId = "1ler1J9DEjfmiAvaFihzI7_vqHH-5qiCLZykC-azKkGE"; // Google Sheets URL'inden alabilirsiniz
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: sheetId,
        range: range, // Hangi hücreden başlayacağını belirtin
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
        }
      }
    );
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
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
    //   port: 465, // Port for SMTP (usually 465)
    //   secure: true, // Usually true if connecting to port 465
    //   auth: {
    //     user: "meliherpek26@gmail.com",
    //     pass: "xjiwwmqazompwlwo",
    //   },
    // });
    // const mailOptions = {
    //   from: "meliherpek26@gmail.com",
    //   to: "info@trafiktazminathesapla.com",
    //   subject: "trafiktazminathesapla.com Yeni Kayıt Geldi",
    //   text: "Yeni kaydın bilgileri aşağıdadır.",
    //   html:
    //     "<p>Form Türü: Vefat</p>" +
    //     "<p>Kaza Türü: " +
    //     kazaturu +
    //     "</p><p>Kaza Tarihi: " +
    //     kazatarihi +
    //     "</p><p>Kusur Durumu: " +
    //     kusurdurumu +
    //     "</p><p>Doğum Yılı: " +
    //     dogumyili +
    //     "</p><p>Cinsiyet: " +
    //     cinsiyet +
    //     "</p><p>Gelir: " +
    //     gelir +
    //     "</p><p>Yakınlık: " +
    //     yakinlik +
    //     "</p><p>Telefon: " +
    //     telno +
    //     "</p><p>Hak Sahibi Doğum Yılı: " +
    //     dogumyiliHakSahibi +
    //     "</p><p>İl: " +
    //     il +
    //     "</p><p>Ad Soyad: " +
    //     name,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log("Hata oluştu: ", error);
    //   } else {
    //     res.json({ success: true });
    //   }
    // });
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
    const sheets = google.sheets({ version: "v4", auth: client });
    const now = new Date(Date.now());

    // Türkiye'nin saat diliminde tarihi ve saati al
    const turkiyeZamani = now.toLocaleString("tr-TR", {
      timeZone: "Europe/Istanbul",
    });
    let data = [
      [
        kazatarihi,
        kusurdurumu,
        name,
        telno,
        aracMarka,
        model,
        aciklama,
        turkiyeZamani,
      ],
    ];
    const range = "Maddi Hasarlı" + "!A2";

    const sheetId = "1ler1J9DEjfmiAvaFihzI7_vqHH-5qiCLZykC-azKkGE"; // Google Sheets URL'inden alabilirsiniz
    sheets.spreadsheets.values.append(
      {
        spreadsheetId: sheetId,
        range: range, // Hangi hücreden başlayacağını belirtin
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
        }
      }
    );
    await MaddiHasar.create({
      kazatarihi,
      kusurdurumu,
      telno,
      name,
      aracMarka,
      model,
      aciklama,
    });
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com", // SMTP server address (usually mail.your-domain.com)
    //   port: 465, // Port for SMTP (usually 465)
    //   secure: true, // Usually true if connecting to port 465
    //   auth: {
    //     user: "meliherpek26@gmail.com",
    //     pass: "xjiwwmqazompwlwo",
    //   },
    // });
    // const mailOptions = {
    //   from: "meliherpek26@gmail.com",
    //   to: "info@trafiktazminathesapla.com",
    //   subject: "trafiktazminathesapla.com Yeni Kayıt Geldi",
    //   text: "Yeni kaydın bilgileri aşağıdadır.",
    //   html:
    //     "<p>Form Türü: Maddi Hasar</p>" +
    //     "<p>Kaza Tarihi: " +
    //     kazatarihi +
    //     "</p><p>Kusur Durumu: " +
    //     kusurdurumu +
    //     "</p><p>Telefon: " +
    //     telno +
    //     "</p><p>Ad Soyad: " +
    //     name +
    //     "</p><p>Araç Marka: " +
    //     aracMarka +
    //     "</p><p>Model: " +
    //     model +
    //     "</p><p>Açıklama: " +
    //     aciklama +
    //     "</p>",
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log("Hata oluştu: ", error);
    //   } else {
    //     res.json({ success: true });
    //   }
    // });
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
