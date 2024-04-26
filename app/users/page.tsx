"use client";
import { useAuth } from "@/providers/authProvider";
import { getAllUsers } from "@/utils/apiCalls";
import { capitalize } from "@/utils/utils";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Input } from "@nextui-org/react";
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const INITIAL_VISIBLE_COLUMNS = [
  "first_name",
  "last_name",
  "username",
  "email",
  "role",
  "status",
  "actions",
  "is_active",
];
const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};
const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

const columns = [
  { name: "ID", uid: "user_id", sortable: true },
  { name: "FIRST NAME", uid: "first_name", sortable: true },
  { name: "LAST NAME", uid: "last_name", sortable: true },
  { name: "USERNAME", uid: "username", sortable: true },
  { name: "PHONE", uid: "phone", sortable: true },
  { name: "ROLE", uid: "role", sortable: true },
  { name: "EMAIL", uid: "email" },
  { name: "STATUS", uid: "is_active", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

type UsersType = {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  last_login: Date;
  role: null;
  start_date: Date;
  phone: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  groups: any[];
  user_permissions: any[];
  actions: string;
  status: Boolean;
};

type UserKey = keyof UsersType;

interface ItemType {
  [key: string]: any;
}

interface sortDescriptorType {
  column: string;
  direction: string;
}

const UserPage = () => {
  const { accessToken } = useAuth();
  const [userData, setUserData] = useState<UsersType[]>([]);
  const fetchAllUsers = async () => {
    if (accessToken) {
      const user = await getAllUsers(accessToken);
      setUserData(user);
    }
    return null;
  };
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      fetchAllUsers();
    }
  });

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<any>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] =
    React.useState<sortDescriptorType>({
      column: "age",
      direction: "ascending",
    });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) {
      return columns;
    }

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...userData];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((userData) =>
        userData.username.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((userData) =>
        Array.from(statusFilter).includes(userData.username)
      );
    }

    return filteredUsers;
  }, [userData, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: ItemType, b: ItemType) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (userData: UsersType, columnKey: UserKey) => {
      const cellValue = userData[columnKey];

      switch (columnKey) {
        case "user_id":
          return (
            <User
              // avatarProps={{ radius: 'lg', src: user.avatar }}
              description={userData.email}
              name={String(cellValue)}
            >
              {userData.email}
            </User>
          );
        case "first_name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {String(cellValue)}
              </p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {userData.first_name}
              </p>
            </div>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {String(cellValue)}
              </p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {userData.role}
              </p>
            </div>
          );
        case "is_active":
          return (
            <Chip
              className="capitalize"
              color={cellValue === userData.is_active ? "success" : "primary"}
              size="sm"
              variant="flat"
            >
              {cellValue === userData.is_active ? "Active" : "Not Active"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVerticalIcon className="w-5 h-5" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu onAction={(key) => router.push(String(key))}>
                  <DropdownItem>View</DropdownItem>

                  <DropdownItem key={`/users/${String(userData.user_id)}`}>
                    Edit
                  </DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [router]
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

  const onRowsPerPageChange = React.useCallback(
    (e: { target: { value: any } }) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback(
    (value: React.SetStateAction<string>) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    },
    []
  );

  const onClear = React.useCallback(() => {
    setFilterValue("");
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
                  endContent={<ChevronDownIcon className="w-5 h-5" />}
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
                onSelectionChange={setVisibleColumns as any}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {userData.length} users
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
    onSearchChange,
    statusFilter,
    visibleColumns,
    userData.length,
    onRowsPerPageChange,
    onClear,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys.size === 0
            ? "All items selected"
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
  }, [
    selectedKeys.size,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[382px]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor as any}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys as any}
      onSortChange={setSortDescriptor as any}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No users found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.user_id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey as any) as any}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UserPage;
