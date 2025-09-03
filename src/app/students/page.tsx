"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import DashboardLayout from "../components/layouts/dashboard";

const { Option } = Select;

// O‘quvchi interfeysi
interface Student {
  _id?: string;
  id: number;
  name: string;
  phone: string;
  group: string;
  teacher: string;
  isFrozen?: boolean;
}

// 🔥 Backend API URL
const API_URL = "https://unco-backend.onrender.com/api/students";

const StudentsPage: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // ✅ Barcha studentlarni olish
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      message.error("Studentlarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Student qo‘shish
  const onFinish = async (values: any) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: students.length + 1,
          ...values,
        }),
      });

      if (!res.ok) throw new Error("Xatolik yuz berdi");

      const data = await res.json();
      setStudents([...students, data.student]);
      message.success("O‘quvchi muvaffaqiyatli qo‘shildi!");
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error("O‘quvchi qo‘shishda xatolik!");
    }
  };

  // ✅ Studentni o‘chirish
  const deleteStudent = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Xatolik yuz berdi");

      setStudents(students.filter((s) => s.id !== id));
      message.success("O‘quvchi o‘chirildi!");
    } catch (error) {
      message.error("O‘chirishda xatolik!");
    }
  };

  // ✅ Studentni yangilash
  const onEditFinish = async (values: any) => {
    if (!editingStudent) return;

    try {
      const res = await fetch(`${API_URL}/${editingStudent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Xatolik yuz berdi");

      const data = await res.json();

      setStudents(
        students.map((s) => (s.id === editingStudent.id ? data.student : s))
      );

      message.success("O‘quvchi yangilandi!");
      setIsEditModalOpen(false);
      setEditingStudent(null);
    } catch (error) {
      message.error("Yangilashda xatolik!");
    }
  };

  // Filter
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Jadval ustunlari
  const columns: ColumnsType<Student> = [
    {
      title: "#",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    { title: "Ismi familyasi", dataIndex: "name", key: "name" },
    { title: "Telefon", dataIndex: "phone", key: "phone" },
    { title: "Guruhi", dataIndex: "group", key: "group" },
    { title: "Ustoz", dataIndex: "teacher", key: "teacher" },
    {
      title: "To‘lov",
      key: "payment",
      render: () => (
        <Button
          type="primary"
          size="small"
          className="bg-blue-600 hover:bg-blue-700"
        >
          To‘lov qilish
        </Button>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setViewStudent(record);
              setIsViewModalOpen(true);
            }}
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingStudent(record);
              setIsEditModalOpen(true);
              editForm.setFieldsValue(record);
            }}
          />
          <Popconfirm
            title="Haqiqatan o‘chirmoqchimisiz?"
            onConfirm={() => deleteStudent(record.id)}
            okText="Ha"
            cancelText="Yo‘q"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Umumiy o‘quvchilar</h2>
          <p className="text-gray-600">
            Barcha o‘quvchilar soni: {filteredStudents.length}
          </p>
        </div>

        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Yangi o‘quvchi
        </Button>
      </div>

      {/* Qidiruv */}
      <div className="mb-4">
        <Input
          placeholder="Qidiruv"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="w-full max-w-sm"
        />
      </div>

      {/* Jadval */}
      <Table<Student>
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
        loading={loading}
        className="bg-white rounded shadow-sm"
      />

      {/* Qo‘shish Modal */}
      <Modal
        title="Yangi O‘quvchi Qo‘shish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            label="Ism Familya"
            name="name"
            rules={[{ required: true, message: "Ismni kiriting!" }]}
          >
            <Input placeholder="Ism familiyasi" />
          </Form.Item>

          <Form.Item
            label="Telefon"
            name="phone"
            rules={[{ required: true, message: "Telefon raqamini kiriting!" }]}
          >
            <Input placeholder="+998..." />
          </Form.Item>

          <Form.Item
            label="Guruh"
            name="group"
            rules={[{ required: true, message: "Guruhni tanlang!" }]}
          >
            <Select placeholder="Guruhni tanlang">
              <Option value="Fn1">Fn1</Option>
              <Option value="Fn17">Fn17</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ustozi"
            name="teacher"
            rules={[{ required: true, message: "Ustozni tanlang!" }]}
          >
            <Select placeholder="Ustozni tanlang">
              <Option value="Rasuljon Adhamov">Rasuljon Adhamov</Option>
              <Option value="Doe Doe">Doe Doe</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Qo‘shish
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Tahrirlash Modal */}
      <Modal
        title="O‘quvchini Tahrirlash"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={onEditFinish} form={editForm}>
          <Form.Item
            label="Ism Familya"
            name="name"
            rules={[{ required: true, message: "Ismni kiriting!" }]}
          >
            <Input placeholder="Ism familiyasi" />
          </Form.Item>

          <Form.Item
            label="Telefon"
            name="phone"
            rules={[{ required: true, message: "Telefon raqamini kiriting!" }]}
          >
            <Input placeholder="+998..." />
          </Form.Item>

          <Form.Item
            label="Guruh"
            name="group"
            rules={[{ required: true, message: "Guruhni tanlang!" }]}
          >
            <Select placeholder="Guruhni tanlang">
              <Option value="Fn1">Fn1</Option>
              <Option value="Fn17">Fn17</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Ustozi"
            name="teacher"
            rules={[{ required: true, message: "Ustozni tanlang!" }]}
          >
            <Select placeholder="Ustozni tanlang">
              <Option value="Rasuljon Adhamov">Rasuljon Adhamov</Option>
              <Option value="Doe Doe">Doe Doe</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Yangilash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Ko‘rish Modal */}
      <Modal
        title="O‘quvchi ma’lumotlari"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
      >
        {viewStudent && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Ism familya">
              {viewStudent.name}
            </Descriptions.Item>
            <Descriptions.Item label="Telefon">
              {viewStudent.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Guruhi">
              {viewStudent.group}
            </Descriptions.Item>
            <Descriptions.Item label="Ustozi">
              {viewStudent.teacher}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default StudentsPage;
