"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  message,
  Select,
  Space,
  Popconfirm,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Link from "next/link";
import dayjs from "dayjs";
import DashboardLayout from "@/app/components/layouts/dashboard";

interface Student {
  _id: string;
  id: number;
  name: string;
  phone: string;
  group: string;
  teacher: string;
  isFrozen?: boolean;
  freezeNote?: string;
  freezeUntil?: string;
}

interface Group {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
  subject: string;
}

const API_BASE = "https://unco-backend.onrender.com/api";

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [freezingStudent, setFreezingStudent] = useState<Student | null>(null);

  const [form] = Form.useForm();
  const [freezeForm] = Form.useForm();

  // 🔹 Studentlarni olish
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/students`);
      setStudents(res.data);
    } catch {
      message.error("Studentlarni olishda xatolik!");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Guruhlarni olish
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_BASE}/groups`);
      setGroups(res.data);
    } catch (err) {
      message.error("Guruhlarni olishda xatolik!");
    }
  };

  // 🔹 O‘qituvchilarni olish
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/teachers`);
      setTeachers(res.data);
    } catch (err) {
      message.error("O‘qituvchilarni olishda xatolik!");
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchGroups();
    fetchTeachers();
  }, [fetchStudents]);

  // 🔹 Student qo‘shish / tahrirlash
  const handleSaveStudent = async (values: {
    name: string;
    phone: string;
    group: string;
    teacher: string;
  }) => {
    try {
      if (editingStudent) {
        // 🔸 UPDATE
        const res = await axios.put(
          `${API_BASE}/students/${editingStudent._id}`,
          values
        );
        message.success(res.data.message || "Student yangilandi!");
      } else {
        // 🔸 CREATE
        const selectedGroup = groups.find((g) => g._id === values.group);
        const selectedTeacher = teachers.find((t) => t._id === values.teacher);

        const newStudent = {
          id: Date.now(),
          name: values.name,
          phone: values.phone,
          group: selectedGroup ? selectedGroup.name : values.group,
          teacher: selectedTeacher ? selectedTeacher.name : values.teacher,
        };

        const res = await axios.post(`${API_BASE}/students`, newStudent);
        message.success(res.data.message || "Student qo‘shildi!");
      }

      setIsModalOpen(false);
      setEditingStudent(null);
      form.resetFields();
      fetchStudents();
    } catch (err: any) {
      console.error("Xatolik:", err.response?.data || err.message);
      message.error(err.response?.data?.message || "Amaliyotda xatolik!");
    }
  };

  // 🔹 Student o‘chirish
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${API_BASE}/students/${id}`);
      message.success(res.data.message || "Student o‘chirildi!");
      fetchStudents();
    } catch (err) {
      message.error("O‘chirishda xatolik!");
    }
  };

  // 🔹 Muzlatish
  const handleFreezeStudent = async (values: {
    freezeNote: string;
    freezeUntil: string;
  }) => {
    if (!freezingStudent) return;

    try {
      const res = await axios.put(
        `${API_BASE}/students/${freezingStudent._id}`,
        {
          isFrozen: true,
          ...values,
        }
      );
      message.success(res.data.message || "Student muzlatildi!");
      setIsFreezeModalOpen(false);
      freezeForm.resetFields();
      fetchStudents();
    } catch (err) {
      message.error("Muzlatishda xatolik!");
    }
  };

  // 🔹 Qidiruv
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 🔹 Jadval ustunlari
  const columns = [
    {
      title: "#",
      key: "index",
      render: (_: unknown, __: Student, idx: number) => idx + 1,
    },
    {
      title: "Ism Familya",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: Student) => (
        <Link href={`/students/${record._id}`}>{record.name}</Link>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => <a href={`tel:${phone}`}>{phone}</a>,
    },
    {
      title: "Guruhi",
      dataIndex: "group",
      key: "group",
    },
    { title: "Ustoz", dataIndex: "teacher", key: "teacher" },
    {
      title: "Holat",
      key: "status",
      render: (_: unknown, record: Student) =>
        record.isFrozen ? "❄️ Muzlatilgan" : "✅ Aktiv",
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_: unknown, record: Student) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingStudent(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          />
          <Button
            icon={<PauseCircleOutlined />}
            type="dashed"
            onClick={() => {
              setFreezingStudent(record);
              setIsFreezeModalOpen(true);
            }}
          >
            Muzlatish
          </Button>
          <Popconfirm
            title="O‘chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      {/* Qidiruv + Qo‘shish tugmasi */}
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Qidiruv"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingStudent(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Yangi Student
        </Button>
      </div>

      {/* Jadval */}
      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        loading={loading}
        bordered
      />

      {/* Modal: Student qo‘shish/tahrirlash */}
      <Modal
        title={editingStudent ? "Studentni Tahrirlash" : "Yangi Student Qo‘shish"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        okText="Saqlash"
        cancelText="Bekor qilish"
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveStudent}>
          <Form.Item
            label="Ism Familya"
            name="name"
            rules={[{ required: true, message: "Ismni kiriting!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Telefon"
            name="phone"
            rules={[{ required: true, message: "Telefon raqamni kiriting!" }]}
          >
            <Input placeholder="+998901234567" />
          </Form.Item>

          <Form.Item
            label="Guruhi"
            name="group"
            rules={[{ required: true, message: "Guruhni tanlang!" }]}
          >
            <Select placeholder="Guruh tanlang">
              {groups.map((g) => (
                <Select.Option key={g._id} value={g._id}>
                  {g.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ustoz"
            name="teacher"
            rules={[{ required: true, message: "Ustozni tanlang!" }]}
          >
            <Select placeholder="Ustoz tanlang">
              {teachers.map((t) => (
                <Select.Option key={t._id} value={t._id}>
                  {t.name} ({t.subject})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal: Muzlatish */}
      <Modal
        title={`Muzlatish - ${freezingStudent?.name}`}
        open={isFreezeModalOpen}
        onCancel={() => {
          setIsFreezeModalOpen(false);
          freezeForm.resetFields();
        }}
        okText="Muzlatish"
        cancelText="Bekor qilish"
        onOk={() => freezeForm.submit()}
      >
        <Form form={freezeForm} layout="vertical" onFinish={handleFreezeStudent}>
          <Form.Item
            label="Izoh"
            name="freezeNote"
            rules={[{ required: true, message: "Izoh kiriting!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Masalan: To‘lov qilmagani uchun..."
            />
          </Form.Item>
          <Form.Item
            label="Muzlatish muddati"
            name="freezeUntil"
            rules={[{ required: true, message: "Muddatni tanlang!" }]}
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current < dayjs().endOf("day")
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentsPage;
