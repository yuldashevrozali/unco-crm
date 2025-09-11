"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Tabs,
  Button,
  Modal,
  Form,
  Select,
  TimePicker,
  message,
} from "antd";
import type { TabsProps } from "antd";
import axios from "axios";
import dayjs from "dayjs";

interface Schedule {
  _id?: string;
  group: { _id?: string; name: string };
  teacher?: { _id?: string; name: string };
  room: string;
  date: string[];
  time: string;
}

interface Group {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
}

const timeSlots: string[] = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 5;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const rooms: string[] = ["1", "2", "3", "4", "5", "6"];
const days: string[] = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
];

const ScheduleTable: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const API_URL = "https://unco-backend.onrender.com/api";

  // 🔹 Jadvalni olish
  const fetchSchedules = async () => {
    try {
      const res = await axios.get(`${API_URL}/schedules`);
      setSchedules(res.data);
    } catch {
      message.error("Jadvalni yuklashda xatolik");
    }
  };

  // 🔹 Guruhlar
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_URL}/groups`);
      setGroups(res.data);
    } catch {
      message.error("Guruhlarni yuklashda xatolik");
    }
  };

  // 🔹 O‘qituvchilar
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_URL}/teachers`);
      setTeachers(res.data);
    } catch {
      message.error("O‘qituvchilarni yuklashda xatolik");
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchGroups();
    fetchTeachers();
  }, []);

  // 🔹 Qo‘shish / Tahrirlash
  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        group: values.group,
        teacher: values.teacher,
        room: values.room,
        date: values.date,
        time: values.time.format("HH:mm"),
      };

      if (editingSchedule?._id) {
        const res = await axios.put(
          `${API_URL}/schedules/${editingSchedule._id}`,
          payload
        );
        message.success(res.data.message);
      } else {
        const res = await axios.post(`${API_URL}/schedules`, payload);
        message.success(res.data.message);
      }

      form.resetFields();
      setIsModalOpen(false);
      setEditingSchedule(null);
      fetchSchedules();
    } catch {
      message.error("Amalni bajarishda xatolik");
    }
  };

  // 🔹 O‘chirish
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${API_URL}/schedules/${id}`);
      message.success(res.data.message);
      fetchSchedules();
    } catch {
      message.error("O‘chirishda xatolik");
    }
  };

  // 🔹 Jadvalni gridga joylash
  const renderSchedule = (day: string, room: string, time: string) => {
    const lesson = schedules.find(
      (s) => s.room === room && s.time === time && s.date.includes(day)
    );
    if (!lesson) return null;

    return (
      <Card
        size="small"
        style={{
          backgroundColor: "#1677ff",
          color: "white",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 10px",
          height: "100%",
          fontSize: "14px",
        }}
        onClick={() => {
          setEditingSchedule(lesson);
          form.setFieldsValue({
            group: lesson.group?._id,
            teacher: lesson.teacher?._id,
            room: lesson.room,
            date: lesson.date,
            time: lesson.time ? dayjs(lesson.time, "HH:mm") : undefined,
          });
          setIsModalOpen(true);
        }}
      >
        {/* Faqat guruh nomi */}
        <div>{lesson.group?.name || "No Group"}</div>

        <Button
          size="small"
          type="link"
          danger
          onClick={(e) => {
            e.stopPropagation();
            if (lesson._id) handleDelete(lesson._id);
          }}
        >
          🗑️
        </Button>
      </Card>
    );
  };

  const items: TabsProps["items"] = days.map((day) => ({
    key: day,
    label: day,
    children: (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${timeSlots.length + 1}, 1fr)`,
          gap: 1,
        }}
      >
        <div></div>
        {timeSlots.map((time) => (
          <div
            key={time}
            style={{
              padding: 8,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            {time}
          </div>
        ))}

        {rooms.map((room) => (
          <React.Fragment key={room}>
            <div
              style={{
                padding: 8,
                fontWeight: "bold",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {room}
            </div>
            {timeSlots.map((time) => (
              <div
                key={`${room}-${time}`}
                style={{
                  border: "1px solid #ddd",
                  height: 80, // katak balandligi
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                {renderSchedule(day, room, time)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    ),
  }));

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Dars jadvali</h2>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setEditingSchedule(null);
            setIsModalOpen(true);
          }}
        >
          + Jadval qo‘shish
        </Button>
      </div>

      <Tabs defaultActiveKey="Dushanba" items={items} />

      {/* Modal */}
      <Modal
        title={editingSchedule ? "Jadvalni tahrirlash" : "Yangi jadval qo‘shish"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingSchedule(null);
        }}
        onOk={() => form.submit()}
        okText={editingSchedule ? "Yangilash" : "Qo‘shish"}
        cancelText="Bekor qilish"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="group" label="Guruh" rules={[{ required: true }]}>
            <Select placeholder="Guruhni tanlang">
              {groups.map((g) => (
                <Select.Option key={g._id} value={g._id}>
                  {g.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="teacher"
            label="O‘qituvchi"
            rules={[{ required: true }]}
          >
            <Select placeholder="O‘qituvchini tanlang">
              {teachers.map((t) => (
                <Select.Option key={t._id} value={t._id}>
                  {t.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="room" label="Xona" rules={[{ required: true }]}>
            <Select>
              {rooms.map((r) => (
                <Select.Option key={r} value={r}>
                  {r}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Kunlar" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="Kunlarni tanlang">
              {days.map((d) => (
                <Select.Option key={d} value={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="time" label="Vaqt" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ScheduleTable;
