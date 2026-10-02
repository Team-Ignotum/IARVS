import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminPagination from "@/components/admin/AdminPagination"
import TableActionMenu from "../TableActionMenu";
import TableStateRows from "../TableStateRows";


import { UserRecord } from "./types";
import { userColumns } from "./columns";

interface UsersTableProps {
  users: UserRecord[];
  isLoading: boolean;
  fetchError: string | null;
  page: number;
  totalPages: number;
  totalUsers: number;
  itemsPerPage: number;

  onPageChange: (page: number) => void;
  onViewUser: (user: UserRecord) => void;
  onChangeStatus: (user: UserRecord) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersTable({
  users,
  isLoading,
  fetchError,
  page,
  totalPages,
  totalUsers,
  itemsPerPage,
  onPageChange,
  onViewUser,
  onChangeStatus,
  onDeleteUser,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e4e7ed]">
      <Table>
        {/*  Header*/}
        <TableHeader>
          <TableRow className="bg-[#f8fafc] hover:bg-[#f8fafc]">
            {userColumns.map((column) => (
              <TableHead
                key={column.key}
                className="px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500"
              >
                {column.label}
              </TableHead>
            ))}

            <TableHead className="px-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

      {/* Table Body*/}
        <TableBody>

          <TableStateRows
            colSpan={userColumns.length + 1}
            loading={isLoading}
            error={fetchError}
            empty={!isLoading && !fetchError && users.length === 0}
            loadingMessage="Loading users..."
            emptyMessage="No users found for the selected filters."
          />
          {!isLoading &&
            !fetchError &&
            users.map((user) => (
              <TableRow key={user.id} className="bg-white hover:bg-[#fbfcff]">
               
                  {/* Dynamic Columns */}
                   {userColumns.map((column)=> (
                      <TableCell key={column.key}
                         className="px-4 py-3" >
                          {column.render
                          ? column.render(user)
                        :user[column.key as keyof UserRecord]}
                        </TableCell>
                   ))}

              

                {/* Actions */}

                <TableCell className="px-4 py-3 text-right">
                  <TableActionMenu
                    ariaLabel={`Actions for ${user.name}`}
                    items={[
                      {
                        label: "View Details",
                        onSelect: () => onViewUser(user),
                      },
                      {
                        label: "Change Status",
                        onSelect: () => onChangeStatus(user),
                      },
                      {
                        label: "Delete User",
                        variant: "danger",
                        separator: true,
                        onSelect: () => onDeleteUser(user.id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        total={totalUsers}
        itemsPerPage={itemsPerPage}
        itemLabel="users"
        onPageChange={onPageChange}
      />
    </div>
  );
}
