import { FC, useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import ContractFilters from "@/components/contracts/ContractFilters";
import ContractTable from "@/components/contracts/ContractTable";
import CreateContractModal from "@/components/contracts/CreateContractModal";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, FileUp, FileDown, FileSpreadsheet, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/App";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

const Contracts: FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<{
    status?: string;
    contractType?: string;
    dateRange?: string;
    searchQuery?: string;
  }>({});
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    setFilters(prev => ({
      ...prev,
      searchQuery: trimmedQuery || undefined
    }));
  }, [searchQuery]);
  
  const { data: contracts, isLoading, refetch } = useQuery({
    queryKey: ["/api/contracts", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.contractType) queryParams.append("type", filters.contractType);
      if (filters.dateRange) queryParams.append("dateRange", filters.dateRange);
      if (filters.searchQuery) queryParams.append("search", filters.searchQuery);
      
      console.log("Query parameters being sent:", Object.fromEntries(queryParams.entries()));
      
      const url = `/api/contracts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }
      return response.json();
    },
  });
  
  const handleFilterChange = (newFilters: {
    status?: string;
    contractType?: string;
    dateRange?: string;
  }) => {
    setFilters(prev => ({
      ...newFilters,
      searchQuery: prev.searchQuery
    }));
  };
  
  const handleContractChange = () => {
    refetch();
  };
  
  // Export contracts to Excel file
  const handleExport = () => {
    if (!contracts || contracts.length === 0) {
      toast({
        title: "Export failed",
        description: "No contracts available to export",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a worksheet from the contracts data
      const worksheet = XLSX.utils.json_to_sheet(contracts);
      
      // Create a workbook with the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contracts');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Create blob and download link
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `contracts_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: `${contracts.length} contracts exported to Excel file`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting contracts",
        variant: "destructive"
      });
    }
  };
  
  // Handle imported contracts data
  const [importedContracts, setImportedContracts] = useState<any[]>([]);
  const [showImportedData, setShowImportedData] = useState(false);
  
  // Trigger file input click for import
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file import
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast({
        title: "Import failed",
        description: "Only Excel files (.xlsx, .xls) are supported",
        variant: "destructive"
      });
      event.target.value = '';
      return;
    }
    
    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            throw new Error("Invalid format or empty data");
          }
          
          // Store the imported data
          setImportedContracts(jsonData);
          setShowImportedData(true);
          
          toast({
            title: "Import successful",
            description: `${jsonData.length} contracts imported from Excel file. They are now displayed in the table.`,
          });
          
        } catch (parseError) {
          console.error("Parse error:", parseError);
          toast({
            title: "Import failed",
            description: "Unable to parse the Excel file. Please check the format.",
            variant: "destructive"
          });
        }
      };
      
      reader.readAsArrayBuffer(file);
      
      // Reset the file input
      event.target.value = '';
      
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Import failed",
        description: "There was an error importing the file",
        variant: "destructive"
      });
      event.target.value = '';
    }
  };
  
  return (
    <>
      <div className="mb-6 flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Contracts</h2>
          <p className="text-sm text-gray-500">Manage and track all your contract documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <div className="flex space-x-2">
            <Button
              onClick={handleImportClick}
              variant="outline"
              className="border-gray-300"
              size="sm"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="border-gray-300"
              size="sm"
            >
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-primary hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        </div>
      </div>
      
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".xlsx,.xls"
        className="hidden"
      />
      
      <ContractFilters onFilterChange={handleFilterChange} />
      
      {showImportedData ? (
        <div className="mb-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileSpreadsheet className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Showing {importedContracts.length} imported contracts from Excel file. 
                  <button 
                    className="ml-2 font-medium text-yellow-700 underline"
                    onClick={() => setShowImportedData(false)}
                  >
                    Return to database contracts
                  </button>
                </p>
              </div>
            </div>
          </div>
          
          <ContractTable 
            contracts={importedContracts} 
            isLoading={false}
            onContractChange={() => {}}
            isImportedData={true}
          />
        </div>
      ) : (
        <ContractTable 
          contracts={contracts || []} 
          isLoading={isLoading}
          onContractChange={handleContractChange}
          isImportedData={false}
        />
      )}
      
      <CreateContractModal 
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          setCreateModalOpen(false);
          handleContractChange();
        }}
      />
    </>
  );
};

export default Contracts;
