
import { FC, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Phone, Search } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialClientsData = [
  { id: 1, name: "Acme Corporation", email: "contact@acme.com", phone: "+1 234-567-8901", status: "Active", projects: 5 },
  { id: 2, name: "TechCorp Solutions", email: "info@techcorp.com", phone: "+1 345-678-9012", status: "Active", projects: 3 },
  { id: 3, name: "Global Industries", email: "contact@global.com", phone: "+1 456-789-0123", status: "Inactive", projects: 1 },
  { id: 4, name: "Innovative Systems", email: "info@innovative.com", phone: "+1 567-890-1234", status: "Active", projects: 4 },
  { id: 5, name: "Strategic Partners", email: "contact@strategic.com", phone: "+1 678-901-2345", status: "Active", projects: 2 },
];

const Clients: FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [clientsData, setClientsData] = useState(initialClientsData);

  const handleCreate = () => {
    const newClientData = {
      id: clientsData.length + 1,
      ...newClient,
      status: 'Active',
      projects: 0
    };
    setClientsData([...clientsData, newClientData]);
    setCreateModalOpen(false);
    setNewClient({ name: '', email: '', phone: '' });
  };

  const filteredClients = clientsData.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Clients</h2>
          <p className="text-sm text-gray-500">Manage your client relationships</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    client.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {client.status}
                  </span>
                </TableCell>
                <TableCell>{client.projects} projects</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedClient(client);
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

      {/* Create Client Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Client Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="mt-1">{selectedClient.name}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="mt-1">{selectedClient.status}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="mt-1">{selectedClient.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="mt-1">{selectedClient.phone}</p>
                </div>
                <div>
                  <Label>Projects</Label>
                  <p className="mt-1">{selectedClient.projects}</p>
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

export default Clients;
