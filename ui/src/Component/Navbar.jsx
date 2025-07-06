import { useState } from "react";
import "../index.css"
import SideProfile from "./SideProfile.jsx"
import { useEffect } from "react";




const  Navbar=()=> {

    const [drawer,setdrawer]=useState(false);
    const toggleDrawer=()=>{
        setdrawer(true);
        console.log(drawer)
    }

    return (
        <>

            <div className="sidNav" >
                <SideProfile/>
            </div>
            
        </>
      )

}

export default Navbar;