import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { TaskWithDetails } from "@workspace/types"

interface GenerateMetricsPDFParams {
  title: string
  totalTasks: number
  completionRate: number
  holdTasks: number
  totalMetricValue: number
  departmentData: {
    department: string
    total: number
    completed: number
    inProgress: number
    hold: number
  }[]
  tasks: TaskWithDetails[]
  filters: {
    department: string
    timeframe: string
  }
}

export function generateMetricsPDF(params: GenerateMetricsPDFParams) {
  const doc = new jsPDF("p", "pt", "a4")
  const margin = 40
  let currentY = 40

  // --- Title & Header ---
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text(params.title, margin, currentY)
  
  currentY += 15
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, currentY)
  
  currentY += 15
  doc.setFont("helvetica", "bold")
  doc.setTextColor(60, 60, 60)
  doc.text(`Department: `, margin, currentY)
  doc.setFont("helvetica", "normal")
  doc.text(params.filters.department, margin + 65, currentY)
  
  currentY += 15
  doc.setFont("helvetica", "bold")
  doc.text(`Timeframe: `, margin, currentY)
  doc.setFont("helvetica", "normal")
  doc.text(params.filters.timeframe, margin + 60, currentY)

  currentY += 25

  // --- High-Level KPIs (Summary) ---
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(40, 40, 40)
  doc.text("Executive Summary", margin, currentY)
  currentY += 15

  const kpiData = [
    ["Total Tasks", params.totalTasks.toString()],
    ["Completion Rate", `${params.completionRate}%`],
    ["Active Hold", params.holdTasks.toString()],
    ["Total Value", params.totalMetricValue.toLocaleString("en-US")]
  ]

  autoTable(doc, {
    startY: currentY,
    head: [],
    body: kpiData,
    theme: "plain",
    styles: { fontSize: 11, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [60, 60, 60] },
      1: { textColor: [40, 40, 40] }
    },
    tableWidth: 300,
  })
  
  // @ts-ignore - jspdf-autotable adds lastAutoTable property
  currentY = doc.lastAutoTable.finalY + 30

  // --- Department Breakdown ---
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Department Breakdown", margin, currentY)
  currentY += 15

  const deptHead = [["Department", "Total", "Completed", "In Progress", "Hold"]]
  const deptBody = params.departmentData.map(d => [
    d.department,
    d.total.toString(),
    d.completed.toString(),
    d.inProgress.toString(),
    d.hold.toString()
  ])

  autoTable(doc, {
    startY: currentY,
    head: deptHead,
    body: deptBody,
    theme: "striped",
    headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
    styles: { fontSize: 10 },
  })

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 30

  // --- Detailed Tasks Table ---
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Filtered Tasks", margin, currentY)
  currentY += 15

  const taskHead = [["Title", "Status", "Department", "Created At", "Value"]]
  const taskBody = params.tasks.map(t => [
    t.name,
    t.status.replace("_", " "),
    t.department?.name || "Unassigned",
    new Date(t.createdAt).toLocaleDateString(),
    t.metricValue != null ? t.metricValue.toLocaleString("en-US") : "-"
  ])

  autoTable(doc, {
    startY: currentY,
    head: taskHead,
    body: taskBody,
    theme: "striped",
    headStyles: { fillColor: [71, 85, 105] }, // Slate 600
    styles: { fontSize: 9, cellPadding: 4 },
  })

  // Save the document
  doc.save(`Metrics_Report_${new Date().getTime()}.pdf`)
}
