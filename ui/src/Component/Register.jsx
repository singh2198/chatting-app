import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const Register = () => {
    const [name, setName] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const userObject=[];

    // let  url = 'http://localhost:3032'
    let url = process.env.REACT_APP_BACKEND_URL || "https://localhost:3032/";


    
    const generateRandomId = () => Math.floor(Math.random() * 100000);

    
    const handleRegister = async (event) => {
        event.preventDefault();
        if (name.trim() === "") {
            alert("Please enter your name.");
            return;
        }
        const id = generateRandomId();
        setUserId(id);
        const createuser={
            "name":name,
            "socketId":id
        }

        try{
            const response= await fetch(`${url}/Register`,{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(createuser),
            });
            if(response.ok){
                const data = await response.json();
                console.log("User registered successfully:", data);
                navigate("/chat");
                setName("");
                  
            }
            else{
                console.error("Failed to register user:", response.statusText);
            }
        }catch(error){
            console.error("Error registering user:", error);
        }


    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Register Page</h2>
            <form onSubmit={handleRegister} style={styles.form}>
                <label style={styles.label}>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Register</button>
            </form>
            {userId && <p style={styles.successMessage}>Your User ID: {userId}</p>}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height:'100%',
        backgroundColor: "#f4f6f8",
        fontFamily: "Arial, sans-serif",
    },
    header: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    },
    label: {
        fontSize: "18px",
        marginBottom: "10px",
    },
    input: {
        padding: "10px",
        width: "200px",
        marginBottom: "20px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ddd",
        position:"static"
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontSize: "16px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    successMessage: {
        marginTop: "20px",
        fontSize: "18px",
        color: "#4CAF50",
    },
};

export default Register;
