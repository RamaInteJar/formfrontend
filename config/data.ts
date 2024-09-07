import { PaymentModeEnum, PaymentOptionsEnum } from "@/components/enums/form-enums";
import React from "react";
const columns = [
  { name: "FACULTY ID", uid: "faculty_id", sortable: true },
  { name: "USER", uid: "users_ct", sortable: true },
  { name: "DUTY", uid: "duty", sortable: true },
  { name: "REASON", uid: "reason", sortable: true },
  { name: "DESCRIPTIONS", uid: "descriptions", sortable: true },
  { name: "SUBNEEDED", uid: "sub_needed" },
  { name: "TIMES", uid: "times" },
  { name: "AFTER SCHOOL", uid: "after_school" },
  { name: "EMERGENCY", uid: "emergency" },
  { name: "FULL DAY", uid: "full_day" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

const paymentOptions = [
  {
    label: PaymentOptionsEnum.CUSHMAN,
    value: PaymentOptionsEnum.CUSHMAN
  },
  {
    label: PaymentOptionsEnum.EMPLOYEE,
    value: PaymentOptionsEnum.EMPLOYEE
  },
];
const paymentMode= [
  {
    label: PaymentModeEnum.CASH,
    value: PaymentModeEnum.CASH
  },
  {
    label: PaymentModeEnum.CHEQUE,
    value: PaymentModeEnum.CHEQUE
  },
];

const reasons = [
  {
    label: "Personal",
    value: "personal",
  },
  {
    label: "Maternity Leave",
    value: "maternity leave",
  },
  {
    label: "Doctor's Appointment",
    value: "doctor's appointment",
  },
  {
    label: "Professional Development",
    value: "professional development",
  },
  {
    label: "Others",
    value: "others",
  },
];

export { columns, statusOptions,paymentOptions,paymentMode, reasons };
