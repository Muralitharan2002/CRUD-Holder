import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ValidateResetPass } from './Validation';
import { useParams } from 'react-router-dom';
import { ToastContainer, Flip, toast } from 'react-toastify';
import axios from 'axios';

function ResetPassword() {
    const [newPassword, setnewPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [shownewPassword, setshownewPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const [formErrors, setformErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const { Role, _id, token } = useParams();

    const togglePasswordNew = () => {
        setshownewPassword(!shownewPassword)
    }
    const togglePasswordConfirm = () => {
        setshowConfirmPassword(!showConfirmPassword)
    }

    const ResetPass = (e) => {
        e.preventDefault();
        const Error = ValidateResetPass(newPassword, ConfirmPassword);
        setformErrors(Error);

        if (Object.keys(Error).length === 0) {
            setLoading(true)
            try {
                axios.post(`https://crud-holder.onrender.com/router/passwordChange/${Role}/${_id}/${token}`, { newPassword, ConfirmPassword }, { withCredentials: true })
                    .then((res) => {
                        if (res.data.status === "success") {
                            toast.success("Successfully Reset Password")
                        } else if (res.data.status === "error") {
                            toast.error("password confirmation does not match!")
                        } else {
                            toast.error("Link Expired!")
                        }
                    })
                    .catch((err) => {
                        console.log("ResetPassword axios problem", err)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
            catch (err) {
                console.log("ResetPassword process failed", err)
            }
        }


    }

    return (
        <>
            <div className="page">
                <div className="Reset-container">
                    <div style={loading ? { display: "block" } : { display: "none" }} ><div className="loader-line"></div></div>
                    <form onSubmit={ResetPass}>
                        <h1 className="Rpass-title">
                            Reset Password
                        </h1>
                        <div className="Rpass-field1">
                            <input type={shownewPassword ? "text" : "password"} value={newPassword} style={{ zIndex: "99" }} placeholder='New Password' className='password' onChange={(e) => { setnewPassword(e.target.value) }} />
                            {shownewPassword ? <AiOutlineEye className='eye' style={{ zIndex: "999" }} onClick={togglePasswordNew}></AiOutlineEye> : <AiOutlineEyeInvisible className='eye' onClick={togglePasswordNew}></AiOutlineEyeInvisible>}

                            <p id="Email-msg">{formErrors.newPassword}</p>
                        </div>
                        <div className="Rpass-field">
                            <input type={showConfirmPassword ? "text" : "password"} value={ConfirmPassword} placeholder='Confirm Password' className='password' onChange={(e) => { setConfirmPassword(e.target.value) }} />
                            {showConfirmPassword ? <AiOutlineEye className='eye' onClick={togglePasswordConfirm}></AiOutlineEye> : <AiOutlineEyeInvisible className='eye' onClick={togglePasswordConfirm}></AiOutlineEyeInvisible>}

                            <p id="Email-msg">{formErrors.ConfirmPassword}</p>
                        </div>

                        <div className="container-btn Rpass-btn">
                            <button className='signin-btn'>Reset</button>
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

export default ResetPassword

