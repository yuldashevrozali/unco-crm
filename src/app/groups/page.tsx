"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import DashboardLayout from "../components/layouts/dashboard";
import axios from "axios";
import { Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

interface StudentType {
  _id: string;
  id: number;
  name: string;
  phone: string;
  group: string;
  teacher: string;
  isFrozen: boolean;
}

interface GroupType {
  _id?: string;
  name: string;
  date: string; // faqat hafta kuni
  time: string;
  students: string[];
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupType | null>(null);

  const [formData, setFormData] = useState<GroupType>({
    name: "",
    date: "",
    time: "",
    students: [],
  });

  // 🔹 Grouplarni olish
  const fetchGroups = async () => {
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Gruplarni olishda xatolik:", err);
    }
  };

  // 🔹 Studentlarni olish
  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Studentlarni olishda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchStudents();
  }, []);

  // 🔹 Guruh qo‘shish yoki yangilash
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      alert("Guruh nomi kiritilishi kerak!");
      return;
    }

    if (!formData.date) {
      alert("Hafta kunini tanlang!");
      return;
    }

    try {
      if (editingGroup) {
        const res = await axios.put(
          `https://unco-backend.onrender.com/api/groups/${editingGroup._id}`,
          formData,
          { headers: { "Content-Type": "application/json" } }
        );
        alert(res.data.message);
        setGroups(
          groups.map((g) => (g._id === editingGroup._id ? res.data.group : g))
        );
      } else {
        const res = await axios.post("https://unco-backend.onrender.com/api/groups", formData, {
          headers: { "Content-Type": "application/json" },
        });
        alert(res.data.message);
        setGroups([...groups, res.data.group]);
      }

      setFormData({ name: "", date: "", time: "", students: [] });
      setEditingGroup(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
    }
  };

  // 🔹 Guruh o‘chirish
  const handleDelete = async (id: string) => {
    if (!confirm("Rostdan ham ushbu guruhni o‘chirmoqchimisiz?")) return;

    try {
      await axios.delete(`https://unco-backend.onrender.com/api/groups/${id}`);
      setGroups(groups.filter((g) => g._id !== id));
    } catch (err) {
      console.error("O‘chirishda xatolik:", err);
    }
  };

  // 🔹 Guruhni tahrirlash
  const handleEdit = (group: GroupType) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      date: group.date,
      time: group.time,
      students: group.students.map((s: any) => (typeof s === "string" ? s : s._id)),
    });
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">📚 Guruhlar</h1>
          <button
            onClick={() => {
              setEditingGroup(null);
              setFormData({ name: "", date: "", time: "", students: [] });
              setModalOpen(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            ➕ Yangi guruh qo‘shish
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">📌 Guruh nomi</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">📅 Hafta kuni</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">⏰ Vaqt</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">👨‍🎓 O‘quvchilar soni</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">⚙️ Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {groups.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Guruhlar mavjud emas
                  </td>
                </tr>
              )}
              {groups.map((group, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800">{group.name}</td>
                  <td className="px-6 py-4">{group.date}</td>
                  <td className="px-6 py-4">{group.time}</td>
                  <td className="px-6 py-4 text-indigo-600 font-semibold">
                    {group.students ? group.students.length : 0} ta
                  </td>
                  <td className="px-6 py-4 text-center">
  <div className="flex justify-center gap-3">
    <button
      onClick={() => handleEdit(group)}
      className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
      title="Tahrirlash"
    >
      <EditOutlined />
    </button>
    <button
      onClick={() => handleDelete(group._id!)}
      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
      title="O‘chirish"
    >
      <DeleteOutlined />
    </button>
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Transition appear show={modalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setModalOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all">
                    <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-4">
                      {editingGroup ? "✏️ Guruhni tahrirlash" : "➕ Yangi guruh qo‘shish"}
                    </Dialog.Title>

                    <div className="space-y-4">
                      {/* Guruh nomi */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">📌 Guruh nomi</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Hafta kuni */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">📅 Hafta kuni</label>
                        <Select
                          className="w-full mt-1"
                          placeholder="Hafta kunini tanlang"
                          value={formData.date}
                          onChange={(value) => setFormData({ ...formData, date: value })}
                        >
                          <Option value="Dushanba">Dushanba</Option>
                          <Option value="Seshanba">Seshanba</Option>
                          <Option value="Chorshanba">Chorshanba</Option>
                          <Option value="Payshanba">Payshanba</Option>
                          <Option value="Juma">Juma</Option>
                          <Option value="Shanba">Shanba</Option>
                          <Option value="Yakshanba">Yakshanba</Option>
                        </Select>
                      </div>

                      {/* Vaqt */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">⏰ Vaqt</label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* O‘quvchilar */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">👨‍🎓 O‘quvchilar</label>
                        <Select
                          mode="multiple"
                          allowClear
                          className="w-full"
                          placeholder="O‘quvchilarni tanlang"
                          value={formData.students}
                          onChange={(value) => setFormData({ ...formData, students: value })}
                        >
                          {students.map((s) => (
                            <Option key={s._id} value={s._id}>
                              {s.name} ({s.phone})
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100 transition"
                        onClick={() => setModalOpen(false)}
                      >
                        ❌ Bekor qilish
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white shadow hover:bg-indigo-700 transition"
                        onClick={handleSubmit}
                      >
                        {editingGroup ? "💾 Yangilash" : "➕ Qo‘shish"}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </DashboardLayout>
  );
}
