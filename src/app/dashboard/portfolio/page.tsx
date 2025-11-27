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
import { IPortfolio } from "@/types/IPortfolio";
import { MdPhotoLibrary } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import PortfolioModal from "@/components/PortfolioModal";

const PortfolioDashboard = () => {
  const [images, setImages] = useState<IPortfolio[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IPortfolio | null>(null);

  const API_URL = "http://localhost:5000/api/images";

  const fetchImages = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });

      setImages(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (image: IPortfolio) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleDelete = async (image: IPortfolio) => {
    const id = image._id || image.id;
    if (!confirm("Delete this image?")) return;

    await axios.delete(`${API_URL}/${id}`);
    fetchImages();
  };
  const columns: IColumn[] = [
    {
      key: "imageUrl",
      label: "Image",
      thClass: "w-32 h-16",
      tdClass: "w-32 h-16",
      useValue: true,
      render: (value: string) =>
        value ? (
          <img
            src={value}
            alt="preview"
            className="w-24 h-24 object-cover rounded"
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      key: "alt",
      useValue: true,
      label: "Alt Text",
      thClass: "w-48 h-16",
      tdClass: "w-48 h-16",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "alt", label: "Alt Text" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      thClass: "w-36 h-16",
      tdClass: "w-36 h-16",
      useValue: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <MdPhotoLibrary className="text-5xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Portfolio"
          buttonText="Add Image"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedImage(null);
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
          data={images}
          noDataText="No images found"
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

        <PortfolioModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          image={selectedImage}
          onSaved={fetchImages}
        />
      </div>
    </Layout>
  );
};

export default PortfolioDashboard;
