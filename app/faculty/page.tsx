'use client';

import { useAuth } from '@/providers/authProvider';
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
    key: 'facultY_id',
    label: 'FACULTY ID',
  },
  {
    key: 'user',
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
    key: 'subneeded',
    label: 'SUB NEEDED',
  },
  {
    key: 'time',
    label: 'TIME',
  },
  {
    key: 'status',
    label: 'STATUS',
  },
];

const FacultyPage = () => {
  const [forms, setForms] = useState([]);
  const { accessToken } = useAuth();

  console.log(accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFacultyForms(accessToken);
        console.log(data)
        setForms(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [accessToken]);

  console.log(forms);

  return (
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={rows}>
        {(item) => (
          <TableRow key={item.key}>
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
