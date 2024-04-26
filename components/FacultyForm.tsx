"use client";
import { useAuth } from "@/providers/authProvider";
import { sendEmailNotification, submitForm } from "@/utils/apiCalls";
import {
  Select,
  Checkbox,
  SelectItem,
  Button,
  Input,
  Textarea,
  DatePicker,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { reasons } from "@/config/data";
import { getLocalTimeZone, today } from "@internationalized/date";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { parseDate } from "@internationalized/date";

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
  emergency: boolean;
  descriptions: string | null;
};

const nowDate = new Date();
const isoDateString = nowDate.toISOString();
const datePartOnly = isoDateString.split("T")[0];

const FacultyForm = () => {
  const [formData, setFormData] = useState<formDataType>({
    sub_needed: false,
    full_day: false,
    times: null,
    after_school: false,
    duty: null,
    reason: null,
    emergency: false,
    descriptions: null,
  });
  const { accessToken } = useAuth();

  const [timeValue, setTimeValue] = useState(null);
  const [reasonValue, setReasonValue] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [startDate, setStartDate] = useState(
    parseDate(datePartOnly.toString())
  );

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
      start_date: startDate.toString(),
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
        emergency: false,
        descriptions: null,
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
          <div className="flex mx-auto mb-4 justify-between">
            <div className="mb-4">
              <label>After School Duty:</label>
              <Checkbox
                name="after_school"
                isSelected={formData.after_school}
                onChange={handleChange}
                isDisabled={formData.emergency ?? formData.after_school}
              />
            </div>
            <div className="mb-4">
              <label>Emergency:</label>
              <Checkbox
                name="emergency"
                isSelected={formData.emergency}
                onChange={handleChange}
                isDisabled={formData.after_school ?? formData.emergency}
              />
            </div>
          </div>
          {!formData.emergency && (
            <div className="w-full items-center justify-between flex">
              <DatePicker
                label="Start Date"
                variant="flat"
                showMonthAndYearPickers
                value={startDate}
                onChange={setStartDate}
                minValue={today(getLocalTimeZone())}
                defaultValue={today(getLocalTimeZone()).subtract({ days: 14 })}
              />
            </div>
          )}

          <div className="flex mx-auto mb-4 justify-between">
            <div>
              <label>Sub Needed:</label>
              <Checkbox
                name="sub_needed"
                isSelected={formData.sub_needed}
                isDisabled={formData.full_day ?? formData.sub_needed}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Full Day:</label>
              <Checkbox
                name="full_day"
                isSelected={formData.full_day}
                isDisabled={formData.sub_needed ?? formData.full_day}
                onChange={handleChange}
              />
            </div>
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

          {reasonValue === "others" && (
            <Textarea
              // isInvalid={true}
              variant="bordered"
              label="Description"
              placeholder="Enter your description"
              name="descriptions"
              value={formData.descriptions || ""}
              onChange={handleChange}
              // errorMessage="The description should be at least 255 characters long."
              className="w-full"
            />
          )}

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
