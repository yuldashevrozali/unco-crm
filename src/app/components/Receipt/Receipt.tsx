// components/Receipt/Receipt.tsx
import { forwardRef } from "react";

interface Payment {
  student: string;
  group: string;
  price: number;
  date: string;
}

interface ReceiptProps {
  payment: Payment;
}

const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(({ payment }, ref) => {
  return (
    <div ref={ref} className="p-4 border text-sm w-[250px] font-mono">
      <h2 className="text-center font-bold">💳 UNCO CRM</h2>
      <p>---------------------------</p>
      <p><b>O‘quvchi:</b> {payment.student}</p>
      <p><b>Guruh:</b> {payment.group}</p>
      <p><b>Summa:</b> {payment.price.toLocaleString()} so‘m</p>
      <p><b>Sana:</b> {new Date(payment.date).toLocaleDateString("uz-UZ")}</p>
      <p>---------------------------</p>
      <p className="text-center text-xs">Rahmat!</p>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
