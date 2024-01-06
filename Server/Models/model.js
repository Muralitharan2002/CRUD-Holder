const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    AdminKey: {
        type: String
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String
    },
    Role: {
        type: String
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    verificationToken: {
        type: String
    },
    ExpireAt: {
        type: Date
    }
})

const UserSchema = new mongoose.Schema({
    Name: {
        type: String
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String
    },
    Role: {
        type: String
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    verificationToken: {
        type: String,
        required: true
    },
    ExpireAt: {
        type: Date
    }
});

const ProfileSchema = new mongoose.Schema({
    Name: {
        type: String
    },
    Email: {
        type: String,
        required: true,
        unique: true

    },
    FatherName: {
        type: String,

    },
    MotherName: {
        type: String,

    },
    Gender: {
        type: String,

    },
    DOB: {
        type: Date,

    },
    Mobile: {
        type: Number,

    },
    MartialStatus: {
        type: String,

    },
    BloodGroup: {
        type: String,

    },
    ACADEMICS: {
        YearPercentage1: String,
        UniversityInstituteName1: String,
        ProgrammeStream1: String,
        YearPercentage2: String,
        UniversityInstituteName2: String,
        ProgrammeStream2: String,
        YearPercentage3: String,
        UniversityInstituteName3: String,
        ProgrammeStream3: String
    },
    PRE_ACADEMICS: {
        YearPercentageHSC: String,
        InstituteBoardNameHSC: String,
        HSC: String,
        YearPercentageSSLC: String,
        InstituteBoardNameSSLC: String,
        SSLC: String
    },
    ADDRESS_DETAILS: {
        Doorno: String,
        Street: String,
        City: String,
        Landmark: String,
        Pincode: Number,
        District: String,
        State: String
    },
    UserID: {
        type: mongoose.Schema.Types.ObjectId
    }
});

const ResetPassword = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Role: {
        type: String
    },
    verificationToken: {
        type: String
    },
    ExpireAt: {
        type: Date
    },
    UserID: {
        type: mongoose.Schema.Types.ObjectId
    }
});



const AdminModel = mongoose.model("Admin_infos", AdminSchema);
const signup = mongoose.model("user_infos", UserSchema);
const Profile = mongoose.model("Personal_infos", ProfileSchema);
const PasswordReset = mongoose.model("ResetPassword", ResetPassword);


module.exports = { AdminModel, signup, Profile, PasswordReset };
