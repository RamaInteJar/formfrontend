'use client';

import React, { SetStateAction } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  User,
} from '@nextui-org/react';
import { Input } from '@nextui-org/input';
import { columns, statusOptions } from '@/config/data';
import { capitalize } from '@/utils/utils';
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { fetchFacultyForms } from '@/utils/apiCalls';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

type SortDescriptionType = {
  column: 'users_ct' | 'status';
  direction: 'ascending' | 'descending';
};

type FromStatustype = 'active' | 'paused' | 'vacation';

type FormType = {
  faculty_id: string;
  users_ct: string;
  duty: string;
  reason: string;
  sub_needed: Boolean;
  times: string;
  after_school: Boolean;
  full_day: Boolean;
  status: Boolean;
  actions: string;
};

type FormKey = keyof FormType;

const INITIAL_VISIBLE_COLUMNS = [
  'faculty_id',
  'users_ct',
  'duty',
  'reason',
  'sub_needed',
  'times',
  'after_school',
  'full_day',
  'status',
  'actions',
];

export default function FacultyPage() {
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] =
    React.useState<SortDescriptionType>({
      column: 'users_ct',
      direction: 'ascending',
    });
  const [page, setPage] = React.useState(1);
  const [forms, setForms] = React.useState<FormType[]>([]);
  const router = useRouter();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredforms = [...forms];

    if (hasSearchFilter) {
      filteredforms = filteredforms.filter((forms) =>
        forms.users_ct.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredforms = filteredforms.filter((forms) =>
        Array.from(statusFilter).includes(forms.users_ct)
      );
    }

    return filteredforms;
  }, [forms, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const { accessToken } = useAuth();

  React.useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          const data = await fetchFacultyForms(accessToken);
          setForms(data);
        }
        return null;
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [accessToken]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (forms: FormType, columnKey: FormKey) => {
      const cellValue = forms[columnKey];

      switch (columnKey) {
        case 'users_ct':
          return (
            <User
              // avatarProps={{ radius: 'lg', src: forms?.avatar }}
              // description={forms.email}
              name={String(cellValue)}
            >
              {forms.users_ct}
            </User>
          );
        // case 'role':
        //   return (
        //     <div className="flex flex-col">
        //       <p className="text-bold text-small capitalize">{cellValue}</p>
        //       <p className="text-bold text-tiny capitalize text-default-400">
        //         {forms.team}
        //       </p>
        //     </div>
        //   );
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? 'success' : 'primary'}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? 'Appproved' : 'Not Approved'}
            </Chip>
          );
        case 'sub_needed':
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? 'success' : 'primary'}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? 'Yes' : 'No'}
            </Chip>
          );
        case 'after_school':
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? 'success' : 'primary'}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? 'Yes' : 'No'}
            </Chip>
          );
        case 'full_day':
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? 'success' : 'primary'}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? 'Yes' : 'No'}
            </Chip>
          );
        case 'actions':
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVerticalIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem>
                    <Link href={`/faculty/${String(forms.faculty_id)}`}>
                      View
                    </Link>
                  </DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: SetStateAction<string>) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<MagnifyingGlassIcon className="w-5 h-5" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              type="button"
              onClick={() => router.push('faculty/addnew')}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {forms.length} forms
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    forms.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px]',
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No formss found'} items={sortedItems}>
        {(item) => (
          <TableRow key={item.faculty_id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
