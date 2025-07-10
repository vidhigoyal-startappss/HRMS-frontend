import React from 'react'
import { useNavigate } from 'react-router-dom'

const EmailSentMessge = () => {
    const navigate = useNavigate()
  return (
    <div className='flex justify-center items-center bg-[#226597] w-full min-h-screen gap-4'>
        <div>


        <h1>Thank You</h1>
        <p>Check Your Mail to Reset the Links</p>
        <button type="button" onClick={navigate('/')} className='bg-gray-400'>Go To Login</button>
        </div>
    </div>
  )
}

export default EmailSentMessge