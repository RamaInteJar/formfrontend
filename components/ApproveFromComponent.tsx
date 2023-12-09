'use client';
import { useAuth } from '@/providers/authProvider';
import { ApproveForm } from '@/utils/apiCalls';
import { Button } from '@nextui-org/button';
import { Textarea } from '@nextui-org/input';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface ApproveFromComponentProps {
  faculty_id: string;
}

const ApproveFromComponent: React.FC<ApproveFromComponentProps> = ({
  faculty_id,
}) => {
  const { accessToken } = useAuth();
  const [reasonData, setReasonData] = useState('');
  const router = useRouter();

  // const handleChange = (e: any) => {
  //   setReasonData(e.target.value);
  // }

  const handleApprove = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(reasonData);
    const res = await ApproveForm(faculty_id, reasonData, accessToken);
    if (res.status === 201) {
      console.log(res.data);
    }
    router.push('/');
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
          value={reasonData}
          onValueChange={setReasonData}
        />
        <div>
          <Button
            className="mt-5"
            color="primary"
            variant="bordered"
            type="submit"
          >
            Approve
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ApproveFromComponent;
