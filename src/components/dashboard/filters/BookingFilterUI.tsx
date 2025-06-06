import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Branch } from "@/types";
import { PaymentStatus } from "@/types/booking.types";
import { BookingFilters } from "@/hooks/bookings/useBookingFilters.hook";

interface BookingFilterUIProps {
  onApplyFilter: (filters: Partial<BookingFilters>) => void;
  onResetFilter: () => void;
  branches?: Branch[]; 
  showBranchFilter?: boolean;
}

export default function BookingFilterUI({ 
  onApplyFilter, 
  onResetFilter,
  branches = [], 
  showBranchFilter = false 
}: BookingFilterUIProps) {
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState("all");

  const handleApplyFilter = () => {
    const selectedBranchId = branchId === "all" ? undefined : Number(branchId);
    
    onApplyFilter({
      status: status === "all" ? undefined : status as PaymentStatus,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
      search,
      branchId: selectedBranchId,
    });
  };

  const handleResetFilter = () => {
    setStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch("");
    setBranchId("all");
    onResetFilter();
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="dp_paid">DP Terbayar</SelectItem>
                <SelectItem value="failed">Gagal</SelectItem>
                <SelectItem value="refunded">Dikembalikan</SelectItem>
                <SelectItem value="cancel">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showBranchFilter && branches.length > 0 && (
            <div>
              <Label htmlFor="branch">Cabang</Label>
              <Select
                value={branchId}
                onValueChange={(value) => setBranchId(value)}
              >
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Semua Cabang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Cabang</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="startDate">Tanggal Mulai</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="startDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="endDate">Tanggal Selesai</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="endDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "PPP", { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) =>
                    startDate ? date < startDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="search">Cari</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Cari booking..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end gap-2 md:col-span-5">
            <Button onClick={handleApplyFilter} className="flex-1">
              Terapkan Filter
            </Button>
            <Button
              variant="outline"
              onClick={handleResetFilter}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 