import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa"
import { Flip, toast, ToastContainer } from 'react-toastify';
import { ValidateProfile } from './Validation';
import { BiLogOutCircle } from "react-icons/bi"

function Profile({ onUserLogout }) {

    const navigate = useNavigate();
    const [formError, setformError] = useState([]);
    const [Data, setData] = useState({
        Name: '',
        Email: ''
    });
    const [Personel, setPersonal] = useState({
        FatherName: '',
        MotherName: '',
        Gender: '',
        DOB: '',
        Mobile: '',
        MartialStatus: '',
        BloodGroup: '',
        ACADEMICS: {
            YearPercentage1: "",
            UniversityInstituteName1: "",
            ProgrammeStream1: "",
            YearPercentage2: "",
            UniversityInstituteName2: "",
            ProgrammeStream2: "",
            YearPercentage3: "",
            UniversityInstituteName3: "",
            ProgrammeStream3: ""
        },
        PRE_ACADEMICS: {
            YearPercentageHSC: "",
            InstituteBoardNameHSC: "",
            HSC: "",
            YearPercentageSSLC: "",
            InstituteBoardNameSSLC: "",
            SSLC: ""
        },
        ADDRESS_DETAILS: {
            Doorno: "",
            Street: "",
            City: "",
            Landmark: "",
            Pincode: "",
            District: "",
            State: ""
        }


    })
    const [isEdit, setEdit] = useState(false);
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 'Puducherry'
    ].sort();

    const bloodGroups = [
        'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
    ];


    const fetchData = async () => {
        try {
            const Userinfo = await axios.get("http://localhost:3800/router/fetchData", { withCredentials: true });
            if (Userinfo.data) {
                setData(Userinfo.data);
            } else {
                console.log("Invalid data format received");
            }
        } catch (err) {
            console.log("Fetching Error", err);
        }
    };
    const fetchData2 = async () => {
        try {
            const Userinfo = await axios.get("http://localhost:3800/router/fetchData2", { withCredentials: true });
            if (Userinfo.data && Userinfo.data.DOB) {
                const format = Userinfo.data.DOB;
                Userinfo.data.DOB = new Date(format).toLocaleDateString();
                const newformat = Userinfo.data.DOB.split("/");
                Userinfo.data.DOB = `${newformat[2]}-${newformat[0].length === 1 ? `0` + newformat[0] : newformat[0]}-${newformat[1].length === 1 ? `0` + newformat[1] : newformat[1]}`;
                setPersonal(Userinfo.data);
            }
        } catch (err) {
            console.log("Fetching Error", err);
        }
    };

    const UpdateProfile = () => {


        axios.post("http://localhost:3800/router/update", { ...Data, ...Personel }, { withCredentials: true })
            .then((res) => {
                if (res.data.message === "success") {
                    toast.success("Updated Successfully");
                } else {
                    toast.error("updation failed");
                }
            })
            .catch((err) => {
                console.log("updation process" + err)
            })



    }

    useEffect(() => {
        fetchData();
        fetchData2();
    }, []);

    const CallEdit = () => {
        setEdit(true);
        document.getElementById("display").style.display = "block";
    }

    const Save = (e) => {
        e.preventDefault();
        console.log(Personel);
        const Error = ValidateProfile(Personel);
        setformError(Error);


        if (Object.keys(Error).length === 0) {
            setEdit(false);
            document.getElementById("display").style.display = "none";
            UpdateProfile();
        } else {
            toast.error("Field is Required!")
            console.log(Object.keys(Error).length)
        }
    }

    const logout = () => {
        axios.post("http://localhost:3800/router/userlogout", {}, { withCredentials: true })
            .then((result) => {
                if (result.data.status === "success") {
                    onUserLogout();
                    navigate("/");
                } else {
                    toast.error("LogOut Denied");
                    console.log(result.data.message)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            <div className="Profile-section">
                <div className="head-bar">
                    <h1 className="Heading">
                        Profile .
                    </h1>
                    <p><BiLogOutCircle className='log-out' onClick={logout} /></p>
                </div>

                <div className="form-container">
                    <form action=""  >
                        <div className='person-info'>
                            <div className="head_flex">
                                <h2 className="head1">Personal Information .</h2>
                                <FaUserEdit className='edit-icon' onClick={CallEdit} />
                            </div>

                            <div className="flex">
                                <label htmlFor="" className='field-name' >
                                    Name <br />
                                    <input type="text" className='text-field' placeholder='Name' value={Data.Name} onChange={(e) => setData({ Name: e.target.value })} disabled={!isEdit} />
                                    {/* <p id="error">{formError.Name}</p> */}
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Father Name<br />
                                    <input type="text" className='text-field' placeholder='Father Name' value={Personel.FatherName} onChange={(e) => { setPersonal({ ...Personel, FatherName: e.target.value }) }} disabled={!isEdit} />
                                    <p id="error">{formError.FatherName}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Mother Name<br />
                                    <input type="text" className='text-field' placeholder='Mother Name' value={Personel.MotherName} onChange={(e) => { setPersonal({ ...Personel, MotherName: e.target.value }) }} disabled={!isEdit} />
                                    <p id="error">{formError.MotherName}</p>
                                </label>
                                <label htmlFor="" className='field-name'>
                                    Gender<br />
                                    <select className='text-field' value={Personel.Gender} onChange={(e) => { setPersonal({ ...Personel, Gender: e.target.value }) }} disabled={!isEdit}>
                                        <option value="">Select a Gender</option>
                                        <option value="Male" >Male</option>
                                        <option value="Female" >Female</option>
                                        <option value="Others" >Others</option>
                                    </select>
                                    <p id="error">{formError.Gender}</p>
                                </label>
                                <label htmlFor="" className='field-name'>
                                    Email<br />
                                    <input type="email" className='text-field' placeholder='abc@gmail.com' value={Data.Email} onChange={(e) => { setData({ Email: e.target.value }) }} disabled={true} />
                                    {/* <p id="error">{formError.Email}</p> */}
                                </label>

                                <label htmlFor="" className='field-name'>
                                    Date Of Birth<br />
                                    <input type="date" className='text-field' placeholder='DOB' value={Personel.DOB} onChange={(e) => { setPersonal({ ...Personel, DOB: e.target.value }) }} disabled={!isEdit} />
                                    <p id="error">{formError.DOB}</p>
                                </label>
                                <label htmlFor="" className='field-name'>
                                    Mobile<br />
                                    <input type="tel" className='text-field' placeholder='Mobile no' value={Personel.Mobile} onChange={(e) => { setPersonal({ ...Personel, Mobile: e.target.value }) }} disabled={!isEdit} />
                                    <p id="error">{formError.Mobile}</p>
                                </label>
                                <label htmlFor="" className='field-name'>
                                    Martial Status<br />
                                    <select className='text-field' value={Personel.MartialStatus} onChange={(e) => { setPersonal({ ...Personel, MartialStatus: e.target.value }) }} disabled={!isEdit} >
                                        <option value="">Select a Status</option>
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                    </select>
                                    <p id="error">{formError.MartialStatus}</p>
                                </label>
                                <label htmlFor="" className='field-name'>
                                    Blood Group<br />
                                    <select className='text-field' value={Personel.BloodGroup} onChange={(e) => { setPersonal({ ...Personel, BloodGroup: e.target.value }) }} disabled={!isEdit}>
                                        <option value="">Select a BloodGroup</option>
                                        {bloodGroups.map((item, index) => (
                                            <option key={index} value={item}>{item}</option>
                                        ))}
                                    </select>
                                    <p id="error">{formError.BloodGroup}</p>
                                </label>


                            </div>

                            <div className="head">
                                <h2 className='head1'>Academic Qualification .</h2>
                            </div>

                            <div className="flex">
                                <label htmlFor="" className='field-name' >
                                    Year & Percentage<br />
                                    <input type="text" className='text-field' placeholder='2001 & 90%' value={Personel.ACADEMICS.YearPercentage1} onChange={(e) => { setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, YearPercentage1: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.YearPercentage1}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    University/Institute Name<br />
                                    <input type="text" className='text-field' placeholder='University/Institute' value={Personel.ACADEMICS.UniversityInstituteName1} onChange={(e) => { setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, UniversityInstituteName1: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.UniversityInstituteName1}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Programme & Stream<br />
                                    <input type="text" className='text-field' placeholder='B.E & CSE/M.E & CSE' value={Personel.ACADEMICS.ProgrammeStream1} onChange={(e) => { setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, ProgrammeStream1: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.ProgrammeStream1}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Year & Percentage<br />
                                    <input type="text" className='text-field' placeholder='2001 & 90%' value={Personel.ACADEMICS.YearPercentage2} onChange={(e) => setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, YearPercentage2: e.target.value } })} disabled={!isEdit} />
                                    <p id="error">{formError.YearPercentage2}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    University/Institute Name<br />
                                    <input type="text" className='text-field' placeholder='University/Institute' value={Personel.ACADEMICS.UniversityInstituteName2} onChange={(e) => { setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, UniversityInstituteName2: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.UniversityInstituteName2}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Programme & Stream<br />
                                    <input type="text" className='text-field' placeholder='B.E & CSE/M.E & CSE' value={Personel.ACADEMICS.ProgrammeStream2} onChange={(e) => { setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, ProgrammeStream2: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.ProgrammeStream2}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Year & Percentage<br />
                                    <input type="text" className='text-field' placeholder='2001 & 90%' value={Personel.ACADEMICS.YearPercentage3} onChange={(e) => setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, YearPercentage3: e.target.value } })} disabled={!isEdit} />
                                    <p id="error">{formError.YearPercentage3}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    University/Institute Name<br />
                                    <input type="text" className='text-field' placeholder='University/Institute' value={Personel.ACADEMICS.UniversityInstituteName3} onChange={(e) => { setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, UniversityInstituteName3: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.UniversityInstituteName3}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Programme & Stream<br />
                                    <input type="text" className='text-field' placeholder='B.E & CSE/M.E & CSE' value={Personel.ACADEMICS.ProgrammeStream3} onChange={(e) => { setPersonal({ ...Personel, ACADEMICS: { ...Personel.ACADEMICS, ProgrammeStream3: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.ProgrammeStream3}</p>
                                </label>


                            </div>


                            <div className="head">
                                <h2 className='head1'>Pre-Academic Qualification .</h2>
                            </div>

                            <div className="flex">
                                <label htmlFor="" className='field-name' >
                                    Year & Percentage <span style={{ fontSize: "12px" }}>(HSC)</span><br />
                                    <input type="text" className='text-field' placeholder='2001 & 90%' value={Personel.PRE_ACADEMICS.YearPercentageHSC} onChange={(e) => setPersonal({ ...Personel, PRE_ACADEMICS: { ...Personel.PRE_ACADEMICS, YearPercentageHSC: e.target.value } })} disabled={!isEdit} />
                                    <p id="error">{formError.YearPercentageHSC}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Institute/Board Name<br />
                                    <input type="text" className='text-field' placeholder='Institute/Board' value={Personel.PRE_ACADEMICS.InstituteBoardNameHSC} onChange={(e) => { setPersonal({ ...Personel, PRE_ACADEMICS: { ...Personel.PRE_ACADEMICS, InstituteBoardNameHSC: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.InstituteBoardNameHSC}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    HSC<br />
                                    <input type="text" className='text-field' placeholder='std' value={Personel.PRE_ACADEMICS.HSC} onChange={(e) => { setPersonal({ ...Personel, PRE_ACADEMICS: { ...Personel.PRE_ACADEMICS, HSC: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.HSC}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Year & Percentage <span style={{ fontSize: "12px" }}>(SSLC)</span><br />
                                    <input type="text" className='text-field' placeholder='2001 & 90%' value={Personel.PRE_ACADEMICS.YearPercentageSSLC} onChange={(e) => setPersonal({ ...Personel, PRE_ACADEMICS: { ...Personel.PRE_ACADEMICS, YearPercentageSSLC: e.target.value } })} disabled={!isEdit} />
                                    <p id="error">{formError.YearPercentageSSLC}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Institute/Board Name<br />
                                    <input type="text" className='text-field' placeholder='Institute/Board' value={Personel.PRE_ACADEMICS.InstituteBoardNameSSLC} onChange={(e) => { setPersonal({ ...Personel, PRE_ACADEMICS: { ...Personel.PRE_ACADEMICS, InstituteBoardNameSSLC: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.InstituteBoardNameSSLC}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    SSLC<br />
                                    <input type="text" className='text-field' placeholder='std' value={Personel.PRE_ACADEMICS.SSLC} onChange={(e) => { setPersonal({ ...Personel, PRE_ACADEMICS: { ...Personel.PRE_ACADEMICS, SSLC: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.SSLC}</p>
                                </label>



                            </div>





                            <div className="head">
                                <h2 className='head1'>Address Information .</h2>
                            </div>

                            <div className="flex">
                                <label htmlFor="" className='field-name' >
                                    Door No.<br />
                                    <input type="text" className='text-field' placeholder='Door No.' value={Personel.ADDRESS_DETAILS.Doorno} onChange={(e) => setPersonal({ ...Personel, ADDRESS_DETAILS: { ...Personel.ADDRESS_DETAILS, Doorno: e.target.value } })} disabled={!isEdit} />
                                    <p id="error">{formError.Doorno}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Street<br />
                                    <input type="text" className='text-field' placeholder='Street/Colony' value={Personel.ADDRESS_DETAILS.Street} onChange={(e) => { setPersonal({ ...Personel, ADDRESS_DETAILS: { ...Personel.ADDRESS_DETAILS, Street: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.Street}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    City<br />
                                    <input type="text" className='text-field' placeholder='City' value={Personel.ADDRESS_DETAILS.City} onChange={(e) => { setPersonal({ ...Personel, ADDRESS_DETAILS: { ...Personel.ADDRESS_DETAILS, City: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.City}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Landmark<br />
                                    <input type="text" className='text-field' placeholder='Eg: near SBI bank' value={Personel.ADDRESS_DETAILS.Landmark} onChange={(e) => { setPersonal({ ...Personel, ADDRESS_DETAILS: { ...Personel.ADDRESS_DETAILS, Landmark: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.Landmark}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    Pincode<br />
                                    <input type="number" className='text-field' placeholder='Pincode' value={Personel.ADDRESS_DETAILS.Pincode} onChange={(e) => { setPersonal({ ...Personel, ADDRESS_DETAILS: { ...Personel.ADDRESS_DETAILS, Pincode: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.Pincode}</p>
                                </label>
                                <label htmlFor="" className='field-name' >
                                    District<br />
                                    <input type="text" className='text-field' placeholder='District' value={Personel.ADDRESS_DETAILS.District} onChange={(e) => { setPersonal({ ...Personel, ADDRESS_DETAILS: { ...Personel.ADDRESS_DETAILS, District: e.target.value } }) }} disabled={!isEdit} />
                                    <p id="error">{formError.District}</p>
                                </label>
                                <label htmlFor="" className='field-name'>
                                    State<br />
                                    <select name="" id="" className='text-field ' value={Personel.ADDRESS_DETAILS.State} onChange={(e) => { setPersonal({ ...Personel, ADDRESS_DETAILS: { ...Personel.ADDRESS_DETAILS, State: e.target.value } }) }} disabled={!isEdit}>
                                        <option value="">Select a state</option>
                                        {indianStates.map((item, index) => (
                                            <option key={index} value={item} >{item}</option>
                                        ))}
                                    </select>
                                    <p id="error">{formError.State}</p>
                                </label>
                            </div>

                            <div id="display">
                                <div className="profile-save" >
                                    <button type='submit' onClick={Save}>Save</button>
                                </div>
                            </div>

                        </div>
                    </form>
                </div>

            </div>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                pauseOnFocusLoss={false}
                pauseOnHover={false}
                draggable={false}
                transition={Flip}
            />
        </>
    )
}

export default Profile