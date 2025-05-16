import { FC, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Eye, 
  Edit, 
  Trash2 
} from "lucide-react";
import { Contract } from "@shared/schema";
import ViewContractModal from "./ViewContractModal";
import EditContractModal from "./EditContractModal";
import DeleteContractDialog from "./DeleteContractDialog";

const getStatusBadgeClasses = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-success";
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "terminated":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getContractTypeIcon = (type: string) => {
  switch (type) {
    case "service":
      return "bg-blue-100 text-primary";
    case "nda":
      return "bg-purple-100 text-purple-600";
    case "purchase":
      return "bg-green-100 text-green-600";
    case "employment":
      return "bg-yellow-100 text-yellow-800";
    case "lease":
      return "bg-red-100 text-red-600";
    case "consulting":
      return "bg-green-100 text-green-600";
    case "license":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-blue-100 text-primary";
  }
};

interface ContractTableProps {
  contracts: Contract[];
  isLoading: boolean;
  onContractChange: () => void;
}

const ContractTable: FC<ContractTableProps> = ({ 
  contracts, 
  isLoading,
  onContractChange 
}) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const contractsPerPage = 5;
  const indexOfLastContract = currentPage * contractsPerPage;
  const indexOfFirstContract = indexOfLastContract - contractsPerPage;
  const currentContracts = contracts.slice(indexOfFirstContract, indexOfLastContract);
  const totalPages = Math.ceil(contracts.length / contractsPerPage);
  
  const handleView = (contract: Contract) => {
    setSelectedContract(contract);
    setViewModalOpen(true);
  };
  
  const handleEdit = (contract: Contract) => {
    setSelectedContract(contract);
    setEditModalOpen(true);
  };
  
  const handleDelete = (contract: Contract) => {
    setSelectedContract(contract);
    setDeleteDialogOpen(true);
  };
  
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };
  
  const formatCurrency = (value?: number | string | null) => {
    if (value === undefined || value === null) return "N/A";
    if (value === 0) return "N/A";
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(typeof value === "string" ? parseFloat(value) : value);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Name
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Type
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading contracts...
                  </TableCell>
                </TableRow>
              ) : currentContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No contracts found.
                  </TableCell>
                </TableRow>
              ) : (
                currentContracts.map((contract) => (
                  <TableRow key={contract.id} className="hover:bg-gray-50">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center ${getContractTypeIcon(contract.contractType)} rounded-md`}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contract.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contract.clientName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contract.contractType === "service" && "Service Agreement"}
                        {contract.contractType === "nda" && "Non-Disclosure"}
                        {contract.contractType === "purchase" && "Purchase Order"}
                        {contract.contractType === "employment" && "Employment"}
                        {contract.contractType === "lease" && "Lease Agreement"}
                        {contract.contractType === "consulting" && "Consulting"}
                        {contract.contractType === "license" && "License Agreement"}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(contract.status)}`}>
                        {contract.status === "active" && "Active"}
                        {contract.status === "draft" && "Draft"}
                        {contract.status === "pending" && "Pending Signature"}
                        {contract.status === "expired" && "Expired"}
                        {contract.status === "terminated" && "Terminated"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contract.startDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contract.endDate)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(contract.value)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-primary hover:text-blue-800" 
                          onClick={() => handleView(contract)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-secondary hover:text-gray-600" 
                          onClick={() => handleEdit(contract)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-danger hover:text-red-700" 
                          onClick={() => handleDelete(contract)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstContract + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastContract, contracts.length)}
                </span>{" "}
                of <span className="font-medium">{contracts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <Button
                      key={idx}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === currentPage
                          ? "bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    <Button
                      variant="outline"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {selectedContract && (
        <>
          <ViewContractModal
            isOpen={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            contract={selectedContract}
            onEdit={() => {
              setViewModalOpen(false);
              setEditModalOpen(true);
            }}
          />
          
          <EditContractModal
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            contract={selectedContract}
            onSuccess={() => {
              setEditModalOpen(false);
              onContractChange();
            }}
          />
          
          <DeleteContractDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            contract={selectedContract}
            onSuccess={() => {
              setDeleteDialogOpen(false);
              onContractChange();
            }}
          />
        </>
      )}
    </>
  );
};

export default ContractTable;
