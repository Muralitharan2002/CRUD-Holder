import React, { useState, useContext, useEffect } from 'react'
import { MdDeleteForever } from "react-icons/md"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Flip, toast, ToastContainer } from 'react-toastify'
import { BiLogOutCircle } from "react-icons/bi";
import { UserAuth } from '../App'


function Admin({ onAdminLogout }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ Users: [], VerifiedUser: 0, unVerifiedUser: 0, UpdatedUser: [] })
    const navigate = useNavigate();
    const [key, setKey] = useState("");
    const { isAdmin } = useContext(UserAuth)




    const AllUsers = () => {
        setLoading(true)
        axios.get("https://crud-holder.onrender.com/router/AdminFetch", { withCredentials: true })
            .then((res) => {
                if (res) {
                    setData(res.data);
                } else {
                    console.log(res.data)
                }
            })
            .catch((err) => {
                console.log("Admin Fetching process failed", err)
            }).finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        AllUsers();
    }, [])


    const Delete = (userID, Name, isVerified) => {
        axios.delete(`https://crud-holder.onrender.com/router/AdminDelete/${Name}/${userID}`, { withCredentials: true })
            .then((result) => {
                if (result.data.status === "success") {
                    setData((PrevData) => ({
                        ...PrevData,
                        Users: PrevData.Users.filter(user => user._id !== userID),
                        VerifiedUser: isVerified ? PrevData.VerifiedUser - 1 : PrevData.VerifiedUser,
                        unVerifiedUser: isVerified ? PrevData.unVerifiedUser : PrevData.unVerifiedUser - 1,
                        UpdatedUser: PrevData.UpdatedUser.filter(user => user.UserID !== userID)
                    }))
                    toast.success(`${Name} Account deleted !`)
                } else {
                    console.log("Deleted function failed", result.data)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }





    const logout = () => {
        axios.post("https://crud-holder.onrender.com/router/userlogout", {}, { withCredentials: true })
            .then((result) => {
                if (result.data.status === "success") {
                    onAdminLogout();
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
            <div className="msg-slide" style={isAdmin ? { display: "none" } : { display: "flex" }}>
                <div className="msg-box">
                    <h2>Admin,<br /> You forgot to Login !</h2>
                </div>
            </div>

            <div className="admin-page" style={isAdmin ? { filter: "blur(0)" } : { filter: "blur(15px)", pointerEvents: "none" }}>
                <div className="head-bar head-bar1">
                    <h1 className="Heading">
                        Admin .
                    </h1>
                    <p><BiLogOutCircle className='log-out' onClick={logout} /></p>
                </div>
                {loading ? (
                    <span className="loader"></span>)
                    : (
                        <div className="dashboard">
                            <div className="grid-line">
                                <div className="grid">
                                    {data.Users && (
                                        <h1 className='value'>{data.Users.length}</h1>
                                    )}
                                    <h3 className='value-name'>Total Users</h3>
                                </div>
                                <div className="grid">
                                    <h1 className='value'>{data.VerifiedUser}</h1>
                                    <h3 className='value-name'>Verified Users</h3>
                                </div>
                                <div className="grid">
                                    {data.UpdatedUser && (
                                        <h1 className='value'>{data.UpdatedUser.length}</h1>
                                    )}
                                    <h3 className='value-name'>Updated Users</h3>
                                </div>
                                <div className="grid">
                                    <h1 className='value'>{data.unVerifiedUser}</h1>
                                    <h3 className='value-name'>UnVerified Users</h3>
                                </div>
                            </div>
                            <div className="section">
                                <div className="section-flex">
                                    <h4 className='company-title'>Holder Users</h4>
                                    <div className="searchflex">
                                        <div className="search-field">
                                            <input type="search" className="search-bar" placeholder='Search' onChange={(e) => { setKey(e.target.value) }} />
                                            {/* <MdSearch className='glass' /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-line"></div>

                                <div className="table-container">
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Created</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.Users && data.Users.filter((item) => {
                                                return key.toLowerCase() === "" ?
                                                    item : item.Name.toLowerCase().includes(key);
                                            }).map((item, index) => (
                                                <tr key={index} >
                                                    <td>{index + 1}</td>
                                                    <td >{item.Name}</td>
                                                    <td>{item.Email}</td>
                                                    <td>{new Date(item.ExpireAt).toLocaleDateString()}</td>
                                                    <td>{(item.isVerified) ? "Verified" : "Pending"}</td>
                                                    <td ><MdDeleteForever className='delete' onClick={() => { Delete(item._id, item.Name, item.isVerified) }} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div >
                    )}
            </div >
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

export default Admin