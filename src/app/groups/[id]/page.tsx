"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Card, Spin, Alert } from "antd";
import DashboardLayout from "@/app/components/layouts/dashboard";

interface Group {
  _id: string;
  name: string;
  subject: string;
  teacher: string;
}

export default function GroupDetailPage() {
  const { id } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    axios
      .get(`https://unco-backend.onrender.com/api/groups/${id}`)
      .then((res) => {
        setGroup(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Guruhni olishda xatolik yuz berdi");
        setLoading(false);
      });
  }, [id]);

  return (
    <DashboardLayout>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : group ? (
        <Card title={`📚 ${group.name}`}>
          <p>
            <b>Fan:</b> {group.subject}
          </p>
          <p>
            <b>Ustoz:</b> {group.teacher}
          </p>
        </Card>
      ) : (
        <Alert message="Guruh topilmadi" type="warning" />
      )}
    </DashboardLayout>
  );
}
