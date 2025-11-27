"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DynamicTable from "@/components/DynamicTable";
import DynamicPagination from "@/components/DynamicPagination";
import ReusableSearch from "@/components/ReusableSearch";
import BannerModal from "@/components/BannerModal";
import { FaPlus } from "react-icons/fa";
import HeaderCard from "@/components/HeaderCard";
import { MdPriceChange } from "react-icons/md";
import ReusableSort from "@/components/ReusableSort";

interface IBanner {
  _id?: string;
  mainTitle: string;
  highlight: string;
  subtitle: string;
  buttonText: string;
  trustedText: string;
}

const BannerDashboard = () => {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<IBanner | null>(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/banners", {
        params: { page, limit, search, sortField, sortOrder },
      });

      setBanners(res.data.data || res.data);
      setTotal(res.data.total || res.data.length || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (banner: IBanner) => {
    setSelectedBanner(banner);
    setIsBannerModalOpen(true);
  };

  const columns = [
    {
      key: "mainTitle",
      label: "Main Title",
      thClass: "w-36",
      tdClass: "w-36",
    },
    {
      key: "highlight",
      label: "Highlight",
      thClass: "w-10",
      tdClass: "w-10",
    },
    { key: "subtitle", label: "Subtitle", thClass: "w-52", tdClass: "w-52" },
    {
      key: "buttonText",
      label: "Button Text",
      thClass: "w-24",
      tdClass: "w-24",
    },
    {
      key: "trustedText",
      label: "Trusted Text",
      thClass: "w-44",
      tdClass: "w-44",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        <HeaderCard
          icon={
            <MdPriceChange className="text-6xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Banners"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedBanner(null);
            setIsBannerModalOpen(true);
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
          data={banners}
          noDataText="No banners found"
          onEdit={handleEdit}
        />

        <BannerModal
          isOpen={isBannerModalOpen}
          onClose={() => setIsBannerModalOpen(false)}
          banner={selectedBanner}
          onSaved={fetchBanners}
        />
      </div>
    </Layout>
  );
};

export default BannerDashboard;
