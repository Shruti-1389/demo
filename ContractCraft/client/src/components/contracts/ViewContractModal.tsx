import { FC } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Contract } from "@shared/schema";
import { FileText, Printer, Download, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ViewContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  onEdit: () => void;
}

const ViewContractModal: FC<ViewContractModalProps> = ({ 
  isOpen, 
  onClose, 
  contract,
  onEdit
}) => {
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
  
  const getStatusClass = (status: string) => {
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
  
  const getContractTypeName = (type: string) => {
    switch (type) {
      case "service":
        return "Service Agreement";
      case "nda":
        return "Non-Disclosure Agreement";
      case "purchase":
        return "Purchase Order";
      case "employment":
        return "Employment Contract";
      case "lease":
        return "Lease Agreement";
      case "consulting":
        return "Consulting Agreement";
      case "license":
        return "License Agreement";
      default:
        return type;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 ml-3">
              {contract.name}
            </h3>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon">
              <Printer className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Status</h4>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(contract.status)}`}>
                    {contract.status === "active" && "Active"}
                    {contract.status === "draft" && "Draft"}
                    {contract.status === "pending" && "Pending Signature"}
                    {contract.status === "expired" && "Expired"}
                    {contract.status === "terminated" && "Terminated"}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Contract Type</h4>
                <p className="text-sm text-gray-900">{getContractTypeName(contract.contractType)}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Contract ID</h4>
                <p className="text-sm text-gray-900">CONT-{contract.id.toString().padStart(4, '0')}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Client</h4>
                <p className="text-sm text-gray-900">{contract.clientName}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Value</h4>
                <p className="text-sm text-gray-900">{formatCurrency(contract.value)}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Created By</h4>
                <p className="text-sm text-gray-900">John Doe</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Start Date</h4>
                <p className="text-sm text-gray-900">{formatDate(contract.startDate)}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">End Date</h4>
                <p className="text-sm text-gray-900">{formatDate(contract.endDate)}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-1">Last Updated</h4>
                <p className="text-sm text-gray-900">{formatDate(contract.updatedAt)}</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="details">
            <TabsList className="border-b border-gray-200">
              <TabsTrigger value="details">Contract Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <div className="contract-preview p-4 border border-gray-200 rounded-lg h-64 overflow-y-auto mt-4">
                {contract.contractType === "service" && (
                  <>
                    <h4 className="font-medium text-lg mb-2">SERVICE AGREEMENT</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      This Service Agreement (the "Agreement") is entered into as of {formatDate(contract.startDate)} (the "Effective Date") 
                      by and between {contract.clientName}, with its principal place of business at 123 Business Way, Metropolis ("Client") 
                      and Our Company LLC ("Service Provider").
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      WHEREAS, Client desires to retain Service Provider to provide certain services as set forth in this Agreement; and
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      WHEREAS, Service Provider is willing to perform such services in accordance with the terms and conditions of this Agreement;
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, the parties agree as follows:
                    </p>
                    <h5 className="font-medium text-base mb-1">1. SERVICES</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      Service Provider shall provide Client with the services described in Exhibit A attached hereto (the "Services"). 
                      Any additional services must be agreed upon in writing by both parties.
                    </p>
                    <h5 className="font-medium text-base mb-1">2. PAYMENT TERMS</h5>
                    <p className="text-sm text-gray-700 mb-3">
                      In consideration for the Services, Client shall pay Service Provider the amount of {formatCurrency(contract.value)} 
                      as specified in Exhibit B attached hereto. Payments shall be made according to the schedule set forth in Exhibit B.
                    </p>
                    <p className="text-sm text-gray-700 mb-3">...</p>
                  </>
                )}
                
                {contract.contractType === "nda" && (
                  <>
                    <h4 className="font-medium text-lg mb-2">NON-DISCLOSURE AGREEMENT</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      This Non-Disclosure Agreement (the "Agreement") is entered into as of {formatDate(contract.startDate)} (the "Effective Date") 
                      by and between {contract.clientName}, with its principal place of business at 123 Business Way, Metropolis ("Disclosing Party") 
                      and Our Company LLC ("Receiving Party").
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      1. PURPOSE: The parties wish to explore a potential business relationship in connection with which Disclosing Party may disclose 
                      certain confidential and proprietary information to the Receiving Party. This Agreement is intended to protect such information.
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      2. DEFINITION OF CONFIDENTIAL INFORMATION: "Confidential Information" means any information disclosed by the Disclosing Party to the 
                      Receiving Party, either directly or indirectly, in writing, orally or by inspection of tangible objects, that is designated as 
                      "Confidential", "Proprietary" or some similar designation.
                    </p>
                    <p className="text-sm text-gray-700 mb-3">...</p>
                  </>
                )}
                
                {contract.contractType !== "service" && contract.contractType !== "nda" && (
                  <div className="text-sm text-gray-700 mb-3">
                    <h4 className="font-medium text-lg mb-2">{getContractTypeName(contract.contractType).toUpperCase()}</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      {contract.description || "No detailed contract text available."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="p-4 border border-gray-200 rounded-lg h-64 overflow-y-auto mt-4">
                <div className="text-center text-gray-500 py-10">
                  <FileText className="h-16 w-16 mx-auto text-gray-300" />
                  <p className="mt-2">No documents attached to this contract</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="p-4 border border-gray-200 rounded-lg h-64 overflow-y-auto mt-4">
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs font-medium">JD</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">John Doe created this contract</p>
                      <p className="text-xs text-gray-500">{formatDate(contract.createdAt)}</p>
                    </div>
                  </div>
                  
                  {contract.status !== "draft" && (
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium">JD</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">John Doe changed status to {contract.status}</p>
                        <p className="text-xs text-gray-500">{formatDate(contract.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes">
              <div className="p-4 border border-gray-200 rounded-lg h-64 overflow-y-auto mt-4">
                <div className="text-center text-gray-500 py-10">
                  <p>No notes for this contract</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            Edit Contract
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewContractModal;
