"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Card,
  Spin,
  Alert,
  Typography,
  Descriptions,
  Space,
} from "antd";
import DashboardLayout from "@/app/components/layouts/dashboard";

const { Title } = Typography;

interface Student {
  _id: string;
  name: string;
  phone: string;
  group: string;
  teacher: string;
}

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchStudent = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get<Student>(
        `https://unco-backend.onrender.com/api/students/${id}`
      );
      setStudent(data);
    } catch (err) {
      setError("❌ O‘quvchini olishda xatolik yuz berdi. Qayta urinib ko‘ring.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        {loading ? (
          <Spin tip="Yuklanmoqda..." size="large" />
        ) : error ? (
          <Alert
            message="Xatolik"
            description={error}
            type="error"
            showIcon
          />
        ) : student ? (
          <Card
            className="shadow-lg rounded-2xl w-full max-w-2xl"
            bordered={false}
          >
            <Space direction="vertical" size="large" className="w-full">
              <Title level={3}>👤 {student.name}</Title>

              <Descriptions bordered column={1}>
                <Descriptions.Item label="📞 Telefon">
                  <a
                    href={`tel:${student.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {student.phone}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="👥 Guruh">
                  {student.group}
                </Descriptions.Item>
                <Descriptions.Item label="🎓 Ustoz">
                  {student.teacher}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
        ) : (
          <Alert message="⚠️ O‘quvchi topilmadi" type="warning" showIcon />
        )}
      </div>
    </DashboardLayout>
  );
}
