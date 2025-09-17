"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import DashboardLayout from "../components/layouts/dashboard";

interface Lead {
  _id: string;
  name: string;
  phone: string;
  source: string; // fan
  notes?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
}

export default function LidlarPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  const [filter, setFilter] = useState<
    "all" | "accepted" | "rejected" | "pending"
  >("all");

  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const API_URL = "https://unco-backend.onrender.com/api/leads";

  // Leadlarni olish
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setLeads(res.data);
    } catch (err) {
      console.error("Leadlarni olishda xatolik:", err);
      message.error("Leadlarni olishda muammo!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Lead qo‘shish
  const handleAddLead = async () => {
    try {
      const values = await addForm.validateFields();
      await axios.post(API_URL, values);
      message.success("✅ Yangi lead qo‘shildi!");
      setIsAddModalOpen(false);
      addForm.resetFields();
      fetchLeads();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        message.error(err.response?.data?.message || "❌ Lead qo‘shishda xatolik!");
      } else {
        message.error("❌ Lead qo‘shishda xatolik!");
      }
    }
  };

  // Leadni tahrirlash uchun modalni ochish
  const editLead = (lead: Lead) => {
    setCurrentLead(lead);
    form.setFieldsValue(lead);
    setIsModalOpen(true);
  };

  // Leadni yangilash
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`${API_URL}/${currentLead?._id}`, values);
      message.success("✅ Lead yangilandi!");
      setIsModalOpen(false);
      fetchLeads();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        message.error(err.response?.data?.message || "❌ Xatolik yuz berdi!");
      } else {
        message.error("❌ Xatolik yuz berdi!");
      }
    }
  };

  // Statusni o‘zgartirish
  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status });
      message.success(`Lead holati "${status}" ga o‘zgartirildi!`);
      fetchLeads();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Status update error:", err.response?.data || err);
        message.error(err.response?.data?.message || "❌ Holatni o‘zgartirishda xatolik!");
      } else {
        console.error("Status update error:", err);
        message.error("❌ Holatni o‘zgartirishda xatolik!");
      }
    }
  };

  // Leadni o‘chirish
  const deleteLead = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success("🗑️ Lead o‘chirildi!");
      fetchLeads();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        message.error(err.response?.data?.message || "❌ Leadni o‘chirishda xatolik!");
      } else {
        message.error("❌ Leadni o‘chirishda xatolik!");
      }
    }
  };

  // Filterlangan leadlar
  const filteredLeads = leads.filter((lead) => {
    if (filter === "accepted") return lead.status === "converted";
    if (filter === "rejected") return lead.status === "lost";
    if (filter === "pending") return lead.status === "new";
    return true;
  });

  // Jadval ustunlari
  const columns = [
    { title: "Ism Familya", dataIndex: "name", key: "name" },
    { title: "Telefon", dataIndex: "phone", key: "phone" },
    { title: "Fan", dataIndex: "source", key: "source" },
    { title: "Izoh", dataIndex: "notes", key: "notes" },
    {
      title: "Holati",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        if (status === "converted") return <Tag color="green">✅ Qabul qilingan</Tag>;
        if (status === "lost") return <Tag color="red">❌ Rad etilgan</Tag>;
        return <Tag color="orange">⏳ Kutilmoqda</Tag>;
      },
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_: unknown, record: Lead) => (
        <Space>
          <Button type="primary" onClick={() => updateStatus(record._id, "converted")}>
            Qabul qilish
          </Button>
          <Button danger onClick={() => updateStatus(record._id, "lost")}>
            Rad etish
          </Button>
          <Button onClick={() => updateStatus(record._id, "new")}>
            ⏳ Kutilmoqda
          </Button>
          <Button onClick={() => editLead(record)}>✏️ </Button>
          <Popconfirm
            title="Leadni o‘chirishni tasdiqlaysizmi?"
            onConfirm={() => deleteLead(record._id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button danger>🗑️ </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">📋 Lidlar</h1>
          <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
            ➕ Yangi Lead
          </Button>
        </div>

        {/* Filter tugmalari */}
        <div className="flex gap-2 mb-4">
          <Button type={filter === "all" ? "primary" : "default"} onClick={() => setFilter("all")}>
            Hammasi
          </Button>
          <Button
            type={filter === "accepted" ? "primary" : "default"}
            onClick={() => setFilter("accepted")}
          >
            ✅ Qabul qilingan
          </Button>
          <Button
            type={filter === "rejected" ? "primary" : "default"}
            onClick={() => setFilter("rejected")}
          >
            ❌ Rad etilgan
          </Button>
          <Button
            type={filter === "pending" ? "primary" : "default"}
            onClick={() => setFilter("pending")}
          >
            ⏳ Kutilmoqda
          </Button>
        </div>

        <Table
          dataSource={filteredLeads}
          columns={columns}
          rowKey={(record) => record._id}
          loading={loading}
          bordered
        />

        {/* Modal (Tahrirlash) */}
        <Modal
          title="Leadni tahrirlash"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleUpdate}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Ism Familya"
              rules={[{ required: true, message: "Ism Familyani kiriting!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Telefon"
              rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="source"
              label="Fan"
              rules={[{ required: true, message: "Fanni kiriting!" }]}
            >
              <Input placeholder="Ingliz tili, Dasturlash..." />
            </Form.Item>
            <Form.Item name="notes" label="Izoh">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal (Yangi Lead qo‘shish) */}
        <Modal
          title="Yangi Lead qo‘shish"
          open={isAddModalOpen}
          onCancel={() => setIsAddModalOpen(false)}
          onOk={handleAddLead}
        >
          <Form form={addForm} layout="vertical">
            <Form.Item
              name="name"
              label="Ism Familya"
              rules={[{ required: true, message: "Ism Familyani kiriting!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Telefon"
              rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="source"
              label="Fan"
              rules={[{ required: true, message: "Fanni kiriting!" }]}
            >
              <Input placeholder="Ingliz tili, Dasturlash..." />
            </Form.Item>
            <Form.Item name="notes" label="Izoh">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
