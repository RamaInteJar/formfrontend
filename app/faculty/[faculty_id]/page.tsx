import { fetchFacultyForm } from '@/utils/apiCalls';
import React from 'react';
import ApproveFromComponent from '@/components/ApproveFromComponent';

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
  // const [faculty, setFaculty] = React.useState<FacultyType | null>(null);

  // React.useEffect(() => {
  //   const fetchFaculty = async () => {
  //     const res = await fetchFacultyForm(params.faculty_id);

  //     setFaculty(res.faculty);
  //   };
  //   fetchFaculty();
  // }, []);

  const faculty = await fetchFacultyForm(params.faculty_id);

  return (
    <div>
      <h1>Application Details {faculty.faculty_id}</h1>
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
              <p className="text-lg">{faculty.users_ct}</p>
              <p className="text-lg">{faculty.duty}</p>
              <p className="text-lg">{faculty.reason}</p>
              <p className="text-lg">{faculty.times}</p>
              <p className="text-lg">{faculty.sub_needed ? 'Yes' : 'No'}</p>
              <p className="text-lg">{faculty.full_day ? 'Yes' : 'No'}</p>
              <p className="text-lg">{faculty.after_school ? 'Yes' : 'No'}</p>
              <p className="text-lg">
                {faculty.status ? 'Approved' : 'Not Approved'}
              </p>
            </div>
          </div>
        </div>
        <ApproveFromComponent faculty_id={faculty.faculty_id} />
      </div>
    </div>
  );
};

export default FacultyDetails;
