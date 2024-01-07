import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { Flip, toast, ToastContainer } from 'react-toastify';
import { validateSignUp, validateEmailPassword, ValidateAdmin } from "./Validation"
import 'react-toastify/dist/ReactToastify.css';
import '../Assets/Style/Component.css';
import axios from "axios";


function SignUp() {

    const [Name, SetName] = useState("");
    const [Email, SetEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [showPassword, setshowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [keyStatus, setkeyStatus] = useState({});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [adminKey, setadminKey] = useState("");

    const togglePassword = () => {
        setshowPassword(!showPassword)
    }
    const handleCheckbox = () => {
        setAdmin(!isAdmin)
    }

    const handleUserSubmit = (e) => {
        e.preventDefault();
        const errors = validateSignUp(Name, Email, Password);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setLoading(true)
            axios.post("https://crud-holder.onrender.com/router/create", { Name, Email, Password })
                .then((response) => {
                    if (response.data.status === "Exist") {
                        toast.info("User already exists!");
                    } else if (response.data.status === "success") {
                        toast.success("An Email sent to your account please verify");
                        setTimeout(() => {
                            navigate('/');
                        }, 3100);
                    }
                    else {
                        console.log(response.data)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false)
                })
        }

    }
    const handleAdminSubmit = (e) => {
        e.preventDefault();
        const Error = ValidateAdmin(adminKey);
        setkeyStatus(Error);
        const errors = validateEmailPassword(Email, Password);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            setLoading(true)
            axios.post("https://crud-holder.onrender.com/router/AdminCreate", { adminKey, Email, Password })
                .then((response) => {
                    if (response.data.status === "warning") {
                        toast.info("Admin already exists!");
                    } else if (response.data.status === "success") {
                        toast.success("An Email sent to your account please verify");
                        setTimeout(() => {
                            navigate('/');
                        }, 3100);
                    } else if (response.data.status === "error") {
                        toast.success("Invaid AdminKey!");
                    }
                    else {
                        toast.success("Action Failed!");

                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false)
                })
        }

    }

    return (
        <>
            <div className="div-center">
                <div className="container-signup">
                    <div style={loading ? { display: "block" } : { display: "none" }} ><div className="loader-line"></div></div>
                    <div className="container-center">
                        <h1 className="container-title">
                            Signup
                        </h1>

                        <p className="container-para">Create Account</p>

                        <form className="signin" onSubmit={isAdmin ? handleAdminSubmit : handleUserSubmit} noValidate>
                            {isAdmin ? <div className="email-field">
                                <input type="text" placeholder='Admin Key' className='email' value={adminKey} onChange={(e) => { setadminKey(e.target.value) }} />
                                <p id="Email-msg">{keyStatus.KeyError}</p>
                            </div> : <div className="name-field">
                                <input type="text" placeholder='Name' className='name' autoComplete='on' value={Name} onChange={(e) => { SetName(e.target.value) }} />
                                <p id="Name-msg">{formErrors.name}</p>
                            </div>}

                            <div className="email-field">
                                <input type="email" placeholder='Email' className='email' value={Email} onChange={(e) => { SetEmail(e.target.value) }} />
                                <p id="Email-msg">{formErrors.email}</p>
                            </div>

                            <div className="password-field1">
                                <input type={showPassword ? "text" : "password"} value={Password} placeholder='Password' className='password' onChange={(e) => { setPassword(e.target.value) }} />
                                {showPassword ? <AiOutlineEye className='eye' onClick={togglePassword}></AiOutlineEye> : <AiOutlineEyeInvisible className='eye' onClick={togglePassword}></AiOutlineEyeInvisible>}

                                <p id="Password-msg">{formErrors.password}</p>
                            </div>

                            <div className='signup-admin'>
                                <label className='checkbox'>
                                    <input type="checkbox" checked={isAdmin} onChange={handleCheckbox} />
                                    Admin
                                </label>
                            </div>

                            <div className="container-btn">
                                <button className='signin-btn'>Signup</button>
                            </div>
                        </form>
                        <p className="link-signup">Already have an account? <Link to={'/'} className="link2">Login</Link> here</p>

                        <div className="break-line">
                            <p className="line"></p>
                            <p className="or">Or</p>
                        </div>

                        <div className="google">
                            <button className='google-login'><FcGoogle className='google-logo' />Signup with Google</button>
                        </div>

                    </div>
                </div>
            </div>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                // pauseOnFocusLoss={false}
                pauseOnHover={false}
                draggable={false}
                transition={Flip}
            />
        </>
    )
}

export default SignUp