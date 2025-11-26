"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DynamicTable from "@/components/DynamicTable";
import DynamicPagination from "@/components/DynamicPagination";
import ReusableSearch from "@/components/ReusableSearch";
import ReusableSort from "@/components/ReusableSort";
import HeaderCard from "@/components/HeaderCard";
import { IColumn } from "@/types/IColumn";
import { MdPeople } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import TestimonialModal from "@/components/TestimonialModal";

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
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<ITestimonial | null>(null);

  const API_URL = "http://localhost:5000/api/testimonials";

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });

      setTestimonials(res.data.data || res.data);
      setTotal(res.data.total || res.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (testimonial: ITestimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };
  const handleDelete = async (testimonial: ITestimonial) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`${API_URL}/${testimonial._id}`);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      alert("Failed to delete testimonial");
    }
  };

  const columns: IColumn[] = [
    {
      key: "image",
      label: "Image",
      useValue: true,
      thClass: "w-20 h-10",
      tdClass: "w-20 h-10",
      render: (value: string) =>
        value ? (
          <img
            src={value}
            alt="testimonial"
            className="w-14 h-14 object-cover rounded"
          />
        ) : (
          <span>No Image</span>
        ),
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
      key: "title",
      label: "Title",
      useValue: true,
      thClass: "w-52 h-16",
      tdClass: "w-52 h-16",
    },
    {
      key: "companyLogo",
      label: "Company Logo",
      thClass: "w-36 h-10",
      useValue: true,
      tdClass: "w-36 h-10",
      render: (value: string) =>
        value ? (
          <img
            src={value}
            alt="logo"
            className="w-14 h-14 object-cover rounded"
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
      key: "titleReview",
      label: "Title Review",
      useValue: true,
      thClass: "w-52 h-16",
      tdClass: "w-52 h-16",
    },
    {
      key: "reviewDescription",
      label: "Review Description",
      thClass: "w-80 h-16",
      useValue: true,
      tdClass: "w-80 h-16",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <MdPeople className="text-6xl p-2 bg-green-600 text-white rounded-lg" />
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

        <TestimonialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          testimonial={selectedTestimonial}
          onSaved={fetchTestimonials}
        />
      </div>
    </Layout>
  );
};

export default TestimonialDashboard;
