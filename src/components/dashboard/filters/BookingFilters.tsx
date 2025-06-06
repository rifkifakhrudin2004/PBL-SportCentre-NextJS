"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Branch, PaymentStatus, Role } from "@/types";
import { BookingFilters as BookingFiltersType } from "@/hooks/bookings/useBookingFilters.hook";
import { useAuth } from "@/context/auth/auth.context";

interface BookingFiltersProps {
  onFilterChange: (filters: Partial<BookingFiltersType>) => void;
  branches?: Branch[];
  showBranchFilter?: boolean;
  initialBranchId?: number;
}

export default function BookingFilters({ 
  onFilterChange, 
  branches = [], 
  showBranchFilter = false,
  initialBranchId
}: BookingFiltersProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState<string>(initialBranchId ? initialBranchId.toString() : "all");
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) {
      return;
    }

    if (user?.role === Role.ADMIN_CABANG && branches.length > 0 && user.branches && user.branches.length > 0) {
      const adminBranchId = user.branches[0].branchId;
      if (branches.some(branch => branch.id === adminBranchId)) {
        setBranchId(adminBranchId.toString());
        
        if (!initialBranchId || initialBranchId !== adminBranchId) {
          onFilterChange({
            branchId: adminBranchId
          });
        }
        
        initializedRef.current = true;
      }
    } else if (initialBranchId && initialBranchId > 0 && branches.some(branch => branch.id === initialBranchId)) {
      setBranchId(initialBranchId.toString());
      initializedRef.current = true;
    }
  }, [branches, user, initialBranchId, onFilterChange]);

  const applyFilter = () => {
    onFilterChange({
      status: status === "all" ? undefined : status as PaymentStatus,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
      search,
      branchId: branchId === "all" ? undefined : Number(branchId),
    });
  };

  const resetFilter = () => {
    setStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch("");
    
    if (user?.role === Role.ADMIN_CABANG && user.branches && user.branches.length > 0) {
      const adminBranchId = user.branches[0].branchId.toString();
      setBranchId(adminBranchId);
      
      onFilterChange({
        status: undefined,
        startDate: "",
        endDate: "",
        search: "",
        branchId: Number(adminBranchId),
      });
    } else {
      setBranchId("all");
      onFilterChange({
        status: undefined,
        startDate: "",
        endDate: "",
        search: "",
        branchId: undefined,
      });
    }
  };

  const renderDateButton = (
    buttonId: string, 
    value: Date | undefined, 
    placeholder: string
  ) => (
    <Button
      variant="outline"
      className="w-full justify-start text-left font-normal"
      id={buttonId}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value ? format(value, "PPP", { locale: id }) : <span>{placeholder}</span>}
    </Button>
  );

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
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
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger id="branch">
                  <SelectValue placeholder="Semua Cabang" />
                </SelectTrigger>
                <SelectContent>
                  {user?.role !== Role.ADMIN_CABANG && (
                    <SelectItem value="all">Semua Cabang</SelectItem>
                  )}
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
                {renderDateButton("startDate", startDate, "Pilih tanggal")}
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
                {renderDateButton("endDate", endDate, "Pilih tanggal")}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
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
            <Button onClick={applyFilter} className="flex-1">
              Terapkan Filter
            </Button>
            <Button
              variant="outline"
              onClick={resetFilter}
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