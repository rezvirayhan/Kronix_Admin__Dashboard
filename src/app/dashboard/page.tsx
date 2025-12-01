"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/Layout";
import HeaderCard from "../components/HeaderCard";

import {
  MdDashboard,
  MdMiscellaneousServices,
  MdOutlineLibraryBooks,
  MdPhotoLibrary,
  MdPriceChange,
} from "react-icons/md";
import { FiMail } from "react-icons/fi";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";
import { FaCartArrowDown, FaUserTie } from "react-icons/fa6";
import { VscPreview } from "react-icons/vsc";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ArcElement
);

const MainDashboardPages = () => {
  const [counts, setCounts] = useState({
    users: 0,
    testimonials: 0,
    portfolio: 0,
    services: 0,
    emails: 0,
    orders: 0,
    pricing: 0,
    blogs: 0,
  });

  const [loading, setLoading] = useState(false);

  const API_ENDPOINTS = {
    users: "http://localhost:5000/api/users",
    testimonials: "http://localhost:5000/api/testimonials",
    portfolio: "http://localhost:5000/api/portfolio",
    services: "http://localhost:5000/api/services",
    emails: "http://localhost:5000/api/emails",
    orders: "http://localhost:5000/api/order",
    pricing: "http://localhost:5000/api/pricing",
    blogs: "http://localhost:5000/api/blogs",
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const responses = await Promise.all(
        Object.values(API_ENDPOINTS).map((url) => axios.get(url))
      );

      const newCounts = {
        users: responses[0].data.data?.length || responses[0].data.length || 0,
        testimonials:
          responses[1].data.data?.length || responses[1].data.length || 0,
        portfolio:
          responses[2].data.data?.length || responses[2].data.length || 0,
        services:
          responses[3].data.data?.length || responses[3].data.length || 0,
        emails: responses[4].data.data?.length || responses[4].data.length || 0,
        orders: responses[5].data.data?.length || responses[5].data.length || 0,
        pricing:
          responses[6].data.data?.length || responses[6].data.length || 0,
        blogs: responses[7].data.data?.length || responses[7].data.length || 0,
      };

      setCounts(newCounts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statsData = [
    {
      title: "Total Users",
      value: counts.users,
      icon: <FaUserTie />,
      gradient: "bg-gradient-to-l from-blue-400 to-blue-600",
    },
    {
      title: "Testimonials",
      value: counts.testimonials,
      icon: <VscPreview />,
      gradient: "bg-gradient-to-l from-purple-400 to-purple-600",
    },
    {
      title: "Portfolio Items",
      value: counts.portfolio,
      icon: <MdPhotoLibrary />,
      gradient: "bg-gradient-to-l from-green-400 to-green-600",
    },
    {
      title: "Services",
      value: counts.services,
      icon: <MdMiscellaneousServices />,
      gradient: "bg-gradient-to-l from-yellow-400 to-yellow-600",
    },
    {
      title: "Emails",
      value: counts.emails,
      icon: <FiMail />,
      gradient: "bg-gradient-to-l from-pink-400 to-pink-600",
    },
    {
      title: "Orders",
      value: counts.orders,
      icon: <FaCartArrowDown />,
      gradient: "bg-gradient-to-l from-indigo-400 to-indigo-600",
    },
    {
      title: "Pricing Plans",
      value: counts.pricing,
      icon: <MdPriceChange />,
      gradient: "bg-gradient-to-l from-red-400 to-red-600",
    },
    {
      title: "Blogs",
      value: counts.blogs,
      icon: <MdOutlineLibraryBooks />,
      gradient: "bg-gradient-to-l from-teal-400 to-teal-600",
    },
  ];

  const chartLabels = statsData.map((item) => item.title);
  const chartValues = statsData.map((item) => item.value);

  const chartColors = [
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#9C27B0",
    "#E91E63",
    "#3F51B5",
    "#F44336",
    "#009688",
  ];

  const barData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Total Counts",
        data: chartValues,
        backgroundColor: chartColors,
      },
    ],
  };

  const pieData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: chartColors,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 max-w-[1350px] mx-auto">
        {loading ? (
          <div className="flex items-center gap-4">
            <Skeleton height={80} width={80} borderRadius={12} />
            <div className="flex-1">
              <Skeleton height={25} width={200} />
              <Skeleton height={20} width={150} className="mt-2" />
            </div>
          </div>
        ) : (
          <HeaderCard
            icon={
              <MdDashboard className="text-6xl p-2 bg-white text-[#019ee2] rounded-lg" />
            }
            title="Dashboard"
          />
        )}

        <div className="grid gap-6 md:grid-cols-4 mt-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  height={100}
                  className="rounded-lg"
                  borderRadius={12}
                />
              ))
            : statsData.map((card, idx) => (
                <div
                  key={idx}
                  className={`flex items-center p-4 rounded-lg shadow-sm ${card.gradient}`}
                >
                  <div className="flex-1">
                    <p className="text-sm text-white opacity-80">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {card.value}
                    </p>
                  </div>
                  <div className="text-3xl text-white ml-4 flex items-center">
                    {card.icon}
                  </div>
                </div>
              ))}
        </div>

        <div className="flex gap-5 mt-10">
          <div className="bg-white p-6 rounded-lg shadow flex-1 h-[420px]">
            <h2 className="text-xl font-bold mb-4">Overall Data Overview</h2>
            <div className="h-[350px]">
              {loading ? <Skeleton height={320} /> : <Bar data={barData} />}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow flex-1 h-[420px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Data Distribution</h2>

            <div className="w-[350px] h-[350px]">
              {loading ? (
                <Skeleton height={330} width={330} circle />
              ) : (
                <Pie
                  data={pieData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainDashboardPages;
