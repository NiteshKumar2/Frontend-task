"use client";

import { useEffect, useMemo, useState } from "react";
import { MoreHorizontal, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchUsers,
  createUser,
  deleteUser,
  updateUser,
} from "@/redux/features/users/usersSlice";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DataTable() {
  const dispatch = useAppDispatch();
  const { data, loading } = useAppSelector((s) => s.users);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addErrors, setAddErrors] = useState<{ name?: string }>({});
  const [editErrors, setEditErrors] = useState<{ name?: string }>({});
  const [currentPage, setCurrentPage] = useState(1);

  type SortKey = "name" | null;
  type SortOrder = "asc" | "desc";

  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const ITEMS_PER_PAGE = 8;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // toggle order
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "active" as "active" | "inactive",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    status: "active" as "active" | "inactive",
  });
  const startEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleCreate = () => {
    if (!addForm.name.trim()) {
      setAddErrors({ name: "Name is required" });
      return;
    }

    setAddErrors({});

    dispatch(
      createUser({
        ...addForm,
        createdAt: new Date().toLocaleDateString(),
      }),
    );

    setIsAdding(false);
    setAddForm({
      name: "",
      email: "",
      role: "",
      status: "active",
    });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setAddForm({
      name: "",
      email: "",
      role: "",
      status: "active",
    });
  };
  const handleUpdate = (id: string) => {
    if (!editForm.name.trim()) {
      setEditErrors({ name: "Name is required" });
      return;
    }

    setEditErrors({});

    dispatch(
      updateUser({
        id,
        data: editForm,
      }),
    );

    setEditingId(null);
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    let result = data.filter((u) =>
      `${u.name} ${u.email} ${u.role}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey].toLowerCase();
        const bVal = b[sortKey].toLowerCase();

        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, search, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortKey, sortOrder]);

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedIds.includes(row.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paginatedData.some((row) => row.id === id)),
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...paginatedData.map((r) => r.id)]),
      ]);
    }
  };

  if (loading) return <p className="text-sm">Loading users...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">
            Total Users : {filteredData.length}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, role..."
              className="pl-8 w-72"
            />
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>

              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortKey === "name" && (
                    <span className="text-xs">
                      {sortOrder === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </div>
              </TableHead>

              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isAdding && (
              <TableRow className="bg-muted/30">
                <TableCell>
                  <Checkbox disabled />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Input
                      value={addForm.name}
                      onChange={(e) => {
                        setAddForm({ ...addForm, name: e.target.value });
                        if (addErrors.name) setAddErrors({});
                      }}
                      className={cn("h-8", addErrors.name && "border-red-500")}
                      placeholder="Name"
                    />
                    {addErrors.name && (
                      <p className="text-xs text-red-500">{addErrors.name}</p>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Input
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm({ ...addForm, email: e.target.value })
                    }
                    className="h-8"
                    placeholder="Email"
                  />
                </TableCell>

                <TableCell>
                  <Input
                    value={addForm.role}
                    onChange={(e) =>
                      setAddForm({ ...addForm, role: e.target.value })
                    }
                    className="h-8"
                    placeholder="Role"
                  />
                </TableCell>

                <TableCell className="text-muted-foreground text-sm">
                  Auto
                </TableCell>

                <TableCell>
                  <select
                    value={addForm.status}
                    onChange={(e) =>
                      setAddForm({
                        ...addForm,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="border rounded-md px-2 py-1 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" onClick={handleCreate}>
                      ✅
                    </Button>
                    <Button size="icon" variant="ghost" onClick={cancelAdd}>
                      ❌
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {paginatedData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(row.id)}
                    onCheckedChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(row.id)
                          ? prev.filter((x) => x !== row.id)
                          : [...prev, row.id],
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <div className="space-y-1">
                      <Input
                        value={editForm.name}
                        onChange={(e) => {
                          setEditForm({ ...editForm, name: e.target.value });
                          if (editErrors.name) setEditErrors({});
                        }}
                        className={cn(
                          "h-8",
                          editErrors.name && "border-red-500",
                        )}
                      />
                      {editErrors.name && (
                        <p className="text-xs text-red-500">
                          {editErrors.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    row.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <Input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="h-8"
                    />
                  ) : (
                    row.email
                  )}
                </TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <Input
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm({ ...editForm, role: e.target.value })
                      }
                      className="h-8"
                    />
                  ) : (
                    row.role
                  )}
                </TableCell>

                <TableCell>{row.createdAt}</TableCell>
                <TableCell>
                  {editingId === row.id ? (
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          status: e.target.value as "active" | "inactive",
                        })
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        row.status === "active"
                          ? "text-emerald-600"
                          : "text-red-500",
                      )}
                    >
                      {row.status}
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {editingId === row.id ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleUpdate(row.id)}
                      >
                        ✅
                      </Button>

                      <Button size="icon" variant="ghost" onClick={cancelEdit}>
                        ❌
                      </Button>
                    </div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => startEdit(row)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => setDeleteId(row.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete user?</AlertDialogTitle>
              <AlertDialogDescription>
                Permanently delete the user.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteId(null)}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  if (deleteId) {
                    handleDelete(deleteId);
                    setDeleteId(null);
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
