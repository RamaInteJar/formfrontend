'use client';

import React, { useState } from 'react'
import  {Button, Checkbox, Input, Select, SelectItem} from '@nextui-org/react'
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const{login} = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: val,
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    login(formData.email, formData.password)

    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="w-full mr-5">
          <label>Email:</label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label>Password:</label>
          <Input name="password" type='password' value={formData.password} onChange={handleChange} />
        </div>
      <div className="mb-4">
        <Button type="submit" color="primary" variant="bordered">
          Submit
        </Button>
      </div>
    </form>
  )
}

export default LoginPage