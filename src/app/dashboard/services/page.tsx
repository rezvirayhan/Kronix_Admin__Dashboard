"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/app/components/Layout";
import axios from "axios";
import { IOurCategory } from "@/app/types/IOurCategory";
import DynamicTable from "@/app/components/DynamicTable";
import DynamicPagination from "@/app/components/DynamicPagination";
import ReusableSearch from "@/app/components/ReusableSearch";
import DeleteingModal from "@/app/components/DeleteingModal";
import { IColumn } from "@/app/types/IColumn";
import { MdCategory } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import HeaderCard from "@/app/components/HeaderCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewCategory from "@/app/components/ViewCategory";
import CategoryModal from "@/app/section/CategoryModal";

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
  const [selectedPricing, setSelectedPricing] = useState<IOurCategory | null>(
    null
  );
  const [viewCategoryId, setViewCategoryId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<IOurCategory | null>(
    null
  );

  const API_URL = "http://localhost:5000/api/services";
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });
      setCategories(res.data.data || res.data);
      setTotal(res.data.total || res.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
  const handleView = (category: IOurCategory) => {
    setViewCategoryId(category._id || null);
    setIsViewModalOpen(true);
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
          isLoading={loading}
          noDataText="No categories found"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onView={handleView}
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

        <ViewCategory
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          categoryId={viewCategoryId}
        />
      </div>
    </Layout>
  );
};

export default OurCategoryDashboard;
