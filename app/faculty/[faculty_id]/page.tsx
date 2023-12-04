import { fetchFacultyForm, ApproveForm } from '@/utils/apiCalls';
import { Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import React from 'react';

const FacultyDetails = async ({
  params,
}: {
  params: { faculty_id: string };
}) => {
  const form = await fetchFacultyForm(params.faculty_id);

  const handleApprove = async (formData: FormData) => {
    'use server';
    const reason = formData.get('reason');
    const res = await ApproveForm(form.faculty_id, reason);
    if (res) {
      console.log(res.error);
      return;
    }
    console.log(res, 'success');
  };

  return (
    <div>
      <h1>Application Details {form.faculty_id}</h1>
      <div className="mb-10 pt-6">
        <div className="mb-10">
          <h2 className="text-2xl font-semibold">Personal Details</h2>
          <div className="flex flex-col md:flex-row md:space-x-10">
            <div className="flex flex-col space-y-2">
              <p className="text-lg font-semibold">UserName</p>
              <p className="text-lg font-semibold">Duty</p>
              <p className="text-lg font-semibold">Requesting Reason</p>
              <p className="text-lg font-semibold">Times</p>
              <p className="text-lg font-semibold">Sub Needed</p>
              <p className="text-lg font-semibold">Full Day</p>
              <p className="text-lg font-semibold">After School Duty</p>
              <p className="text-lg font-semibold">Status</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-lg">{form.users_ct}</p>
              <p className="text-lg">{form.duty}</p>
              <p className="text-lg">{form.reason}</p>
              <p className="text-lg">{form.times}</p>
              <p className="text-lg">{form.sub_needed ? 'Yes' : 'No'}</p>
              <p className="text-lg">{form.full_day ? 'Yes' : 'No'}</p>
              <p className="text-lg">{form.after_school ? 'Yes' : 'No'}</p>
              <p className="text-lg">
                {form.status ? 'Approved' : 'Not Approved'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <form action={handleApprove} method="POST">
        <Textarea
          variant="bordered"
          label="Reason"
          labelPlacement="outside"
          placeholder="Reason"
          className="max-w-[500px]"
          name="reason"
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

export default FacultyDetails;
