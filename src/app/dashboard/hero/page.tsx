/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/Layout";
import DynamicTable from "@/app/components/DynamicTable";
import DynamicPagination from "@/app/components/DynamicPagination";
import ReusableSearch from "@/app/components/ReusableSearch";
import HeaderCard from "@/app/components/HeaderCard";
import { MdPeople } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import ReusableSort from "@/app/components/ReusableSort";
import { BsPostageFill } from "react-icons/bs";
import { toast } from "react-toastify";
import DeleteingModal from "@/app/components/DeleteingModal";
import HeroModal from "@/app/section/HeroModal";

const API_URL = "https://kronix-back-end.vercel.app/api/process";

export interface HeroStep {
  title: string;
  description: string;
}

interface Hero {
  _id?: string;
  mainTitle: string;
  description: string;
  steps: HeroStep[];
  createdAt?: string;
  updatedAt?: string;
}
interface IColumn<T> {
  key: string;
  label: string;
  thClass?: string;
  tdClass?: string;
  useValue: boolean;
  headerComponent?: React.ReactNode;
  render?: (row: T) => React.ReactNode;
}
export interface HeroStep {
  title: string;
  description: string;
  image: string | File | null;
}

interface Hero {
  mainTitle: string;
  subTitle?: string;
  steps: HeroStep[];
}

const HeroDashboard = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteHero, setDeleteHero] = useState<Hero | null>(null);

  const fetchHeroes = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });

      setHeroes(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (hero: Hero) => {
    setSelectedHero(hero);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (hero: Hero) => {
    setDeleteHero(hero);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteHero?._id) return;
    try {
      await axios.delete(`${API_URL}/${deleteHero._id}`);
      toast.success(`Hero "${deleteHero.mainTitle}" deleted successfully!`);
      setShowDeleteModal(false);
      setDeleteHero(null);
      fetchHeroes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete hero");
    }
  };

  const columns: IColumn<Hero>[] = [
    {
      key: "mainTitle",
      label: "Main Title",
      thClass: "w-40",
      useValue: false,

      tdClass: "w-40",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "mainTitle", label: "Main Title" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
      render: (row: Hero) => row.mainTitle || null,
    },
    {
      key: "description",
      useValue: false,
      label: "Description",
      thClass: "w-60",
      tdClass: "w-60",
      headerComponent: (
        <ReusableSort
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOptions={[{ value: "createdAt", label: "Created At" }]}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
      ),
      render: (row: Hero) => row.description || null,
    },
    {
      key: "steps",
      label: "Steps",
      useValue: false,
      thClass: "w-80",
      tdClass: "w-80",
      render: (row: Hero) => {
        if (!row.steps || row.steps.length === 0) return null;
        return (
          <div className="flex flex-col gap-2">
            {row.steps.map((step, index) => (
              <div
                key={index}
                className="border p-2 border-[#cfd8e3] flex gap-5 rounded "
              >
                <div className="w-10/12">
                  {step.title && (
                    <span className="font-medium">{step.title}</span>
                  )}
                  {step.description && (
                    <p className="text-gray-500">{step.description}</p>
                  )}
                </div>
                <div className="w-1/6">
                  {step.image && (
                    <img
                      src={step.image as string}
                      alt={step.title}
                      className="mt-1 w-20 h-20 object-cover rounded-full"
                    />
                  )}
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
            <BsPostageFill className="text-5xl p-2 bg-[#00b0ea] text-white rounded-lg" />
          }
          title="Heroes"
          buttonIcon={<FaPlus />}
          onButtonClick={() => {
            setSelectedHero(null);
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
          isLoading={loading}
          data={heroes}
          noDataText="No heroes found"
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <HeroModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hero={selectedHero}
          onSaved={fetchHeroes}
        />

        <DeleteingModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          heading="Delete Hero"
          message={`Are you sure you want to delete "${deleteHero?.mainTitle}"?`}
          yesText="Yes"
          noText="No"
        />
      </div>
    </Layout>
  );
};

export default HeroDashboard;
