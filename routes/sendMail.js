// import secondStepModel from "../config/models/secondStepModel";

const nodemailer = require("nodemailer");
const express = require("express");
const secondStepModel = require("../config/models/secondStepModel");
const router = express.Router();
const sendEmail = async (body) => {
  const { to } = body;
  if (!to) {
    return {
      success: false,
      msg: "No recipients defined",
    };
  }
  var email = to;
  var fourdigitotp = Math.floor(1000 + Math.random() * 9000);
  var data = await secondStepModel.findOne({ email });
  if (!data) {
    var tosave = new secondStepModel({
      email,
      otp: fourdigitotp,
      totalTries: { tries: 1, date: new Date().toDateString() },
    });
    await tosave.save();
    var emailsent = await sendForgetPassMail({ to, otp: fourdigitotp, email });
    if (emailsent) {
      return {
        success: true,
        msg: "Email Sent",
      };
    } else {
      return {
        success: false,
        msg: "Unable To Send Email",
      };
    }
  }
  if (data?.totalTries?.tries && data.totalTries.tries > 5) {
    if (data.totalTries.date == new Date().toDateString()) {
      return {
        success: false,
        msg: "Max Tries Limit Reached. Try Tommorow",
      };
    } else {
      await secondStepModel.findOneAndUpdate(
        { email },
        {
          "totalTries.tries": 1,
          "totalTries.date": new Date().toDateString(),
        }
      );

      var emailsent = await sendForgetPassMail({ to, email });
      if (emailsent) {
        return {
          success: true,
          msg: "Email Sent",
        };
      } else {
        return {
          success: false,
          msg: "Unable To Send Email",
        };
      }
    }
  } else {
    if (
      data?.totalTries?.date &&
      data.totalTries.date != new Date().toDateString()
    ) {
      await secondStepModel.findOneAndUpdate(
        { email },
        {
          "totalTries.tries": 1,
          "totalTries.date": new Date().toDateString(),
        }
      );
    } else {
      await secondStepModel.findOneAndUpdate(
        { email },
        {
          $inc: {
            "totalTries.tries": 1,
          },
          "totalTries.date": new Date().toDateString(),
        }
      );
    }
    var emailsent = await sendForgetPassMail({ to, email });
    if (emailsent) {
      return {
        success: true,
        msg: "Email Sent",
      };
    } else {
      return {
        success: false,
        msg: "Unable To Send Email",
      };
    }
  }
  // Create a transporter with Gmail SMTP credentials
};
router.post("/", async (req, res) => {
  return res.send(await sendEmail(req.body));
});
async function sendForgetPassMail(newbody) {
  var { to, email } = newbody;
  var otp = newbody?.otp || Math.floor(1000 + Math.random() * 9000);
  await secondStepModel.findOneAndUpdate({ email }, { otp });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kradityanormal5@gmail.com", // Your Gmail email address
      pass: process.env.emailpass, // Your Gmail password or App Password
    },
  });

  // Email message options
  const mailOptions = {
    from: "OTP for capstone project <kradityanormal5@gmail.com>", // Sender address
    to,
    subject: "OTP for capstone project",
    text: `${otp}`,
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Newton school of technology</a>
    </div>
    <p style="font-size:1.1em">Hi, ${
      email.split("@")[0].includes(".")
        ? email.split("@")[0].replace(" ")
        : email.split("@")[0]
    }</p>
    <p>Thank you for choosing Newton School. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Newton school Team</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Newton School Of Technology,</p>
      <p>Sonipat,</p>
      <p>Delhi NCR</p>
    </div>
  </div>
</div>`,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
    return false;
  }
}

module.exports = router;
