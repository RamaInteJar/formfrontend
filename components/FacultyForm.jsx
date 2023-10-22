"use client"
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { Checkbox } from '@nextui-org/react'


import React, { useState } from 'react'
const FacultyForm = () => {
  const [formData, setFormData] = useState({
    staffName: '',
    dates: '',
    subNeed: false,
    fullDay: false,
    time: '',
    afterSchoolDuty: false,
    duty: '',
    reason: '',
    staffSignature: '',
    dated: '',
  })
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: val,
    }))
  }
  return (
    <form>
      <div className="flex mx-auto mb-4">
        <div className="w-full mr-5">
          <label>Faculty/Staff Name:</label>
          <Input
            name="staffName"
            value={formData.staffName}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label>Dates Requesting:</label>
          <Input name="dates" value={formData.dates} onChange={handleChange} />
        </div>
      </div>
      <div className="flex mx-auto mb-4">
        <div>
          <label>Sub Need:</label>
          <Checkbox
            name="subNeed"
            checked={formData.subNeed}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Full Day:</label>
          {/* <Checkbox
            name="fullDay"
            checked={formData.fullDay}
            onChange={handleChange}
          /> */}
        </div>
      </div>
      <div className="mb-4">
        <label>Time:</label>
        {/* <Select
          name="time"
          value={formData.time}
          onChange={handleChange}
          label="Time"
        >
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </Select> */}
      </div>
      <div className="mb-4">
        <label>After School Duty:</label>
        {/* <Checkbox
          name="afterSchoolDuty"
          checked={formData.afterSchoolDuty}
          onChange={handleChange}
        /> */}
      </div>
      <div className="mb-4">
        <label>Duty:</label>
        <Input name="duty" value={formData.duty} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label>Reason for Request:</label>
        {/* <Select
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          label="Reason for Request:"
        >
          <SelectItem value="Personal">Personal</SelectItem>
          <SelectItem value="Professional">Professional</SelectItem>
          <SelectItem value="Office">Office</SelectItem>
        </Select> */}
      </div>
      <div className="mb-4">
        <label>Staff Signature:</label>
        <Input
          name="staffSignature"
          value={formData.staffSignature}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label>Dated:</label>
        <Input name="dated" value={formData.dated} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <Button type="submit" color="primary" variant="bordered">
          Submit
        </Button>
      </div>
    </form>
  )
}

export default FacultyForm