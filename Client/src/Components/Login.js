import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { FcGoogle } from 'react-icons/fc'
import { validateEmailPassword, ValidateReset } from './Validation';
import { Flip, toast, ToastContainer } from 'react-toastify';
import '../Assets/Style/Component.css'
import axios from 'axios';



function Login({ onUserLogin, onAdminLogin }) {
    const [Email, SetEmail] = useState("");
    const [Password, setPassword] = useState("");
    const [showPassword, setshowPassword] = useState(false);
    const [formErrors, setformErrors] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAdmin, setAdmin] = useState(false);


    const handleCheckbox = () => {
        setAdmin(!isAdmin)
    }


    const togglePassword = () => {
        setshowPassword(!showPassword)
    }

    const handlesubmit = async (e) => {
        e.preventDefault();

        const Error = validateEmailPassword(Email, Password);
        setformErrors(Error);

        if (Object.keys(Error).length === 0) {
            setLoading(true)

            if (isAdmin) {
                await axios.post("http://localhost:3800/router/Adminlogin", { Email, Password }, { withCredentials: true })
                    .then((res) => {
                        if (res.data.status === "success") {
                            document.clearAllCookie();
                            onAdminLogin()
                            navigate("/Admin");
                        } else if (res.data.status === "warning") {
                            toast.error("You must verify your mailID")
                        }
                        else if (res.data.status === "error1") {
                            toast.error("Invalid credentials")
                        } else if (res.data.status === "error2") {
                            toast.error("Admin yet not registered")
                        }
                        else {
                            console.log(res.data)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } else {
                await axios.post("http://localhost:3800/router/login", { Email, Password }, { withCredentials: true })
                    .then((res) => {
                        if (res.data.status === "success") {
                            onUserLogin();
                            navigate("/profile");
                        } else if (res.data.status === "warning") {
                            toast.error("You must verify your mailID")
                        }
                        else if (res.data.status === "error1") {
                            toast.error("Invalid credentials")
                        } else if (res.data.status === "error2") {
                            toast.error("user yet not registered")
                        }
                        else {
                            console.log(res.data)
                        }
                    })
                    .catch((err) => {
                        console.log(err)

                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        } else {
            console.log(Object.keys(Error).length)
        }
    }


    const ResetPassword = async () => {
        const Error = ValidateReset(Email);
        setformErrors(Error);

        if (isAdmin) {
            if (Object.keys(Error).length === 0) {
                setLoading(true)
                await axios.post("http://localhost:3800/router/AdminForgotPassword", { Email })
                    .then((res) => {
                        if (res.data.status === "success") {
                            toast.success("A Link sent to your Mail for Reset Password");
                        } else if (res.data.status === "warning") {
                            toast.info("Already link sent for reset your password");
                        } else {
                            toast.error("Admin not yet Register");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        setLoading(false)
                    })

            } else {
                console.log(Object.keys(Error).length);
            }
        } else {
            if (Object.keys(Error).length === 0) {
                setLoading(true)
                await axios.post("http://localhost:3800/router/ForgotPassword", { Email })
                    .then((res) => {
                        if (res.data.status === "success") {
                            toast.success("A Link sent to your Mail for Reset Password");
                        } else if (res.data.status === "warning") {
                            toast.info("Already link sent for reset your password");
                        } else {
                            toast.error("User not yet Register");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        setLoading(false)
                    })

            } else {
                console.log(Object.keys(Error).length);
            }
        }
    }



    return (
        <>
            <div className="div-center">
                <div className="container-login">
                    <div style={loading ? { display: "block" } : { display: "none" }} ><div className="loader-line"></div></div>
                    <div className="container-center">

                        <h1 className="container-title">
                            Login
                        </h1>

                        <p className="container-para">Hi, Welcome back</p>

                        <form className="signin" onSubmit={handlesubmit} noValidate>


                            <div className="email-field">
                                <input type="email" placeholder='Email' className='email' value={Email} onChange={(e) => { SetEmail(e.target.value) }} />
                                <p id="Email-msg">{formErrors.email}</p>
                            </div>


                            <div className="password-field">
                                <input type={showPassword ? "text" : "password"} value={Password} placeholder='Password' className='password' onChange={(e) => { setPassword(e.target.value) }} />
                                {showPassword ? <AiOutlineEye className='eye' onClick={togglePassword}></AiOutlineEye> : <AiOutlineEyeInvisible className='eye' onClick={togglePassword}></AiOutlineEyeInvisible>}

                                <p id="Email-msg">{formErrors.password}</p>
                            </div>


                            <div className="admin-way">
                                <label className='checkbox'>
                                    <input type="checkbox" checked={isAdmin} onChange={handleCheckbox} />
                                    Admin
                                </label>
                                <p className="link1" onClick={ResetPassword}>Forgot password?</p>
                            </div>

                            <div className="container-btn">
                                <button className='signin-btn'>Login</button>
                            </div>
                        </form>
                        <p className="link-signup">Don't have an account? <Link to={'/signup'} className="link2">Signup</Link></p>

                        <div className="break-line">
                            <p className="line"></p>
                            <p className="or">Or</p>
                        </div>

                        <div className="google">
                            <button className='google-login'><FcGoogle className='google-logo' />Login with Google</button>
                        </div>

                    </div>
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

export default Login
