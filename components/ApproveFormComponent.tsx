'use client';
import { useAuth } from '@/providers/authProvider';
import { IEmailData } from '@/types';
import { ApproveForm, sendEmailNotification } from '@/utils/apiCalls';
import { Textarea } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ApproveFromProps {
  faculty_id: string | undefined;
  email: string | undefined;
}

const ApproveFormComponent: React.FC<ApproveFromProps> = ({
  faculty_id,
  email,
}) => {
  const [formData, setFormData] = useState('');
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const { accessToken } = useAuth();
  const router = useRouter();

  const handleApprove = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (formData === '') {
      toast.error('Please enter a reason');
      return;
    }
    try {
      setIsLoading(!isLoading);
      const res = await ApproveForm(faculty_id, formData, accessToken);

      if (res.status === 201) {
        toast.success(res.message);

        try {
          let emailData: IEmailData = {
            subject: 'Time off Approval',
            message: formData,
            recipients: [email || ''],
          };

          const sent_email = await sendEmailNotification(emailData);

          

          if (sent_email.status === 200) {
            toast.success(sent_email.message);
            router.back();
          }
        } catch (error) {
          toast.error('Error sending email');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data.Details);
    } finally {
      setIsLoading(isLoading);
    }
  };
  return (
    <div>
      <form onSubmit={handleApprove}>
        <Textarea
          variant="bordered"
          label="Reason"
          labelPlacement="outside"
          placeholder="Reason"
          className="max-w-[500px]"
          name="reason"
          value={formData}
          onValueChange={setFormData}
        />
        <div>
          {!isLoading ? (
            <Button
              className="mt-5"
              color="primary"
              variant="bordered"
              type="submit"
            >
              Approve
            </Button>
          ) : (
            <Button color="primary" variant="bordered" isLoading>
              Loading...
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApproveFormComponent;
