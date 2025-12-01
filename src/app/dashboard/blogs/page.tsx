"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/Layout";
import DynamicTable from "@/app/components/DynamicTable";
import DynamicPagination from "@/app/components/DynamicPagination";
import ReusableSearch from "@/app/components/ReusableSearch";
import ReusableSort from "@/app/components/ReusableSort";
import HeaderCard from "@/app/components/HeaderCard";
import { IColumn } from "@/app/types/IColumn";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import DeleteingModal from "@/app/components/DeleteingModal";
import { toast } from "react-toastify";
import { BlogModal } from "@/app/section/BlogModal";
export interface IBlog {
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  createdAt?: string;
}

const BlogDashboard = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "https://kronix-back-end-kappa.vercel.app/api/blogs";

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBlog, setDeleteBlog] = useState<IBlog | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });
      setBlogs(res.data.data || res.data);
      setTotal(res.data.total || res.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (blog: IBlog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const openDeleteModal = (blog: IBlog) => {
    setDeleteBlog(blog);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    if (!deleteBlog?._id) return;

    try {
      await axios.delete(`${API_URL}/${deleteBlog._id}`);
      toast.success("Blog deleted successfully!");
      setShowDeleteModal(false);
      setDeleteBlog(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog!");
    }
  };

  const columns: IColumn[] = [
    {
      key: "image",
      label: "Image",
      useValue: false,
      thClass: "w-32 h-16",
      tdClass: "w-32 h-16",
      render: (row: IBlog) => {
        return row.image ? (
          <img
            src={row.image}
            alt="preview"
            className="w-24 h-24 object-cover rounded"
          />
        ) : (
          <span>No Image</span>
        );
      },
    },
    {
      key: "title",
      label: "Title",
      useValue: false,
      thClass: "w-48 h-16",
      tdClass: "w-48 h-16",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "title", label: "Title" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
    },
    {
      key: "subtitle",
      label: "Subtitle",
      useValue: false,
      thClass: "w-48 h-16",
      tdClass: "w-48 h-16",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <MdOutlineLibraryBooks className="text-6xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Blogs"
          buttonText="Add Blog"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedBlog(null);
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
          data={blogs}
          noDataText="No blogs found"
          onEdit={handleEdit}
          isLoading={loading}
          onDelete={openDeleteModal}
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

        <BlogModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          blog={selectedBlog}
          onSaved={fetchBlogs}
        />
        <DeleteingModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          heading="Delete Blog"
          message={`Are you sure you want to delete "${deleteBlog?.title}"?`}
          yesText="Yes"
          noText="No"
        />
      </div>
    </Layout>
  );
};

export default BlogDashboard;
