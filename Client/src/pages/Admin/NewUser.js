import * as React from "react";
import AdminBar from '../../components/AdminBar'
import SideBarAdmin from '../../components/SideBarAdmin'

const NewUser = () => {
    return (
        <>
        <AdminBar/>
            <div className="createUser">
                <SideBarAdmin/>
            </div>
        </>
    );
};

export default NewUser;