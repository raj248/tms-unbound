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

const YEARS = ["2024", "2025", "2026", "2027", "2028"]
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

export function TimeFilter({ onChange }: TimeFilterProps) {
  const [year, setYear] = useState<string>("ALL")
  const [month, setMonth] = useState<string>("ALL")
  const [week, setWeek] = useState<string>("ALL")

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

    onChange({ startDate, endDate })
  }, [year, month, week])

  // Get active label
  let activeLabel = "All Time"
  if (year !== "ALL") {
    activeLabel = year
    if (month !== "ALL") {
      activeLabel = `${MONTHS.find(m => m.value === month)?.label} ${year}`
      if (week !== "ALL") {
        activeLabel = `W${week} of ${MONTHS.find(m => m.value === month)?.label} ${year}`
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
      <PopoverContent className="w-64 p-4" align="end">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Time Filter</h4>
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
        </div>
      </PopoverContent>
    </Popover>
  )
}
