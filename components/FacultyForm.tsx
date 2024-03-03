'use client';
import { useAuth } from '@/providers/authProvider';
import { sendEmailNotification, submitForm } from '@/utils/apiCalls';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Select, SelectSection, SelectItem } from '@nextui-org/react';
import { Checkbox } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const timeData = [
  {
    id: 1,
    times: 'AM',
  },
  {
    id: 2,
    times: 'PM',
  },
];
const reasonData = [
  {
    id: 1,
    reason: 'Personal',
  },
  {
    id: 2,
    reason: 'Professional',
  },
  {
    id: 3,
    reason: 'Others',
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

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
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
    };

    if (
      updatedFormData.duty === null &&
      updatedFormData.reason === null &&
      updatedFormData.times === null
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      let response = await submitForm(updatedFormData, accessToken);
      setIsSubmitted(true);
      // router.push('/faculty');

      if (response) {
        toast.success(response.message);
        setIsSubmitted(false);
        setFormData({
          full_day: false,
          sub_needed: false,
          after_school: false,
          duty: null,
          times: null,
          reason: null,
        });


        let emailData: emailDataType = {
          subject: `TimeOff application `,
          message: formData.duty + ' ' + `${reasonValue}`,
          recipients: process.env.NEXT_PUBLIC_ADMIN_EMAIL!.split(','),
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
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-900 dark:border-gray-700">
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 md:space-y-6 sm:p-8"
        >
          <Input
            name="duty"
            value={formData.duty || ''}
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
              name="after_school"
              checked={formData.after_school}
              onChange={handleChange}
            />
          </div>

          {!formData.full_day && (
            <div className="mb-4">
              <Select
                value={timeValue || ''}
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
              value={reasonValue || ''}
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
