import { useState, useEffect } from "react"
import { IconCalendarEvent } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export interface TimeFilterProps {
  onChange: (range: { startDate?: string; endDate?: string }) => void
}

const YEARS = ["2024", "2025", "2026"]
const MONTHS = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
]
const WEEKS = [
  { value: "1", label: "Week 1 (1st - 7th)" },
  { value: "2", label: "Week 2 (8th - 14th)" },
  { value: "3", label: "Week 3 (15th - 21st)" },
  { value: "4", label: "Week 4 (22nd - End)" },
]

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { Input } from "@workspace/ui/components/input"

export function TimeFilter({ onChange }: TimeFilterProps) {
  const [mode, setMode] = useState<"PREDEFINED" | "CUSTOM">("PREDEFINED")
  const [year, setYear] = useState<string>("ALL")
  const [month, setMonth] = useState<string>("ALL")
  const [week, setWeek] = useState<string>("ALL")
  const [customStart, setCustomStart] = useState<string>("")
  const [customEnd, setCustomEnd] = useState<string>("")

  useEffect(() => {
    // If year changes to ALL, reset others
    if (year === "ALL") {
      setMonth("ALL")
      setWeek("ALL")
    }
  }, [year])

  useEffect(() => {
    // If month changes to ALL, reset week
    if (month === "ALL") {
      setWeek("ALL")
    }
  }, [month])

  useEffect(() => {
    let startDate: string | undefined
    let endDate: string | undefined

    if (year !== "ALL") {
      const y = parseInt(year)
      if (month !== "ALL") {
        const m = parseInt(month)
        if (week !== "ALL") {
          const w = parseInt(week)
          // Calculate week start/end
          let startDay = 1
          let endDay = 7
          if (w === 2) { startDay = 8; endDay = 14 }
          if (w === 3) { startDay = 15; endDay = 21 }
          if (w === 4) { startDay = 22; endDay = new Date(y, m + 1, 0).getDate() }

          // Month is 0-indexed in JS Date, so m is correct
          startDate = new Date(y, m, startDay).toISOString()
          endDate = new Date(y, m, endDay, 23, 59, 59, 999).toISOString()
        } else {
          // Whole month
          startDate = new Date(y, m, 1).toISOString()
          endDate = new Date(y, m + 1, 0, 23, 59, 59, 999).toISOString()
        }
      } else {
        // Whole year
        startDate = new Date(y, 0, 1).toISOString()
        endDate = new Date(y, 11, 31, 23, 59, 59, 999).toISOString()
      }
    }

    if (mode === "CUSTOM") {
      let cStartDate: string | undefined
      let cEndDate: string | undefined
      if (customStart) {
        cStartDate = new Date(customStart).toISOString()
      }
      if (customEnd) {
        const d = new Date(customEnd)
        d.setHours(23, 59, 59, 999)
        cEndDate = d.toISOString()
      }
      onChange({ startDate: cStartDate, endDate: cEndDate })
      return
    }

    onChange({ startDate, endDate })
  }, [year, month, week, mode, customStart, customEnd])

  // Get active label
  let activeLabel = "All Time"
  if (mode === "CUSTOM") {
    activeLabel = customStart || customEnd ? "Custom Range" : "All Time"
  } else {
    if (year !== "ALL") {
      activeLabel = year
      if (month !== "ALL") {
        activeLabel = `${MONTHS.find(m => m.value === month)?.label} ${year}`
        if (week !== "ALL") {
          activeLabel = `W${week} of ${MONTHS.find(m => m.value === month)?.label} ${year}`
        }
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-[180px] justify-start text-left font-normal h-9">
          <IconCalendarEvent className="mr-2 h-4 w-4" />
          <span className="truncate">{activeLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-9">
            <TabsTrigger value="PREDEFINED" className="text-xs">Yearly/Predefined</TabsTrigger>
            <TabsTrigger value="CUSTOM" className="text-xs">Custom Date</TabsTrigger>
          </TabsList>
          
          <TabsContent value="PREDEFINED" className="space-y-4 mt-0">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Year</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Time</SelectItem>
                  {YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Month</label>
              <Select value={month} onValueChange={setMonth} disabled={year === "ALL"}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Months</SelectItem>
                  {MONTHS.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Week</label>
              <Select value={week} onValueChange={setWeek} disabled={month === "ALL"}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Weeks</SelectItem>
                  {WEEKS.map(w => <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="CUSTOM" className="space-y-4 mt-0">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Start Date</label>
              <Input 
                type="date" 
                value={customStart} 
                onChange={(e) => setCustomStart(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">End Date</label>
              <Input 
                type="date" 
                value={customEnd} 
                onChange={(e) => setCustomEnd(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
