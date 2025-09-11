"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, Spin, Alert, Typography, Descriptions, Space } from "antd";
import DashboardLayout from "@/app/components/layouts/dashboard";

const { Title } = Typography;

interface Teacher {
  _id: string;
  name: string;
  subject: string;
  phone: string;
  email: string;
}

export default function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchTeacher = async () => {
      try {
        const { data } = await axios.get(
          `https://unco-backend.onrender.com/api/teachers/${id}`
        );
        setTeacher(data);
      } catch {
        setError("❌ O‘qituvchini olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center min-h-[60vh]">
        {loading ? (
          <Spin size="large">
            <div style={{ marginTop: 16 }}>Yuklanmoqda...</div>
          </Spin>
        ) : error ? (
          <Alert message="Xatolik" description={error} type="error" showIcon />
        ) : teacher ? (
          <Card
            className="shadow-lg rounded-2xl w-full max-w-2xl"
            bordered={false}
          >
            <Space direction="vertical" size="large" className="w-full">
              <Title level={3}>👨‍🏫 {teacher.name}</Title>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="📘 Fan">
                  {teacher.subject}
                </Descriptions.Item>
                <Descriptions.Item label="📞 Telefon">
                  <a
                    href={`tel:${teacher.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {teacher.phone}
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="✉️ Email">
                  <a
                    href={`mailto:${teacher.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {teacher.email}
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Card>
        ) : (
          <Alert message="⚠️ O‘qituvchi topilmadi" type="warning" showIcon />
        )}
      </div>
    </DashboardLayout>
  );
}
