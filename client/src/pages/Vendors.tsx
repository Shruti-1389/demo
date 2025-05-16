
import { FC, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Building2, CircleDollarSign, Search } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialVendorsData = [
  { id: 1, name: "Supply Pro Solutions", category: "Office Supplies", spend: 150000, rating: 4.8, contracts: 3 },
  { id: 2, name: "Tech Equipment Co", category: "IT Hardware", spend: 280000, rating: 4.5, contracts: 2 },
  { id: 3, name: "Service Masters Inc", category: "Professional Services", spend: 95000, rating: 4.2, contracts: 1 },
  { id: 4, name: "Digital Solutions LLC", category: "Software", spend: 320000, rating: 4.9, contracts: 4 },
  { id: 5, name: "Maintenance Experts", category: "Facility Services", spend: 75000, rating: 4.0, contracts: 2 },
];

const Vendors: FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [newVendor, setNewVendor] = useState({ name: '', category: '', spend: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorsData, setVendorsData] = useState(initialVendorsData);

  const handleCreate = () => {
    const newVendorData = {
      id: vendorsData.length + 1,
      name: newVendor.name,
      category: newVendor.category,
      spend: parseInt(newVendor.spend) || 0,
      rating: 0,
      contracts: 0
    };
    setVendorsData([...vendorsData, newVendorData]);
    setCreateModalOpen(false);
    setNewVendor({ name: '', category: '', spend: '' });
  };

  const filteredVendors = vendorsData.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Vendors</h2>
          <p className="text-sm text-gray-500">Manage your vendor relationships</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Total Vendors", value: vendorsData.length, icon: Building2 },
          { title: "Active Contracts", value: vendorsData.reduce((acc, curr) => acc + curr.contracts, 0), icon: Building2 },
          { title: "Annual Spend", value: `$${vendorsData.reduce((acc, curr) => acc + curr.spend, 0).toLocaleString()}`, icon: CircleDollarSign },
        ].map((stat, index) => (
          <div key={index} className="bg-card rounded-lg p-4 border">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Annual Spend</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Contracts</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.category}</TableCell>
                <TableCell>${vendor.spend.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{vendor.rating}</span>
                  </div>
                </TableCell>
                <TableCell>{vendor.contracts} active</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setViewModalOpen(true);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Vendor Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newVendor.category}
                onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spend">Annual Spend</Label>
              <Input
                id="spend"
                type="number"
                value={newVendor.spend}
                onChange={(e) => setNewVendor({ ...newVendor, spend: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Vendor Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="mt-1">{selectedVendor.name}</p>
                </div>
                <div>
                  <Label>Category</Label>
                  <p className="mt-1">{selectedVendor.category}</p>
                </div>
                <div>
                  <Label>Annual Spend</Label>
                  <p className="mt-1">${selectedVendor.spend.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <p className="mt-1">{selectedVendor.rating} ★</p>
                </div>
                <div>
                  <Label>Active Contracts</Label>
                  <p className="mt-1">{selectedVendor.contracts}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendors;
