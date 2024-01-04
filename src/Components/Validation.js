export const ValidateAdmin = (adminKey) => {
    const Error = {};
    const AdminKey = /[^a-zA-Z]/;

    if (!adminKey) {
        Error.KeyError = "AdminKey is required!"
    } else if (AdminKey.test(adminKey)) {
        Error.KeyError = "Characters only!"
    } else if (adminKey.length < 14 || adminKey.length > 14) {
        Error.KeyError = "It's 14 length character Key";
    }

    return Error;
}

export const validateSignUp = (Name, Email, Password) => {

    const Errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    if (!Name) {
        Errors.name = "Username is required!";
    } else if (Name.length <= 2) {
        Errors.name = "Check your Name!";
    }
    if (!Email) {
        Errors.email = "Email is required!";
    } else if (!emailRegex.test(Email)) {
        Errors.email = "Invalid Email format!";
    }
    if (!Password) {
        Errors.password = "Password is required!";
    } else if (Password.length < 6) {
        Errors.password = "Password must be greater than 6 character";
    }
    else if (!passwordRegex.test(Password)) {
        Errors.password = " include both numbers and special characters.";
    }

    return Errors;

};

export const validateEmailPassword = (Email, Password) => {


    const Errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    if (!Email) {
        Errors.email = "Email is required!";
    } else if (!emailRegex.test(Email)) {
        Errors.email = "Invalid Email format!";
    }
    if (!Password) {
        Errors.password = "Password is required!";
    } else if (Password.length < 6) {
        Errors.password = "Password must be greater than 6 character";
    }
    else if (!passwordRegex.test(Password)) {
        Errors.password = " include both numbers and special characters.";
    }

    return Errors;
};

export const ValidateReset = (Email) => {
    const Errors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!Email) {
        Errors.email = "Email is required!";
    } else if (!emailRegex.test(Email)) {
        Errors.email = "Invalid Email format!";
    }

    return Errors;
}

export const ValidateResetPass = (newPassword, ConfirmPassword) => {
    const Errors = {};

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;

    if (!newPassword) {
        Errors.newPassword = "Password is required!";
    } else if (newPassword.length < 6) {
        Errors.newPassword = "Password must be greater than 6 character";
    }
    else if (!passwordRegex.test(newPassword)) {
        Errors.newPassword = " include both numbers and special characters.";
    }

    if (!ConfirmPassword) {
        Errors.ConfirmPassword = "Password is required!";
    } else if (ConfirmPassword.length < 6) {
        Errors.ConfirmPassword = "Password must be greater than 6 character";
    }
    else if (!passwordRegex.test(ConfirmPassword)) {
        Errors.ConfirmPassword = " include both numbers and special characters.";
    }

    return Errors;
}

// export const ValidateProfile = (FatherName, MotherName, Gender, Mobile, MartialStatus, BloodGrp,
//     YearPercentage1, YearPercentage2, YearPercentage3,
//     UniversityInstituteName1, UniversityInstituteName2, UniversityInstituteName3,
//     ProgrammeStream1, ProgrammeStream2, ProgrammeStream3,
//     YearPercentageHSC, YearPercentageSSLC, InstituteBoardNameHSC, InstituteBoardNameSSLC,
//     HSC, SSLC, Doorno, Street,
//     City, Landmark, Pincode, District,
//     State) => {
//     const Error = {};

//     if (!FatherName) {
//         Error.FatherName = "Field is Required!";
//     } else if (!MotherName) {
//         Error.MotherName = "Field is Required!";
//     } else if (!Gender) {
//         Error.Gender = "Field is Required!";
//     } else if (!Mobile) {
//         Error.Mobile = "Field is Required!";
//     } else if (Mobile.length > 10 && Mobile.length < 10) {
//         Error.Mobile = "Invalid Mobile Number"
//     }
//     else if (!MartialStatus) {
//         Error.MartialStatus = "Field is Required!";
//     } else if (!BloodGrp) {
//         Error.BloodGrp = "Field is Required!";
//     } else if (!YearPercentage1) {
//         Error.YearPercentage1 = "Field is Required!";
//     } else if (!YearPercentage2) {
//         Error.YearPercentage2 = "Field is Required!";
//     } else if (!YearPercentage3) {
//         Error.YearPercentage3 = "Field is Required!";
//     } else if (!UniversityInstituteName1) {
//         Error.UniversityInstituteName1 = "Field is Required!";
//     } else if (!UniversityInstituteName2) {
//         Error.UniversityInstituteName2 = "Field is Required!";
//     } else if (!UniversityInstituteName3) {
//         Error.UniversityInstituteName3 = "Field is Required!";
//     } else if (!ProgrammeStream1) {
//         Error.ProgrammeStream1 = "Field is Required!";
//     } else if (!ProgrammeStream2) {
//         Error.ProgrammeStream2 = "Field is Required!";
//     } else if (!ProgrammeStream3) {
//         Error.ProgrammeStream3 = "Field is Required!";
//     } else if (!YearPercentageHSC) {
//         Error.YearPercentageHSC = "Field is Required!";
//     } else if (!YearPercentageSSLC) {
//         Error.YearPercentageSSLC = "Field is Required!";
//     } else if (!InstituteBoardNameHSC) {
//         Error.InstituteBoardNameHSC = "Field is Required!";
//     } else if (!InstituteBoardNameSSLC) {
//         Error.InstituteBoardNameSSLC = "Field is Required!";
//     } else if (!HSC) {
//         Error.HSC = "Field is Required!";
//     } else if (!SSLC) {
//         Error.SSLC = "Field is Required!";
//     } else if (!Doorno) {
//         Error.Doorno = "Field is Required!";
//     } else if (!Street) {
//         Error.Street = "Field is Required!";
//     } else if (!City) {
//         Error.City = "Field is Required!";
//     } else if (!Landmark) {
//         Error.Landmark = "Field is Required!";
//     } else if (!Pincode) {
//         Error.Pincode = "Field is Required!";
//     } else if (Pincode < 6 && Pincode > 6) {
//         Error.Pincode = "Invalid Pincode";
//     } else if (!District) {
//         Error.District = "Field is Required!";
//     } else if (!State) {
//         Error.State = "Field is Required!";
//     }

//     return Error;

// }

export const ValidateProfile = (personel) => {
    const { FatherName, MotherName, Gender, DOB, Mobile, MartialStatus, BloodGroup, ACADEMICS, PRE_ACADEMICS, ADDRESS_DETAILS } = personel;
    const { YearPercentage1,
        UniversityInstituteName1,
        ProgrammeStream1,
        YearPercentage2,
        UniversityInstituteName2,
        ProgrammeStream2,
        YearPercentage3,
        UniversityInstituteName3,
        ProgrammeStream3 } = ACADEMICS;
    const { YearPercentageHSC, InstituteBoardNameHSC, HSC, YearPercentageSSLC, InstituteBoardNameSSLC, SSLC } = PRE_ACADEMICS;
    const { Doorno, Street, City, Landmark, Pincode, District, State } = ADDRESS_DETAILS;

    const Error = {};

    if (!FatherName) {
        Error.FatherName = "Field is Required!";
    }
    if (!MotherName) {
        Error.MotherName = "Field is Required!";
    }
    if (!Gender) {
        Error.Gender = "Field is Required!";
    }
    if (!DOB) {
        Error.DOB = "Field is Required!";
    }
    if (!Mobile) {
        Error.Mobile = "Field is Required!";
    } else if (Mobile.length > 10 || Mobile.length < 10) {
        Error.Mobile = "Invalid Mobile Number";
    }
    if (!MartialStatus) {
        Error.MartialStatus = "Field is Required!";
    }
    if (!BloodGroup) {
        Error.BloodGroup = "Field is Required!";
    }
    if (!YearPercentage1) {
        Error.YearPercentage1 = "Field is Required!";
    }
    if (!YearPercentage2) {
        Error.YearPercentage2 = "Field is Required!";
    }
    if (!YearPercentage3) {
        Error.YearPercentage3 = "Field is Required!";
    }
    if (!UniversityInstituteName1) {
        Error.UniversityInstituteName1 = "Field is Required!";
    }
    if (!UniversityInstituteName2) {
        Error.UniversityInstituteName2 = "Field is Required!";
    } if (!UniversityInstituteName3) {
        Error.UniversityInstituteName3 = "Field is Required!";
    }
    if (!ProgrammeStream1) {
        Error.ProgrammeStream1 = "Field is Required!";
    }
    if (!ProgrammeStream2) {
        Error.ProgrammeStream2 = "Field is Required!";
    }
    if (!ProgrammeStream3) {
        Error.ProgrammeStream3 = "Field is Required!";
    }
    if (!YearPercentageHSC) {
        Error.YearPercentageHSC = "Field is Required!";
    }
    if (!YearPercentageSSLC) {
        Error.YearPercentageSSLC = "Field is Required!";
    }
    if (!InstituteBoardNameHSC) {
        Error.InstituteBoardNameHSC = "Field is Required!";
    }
    if (!InstituteBoardNameSSLC) {
        Error.InstituteBoardNameSSLC = "Field is Required!";
    }
    if (!HSC) {
        Error.HSC = "Field is Required!";
    }
    if (!SSLC) {
        Error.SSLC = "Field is Required!";
    }
    if (!Doorno) {
        Error.Doorno = "Field is Required!";
    }
    if (!Street) {
        Error.Street = "Field is Required!";
    }
    if (!City) {
        Error.City = "Field is Required!";
    }
    if (!Landmark) {
        Error.Landmark = "Field is Required!";
    }
    if (!Pincode) {
        Error.Pincode = "Field is Required!";
    } else if (Pincode.length > 6 || Pincode.length < 6) {
        Error.Pincode = "Invalid Pincode";
    }
    if (!District) {
        Error.District = "Field is Required!";
    }
    if (!State) {
        Error.State = "Field is Required!";
    }
    return Error;
};

