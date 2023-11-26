"use client";

import React from "react";
import { useRouter } from "next/navigation";
import FacultyForm from "@/components/FacultyForm";
import { Button } from "@nextui-org/react";
import {  ChevronRightIcon } from "@heroicons/react/24/outline";

const AddFacutlyPage = () => {
  const router = useRouter();
  return (
    <div>
      <Button
        size="sm"
        color="primary"
        variant="bordered"
        onClick={() => router.back()}
    endContent = {<ChevronRightIcon className="text-blue-500"/>}
      >
        Go Back
      </Button>
      <FacultyForm />
    </div>
  );
};

export default AddFacutlyPage;
