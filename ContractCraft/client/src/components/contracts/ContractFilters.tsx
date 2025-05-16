import { FC, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { ContractStatus, ContractType } from "@shared/schema";

export interface ContractFiltersProps {
  onFilterChange: (filters: {
    status?: string;
    contractType?: string;
    dateRange?: string;
  }) => void;
}

const ContractFilters: FC<ContractFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: "_all",
    contractType: "_all",
    dateRange: "_all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const updatedFilters = {
      ...filters,
      [key]: value,
    };
    
    setFilters(updatedFilters);
    
    // Pass filters to parent
    const apiFilters = {
      status: updatedFilters.status === "_all" ? undefined : updatedFilters.status,
      contractType: updatedFilters.contractType === "_all" ? undefined : updatedFilters.contractType,
      dateRange: updatedFilters.dateRange === "_all" ? undefined : updatedFilters.dateRange,
    };
    
    onFilterChange(apiFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-3 sm:p-4">
      <div className="flex flex-col space-y-4">
        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full" id="status-filter">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Statuses</SelectItem>
                <SelectItem value={ContractStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={ContractStatus.DRAFT}>Draft</SelectItem>
                <SelectItem value={ContractStatus.PENDING}>Pending Signature</SelectItem>
                <SelectItem value={ContractStatus.EXPIRED}>Expired</SelectItem>
                <SelectItem value={ContractStatus.TERMINATED}>Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Contract Type
            </label>
            <Select
              value={filters.contractType}
              onValueChange={(value) => handleFilterChange("contractType", value)}
            >
              <SelectTrigger className="w-full" id="type-filter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Types</SelectItem>
                <SelectItem value={ContractType.SERVICE}>Service Agreement</SelectItem>
                <SelectItem value={ContractType.NDA}>NDA</SelectItem>
                <SelectItem value={ContractType.PURCHASE}>Purchase Order</SelectItem>
                <SelectItem value={ContractType.EMPLOYMENT}>Employment</SelectItem>
                <SelectItem value={ContractType.LEASE}>Lease Agreement</SelectItem>
                <SelectItem value={ContractType.CONSULTING}>Consulting</SelectItem>
                <SelectItem value={ContractType.LICENSE}>License</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => handleFilterChange("dateRange", value)}
            >
              <SelectTrigger className="w-full" id="date-filter">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all">All Time</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="180">Last 180 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              variant="outline" 
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-full"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button>
          </div>
        </div>
        
        {/* Applied filters here (future enhancement) */}
        {(filters.status !== '_all' || filters.contractType !== '_all' || filters.dateRange !== '_all') && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-500">Applied filters:</div>
            {filters.status !== '_all' && (
              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
                Status: {filters.status}
              </div>
            )}
            {filters.contractType !== '_all' && (
              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
                Type: {filters.contractType}
              </div>
            )}
            {filters.dateRange !== '_all' && (
              <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full flex items-center">
                Date: Last {filters.dateRange} days
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractFilters;
