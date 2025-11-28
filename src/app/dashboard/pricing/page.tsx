"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DynamicTable from "@/components/DynamicTable";
import DynamicPagination from "@/components/DynamicPagination";
import ReusableSearch from "@/components/ReusableSearch";
import ReusableSort from "@/components/ReusableSort";
import { IPricing } from "@/types/IPricing";
import { IColumn } from "@/types/IColumn";
import { MdPriceChange } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import HeaderCard from "@/components/HeaderCard";
import PricingModal from "@/components/PricingModal";
import DeleteingModal from "@/components/DeleteingModal";
import { toast } from "react-toastify";

const PricingDashboard = () => {
  const [pricings, setPricings] = useState<IPricing[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [selectedPricing, setSelectedPricing] = useState<IPricing | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePricing, setDeletePricing] = useState<IPricing | null>(null);

  const fetchPricings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pricing", {
        params: { page, limit, search, sortField, sortOrder },
      });
      setPricings(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPricings();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (row: IPricing) => {
    setSelectedPricing(row);
    setIsPricingModalOpen(true);
  };

  const handleDeleteClick = (row: IPricing) => {
    setDeletePricing(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deletePricing) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/pricing/${deletePricing._id}`
      );
      toast.success(
        `Pricing "${deletePricing.priceTitle}" deleted successfully!`,
        {
          position: "bottom-right",
        }
      );
      fetchPricings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete pricing", { position: "bottom-right" });
    } finally {
      setShowDeleteModal(false);
      setDeletePricing(null);
    }
  };

  const columns: IColumn[] = [
    {
      key: "pricing",
      label: "Pricing",
      useValue: true,
      thClass: "w-24 h-10",
      tdClass: "w-10 h-10",
    },
    {
      key: "priceTitle",
      label: "Price Title",
      useValue: true,
      thClass: "w-36 h-12",
      tdClass: "w-36 h-12",
    },
    {
      key: "pricingPackage",
      label: "Package",
      thClass: "w-20 h-12",
      useValue: true,
      tdClass: "w-20 h-12",
    },
    {
      key: "description",
      label: "Description",
      thClass: "w-60 h-12",
      tdClass: "w-60 h-12",
      useValue: true,
    },
    {
      key: "price",
      label: "Price",
      thClass: "w-10 h-12",
      tdClass: "w-10 h-12",
      useValue: true,
    },
    {
      key: "options",
      label: "Options",
      thClass: "w-52 h-12",
      tdClass: "w-52 h-12",
      useValue: true,
      render: (value: string[]) => (
        <div>
          {value.map((o, i) => (
            <p key={i}>{o}</p>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <MdPriceChange className="text-6xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Pricing"
          buttonText="Add Pricing"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedPricing(null);
            setIsPricingModalOpen(true);
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
          data={pricings}
          noDataText="No pricing found"
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

        <PricingModal
          isOpen={isPricingModalOpen}
          onClose={() => setIsPricingModalOpen(false)}
          pricing={selectedPricing}
          onSaved={fetchPricings}
        />

        <DeleteingModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          heading="Delete Pricing"
          message={`Are you sure you want to delete "${deletePricing?.priceTitle}"?`}
          yesText="Yes"
          noText="No"
        />
      </div>
    </Layout>
  );
};

export default PricingDashboard;
