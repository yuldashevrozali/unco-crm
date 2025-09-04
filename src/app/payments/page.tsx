"use client";
import DashboardLayout from "../components/layouts/dashboard";
import { Table, Button, Input, message, Tag, Space, Switch } from "antd";
import { useState, useEffect } from "react";
import {
  PlusOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PaymentModal from "../components/PaymentModal/paymentModal";

interface PaymentType {
  _id: string;
  student: string;
  price: number;
  date: string;
  createdAt: string;
}

interface StudentType {
  _id: string;
  name: string;
  group: string;
  phone: string;
  payments: PaymentType[];
}

interface GroupType {
  _id: string;
  name: string;
  price: number;
  students: StudentType[];
}

export default function PaymentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [students, setStudents] = useState<StudentType[]>([]);
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showDebtors, setShowDebtors] = useState(false); // 🔹 Qarzdor filteri

  // 🔹 O‘quvchilarni olish
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("O‘quvchilarni olishda xatolik:", err);
      message.error("O‘quvchilarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Guruhlarni olish (narx bilan)
  const fetchGroups = async () => {
    try {
      const res = await axios.get("https://unco-backend.onrender.com/api/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Guruhlarni olishda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, []);

  // 🔹 Yangi to‘lov qo‘shish
  const handleAddPayment = async (values: { studentId: string; price: number; date: string }) => {
    try {
      const res = await axios.post("https://unco-backend.onrender.com/api/payments", values, {
        headers: { "Content-Type": "application/json" },
      });

      message.success(res.data.message);
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      console.error("To‘lov qo‘shishda xatolik:", err);
      message.error("To‘lov qo‘shishda xatolik");
    }
  };

  // 🔹 Guruh narxini topish
  const getGroupPrice = (groupName: string): number => {
    const group = groups.find((g) => g.name === groupName);
    return group ? group.price : 0;
  };

  // 🔹 Jadval uchun ma’lumot tayyorlash
  const paymentsData = students.map((student) => {
    const totalPaid = student.payments.reduce((sum, p) => sum + p.price, 0);
    const groupPrice = getGroupPrice(student.group);
    const debt = groupPrice - totalPaid;

    return {
      key: student._id,
      student: student.name,
      group: student.group,
      totalPaid,
      groupPrice,
      debt: debt > 0 ? debt : 0,
    };
  });

  // 🔹 Qidiruv + qarzdor filteri
  const filteredData = paymentsData.filter((item) => {
    const matchesSearch =
      item.student.toLowerCase().includes(searchText.toLowerCase()) ||
      item.group.toLowerCase().includes(searchText.toLowerCase());

    const matchesDebt = showDebtors ? item.debt > 0 : true;

    return matchesSearch && matchesDebt;
  });

  // 🔹 Excel eksport
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payments.xlsx");
  };

  // 🔹 PDF eksport
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("To‘lovlar ro‘yxati", 14, 10);
    (doc as any).autoTable({
      startY: 20,
      head: [["O‘quvchi", "Guruh", "Umumiy to‘lov", "Guruh narxi", "Qarzdorlik"]],
      body: filteredData.map((item) => [
        item.student,
        item.group,
        `${item.totalPaid.toLocaleString()} so‘m`,
        `${item.groupPrice.toLocaleString()} so‘m`,
        item.debt > 0 ? `${item.debt.toLocaleString()} so‘m` : "Yo‘q",
      ]),
    });
    doc.save("payments.pdf");
  };

  const columns = [
    {
      title: "O‘quvchi",
      dataIndex: "student",
      key: "student",
    },
    {
      title: "Guruh nomi",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Umumiy to‘lov",
      dataIndex: "totalPaid",
      key: "totalPaid",
      render: (amount: number) => `${amount.toLocaleString()} so‘m`,
    },
    {
      title: "Guruh narxi",
      dataIndex: "groupPrice",
      key: "groupPrice",
      render: (price: number) => `${price.toLocaleString()} so‘m`,
    },
    {
      title: "Qarzdorlik",
      dataIndex: "debt",
      key: "debt",
      render: (debt: number) =>
        debt > 0 ? (
          <Tag color="red">{debt.toLocaleString()} so‘m</Tag>
        ) : (
          <Tag color="green">Yo‘q</Tag>
        ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white p-6 rounded-md shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">To‘lovlar</h1>
          <Space>
            {/* 🔹 Qidiruv */}
            <Input
              placeholder="O‘quvchi yoki guruh bo‘yicha qidirish..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-72"
            />

            {/* 🔹 Qarzdor filteri */}
            <span>
              Faqat qarzdorlar:{" "}
              <Switch checked={showDebtors} onChange={setShowDebtors} />
            </span>

            {/* 🔹 Eksport tugmalari */}
            <Button icon={<FileExcelOutlined />} onClick={exportToExcel}>
              Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={exportToPDF}>
              PDF
            </Button>

            {/* 🔹 To‘lov qo‘shish */}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalOpen(true)}
            >
              To‘lov qo‘shish
            </Button>
          </Space>
        </div>

        {/* Jadval */}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 7 }}
        />

        {/* Modal */}
        <PaymentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddPayment}
          students={students}
        />
      </div>
    </DashboardLayout>
  );
}
