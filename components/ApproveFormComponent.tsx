'use client';
import { useAuth } from '@/providers/authProvider';
import { ApproveForm } from '@/utils/apiCalls';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface ApproveFromProps {
  faculty_id: string;
}

const ApproveFormComponent: React.FC<ApproveFromProps> = ({ faculty_id }) => {
  const [formData, setFormData] = useState('');
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  console.log('faculty id', faculty_id);

  const { accessToken } = useAuth();
  const router = useRouter();

  const handleApprove = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (formData === '') {
      console.warn('Please fill the reason');
      return;
    }
    try {
      setIsLoading(!isLoading);
      const res = await ApproveForm(faculty_id, formData, accessToken);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
    setIsLoading(isLoading);
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
            <Button
              color="primary"
              variant="bordered"
              isLoading
            >
              Loading...
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApproveFormComponent;
