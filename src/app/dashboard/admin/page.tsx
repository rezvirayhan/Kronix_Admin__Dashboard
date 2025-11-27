"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DynamicTable from "@/components/DynamicTable";
import DynamicPagination from "@/components/DynamicPagination";
import ReusableSearch from "@/components/ReusableSearch";
import ReusableSort from "@/components/ReusableSort";
import { IColumn } from "@/types/IColumn";
import { FaPlus } from "react-icons/fa";
import HeaderCard from "@/components/HeaderCard";
import AdminModal from "@/components/AdminModal";
import { IUser } from "@/types/IUser";

const API_URL = "http://localhost:5000/api/users";

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

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (row: IUser) => {
    setSelectedUser(row);
    setIsModalOpen(true);
  };

  const handleDelete = async (row: IUser) => {
    if (!confirm("Delete this user?")) return;
    await axios.delete(`${API_URL}/${row._id}`);
    fetchUsers();
  };

  const columns: IColumn[] = [
    {
      key: "name",
      label: "Name",
      thClass: "w-36 h-12",
      tdClass: "w-36 h-12",
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
      thClass: "w-36 h-12",
      tdClass: "w-36 h-12",
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
            <FaPlus className="text-6xl p-2 bg-blue-600 text-white rounded-lg" />
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
      </div>
    </Layout>
  );
};

export default AdminPage;
