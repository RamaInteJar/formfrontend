"use client";
import { useAuth } from "@/providers/authProvider";
import { submitForm } from "@/utils/apiCalls";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/react";
import { Select,SelectSection, SelectItem } from "@nextui-org/react";
import { Checkbox } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
const reasonData = [
  {
    id: 1,
    reason: "Personal",
  },
  {
    id: 2,
    reason: "Professional",
  },
  {
    id: 3,
    reason: "Others",
  },
];

const FacultyForm = () => {
  const [formData, setFormData] = useState({
    sub_needed: false,
    full_day: false,
    times: "",
    after_school: false,
    duty: "",
    reason: "",
  });
  const { accessToken } = useAuth();

  const [timeValue, setTimeValue] = useState("");
  const [reasonValue, setReasonValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: val,
    }));
  };

  console.log(formData.full_day);

  const handleTimeChange = (e: any) => {
    setTimeValue(e.target.value);
  };
  const handleReasonChange = (e: any) => {
    setReasonValue(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Add time and reason values manually to formData before sending the form data
    const updatedFormData = {
      ...formData,
      times: timeValue,
      reason: reasonValue,
    };

    try {
      await submitForm(updatedFormData, accessToken);
      setIsSubmitted(true);
      router.push("/faculty");

      console.log("Form submitted successfully:", updatedFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 ">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 md:space-y-6 sm:p-8"
        >
          <Input
            name="duty"
            value={formData.duty}
            type="text"
            label="Duty"
            onChange={handleChange}
          />
          <div className="flex mx-auto mb-4">
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
              name="afterSchoolDuty"
              checked={formData.after_school}
              onChange={handleChange}
            />
          </div>

          {!formData.full_day && (
            <div className="mb-4">
              <Select
                value={timeValue}
                name="times"
                onChange={handleTimeChange}
                label="Time"
              >
                {timeData.map((times) => (
                  <SelectItem value={times.times} key={times.times}>
                    {times.times}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
          <div className="mb-4">
            <Select
              value={reasonValue}
              name="reason"
              onChange={handleReasonChange}
              label="Reason for Request:"
            >
              {reasonData.map((item) => (
                <SelectItem value={item.reason} key={item.reason}>
                  {item.reason}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mb-4">
            {isSubmitted ? (
              <Button color="primary" isLoading variant="bordered" className="w-full">
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
