"use client";

import DashboardLayout from "../components/layouts/dashboard";
import { Table, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

interface SaleType {
  _id: string;
  seller: string;
  product: string;
  quantity: number;
  price: number;
  date: string;
}

export default function StatisticPage() {
  const [filteredSales, setFilteredSales] = useState<SaleType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/sales");
      setFilteredSales(res.data || []);
    } catch {
      message.error("Sotuvlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const columns = [
    { title: "Sotuvchi", dataIndex: "seller", key: "seller" },
    { title: "Mahsulot", dataIndex: "product", key: "product" },
    {
      title: "Soni",
      dataIndex: "quantity",
      key: "quantity",
      render: (q: number) => (q ? q.toLocaleString() : "—"),
    },
    {
      title: "Narxi",
      dataIndex: "price",
      key: "price",
      render: (p?: number) => (p ? `${p.toLocaleString()} so‘m` : "—"),
    },
    { title: "Sana", dataIndex: "date", key: "date" },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-md shadow">
        <h1 className="text-xl font-semibold mb-4">Sotuvlar statistikasi</h1>
        <Table
          columns={columns}
          dataSource={filteredSales}
          loading={loading}
          pagination={{ pageSize: 10 }}
          rowKey="_id"
        />
      </div>
    </DashboardLayout>
  );
}
