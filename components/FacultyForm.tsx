"use client"
import { Input } from '@nextui-org/react'
import { Button } from '@nextui-org/react'
import {Select, SelectItem } from '@nextui-org/react'
import { Checkbox } from '@nextui-org/react'
import { useState } from 'react'
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
  const handleChange = (e: any) => {
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
          <label>Sub Needed:</label>
          <Checkbox
            name="subNeed"
            checked={formData.subNeed}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Full Day:</label>
          <Checkbox
            name="fullDay"
            checked={formData.fullDay}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label>Time:</label>
        <Select
          name="time"
          value={formData.time}
          onChange={handleChange}
          label="Time"
        >
          <SelectItem value="AM" key={''}>AM</SelectItem>
          <SelectItem value="PM" key={''}>PM</SelectItem>
        </Select>
      </div>
      <div className="mb-4">
        <label>After School Duty:</label>
        <Checkbox
          name="afterSchoolDuty"
          checked={formData.afterSchoolDuty}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label>Duty:</label>
        <Input name="duty" value={formData.duty} onChange={handleChange} />
      </div>
      <div className="mb-4">
        <label>Reason for Request:</label>
        <Select
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          label="Reason for Request:"
        >
          <SelectItem value="Personal" key={''}>Personal</SelectItem>
          <SelectItem value="Professional" key={''}>Professional</SelectItem>
          <SelectItem value="Office" key={''}>Office</SelectItem>
        </Select>
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