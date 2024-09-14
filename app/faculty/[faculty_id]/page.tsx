"use client";

import ApproveFormComponent from "@/components/ApproveFormComponent";
import { useAuth } from "@/providers/authProvider";
import { fetchFacultyForm } from "@/utils/apiCalls";
import { Button, Link } from "@nextui-org/react";

import React from "react";

type FacultyType = {
  faculty_id: string | undefined;
  users_ct: string;
  sub_needed: boolean;
  email: string;
  full_day: boolean;
  times: string;
  after_school: boolean;
  duty: string;
  reason: string;
  status: boolean;
  create_at: Date;
  update_at: Date;
  days_requesting: number;
  paying_option: string;
  payment_mode: string;
};

const FacultyDetails = ({ params }: { params: { faculty_id: string } }) => {
  const [formData, setFormData] = React.useState<FacultyType | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { accessToken } = useAuth();

  const {faculty_id} = params;

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetchFacultyForm(faculty_id, accessToken);
      setFormData(response);
      setIsLoading(false);
    };
    fetchData();
  }, [accessToken, faculty_id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Application Details</h1>
        <Button color="primary" variant="bordered" as={Link} href="/faculty">
          Back to Faculty List
        </Button>
      </div>

      <div className="bg-white rounded-lg overflow-hidden shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-900 dark:border-gray-700">
        <div className="px-6 py-4 bg-gray-50 border-b  dark:bg-gray-900">
          <h2 className="text-xl font-semibold">
            Personal Details - {formData?.faculty_id}
          </h2>
        </div>
        <div className="p-6">
          <table className="w-full">
            <tbody>
              {[
                { label: "Username", value: formData?.users_ct },
                { label: "Duty", value: formData?.duty },
                { label: "Requesting Reason", value: formData?.reason },
                { label: "Times", value: formData?.times },
                { label: "Sub Needed", value: formData?.sub_needed ? "Yes" : "No" },
                { label: "Full Day", value: formData?.full_day ? "Yes" : "No" },
                {
                  label: "After School Duty",
                  value: formData?.after_school ? "Yes" : "No",
                },
                {
                  label: "Number of Days Requested",
                  value: formData?.days_requesting,
                },
                { label: "Payment Option", value: formData?.paying_option },
                { label: "Payment Mode", value: formData?.payment_mode },
                {
                  label: "Status",
                  value: formData?.status ? "Approved" : "PENDING",
                },
              ].map((item, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? "bg-gray-50  dark:bg-gray-900"
                      : " dark:bg-gray-900"
                  }
                >
                  <td className="py-3 px-4 font-semibold">{item.label}</td>
                  <td className="py-3 px-4">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8">
        <ApproveFormComponent
          faculty_id={formData?.faculty_id}
          email={formData?.email}
        />
      </div>
    </div>
  );
};

export default FacultyDetails;
