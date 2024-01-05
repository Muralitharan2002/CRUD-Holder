import React, { useState } from 'react';
import '../Assets/Style/Component.css';
import { GiHamburgerMenu } from 'react-icons/gi'
import { CgProfile } from 'react-icons/cg'
import { RiAdminLine } from 'react-icons/ri'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import { BiLogInCircle } from 'react-icons/bi'
import { NavLink } from 'react-router-dom';



function DashBoard({ children }) {
    const [Open, setOpen] = useState(false);
    const toggle = () => setOpen(!Open);

    const MenuItem = [
        {
            Path: "/",
            Name: "Login",
            Logo: <BiLogInCircle />
        },
        {
            Path: "/signup",
            Name: "Signup",
            Logo: <AiOutlineUsergroupAdd />
        },
        {
            Path: "/Profile",
            Name: "Profile",
            Logo: <CgProfile />
        },
        {
            Path: "/Admin",
            Name: "Admin",
            Logo: <RiAdminLine />
        }
    ]


    return (
        <>
            <div className="dashboard-section">
                <div className="sidebar" style={{ width: Open ? "50px" : "250px" }}>
                    <div className="top-head" onClick={toggle}>
                        <div> <GiHamburgerMenu className='hamburger' /></div>
                        <div className="logo-name" >
                            DashBoard
                        </div>
                    </div>

                    {
                        MenuItem.map((data, index) => (
                            <NavLink className="menu-item" to={data.Path} key={index}>
                                <div className="icon">
                                    {data.Logo}
                                </div>
                                <div className="icon-text" >
                                    {data.Name}
                                </div>
                            </NavLink>
                        ))
                    }

                </div>
                <main>{children}</main>
            </div>
        </>
    );
}

export default DashBoard