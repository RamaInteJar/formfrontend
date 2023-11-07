'use client';

import { AuthProvider, useAuth } from '@/providers/authProvider';
import { fetchFacultyForms } from '@/utils/apiCalls';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';

const rows = [
  {
    key: '1',
    name: 'Tony Reichert',
    role: 'CEO',
    status: 'Active',
  },
  {
    key: '2',
    name: 'Zoey Lang',
    role: 'Technical Lead',
    status: 'Paused',
  },
  {
    key: '3',
    name: 'Jane Fisher',
    role: 'Senior Developer',
    status: 'Active',
  },
  {
    key: '4',
    name: 'William Howard',
    role: 'Community Manager',
    status: 'Vacation',
  },
];

const columns = [
  {
    key: 'faculty_id',
    label: 'FACULTY ID',
  },
  {
    key: 'users_ct',
    label: 'USER',
  },
  {
    key: 'duty',
    label: 'DUTY',
  },
  {
    key: 'reason',
    label: 'REASON',
  },
  {
    key: 'sub_needed',
    label: 'SUBNEEDED',
  },
  {
    key: 'times',
    label: 'TIME',
  },
  {
    key: 'full_day',
    label: 'FULL DAY',
  },
  {
    key: 'status',
    label: 'STATUS',
  },
];

const FacultyPage = () => {
  const [forms, setForms] = useState([]);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFacultyForms(accessToken);
        setForms(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [accessToken]);

  console.log('form', forms);

  return (
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={forms}>
          {(item) => (
            <TableRow key={item}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
  );
};

export default FacultyPage;
