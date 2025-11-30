/* eslint-disable @next/next/no-img-element */
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
import { FaPlus } from "react-icons/fa";
import TestimonialModal from "@/app/components/TestimonialModal";
import { VscPreview } from "react-icons/vsc";
import DeleteingModal from "@/app/components/DeleteingModal";
import { toast } from "react-toastify";
import ViewTestimonial from "@/app/components/ViewTestimonial";

export interface ITestimonial {
  _id?: string;
  companyName: string;
  companyLogo?: string;
  name: string;
  title: string;
  image?: string;
  titleReview: string;
  reviewDescription: string;
  createdAt?: string;
}

const TestimonialDashboard = () => {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTestimonialId, setViewTestimonialId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTestimonial, setDeleteTestimonial] =
    useState<ITestimonial | null>(null);

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<ITestimonial | null>(null);

  const API_URL = "http://localhost:5000/api/testimonials";

  const fetchTestimonials = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });

      setTestimonials(res.data.data || res.data);
      setTotal(res.data.total || res.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (testimonial: ITestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (testimonial: ITestimonial) => {
    setDeleteTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTestimonial?._id) return;

    try {
      await axios.delete(`${API_URL}/${deleteTestimonial._id}`);
      toast.success("User deleted successfully!");
      setShowDeleteModal(false);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete testimonial");
    }
  };
  const handleView = (testimonial: ITestimonial) => {
    setViewTestimonialId(testimonial._id || null);
    setIsViewModalOpen(true);
  };
  const columns: IColumn[] = [
    {
      key: "companyLogo",
      label: "Company Logo",
      thClass: "w-20 h-10",
      useValue: true,
      tdClass: "w-20 h-10",
      render: (value: string) =>
        value ? (
          <img
            src={value}
            alt="logo"
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <span>No Logo</span>
        ),
    },
    {
      key: "companyName",
      label: "Company Name",
      useValue: true,
      thClass: "w-36 h-16",
      tdClass: "w-36 h-16",
    },

    {
      key: "name",
      useValue: true,
      label: "Name",
      thClass: "w-40 h-16",
      tdClass: "w-40 h-16",
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
      key: "titleReview",
      label: "Title Review",
      useValue: true,
      thClass: "w-60 h-16",
      tdClass: "w-60 h-16",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <VscPreview className="text-5xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Testimonials"
          buttonText="Add Testimonial"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedTestimonial(null);
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
          data={testimonials}
          noDataText="No testimonials found"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isLoading={loading}
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

        <TestimonialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          testimonial={selectedTestimonial}
          onSaved={fetchTestimonials}
        />
        <DeleteingModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          heading="Delete Testimonial"
          message={`Are you sure you want to delete "${deleteTestimonial?.name}"?`}
          yesText="Yes"
          noText="No"
        />
        <ViewTestimonial
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          testimonialId={viewTestimonialId}
        />
      </div>
    </Layout>
  );
};

export default TestimonialDashboard;
