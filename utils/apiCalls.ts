import { baseUrl } from '@/config/apiConfig';
import axios from 'axios';
import { axisoInstance } from './axiosInstance';
import { use } from 'react';
import { useAuth } from '@/providers/authProvider';
import Cookies from 'js-cookie';

interface formDataType {
  times: string;
  reason: string;
  sub_needed: boolean;
  full_day: boolean;
  after_school: boolean;
  duty: string;
}

const accessToken = Cookies.get('accessToken');

export const submitForm = async (
  formData: formDataType,
  authToken: string | null
) => {
  try {
    const response = await axisoInstance.post(`/faculty/forms`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Include your authentication token here
        'Content-Type': 'application/json',
      },
    });

    console.log('Form submitted successfully:', response.data);
    return response.data; // You can handle the response data as needed
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error; // Handle the error appropriately in your application
  }
};

export const fetchFacultyForms = async (authToken: string | null) => {
  try {
    const response = await axisoInstance.get(`/faculty/forms`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching faculty forms:', error);
    throw error;
  }
};

export const fetchFacultyForm = async (faculty_id: string) => {
  try {
    const query = `?faculty_id=${faculty_id}`;
    const response = await axisoInstance.get(`/faculty/form${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching faculty forms:', error);
  }
};

export const ApproveForm = async (form_id: string, formData: string) => {
  console.log('faculty id',form_id, 'form data',formData);
  try {
    const query = `?faculty_id=${form_id}`;
    const response = await axisoInstance.post(
      `/faculty/form/response${query}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error Approved failed:', error.message);
  }
};
