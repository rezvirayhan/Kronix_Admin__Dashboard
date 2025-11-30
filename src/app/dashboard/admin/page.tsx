"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/Layout";
import DynamicTable from "@/app/components/DynamicTable";
import DynamicPagination from "@/app/components/DynamicPagination";
import ReusableSearch from "@/app/components/ReusableSearch";
import ReusableSort from "@/app/components/ReusableSort";
import { IColumn } from "@/app/types/IColumn";
import { FaPlus } from "react-icons/fa";
import HeaderCard from "@/app/components/HeaderCard";
import { IUser } from "@/app/types/IUser";
import { toast } from "react-toastify";
import DeleteingModal from "@/app/components/DeleteingModal";
import { FaUserTie } from "react-icons/fa6";
import AdminModal from "@/app/section/AdminModal";

const AdminPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000/api/users";
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });

      setUsers(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (row: IUser) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row: IUser) => {
    setDeleteUser(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteUser?._id) return;

    try {
      await axios.delete(`${API_URL}/${deleteUser._id}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }

    setShowDeleteModal(false);
    setDeleteUser(null);
  };

  const columns: IColumn[] = [
    {
      key: "name",
      useValue: false,
      label: "Name",
      thClass: "w-36",
      tdClass: "w-36",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "name", label: "Name" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
    },
    {
      key: "email",
      label: "Email",
      useValue: false,
      thClass: "w-36",
      tdClass: "w-36",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "email", label: "Email" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <FaUserTie className="text-5xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Users"
          buttonText="Add User"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
        />

        <div className="mb-4 flex justify-end">
          <ReusableSearch
            value={search}
            onChange={(val) => {
              setPage(1);
              setSearch(val);
            }}
          />
        </div>

        <DynamicTable
          columns={columns}
          data={users}
          isLoading={loading}
          noDataText="No users found"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <DynamicPagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />

        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={selectedUser}
          onSaved={fetchUsers}
        />

        <DeleteingModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          heading="Delete admin"
          message={`Are you want to delete this "${deleteUser?.name}"?`}
          yesText="Yes"
          noText="No"
        />
      </div>
    </Layout>
  );
};

export default AdminPage;
