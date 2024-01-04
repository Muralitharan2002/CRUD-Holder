import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Smail from "../Assets/images/Smail.svg"
import Fmail from "../Assets/images/Fmail.svg"

function EmailVerification() {
    const [emailStatus, setemailStatus] = useState("verifing...");
    const [success, setSuccess] = useState();
    const [loading, setLoading] = useState(false);
    const { Role, _id, token } = useParams();
    console.log(Role, _id, token);


    useEffect(() => {
        setLoading(true)
        axios
            .get(`http://localhost:3800/router/verify/${Role}/${_id}/${token}`)
            .then((res) => {
                if (res.data.status === "success") {
                    setemailStatus("Email verified successfully")
                    setSuccess(true)
                } else if (res.data.status === "failed") {
                    setemailStatus("Invalid or expired Email Verification.")
                    setSuccess(false)
                } else {
                    setemailStatus("Email verification process failed")
                    setSuccess(false)
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [Role, _id, token])

    return (
        <>

            <div className='Everify-container'>
                <div className="divider custom-shape-divider-top-1703519057">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M1200 0L0 0 598.97 114.72 1200 0z" className="shape-fill"></path>
                    </svg>
                </div>

                {loading ? (
                    <span className="loader"></span>)
                    : (
                        <>
                            <div className="img">
                                <img src={success ? Smail : Fmail} alt="Svg Img" />
                            </div>

                            <div className="contents">
                                <h1 className="title">Email Verification Status</h1>
                                <h2 className="title1" style={success ? { color: "#129e35" } : { color: "#f82222" }}>{emailStatus}</h2>
                            </div>
                        </>)
                }
            </div>


        </>
    );
}

export default EmailVerification