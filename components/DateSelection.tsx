import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
// import DatePicker from 'react-date-picker';

import DatePicker from "react-datepicker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const DateSelection = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [value, onChange] = useState<Value>(new Date());

  return (
    // <DatePicker
    //   onChange={onChange}
    //   value={value as any}
    //   className="rounded-lg px-8 focus:outline-none bg-['#3f3f45']"
    //   calendarClassName ="bg-red-500"
    // />
    <DatePicker
      selected={startDate}
      showIcon
      isClearable
      icon={<CalendarDaysIcon className="w-6 h-6 px-4 mr-5" />}
      onChange={(date) => setStartDate(date as Date)}
      className="py-8 rounded-lg px-8 focus:outline-none w-full bg-['#3f3f45']"
    />
  );
};

export default DateSelection;
