/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import DynamicTable from "@/components/DynamicTable";
import DynamicPagination from "@/components/DynamicPagination";
import ReusableSearch from "@/components/ReusableSearch";
import HeaderCard from "@/components/HeaderCard";
import { MdPeople } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import HeroModal from "@/components/HeroModal";
import ReusableSort from "@/components/ReusableSort";

const API_URL = "http://localhost:5000/api/heroes";

export interface HeroStep {
  title: string;
  description: string;
  image?: string | File | null;
}

export interface Hero {
  _id?: string;
  mainTitle: string;
  description: string;
  steps: HeroStep[];
  createdAt?: string;
  updatedAt?: string;
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

  const fetchHeroes = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { page, limit, search, sortField, sortOrder },
      });
      setHeroes(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, [page, limit, search, sortField, sortOrder]);

  const handleEdit = (hero: Hero) => {
    setSelectedHero(hero);
    setIsModalOpen(true);
  };

  const handleDelete = async (hero: Hero) => {
    if (!confirm("Are you sure you want to delete this hero?")) return;
    try {
      await axios.delete(`${API_URL}/${hero._id}`);
      fetchHeroes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete hero");
    }
  };

  const columns = [
    {
      key: "mainTitle",
      label: "Main Title",
      thClass: "w-40",
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
            <MdPeople className="text-6xl p-2 bg-green-600 text-white rounded-lg" />
          }
          title="Heroes"
          buttonText="Add Hero"
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
          data={heroes}
          noDataText="No heroes found"
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

        <HeroModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hero={selectedHero}
          onSaved={fetchHeroes}
        />
      </div>
    </Layout>
  );
};

export default HeroDashboard;
