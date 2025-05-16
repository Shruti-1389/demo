import { FC } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Contract, updateContractSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileText } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ContractStatus, ContractType } from "@shared/schema";

interface EditContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: Contract;
  onSuccess: () => void;
}

const EditContractModal: FC<EditContractModalProps> = ({ 
  isOpen, 
  onClose,
  contract,
  onSuccess
}) => {
  const { toast } = useToast();
  
  const formatDateForInput = (dateString?: Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  const form = useForm({
    resolver: zodResolver(updateContractSchema),
    defaultValues: {
      name: contract.name,
      contractType: contract.contractType,
      status: contract.status,
      clientName: contract.clientName,
      value: contract.value?.toString() || "",
      startDate: formatDateForInput(contract.startDate),
      endDate: formatDateForInput(contract.endDate),
      description: contract.description || "",
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/contracts/${contract.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contracts"] });
      toast({
        title: "Contract updated",
        description: "The contract has been updated successfully.",
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update contract: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = form.handleSubmit((data) => {
    updateMutation.mutate(data);
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <div className="flex items-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="ml-3">Edit Contract</DialogTitle>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter contract name" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ContractType.SERVICE}>Service Agreement</SelectItem>
                        <SelectItem value={ContractType.NDA}>Non-Disclosure Agreement</SelectItem>
                        <SelectItem value={ContractType.PURCHASE}>Purchase Order</SelectItem>
                        <SelectItem value={ContractType.EMPLOYMENT}>Employment Contract</SelectItem>
                        <SelectItem value={ContractType.LEASE}>Lease Agreement</SelectItem>
                        <SelectItem value={ContractType.CONSULTING}>Consulting Agreement</SelectItem>
                        <SelectItem value={ContractType.LICENSE}>License Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ContractStatus.DRAFT}>Draft</SelectItem>
                        <SelectItem value={ContractStatus.PENDING}>Pending Signature</SelectItem>
                        <SelectItem value={ContractStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={ContractStatus.EXPIRED}>Expired</SelectItem>
                        <SelectItem value={ContractStatus.TERMINATED}>Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client/Vendor</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter client or vendor name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Value</FormLabel>
                    <FormControl>
                      <div className="relative rounded-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <Input
                          {...field}
                          type="text"
                          placeholder="0.00"
                          className="pl-7"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter contract description" 
                          className="resize-none" 
                          rows={3} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={form.handleSubmit((data) => updateMutation.mutate(data))}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditContractModal;
