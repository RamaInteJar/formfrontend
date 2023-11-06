import { baseUrl } from '@/config/apiConfig';
import axios from 'axios';

interface formDataType {
  times: string;
  reason: string;
  sub_needed: boolean;
  full_day: boolean;
  after_school: boolean;
  duty: string;
}

export const submitForm = async (
  formData: formDataType,
  authToken: string | null
) => {
  try {
    const response = await axios.post(`${baseUrl}/faculty/forms`, formData, {
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
