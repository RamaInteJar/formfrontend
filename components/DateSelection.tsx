import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'
import DatePicker from "react-datepicker";

const DateSelection = () => {
    const [startDate, setStartDate] = useState(new Date());
  return (
    <DatePicker
    selected={startDate}
    showIcon
    isClearable
    icon={<CalendarDaysIcon className="w-6 h-6 px-4 mr-5" />}
    onChange={(date) => setStartDate(date as Date)}
    className="py-8 rounded-lg px-8 focus:outline-none w-full bg-['#3f3f45']"
  />
  )
}

export default DateSelection