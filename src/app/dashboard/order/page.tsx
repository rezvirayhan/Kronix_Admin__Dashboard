/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/Layout";
import DynamicTable from "@/app/components/DynamicTable";
import DynamicPagination from "@/app/components/DynamicPagination";
import ReusableSearch from "@/app/components/ReusableSearch";
import ReusableSort from "@/app/components/ReusableSort";
import HeaderCard from "@/app/components/HeaderCard";
import { MdNotifications } from "react-icons/md";
import { IColumn } from "@/app/types/IColumn";

interface INotification {
  _id: string;
  name: string;
  email: string;
  source: string;
  createdAt: string;
}

const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://kronix-back-end-kappa.vercel.app/api/order",
        {
          params: { page, limit, search, sortField, sortOrder },
        }
      );
      console.log(res);

      const data = (res.data.data || []).map((item: any) => ({
        _id: item._id,
        name: item.name || "No name",
        email: item.email || "No email",
        source: item.source || "N/A",
        createdAt: item.createdAt,
      }));

      setNotifications(data);
      setTotal(res.data.total || data.length);
    } catch (err) {
      console.error("API Error:", err);
      setNotifications([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, limit, search, sortField, sortOrder]);

  const handleDelete = async (row: INotification) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/order/${row._id}`);
      fetchNotifications();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete notification.");
    }
  };

  const columns: IColumn[] = [
    {
      key: "name",
      useValue: false,
      label: "Name",
      thClass: "w-48 h-12",
      tdClass: "w-48 h-12",
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
      thClass: "w-72 h-12",
      tdClass: "w-72 h-12",
    },
    {
      useValue: false,
      key: "source",
      label: "Source",
      thClass: "w-36 h-12",
      tdClass: "w-36 h-12",
      render: (row: INotification) => {
        if (row.source === "book") {
          return (
            <span className="px-3 py-1 text-xs rounded border bg-green-600 text-white">
              Book A Call
            </span>
          );
        } else if (row.source === "buy") {
          return (
            <span className="px-3 py-1 text-xs rounded border bg-gray-600 text-white">
              Click To Buy
            </span>
          );
        } else {
          return (
            <span className="px-3 py-1 text-xs rounded border bg-gray-200 text-gray-800">
              N/A
            </span>
          );
        }
      },
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "source", label: "Source" }]}
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
            <MdNotifications className="text-6xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Notifications"
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
          data={notifications}
          isLoading={loading}
          noDataText="No notifications found"
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

export default NotificationDashboard;
