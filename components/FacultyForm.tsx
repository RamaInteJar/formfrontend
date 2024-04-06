"use client";
import { useAuth } from "@/providers/authProvider";
import { sendEmailNotification, submitForm } from "@/utils/apiCalls";
import { Select, Checkbox, SelectItem, Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { reasons } from "@/config/data";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  CalendarDaysIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const timeData = [
  {
    id: 1,
    times: "AM",
  },
  {
    id: 2,
    times: "PM",
  },
];

type emailDataType = {
  subject: string;
  message: string;
  recipients: string[];
};

type formDataType = {
  sub_needed: boolean;
  full_day: boolean;
  times: string | null;
  after_school: boolean;
  duty: string | null;
  reason: string | null;
};

const FacultyForm = () => {
  const [formData, setFormData] = useState<formDataType>({
    sub_needed: false,
    full_day: false,
    times: null,
    after_school: false,
    duty: null,
    reason: null,
  });
  const { accessToken } = useAuth();

  const [timeValue, setTimeValue] = useState(null);
  const [reasonValue, setReasonValue] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: val,
    }));
  };

  const handleTimeChange = (e: any) => {
    setTimeValue(e.target.value);
  };
  const handleReasonChange = (e: any) => {
    setReasonValue(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Add time and reason values manually to formData before sending the form data
    const updatedFormData: formDataType | any = {
      ...formData,
      times: timeValue,
      reason: reasonValue,
      start_date: startDate
    };

    if (
      updatedFormData.duty === null &&
      updatedFormData.reason === null &&
      updatedFormData.times === null
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitted(true);
      let response = await submitForm(updatedFormData, accessToken);
      // router.push('/faculty');

      if (response) {
        toast.success(response.message);

        let emailData: emailDataType = {
          subject: `TimeOff application `,
          message: formData.duty + " " + `${reasonValue}`,
          recipients: process.env.NEXT_PUBLIC_ADMIN_EMAIL!.split(","),
        };
        try {
          const email_res = await sendEmailNotification(emailData);
          if (email_res) {
            toast.success(email_res.message);
            router.back();
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data.detail);
      setIsSubmitted(false);
    } finally {
      setIsSubmitted(false);
      setFormData({
        full_day: false,
        sub_needed: false,
        after_school: false,
        duty: null,
        times: null,
        reason: null,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 ">
      <div className="mb-5 bg-white rounded-lg  dark:bg-gray-900 dark:border-gray-700">
        <div className="flex justify-center items-center px-2 py-4">
          <ExclamationCircleIcon className="w-6 h-6 text-yellow-400" />
          <p className="p-1">
            Time off request should be submitted two weeks prior.
          </p>
        </div>
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 md:space-y-6 sm:p-8"
        >
          <Input
            name="duty"
            value={formData.duty || ""}
            type="text"
            label="Duty"
            onChange={handleChange}
            size="sm"
          />
          <div className="w-full items-center justify-between flex">
            <label className="flex-1">Start Date:</label>
            <DatePicker
              selected={startDate}
              showIcon
              isClearable
              icon={<CalendarDaysIcon className="w-6 h-6 px-4 mr-5" />}
              onChange={(date) => setStartDate(date as Date)}
              className="py-8 rounded-lg px-8 focus:outline-none w-full bg-['#3f3f45']"
            />
          </div>
          <div className="flex mx-auto mb-4 justify-between">
            <div>
              <label>Sub Needed:</label>
              <Checkbox
                name="sub_needed"
                checked={formData.sub_needed}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Full Day:</label>
              <Checkbox
                name="full_day"
                checked={formData.full_day}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label>After School Duty:</label>
            <Checkbox
              name="after_school"
              checked={formData.after_school}
              onChange={handleChange}
            />
          </div>

          {!formData.full_day && (
            <div className="mb-4">
              <Select
                value={timeValue || ""}
                name="times"
                onChange={handleTimeChange}
                items={timeData}
                label="Time"
                size="sm"
              >
                {(time) => (
                  <SelectItem value={time.times} key={time.times}>
                    {time.times}
                  </SelectItem>
                )}
              </Select>
            </div>
          )}

          <div className="mb-4">
            <Select
              items={reasons}
              label="Reason for Request:"
              size="sm"
              value={reasonValue || ""}
              name="reason"
              onChange={handleReasonChange}
            >
              {(reason) => (
                <SelectItem key={reason.value}>{reason.label}</SelectItem>
              )}
            </Select>
          </div>
          <div className="mb-4">
            {isSubmitted ? (
              <Button
                color="primary"
                isLoading
                variant="bordered"
                className="w-full"
              >
                Loading
              </Button>
            ) : (
              <Button
                type="submit"
                color="primary"
                variant="bordered"
                className="w-full"
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyForm;
