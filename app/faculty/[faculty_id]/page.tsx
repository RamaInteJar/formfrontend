import ApproveFormComponent from "@/components/ApproveFormComponent";
import { fetchFacultyForm } from "@/utils/apiCalls";
import { Button, Link } from "@nextui-org/react";

import React from "react";

type FacultyType = {
  faculty_id: string;
  users_ct: string;
  sub_needed: boolean;
  full_day: boolean;
  times: string;
  after_school: boolean;
  duty: string;
  reason: string;
  status: boolean;
  create_at: Date;
  update_at: Date;
};

const FacultyDetails = async ({
  params,
}: {
  params: { faculty_id: string };
}) => {
  const form = await fetchFacultyForm(params.faculty_id);


  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Application Details {form?.faculty_id}</h1>
        <Button color="primary" variant="bordered">
          <Link href="/faculty">Back</Link>
        </Button>
      </div>
      <div className="mb-10 pt-6 items-center justify-center">
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
              <p className="text-lg font-semibold">Number of days requested</p>
              <p className="text-lg font-semibold">Payment Option</p>
              <p className="text-lg font-semibold">Payment Mode</p>
              <p className="text-lg font-semibold">Status</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-lg">{form?.users_ct}</p>
              <p className="text-lg">{form?.duty}</p>
              <p className="text-lg">{form?.reason}</p>
              <p className="text-lg">{form?.times}</p>
              <p className="text-lg">{form?.sub_needed ? "Yes" : "No"}</p>
              <p className="text-lg">{form?.full_day ? "Yes" : "No"}</p>
              <p className="text-lg">{form?.after_school ? "Yes" : "No"}</p>
              <p className="text-lg">{form?.days_requesting}</p>
              <p className="text-lg">{form?.paying_option}</p>
              <p className="text-lg">{form?.payment_mode}</p>
              <p className="text-lg">
                {form?.status ? "Approved" : "PENDING"}
              </p>
            </div>
          </div>
        </div>
        <ApproveFormComponent faculty_id={form?.faculty_id} email={form?.email} />
      </div>
    </div>
  );
};

export default FacultyDetails;
