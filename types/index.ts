import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface IEmailData {
  subject: string;
  message: string;
  recipients: string[];
}


export type DateType = {
  startDate: Date;
  onDateChange: () => Date;
};