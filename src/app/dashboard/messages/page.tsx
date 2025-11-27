"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DynamicTable from "@/components/DynamicTable";
import DynamicPagination from "@/components/DynamicPagination";
import ReusableSearch from "@/components/ReusableSearch";
import ReusableSort from "@/components/ReusableSort";
import HeaderCard from "@/components/HeaderCard";
import { MdPriceChange } from "react-icons/md";
import { CiText } from "react-icons/ci";

interface IEmail {
  _id: string;
  name?: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

const EmailsPage = () => {
  const [emails, setEmails] = useState<IEmail[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/emails", {
        params: { page, limit, search, sortField, sortOrder },
      });
      setEmails(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, [page, limit, search, sortField, sortOrder]);

  const handleDelete = async (row: IEmail) => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/emails/${row._id}`);
      fetchEmails();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete email.");
    }
  };

  const columns = [
    {
      key: "text",
      label: "Name",
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
    {
      key: "userEmail",
      label: "Email",
      thClass: "w-48 h-12",
      tdClass: "w-48 h-12",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "userEmail", label: "Email" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
    },

    {
      key: "createdAt",
      label: "Created At",
      thClass: "w-36 h-12",
      tdClass: "w-36 h-12",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "createdAt", label: "Created At" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
      render: (value: string) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <CiText className="text-6xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Messages"
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
          data={emails}
          isLoading={loading}
          noDataText="No emails found"
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
      </div>
    </Layout>
  );
};

export default EmailsPage;
