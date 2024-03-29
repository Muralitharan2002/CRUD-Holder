const express = require("express");
const router = express.Router();
const { AdminModel, signup, Profile, PasswordReset } = require("../Models/model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail, ResetPassMail } = require("../utils/sendEmail");
const { authenticateJWT, authenticateAdminJWT } = require("../utils/authenticateJWT");
const { ObjectId } = require('mongodb');


router.post("/AdminCreate", async (req, res) => {
    const { adminKey, Email, Password } = req.body;
    try {

        if (adminKey === process.env.ADMIN_KEY) {
            const hashPassword = await bcrypt.hash(Password, Number(process.env.SALTROUND));
            const email = Email.toLowerCase();
            const person = await AdminModel.findOne({ Email: email });

            if (person) {
                console.log("Admin Already Registered")
                res.json({ status: "warning", message: "Admin Already Registered" });
            } else {
                try {
                    const newAdmin = new AdminModel({
                        AdminKey: adminKey,
                        Email: email,
                        Password: hashPassword,
                        Role: "Admin",
                        isVerified: false,
                        ExpireAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
                    });
                    const token = crypto.randomBytes(32).toString("hex");
                    console.log(token);
                    newAdmin.verificationToken = token;

                    await newAdmin.save();
                    console.log(newAdmin);

                    sendEmail(newAdmin.Role, newAdmin.Email, newAdmin.verificationToken, newAdmin._id);

                    res.status(201).json({ status: "success", message: "An Email sent to your account please verify" });
                } catch (err) {
                    console.log("Admin saving process failed", err);
                    res.status(500).json({ message: err.message });
                }
            }
        } else {
            console.log("AdminKey deos not match")
            res.json({ status: "error", message: "AdminKey deos not match" });
        }

    } catch (err) {
        console.log("Admin Registration process failed", err);
        res.status(500).json({ message: err.message });
    }
})


router.post("/create", async (req, res) => {
    const { Name, Email, Password } = req.body;

    const hashPassword = await bcrypt.hash(Password, Number(process.env.SALTROUND))
    const email = Email.toLowerCase();
    const person = await signup.findOne({ email })
    if (person) {
        return res.status(200).json({ status: "Exist", message: "founded" });
    } else {
        const newUser = new signup({
            Name,
            Email: email,
            Password: hashPassword,
            Role: "User",
            isVerified: false,
            ExpireAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
        });

        const token = crypto.randomBytes(32).toString("hex");
        console.log(token);
        newUser.verificationToken = token;

        try {
            await newUser.save();
            console.log(newUser);

            sendEmail(newUser.Role, newUser.Email, newUser.verificationToken, newUser._id);

            res.status(201).json({ status: "success", message: "An Email sent to your account please verify" });
        } catch (error) {
            console.log("Error saving user:", error.message);
            res.status(500).json({ status: "error", message: error.message });
        }

    }
});


router.get("/verify/:Role/:_id/:token/", async (req, res) => {
    try {
        const Role = req.params.Role;
        const token = req.params.token;
        const Id = new ObjectId(req.params._id);

        if (Role === "Admin") {
            const user = await AdminModel.findById(Id);

            if (user && user.verificationToken === token && user.ExpireAt > new Date()) {
                await AdminModel.updateOne({ _id: Id }, { $set: { isVerified: true } });
                res.json({ status: "success", message: "Email verified successfully" });
            } else {
                await AdminModel.deleteOne({ verificationToken: token });
                console.log("Invalid or expired Email Verification.");
                return res.json({ status: "failed", message: "Invalid or expired Email Verification." });
            }
        } else {
            const user = await signup.findById(Id);

            if (user && user.verificationToken === token && user.ExpireAt > new Date()) {
                await signup.updateOne({ _id: Id }, { $set: { isVerified: true } });
                res.json({ status: "success", message: "Email verified successfully" });
            } else {

                await signup.deleteOne({ verificationToken: token });
                console.log("Invalid or expired Email Verification.");
                return res.json({ status: "failed", message: "Invalid or expired Email Verification." });
            }
        }
    } catch (err) {
        console.error("Error in /verify/:Role/:_id/:token/ route:", err);
        res.json({ status: "error", message: "Email verification process failed" });
    }
});


router.post("/login", async (req, res) => {
    const { Email, Password } = req.body;
    console.log(Email)

    try {
        const userData = await signup.findOne({ Email: Email });
        if (userData) {
            await bcrypt.compare(Password, userData.Password)
                .then((result) => {
                    if (result) {
                        if (userData.isVerified) {
                            const JWTtoken = jwt.sign({ id: userData._id }, process.env.SECRETE_KEY);
                            res.cookie("UserToken", JWTtoken, {
                                httpOnly: true,
                                secure: true,
                                sameSite: "none"

                            });
                            res.json({ status: "success", message: "Login successfully" });
                        } else {
                            res.json({ status: "warning", message: "You must verify your mailID" });
                        }
                    } else {
                        res.json({ status: "error1", message: "Invalid credentials" });
                    }
                })
                .catch((err) => {
                    res.json({ status: "error", message: "Error comparing passwords", Error: err });
                    console.log(err);
                });
        } else {
            res.json({ status: "error2", message: "user yet not registered" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/Adminlogin", async (req, res) => {
    const { Email, Password } = req.body;
    console.log(Email)

    try {
        const userData = await AdminModel.findOne({ Email: Email });
        if (userData) {
            await bcrypt.compare(Password, userData.Password)
                .then((result) => {
                    if (result) {
                        if (userData.isVerified) {
                            const JWTtoken = jwt.sign({ id: userData._id }, process.env.ADMIN_SECRETE_KEY);
                            res.cookie("AdminToken", JWTtoken, {
                                httpOnly: true,
                                secure: true,
                                sameSite: "none"

                            });
                            res.json({ status: "success", message: "Login successfully" });
                        } else {
                            res.json({ status: "warning", message: "You must verify your mailID" });
                        }
                    } else {
                        res.json({ status: "error1", message: "Invalid credentials" });
                    }
                })
                .catch((err) => {
                    res.json({ status: "error", message: "Error comparing passwords", Error: err });
                    console.log(err);
                });
        } else {
            res.json({ status: "error2", message: "Admin yet not registered" });
        }
    } catch (error) {
        console.error("Error during Admin login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/fetchData", authenticateJWT, async (req, res) => {
    const ID = req.user.id;

    try {
        const Data = await signup.findOne({ _id: ID });
        if (Data) {
            res.send(Data);
        } else {
            res.json({ message: "Please Log in" })
        }
    } catch (err) {
        console.log(err);
    }
})


router.get("/fetchData2", authenticateJWT, async (req, res) => {
    const ID = req.user.id;

    try {
        const Data = await Profile.findOne({ UserID: ID });
        if (Data) {
            res.send(Data);
        } else {
            res.json({ message: "Please Log in" })
        }
    } catch (err) {
        console.log(err);
    }
})


router.post("/update", authenticateJWT, async (req, res) => {
    const ID = req.user.id;


    const { Name, Email, FatherName, MotherName, Gender, DOB, Mobile, MartialStatus, BloodGroup,
        ACADEMICS: {
            YearPercentage1,
            UniversityInstituteName1,
            ProgrammeStream1,
            YearPercentage2,
            UniversityInstituteName2,
            ProgrammeStream2,
            YearPercentage3,
            UniversityInstituteName3,
            ProgrammeStream3
        },
        PRE_ACADEMICS: {
            YearPercentageHSC,
            InstituteBoardNameHSC,
            HSC,
            YearPercentageSSLC,
            InstituteBoardNameSSLC,
            SSLC
        },
        ADDRESS_DETAILS: {
            Doorno,
            Street,
            City,
            Landmark,
            Pincode,
            District,
            State
        } } = req.body;

    try {
        const found = await Profile.findOne({ UserID: ID });
        if (found) {
            await Profile.findOneAndUpdate({ UserID: ID }, {
                Name, Email, FatherName, MotherName, Gender, DOB, Mobile, MartialStatus, BloodGroup,
                ACADEMICS: {
                    YearPercentage1,
                    UniversityInstituteName1,
                    ProgrammeStream1,
                    YearPercentage2,
                    UniversityInstituteName2,
                    ProgrammeStream2,
                    YearPercentage3,
                    UniversityInstituteName3,
                    ProgrammeStream3
                },
                PRE_ACADEMICS: {
                    YearPercentageHSC,
                    InstituteBoardNameHSC,
                    HSC,
                    YearPercentageSSLC,
                    InstituteBoardNameSSLC,
                    SSLC
                },
                ADDRESS_DETAILS: {
                    Doorno,
                    Street,
                    City,
                    Landmark,
                    Pincode,
                    District,
                    State
                }
            }, { new: true })
                .then((User) => {
                    console.log(User)
                    res.status(200).json({ message: 'success' })
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ message: 'error' })
                })
        } else {
            const data = new Profile({
                Name, Email, FatherName, MotherName, Gender, DOB, Mobile, MartialStatus, BloodGroup,
                ACADEMICS: {
                    YearPercentage1,
                    UniversityInstituteName1,
                    ProgrammeStream1,
                    YearPercentage2,
                    UniversityInstituteName2,
                    ProgrammeStream2,
                    YearPercentage3,
                    UniversityInstituteName3,
                    ProgrammeStream3
                },
                PRE_ACADEMICS: {
                    YearPercentageHSC,
                    InstituteBoardNameHSC,
                    HSC,
                    YearPercentageSSLC,
                    InstituteBoardNameSSLC,
                    SSLC
                },
                ADDRESS_DETAILS: {
                    Doorno,
                    Street,
                    City,
                    Landmark,
                    Pincode,
                    District,
                    State
                }
                , UserID: ID
            })
            if (data) {
                await data.save();
                console.log(data);
                res.json({ message: "success" });
            } else {
                console.log("cannot get data");
                res.json({ message: "error" });
            }

        }

    } catch (err) {
        console.log(err)
    }
})


router.post("/userlogout", authenticateJWT, async (req, res) => {
    const ID = req.user.id;
    try {
        const user = await signup.findOne({ _id: ID })
        if (user) {
            res.cookie("UserToken", null, { expires: new Date(0), httpOnly: true, sameSite: "none", secure: true });

            return res.json({ status: "success" });
        }
        return res.json({ status: "error" });
        // res.json({ status: "success" });
    } catch (err) {
        console.log("error while logout", err);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
})


router.post("/Adminlogout", authenticateAdminJWT, async (req, res) => {
    const ID = req.user.id;

    try {
        const admin = await AdminModel.findOne({ _id: ID })
        if (admin) {
            res.cookie("AdminToken", null, { expires: new Date(0), httpOnly: true, sameSite: "none", secure: true });
            return res.json({ status: "success" });
        }
        return res.json({ status: "error" });

    } catch (err) {
        console.log("error while logout", err);
        return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
})


router.post("/ForgotPassword", async (req, res) => {
    const { Email } = req.body;
    const token = crypto.randomBytes(32).toString("hex")

    try {
        const person = await signup.findOne({ Email });


        if (person) {
            if (person.isVerified) {
                const ResetDetails = new PasswordReset({
                    Email: Email,
                    Role: person.Role,
                    verificationToken: token,
                    ExpireAt: new Date(Date.now() + 60 * 60 * 1000),
                    UserID: person._id
                })

                const user = await PasswordReset.findOne({ Email });
                try {
                    if (user && user.Role === person.Role) {
                        res.json({ status: "warning", message: "already link sent for reset your password" })
                    } else {
                        await ResetDetails.save();
                        ResetPassMail(person.Role, person.Email, token, person._id);
                        res.json({ status: "success", message: "Email sent for password Reset", data: ResetDetails })
                    }
                }
                catch (err) {
                    console.log("while Reset info checking", err)
                }

            } else {
                console.log("User Not Verified Yet! Check your mail")
                res.json({ status: "warning", message: "User Not Verified Yet! Check your mail" })
            }
        } else {
            console.log("User not yet Register")
            res.json({ Status: "failed", message: "User not yet Register" })
        }

    } catch (err) {
        console.log("Reset password process got error", err);
    }
})


router.post("/AdminForgotPassword", async (req, res) => {
    const { Email } = req.body;
    const token = crypto.randomBytes(32).toString("hex")

    try {
        const person = await AdminModel.findOne({ Email });


        if (person) {
            if (person.isVerified) {
                const ResetDetails = new PasswordReset({
                    Email: Email,
                    Role: person.Role,
                    verificationToken: token,
                    ExpireAt: new Date(Date.now() + 60 * 60 * 1000),
                    UserID: person._id
                })

                const user = await PasswordReset.findOne({ Email });
                try {
                    if (user && user.Role === person.Role) {
                        res.json({ status: "warning", message: "already link sent for reset your password" })
                    } else {
                        await ResetDetails.save();
                        ResetPassMail(person.Role, person.Email, token, person._id);
                        res.json({ status: "success", message: "Email sent for password Reset", data: ResetDetails })
                    }
                }
                catch (err) {
                    console.log("while Reset info checking", err)
                }

            } else {
                console.log("Admin Not Verified Yet! Check your mail")
                res.json({ status: "warning", message: "Admin Not Verified Yet! Check your mail" })
            }
        } else {
            console.log("Admin not yet Register")
            res.json({ Status: "failed", message: "User not yet Register" })
        }

    } catch (err) {
        console.log("Admin Reset password process got error", err);
    }



})


router.post("/passwordChange/:Role/:_id/:token", async (req, res) => {
    const { newPassword, ConfirmPassword } = req.body;
    const id = new ObjectId(req.params._id);
    const token = req.params.token;
    const Role = req.params.Role;

    try {
        if (newPassword === ConfirmPassword) {
            const person = await PasswordReset.findOne({ UserID: id });
            if (person && person.verificationToken === token && person.ExpireAt > new Date()) {
                const hashPassword = await bcrypt.hash(ConfirmPassword, Number(process.env.SALTROUND));

                if (Role === "Admin") {
                    const updatedUser = await AdminModel.findOneAndUpdate(
                        { _id: id },
                        { $set: { Password: hashPassword } },
                        { new: true }
                    );

                    if (updatedUser) {
                        await PasswordReset.deleteOne({ UserID: id });
                        return res.json({ status: "success", message: "Successfully Reset Password" });
                    } else {
                        return res.json({ status: "failed", message: "Failed to update password" });
                    }
                } else {
                    const updatedUser = await signup.findOneAndUpdate(
                        { _id: id },
                        { $set: { Password: hashPassword } },
                        { new: true }
                    );

                    if (updatedUser) {
                        await PasswordReset.deleteOne({ UserID: id });
                        return res.json({ status: "success", message: "Successfully Reset Password" });
                    } else {
                        return res.json({ status: "failed", message: "Failed to update password" });
                    }
                }

            } else {
                await PasswordReset.deleteOne({ UserID: id });
                return res.json({ status: "failed", message: "Link Expired!" })
            }
        } else {
            return res.json({ status: "error", message: "password confirmation does not match!" })
        }
    } catch (err) {
        console.log("passwordchange process failed", err)
    }


})


router.get("/AdminFetch", authenticateAdminJWT, async (req, res) => {
    const ID = req.user.id;
    try {

        const Admin = await AdminModel.findOne({ _id: ID })
        if (Admin) {
            const Users = await signup.find({});
            const VerifiedUser = await signup.countDocuments({ isVerified: true });
            const unVerifiedUser = await signup.countDocuments({ isVerified: false });
            const UpdatedUser = await Profile.find();

            console.log("Datas", Users)
            return res.send({ Users, VerifiedUser, unVerifiedUser, UpdatedUser })
        } else {
            return res.json({ message: "Invalid Admin for fetching" })
        }

    } catch (err) {
        console.log("Admin Fetching process failed", err)
        res.status(500).json({ status: "error", message: "Internal server Error" })
    }
})


router.delete("/AdminDelete/:Name/:userID", authenticateAdminJWT, async (req, res) => {
    const ID = req.params.userID;
    const AdminID = req.user.id;

    try {
        const Admin = await AdminModel.findOne({ _id: AdminID })
        if (Admin) {
            await signup.findByIdAndDelete({ _id: ID })
            await Profile.findOneAndDelete({ UserID: ID })
            await PasswordReset.findOneAndDelete({ UserID: ID })
            return res.status(200).json({ status: "success", message: "User Deleted" })
        } else {
            return res.json({ message: "Invalid Admin for Deletion" })
        }

    } catch (err) {
        console.log("Admin deleted action failed", err)
        res.status(500).json({ status: "error", message: "Internal server Error" })
    }
})

module.exports = router;


