"use client";
import { jsPDF } from "jspdf";

interface Employee {
  id: number;
  documentId: string;
  name: string;
  responsibility: string;
  salary: number;
  VC: number;
  VT: number;
  VR: number;
  VA: number;
  filial: {
    name: string;
  };
}

interface Payroll {
  quantityVR: number;
  quantityVT: number;
  quantityVC: number;
  quantityDayWork: number;
  fuelVoucher: number;
  transportationVoucher: number;
  mealVoucher: number;
  foodVoucher: number;
  gratification: number;
  discount: number;
  totalPayable: number;
  paidAt: string | null;
  paymentDate: string;
}

interface ReceiptData {
  employee: Employee;
  payroll: Payroll;
  month: number;
  year: number;
}

const monthNames = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

function printCurrency(val?: number) {
  if (!val || isNaN(val) || val === 0) return "R$ -";
  return `R$ ${val.toFixed(2).replace(".", ",")}`;
}

function negativePrintCurrency(val?: number) {
  if (!val || isNaN(val) || val === 0) return "R$ -";
  return `R$ -${val.toFixed(2).replace(".", ",")}`;
}

export function generateReceipt({
  employee,
  payroll,
  month,
  year,
}: ReceiptData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const marginLeft = 18;
  let y = 20;

  doc.addImage("/assets/logo_black.png", "PNG", marginLeft, y, 30, 12);
  y += 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("DEMONSTRATIVO DE PAGAMENTO", 105, y, { align: "center" });

  const dataAtual = new Date(payroll.paymentDate);
  const dataStr = dataAtual.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(dataStr, 105, y, { align: "center" });
  y += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Empresa", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text("WCA SERVIÇOS ESPECIALIZADOS", marginLeft + 30, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("CNPJ", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text("18.677.584/0001-08", marginLeft + 30, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Endereço", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Av. Augusto Barbosa Tavares, 320 - SL 08 - JD Maria Sampaio - SP",
    marginLeft + 30,
    y,
  );
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Colaborador", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(employee.name.toUpperCase(), marginLeft + 30, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("CPF", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text("", marginLeft + 30, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Posto", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(employee.filial.name, marginLeft + 30, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Função", marginLeft, y);
  doc.setFont("helvetica", "normal");
  doc.text(employee.responsibility.toUpperCase(), marginLeft + 30, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.text("Dias previstos de trabalho", marginLeft, y);
  doc.text(String(payroll.quantityDayWork || "-"), marginLeft + 60, y);
  y += 6;
  doc.text("VR ao dia", marginLeft, y);
  doc.text(printCurrency(employee.VR), marginLeft + 60, y);
  y += 6;
  doc.text("VC ao dia", marginLeft, y);
  doc.text(printCurrency(employee.VC), marginLeft + 60, y);
  y += 6;
  doc.text("VT ao dia", marginLeft, y);
  doc.text(printCurrency(employee.VT), marginLeft + 60, y);
  y += 6;
  doc.text("VA ao mês", marginLeft, y);
  doc.text(printCurrency(employee.VA), marginLeft + 60, y);
  y += 6;
  doc.text("( + ) ou ( - ) dias para ajuste", marginLeft, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Mês", 65, y);
  doc.text(monthNames[month - 1], 80, y);
  y += 7;

  doc.setFontSize(10);
  doc.text("Item", marginLeft, y);
  doc.text("Valor (R$)", marginLeft + 55, y);
  doc.text("Pago em", marginLeft + 95, y);
  y += 5;
  doc.setLineWidth(0.2);
  doc.line(marginLeft, y, marginLeft + 125, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.text("V. R.", marginLeft, y);
  doc.text(printCurrency(payroll.mealVoucher), marginLeft + 55, y);
  doc.text("C. C", marginLeft + 95, y);
  y += 6;
  doc.text("V. C.", marginLeft, y);
  doc.text(printCurrency(payroll.fuelVoucher), marginLeft + 55, y);
  doc.text("C. C", marginLeft + 95, y);
  y += 6;
  doc.text("V. T.", marginLeft, y);
  doc.text(printCurrency(payroll.transportationVoucher), marginLeft + 55, y);
  doc.text("C. C", marginLeft + 95, y);
  y += 6;
  doc.text("V. A.", marginLeft, y);
  doc.text(printCurrency(payroll.foodVoucher), marginLeft + 55, y);
  doc.text("C. C", marginLeft + 95, y);
  y += 6;
  doc.text("AD PONT / PREST", marginLeft, y);
  doc.text(printCurrency(payroll.gratification), marginLeft + 55, y);
  doc.text("C. C", marginLeft + 95, y);
  y += 7;

  doc.text("DESCONTOS", marginLeft, y);
  doc.text(negativePrintCurrency(payroll.discount), marginLeft + 55, y);
  y += 7;

  doc.setFont("helvetica", "bold");
  doc.text("TOTAL", marginLeft, y);
  doc.text(printCurrency(payroll.totalPayable), marginLeft + 55, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.text("R$", marginLeft, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("A PAGAR NESTE RECIBO", marginLeft + 60, y, { align: "left" });
  y += 8;
  doc.setFontSize(10);
  doc.text(printCurrency(payroll.totalPayable), marginLeft + 60, y, {
    align: "left",
  });
  doc.setFontSize(10);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("OBSERVAÇÃO", marginLeft, y);
  y += 5;
  doc.text("GERAL", marginLeft, y);

  doc.setFontSize(8);
  doc.text(
    dataAtual.toLocaleTimeString("pt-BR", { hour12: false }),
    marginLeft,
    287,
  );
  doc.text("Página 1 de 1", 105, 287, { align: "center" });

  const fileName = `Recibo_${employee.name.replace(/\s+/g, "_")}_${
    monthNames[month - 1]
  }_${year}.pdf`;
  doc.save(fileName);
}
