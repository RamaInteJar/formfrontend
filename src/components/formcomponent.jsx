import React from 'react'

const formcomponent = () => {
  return (
    <form action="">
        <label htmlFor="Staff Name">Staff Name</label>
        <input type="text" name="Staff Name" id="Staff Name" />
        <label htmlFor="Date">Requesting Date</label>
        <input type="date" name="Date" id="Date" />
        <label htmlFor="Sub">Department</label>
    </form>
  )
}

export default formcomponent