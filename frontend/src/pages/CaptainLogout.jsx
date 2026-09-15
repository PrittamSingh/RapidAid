import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CaptainLogout = () => {
    const token = localStorage.getItem('captain-token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) {
            // No token, just redirect to login
            navigate('/CaptainLogin')
            return
        }

      const respond=  axios.get(`${import.meta.env.VITE_API_URL}/api/v1/captain/logout`, {
            headers: {
                Authorization: `Bearer ${token}`//we set also token in header to verify the user as headers token or cookie token
            }
        })
        .then((response) => {
            if (response.status === 200) {
                localStorage.removeItem('captain-token')
                navigate('/CaptainLogin') 
            }
            else  {
                console.log("Logout failed")
            }
        })
        .catch((err) => {
            console.error("Logout error", err)
            localStorage.removeItem('captain-token')
            navigate('/CaptainLogin')
        })
        
    }, [])
    

    return (
        <div>Logging out...</div>
    )
}

export default CaptainLogout
