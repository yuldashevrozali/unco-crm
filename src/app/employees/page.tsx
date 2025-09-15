"use client";

import { Button, Modal, Table, Form, Input, Typography, message, Space, Select } from "antd";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/layouts/dashboard";
import axios from "axios";
import { useRouter } from "next/navigation";

const { Title } = Typography;
const { Option } = Select;

interface Teacher {
  _id?: string;
  key?: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
}

interface Group {
  _id?: string;
  name: string;
  date: string[];
  time: string;
  teacher: string;
}

export default function TeachersPage() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [groupForm] = Form.useForm();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const router = useRouter();

  // ✅ API url
  const API_URL = "https://unco-backend.onrender.com/api/teachers";

  // 🔹 O‘qituvchilarni olish
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(API_URL);
      setTeachers(res.data);
    } catch (err) {
      message.error("O‘qituvchilarni yuklashda xatolik");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // 🔹 Yangi o‘qituvchi qo‘shish yoki yangilash
  const handleSubmit = async (values: any) => {
    try {
      if (editingTeacher) {
        const res = await axios.put(`${API_URL}/${editingTeacher._id}`, values);
        message.success(res.data.message);
      } else {
        const res = await axios.post(API_URL, values);
        message.success(res.data.message);
      }
      form.resetFields();
      setIsModalOpen(false);
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      message.error("Amalni bajarishda xatolik");
    }
  };

  // 🔹 O‘chirish
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${API_URL}/${id}`);
      message.success(res.data.message);
      fetchTeachers();
    } catch (err) {
      message.error("O‘chirishda xatolik");
    }
  };

  // 🔹 Guruh yaratish
  const handleGroupSubmit = async (values: Group) => {
    try {
      const res = await axios.post("https://unco-backend.onrender.com/api/groups", values);
      message.success("Guruh muvaffaqiyatli yaratildi!");
      groupForm.resetFields();
      setIsGroupModalOpen(false);
    } catch (err) {
      message.error("Guruh yaratishda xatolik");
    }
  };

  const columns = [
    {
      title: "T/r",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Ismi",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: Teacher) => (
        <Button type="link" onClick={() => router.push(`/employees/${record._id}`)}>
          {record.name}
        </Button>
      ),
    },
    {
      title: "Fan",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_: any, record: Teacher) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingTeacher(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            ✏️
          </Button>
          <Button danger type="link" onClick={() => handleDelete(record._id!)}>
            🗑️
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">O‘qituvchilar</Title>
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              form.resetFields();
              setEditingTeacher(null);
              setIsModalOpen(true);
            }}
          >
            + O‘qituvchi qo‘shish
          </Button>
          <Button
            type="default"
            onClick={() => {
              groupForm.resetFields();
              setIsGroupModalOpen(true);
            }}
          >
            + Guruh yaratish
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={teachers}
        rowKey="_id"
        bordered
      />

      {/* Modal */}
      <Modal
        title={editingTeacher ? "O‘qituvchini tahrirlash" : "Yangi o‘qituvchi qo‘shish"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTeacher(null);
        }}
        onOk={() => form.submit()}
        okText={editingTeacher ? "Yangilash" : "Qo‘shish"}
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Ismi"
            rules={[{ required: true, message: "Ismni kiriting" }]}
          >
            <Input placeholder="Masalan: Ali Valiyev" />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Fan"
            rules={[{ required: true, message: "Fan nomini kiriting" }]}
          >
            <Input placeholder="Masalan: Matematika" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true, message: "Telefon raqamni kiriting" }]}
          >
            <Input placeholder="+998901234567" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Emailni to‘g‘ri kiriting" }]}
          >
            <Input placeholder="ali.valiyev@example.com" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Guruh yaratish Modal */}
      <Modal
        title="Yangi guruh yaratish"
        open={isGroupModalOpen}
        onCancel={() => setIsGroupModalOpen(false)}
        onOk={() => groupForm.submit()}
        okText="Yaratish"
        cancelText="Bekor qilish"
      >
        <Form form={groupForm} layout="vertical" onFinish={handleGroupSubmit}>
          <Form.Item
            name="name"
            label="Guruh nomi"
            rules={[{ required: true, message: "Guruh nomini kiriting" }]}
          >
            <Input placeholder="Masalan: React Advanced" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Kunlar"
            rules={[{ required: true, message: "Kunlarni tanlang" }]}
          >
            <Select mode="multiple" placeholder="Kunlarni tanlang">
              {["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba", "Yakshanba"].map((day) => (
                <Option key={day} value={day}>
                  {day}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="time"
            label="Vaqt"
            rules={[{ required: true, message: "Vaqtni kiriting" }]}
          >
            <Input placeholder="Masalan: 16:00-18:00" />
          </Form.Item>
          <Form.Item
            name="teacher"
            label="O‘qituvchi"
            rules={[{ required: true, message: "O‘qituvchini tanlang" }]}
          >
            <Select placeholder="O‘qituvchini tanlang">
              {teachers.map((teacher) => (
                <Option key={teacher._id} value={teacher.name}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}
