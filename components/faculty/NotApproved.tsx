"use client";

import React, { SetStateAction } from "react";
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
  Spinner,
} from "@nextui-org/react";
import { Input } from "@nextui-org/input";
import { columns, statusOptions } from "@/config/data";
import { capitalize } from "@/utils/utils";
import {
  ChevronDownIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { fetchFacultyForms } from "@/utils/apiCalls";
import { useAuth } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkUserRole } from "@/utils/userRole";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type SortDescriptionType = {
  column: "users_ct" | "status";
  direction: "ascending" | "descending";
};

type FromStatustype = "active" | "paused" | "vacation";

type FormType = {
  faculty_id: string;
  users_ct: string;
  duty: string;
  reason: string;
  sub_needed: Boolean;
  times: string;
  after_school: Boolean;
  full_day: Boolean;
  emergency: Boolean;
  descriptions: string;
  status: Boolean;
  actions: string;
};

type FormKey = keyof FormType;

const INITIAL_VISIBLE_COLUMNS = [
  "faculty_id",
  "users_ct",
  "duty",
  "reason",
  "sub_needed",
  "times",
  "after_school",
  "full_day",
  "emergency",
  "descritpions",
  "status",
  "actions",
];

const NotApproved = ({ status_query }: { status_query: string }) => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] =
    React.useState<SortDescriptionType>({
      column: "users_ct",
      direction: "ascending",
    });
  const [page, setPage] = React.useState(1);
  const [forms, setForms] = React.useState<FormType[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.has("all")) return columns;

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
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredforms = filteredforms.filter((forms) =>
        Array.from(statusFilter).includes(forms.users_ct)
      );
    }

    return filteredforms;
  }, [forms, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const { accessToken } = useAuth();

  const isAdmin = checkUserRole(accessToken);

  React.useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          setIsLoading(true);

          const data = await fetchFacultyForms(
            String(status_query),
            accessToken
          );
          setForms(data);
        }
        return null;
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (forms: FormType, columnKey: FormKey) => {
      const cellValue = forms[columnKey];

      switch (columnKey) {
        case "users_ct":
          return (
            <User
              // avatarProps={{ radius: 'lg', src: forms?.avatar }}
              // description={forms.email}
              name={String(cellValue)}
            >
              {forms.users_ct}
            </User>
          );
        case "times":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {cellValue !== "" ? cellValue : ("Full Day" as any)}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? "success" : "primary"}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? "Appproved" : "Not Approved"}
            </Chip>
          );
        case "sub_needed":
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? "success" : "primary"}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? "Yes" : "No"}
            </Chip>
          );
        case "after_school":
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? "success" : "primary"}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? "Yes" : "No"}
            </Chip>
          );
        case "full_day":
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? "success" : "primary"}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? "Yes" : "No"}
            </Chip>
          );
        case "emergency":
          return (
            <Chip
              className="capitalize"
              color={cellValue === true ? "danger" : "primary"}
              size="sm"
              variant="flat"
            >
              {cellValue === true ? "Emergency" : "Not Emergency"}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <EllipsisVerticalIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                {isAdmin && (
                  <DropdownMenu onAction={(key) => router.push(String(key))}>
                    <DropdownItem key={`/faculty/${String(forms.faculty_id)}`}>
                      View
                    </DropdownItem>
                    <DropdownItem>Edit</DropdownItem>
                    <DropdownItem>Delete</DropdownItem>
                  </DropdownMenu>
                )}
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

  const onRowsPerPageChange = React.useCallback(
    (e: { target: { value: any } }) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value: SetStateAction<string>) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

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
                onSelectionChange={setStatusFilter as any}
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
            {status_query === "True" ? (
              " "
            ) : (
              <Button
                color="primary"
                endContent={<PlusIcon />}
                type="button"
                onClick={() => router.push("faculty/addnew")}
              >
                Add New
              </Button>
            )}
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
    onSearchChange,
    statusFilter,
    visibleColumns,
    status_query,
    forms.length,
    onRowsPerPageChange,
    onClear,
    router,
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
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

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
      sortDescriptor={sortDescriptor}
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
      <TableBody
        emptyContent={"No formss found"}
        items={sortedItems}
        loadingContent={<Spinner />}
        isLoading={isLoading}
      >
        {(item) => (
          <TableRow key={item.faculty_id}>
            {(columnKey: any) => (
              <TableCell>{renderCell(item, columnKey) as any}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default NotApproved;
