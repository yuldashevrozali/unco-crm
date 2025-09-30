"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Spin,
  Alert,
  Descriptions,
  Typography,
  Space,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../components/layouts/dashboard";
import axios from "axios";

const { Option } = Select;

interface Student {
  _id: string;
  name: string;
  phone: string;
}

interface Teacher {
  _id: string;
  name: string;
  subject: string;
}

interface Group {
  _id?: string;
  name: string;
  date: string[]; // 🔹 oldingi days → endi date
  time: string;
  students: string[];
  teacher?: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [form] = Form.useForm<Group>();

  // 🔹 Guruhlarni olish
  const fetchGroups = async () => {
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/groups");
      setGroups(res.data);
    } catch {
      setError("❌ Guruhlarni olishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };
  console.log(groups);
  

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/students");
      setStudents(res.data);
    } catch {
      message.error("❌ Studentlarni olishda xatolik!");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/teachers");
      setTeachers(res.data);
    } catch {
      message.error("❌ Ustozlarni olishda xatolik!");
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchStudents();
    fetchTeachers();
  }, []);

  // 🔹 Qo‘shish / Yangilash
  const handleFinish = async (values: Group) => {
    try {
      if (editingGroup?._id) {
        const res = await axios.put(
          `https://unco-backend.onrender.com/api/groups/${editingGroup._id}`,
          values
        );
        setGroups((prev) =>
          prev.map((g) => (g._id === editingGroup._id ? res.data.group : g))
        );
        message.success("✅ Guruh yangilandi!");
      } else {
        const res = await axios.post(
          "https://unco-backend.onrender.com/api/groups",
          values
        );
        setGroups((prev) => [...prev, res.data.group]);
        message.success("✅ Guruh qo‘shildi!");
      }
      handleCloseModal();
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
      message.error("❌ Guruhni saqlashda muammo yuz berdi!");
    }
  };

  // 🔹 Modal boshqaruvi
  const handleOpenModal = (group?: Group) => {
    if (group) {
      setEditingGroup(group);
      form.setFieldsValue(group);
    } else {
      setEditingGroup(null);
      form.resetFields();
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGroup(null);
    form.resetFields();
  };

  const handleOpenDetailModal = (group: Group) => {
    setSelectedGroup(group);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedGroup(null);
  };

  // 🔹 O‘chirish
  const handleDelete = async (id: string) => {
    if (!confirm("Rostdan ham ushbu guruhni o‘chirmoqchimisiz?")) return;
    try {
      await axios.delete(`https://unco-backend.onrender.com/api/groups/${id}`);
      setGroups((prev) => prev.filter((g) => g._id !== id));
      message.success("🗑️ Guruh o‘chirildi!");
    } catch (err) {
      console.error("O‘chirishda xatolik:", err);
      message.error("❌ Guruhni o‘chirishda muammo yuz berdi!");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">📚 Guruhlar</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Yangi guruh qo‘shish
          </Button>
        </div>

        {/* Loader / Error / Table */}
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Table
            rowKey="_id"
            dataSource={groups}
            columns={[
              {
                title: "📌 Guruh nomi",
                dataIndex: "name",
                render: (name: string, record: Group) => (
                  <Button
                    type="link"
                    onClick={() => handleOpenDetailModal(record)}
                    style={{ padding: 0 }}
                  >
                    {name}
                  </Button>
                ),
              },
              {
                title: "📅 Kunlar",
                dataIndex: "date", // 🔹 endi date
                render: (date: string[]) => date.join(", "),
              },
              { title: "⏰ Vaqt", dataIndex: "time" },
              {
                title: "👨‍🏫 Ustoz",
                dataIndex: "teacher",
                render: (teacher: string) => teacher || "—",
              },
              {
                title: "👨‍🎓 O‘quvchilar",
                dataIndex: "students",
                render: (students: string[]) => `${students?.length || 0} ta`,
              },
              {
                title: "⚙️ Amallar",
                render: (_, group) => (
                  <>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleOpenModal(group)}
                      className="mr-2"
                    />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => group._id && handleDelete(group._id)}
                    />
                  </>
                ),
              },
            ]}
          />
        )}

        {/* Modal */}
        <Modal
          open={modalOpen}
          onCancel={handleCloseModal}
          title={editingGroup ? "✏️ Guruhni tahrirlash" : "➕ Yangi guruh qo‘shish"}
          okText={editingGroup ? "💾 Yangilash" : "➕ Qo‘shish"}
          cancelText="❌ Bekor qilish"
          onOk={() => form.submit()}
        >
          <Form layout="vertical" form={form} onFinish={handleFinish}>
            <Form.Item
              name="name"
              label="📌 Guruh nomi"
              rules={[{ required: true, message: "Guruh nomi majburiy!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="date" // 🔹 oldingi days → endi date
              label="📅 Hafta kunlari"
              rules={[{ required: true, message: "Kamida 1 kun tanlang!" }]}
            >
              <Select mode="multiple" placeholder="Kunlarni tanlang">
                {[
                  "Dushanba",
                  "Seshanba",
                  "Chorshanba",
                  "Payshanba",
                  "Juma",
                  "Shanba",
                  "Yakshanba",
                ].map((day) => (
                  <Option key={day} value={day}>
                    {day}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="time"
              label="⏰ Vaqt"
              rules={[{ required: true, message: "Vaqt tanlang!" }]}
            >
              <Input type="time" />
            </Form.Item>

            <Form.Item
              name="teacher"
              label="👨‍🏫 Ustoz"
              rules={[{ required: true, message: "Ustoz tanlang!" }]}
            >
              <Select placeholder="Ustozni tanlang">
                {teachers.map((t) => (
                  <Option key={t._id} value={t._id}>
                    {t.name} ({t.subject})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="students" label="👨‍🎓 O‘quvchilar">
              <Select mode="multiple" placeholder="O‘quvchilarni tanlang">
                {students.map((s) => (
                  <Option key={s._id} value={s._id}>
                    {s.name} ({s.phone})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Detail Modal */}
        <Modal
          open={detailModalOpen}
          onCancel={handleCloseDetailModal}
          footer={null}
          width={600}
          title="📚 Guruh tafsilotlari"
        >
          {selectedGroup && (
            <Space direction="vertical" size="large" className="w-full">
              <Typography.Title level={4}>👥 {selectedGroup.name}</Typography.Title>

              <Descriptions bordered column={1}>
                <Descriptions.Item label="📅 Hafta kunlari">
                  {selectedGroup.date.join(", ")}
                </Descriptions.Item>
                <Descriptions.Item label="⏰ Vaqt">
                  {selectedGroup.time}
                </Descriptions.Item>
                <Descriptions.Item label="👨‍🏫 Ustoz">
                  {teachers.find(t => t._id === selectedGroup.teacher)?.name || "—"} ({teachers.find(t => t._id === selectedGroup.teacher)?.subject || ""})
                </Descriptions.Item>
                <Descriptions.Item label="👨‍🎓 O‘quvchilar">
                  {selectedGroup.students.length > 0
                    ? selectedGroup.students.map(id => students.find(s => s._id === id)?.name).filter(Boolean).join(", ")
                    : "O‘quvchilar yo‘q"
                  }
                </Descriptions.Item>
                <Descriptions.Item label="📊 O‘quvchilar soni">
                  {selectedGroup.students.length} ta
                </Descriptions.Item>
              </Descriptions>
            </Space>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
