"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import { IOurCategory } from "@/types/IOurCategory";
import DynamicTable from "@/components/DynamicTable";
import DynamicPagination from "@/components/DynamicPagination";
import ReusableSearch from "@/components/ReusableSearch";
import CategoryModal from "@/components/CategoryModal";
import DeleteingModal from "@/components/DeleteingModal";
import { IColumn } from "@/types/IColumn";
import { MdCategory } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import HeaderCard from "@/components/HeaderCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OurCategoryDashboard = () => {
  const [categories, setCategories] = useState<IOurCategory[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IOurCategory | null>(
    null
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<IOurCategory | null>(
    null
  );

  const API_URL = "http://localhost:5000/api/ctgory";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });
      setCategories(res.data.data || res.data);
      setTotal(res.data.total || res.data.length);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories", { position: "bottom-right" });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit, search, sortField, sortOrder]);
  const handleEdit = (category: IOurCategory) => {
    setSelectedCategory(category);
    setIsCategoryModalOpen(true);
  };
  const handleDeleteClick = (category: IOurCategory) => {
    setDeleteCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteCategory) return;
    try {
      await axios.delete(`${API_URL}/${deleteCategory._id}`);
      toast.success(
        `Category "${deleteCategory.category}" deleted successfully!`,
        { position: "bottom-right" }
      );
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!", { position: "bottom-right" });
    } finally {
      setShowDeleteModal(false);
      setDeleteCategory(null);
    }
  };

  const columns: IColumn[] = [
    {
      key: "category",
      label: "Category",
      useValue: true,
      thClass: "w-36",
      tdClass: "w-36",
    },
    {
      key: "heading_title",
      label: "Heading Title",
      useValue: true,
      thClass: "w-40",
      tdClass: "w-40",
    },
    {
      key: "heading_subtitle",
      label: "Heading Subtitle",
      useValue: true,
      thClass: "w-40",
      tdClass: "w-40",
    },
    {
      key: "heading_description",
      label: "Description",
      useValue: true,
      thClass: "w-80",
      tdClass: "w-80",
    },
    {
      key: "options",
      label: "Options",
      useValue: false,
      thClass: "w-80",
      tdClass: "w-80",
      render: (row: IOurCategory) => {
        if (!row.options || row.options.length === 0) return null;
        return (
          <div className="flex flex-col gap-2">
            {row.options.map((opt: any, idx: number) => (
              <div
                key={opt._id || idx}
                className="border p-2 border-[#cfd8e3] flex items-center gap-4 rounded"
              >
                <div className="w-16 h-16 flex-shrink-0">
                  {opt.icon ? (
                    <img
                      src={opt.icon}
                      alt={opt.option_title || "icon"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                      No Icon
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {opt.option_title || "No Title"}
                  </span>
                  <span className="text-gray-500">
                    {opt.option_subtitle || "No Subtitle"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <MdCategory className="text-6xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Our Categories"
          buttonText="Add Category"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedCategory(null);
            setIsCategoryModalOpen(true);
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
          data={categories}
          noDataText="No categories found"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
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

        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          category={selectedCategory}
          onSaved={fetchCategories}
        />

        <DeleteingModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          heading="Delete Category"
          message={`Do you want all the data of your  "${deleteCategory?.category} Category to be deleted"?`}
          yesText="Yes"
          noText="No"
        />
      </div>
    </Layout>
  );
};

export default OurCategoryDashboard;
