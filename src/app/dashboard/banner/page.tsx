"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/Layout";
import DynamicTable from "@/app/components/DynamicTable";
import DynamicPagination from "@/app/components/DynamicPagination";
import ReusableSearch from "@/app/components/ReusableSearch";
import BannerModal from "@/app/components/BannerModal";
import { FaPlus } from "react-icons/fa";
import HeaderCard from "@/app/components/HeaderCard";
import { MdPriceChange } from "react-icons/md";
import ReusableSort from "@/app/components/ReusableSort";

interface IBanner {
  _id?: string;
  mainTitle: string;
  highlight: string;
  subtitle: string;
  buttonText: string;
  trustedText: string;
}
interface IColumn {
  key: string;
  label: string;
  thClass?: string;
  tdClass?: string;
  useValue: boolean;
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
  const [loading, setLoading] = useState(true);

  const fetchBanners = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/hero", {
        params: { page, limit, search, sortField, sortOrder },
      });

      setBanners(res.data.data || res.data);
      setTotal(res.data.total || res.data.length || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBanners();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (banner: IBanner) => {
    setSelectedBanner(banner);
    setIsBannerModalOpen(true);
  };

  const columns: IColumn[] = [
    {
      key: "mainTitle",
      label: "Main Title",
      thClass: "w-36",
      useValue: false,
      tdClass: "w-36",
    },
    {
      key: "highlight",
      label: "Highlight",
      thClass: "w-10",
      useValue: false,
      tdClass: "w-10",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      thClass: "w-52",
      tdClass: "w-52",
      useValue: false,
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
          isLoading={loading}
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
