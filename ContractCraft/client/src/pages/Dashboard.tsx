import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Contract, ContractStatus } from "@shared/schema";
import { BarChart, PieChart, PieArcDatum } from "@/components/ui/chart";
import { ArrowRight, FileText, Clock, CheckCircle, AlertTriangle, CircleUser } from "lucide-react";
import { Link } from "wouter";

const Dashboard: FC = () => {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ["/api/contracts"],
    queryFn: async () => {
      const response = await fetch("/api/contracts", { credentials: "include" });
      if (!response.ok) {
        throw new Error("Failed to fetch contracts");
      }
      return response.json();
    },
  });

  const getStatusCount = (status: string) => {
    if (!contracts) return 0;
    return contracts.filter((contract: Contract) => contract.status === status).length;
  };

  const getTotalValue = () => {
    if (!contracts) return 0;
    return contracts.reduce((total: number, contract: Contract) => {
      const value = typeof contract.value === 'string' 
        ? parseFloat(contract.value) 
        : (contract.value || 0);
      return total + value;
    }, 0);
  };

  const getContractsByType = () => {
    if (!contracts) return [];

    const typeCount: Record<string, number> = {};
    contracts.forEach((contract: Contract) => {
      typeCount[contract.contractType] = (typeCount[contract.contractType] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  };

  const getContractsByMonth = () => {
    if (!contracts) return [];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = Array(12).fill(0);

    contracts.forEach((contract: Contract) => {
      if (contract.startDate) {
        const date = new Date(contract.startDate);
        const month = date.getMonth();
        monthlyData[month]++;
      }
    });

    return months.map((month, index) => ({
      name: month,
      contracts: monthlyData[index],
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-secondary">Dashboard</h2>
        <Link href="/contracts" className="text-primary hover:text-blue-700 text-sm inline-flex items-center">
          View All Contracts
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3 bg-blue-100 p-2 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold">{isLoading ? "..." : contracts?.length || 0}</p>
                <p className="text-xs text-gray-500">Across all statuses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3 bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold">{isLoading ? "..." : getStatusCount(ContractStatus.ACTIVE)}</p>
                <p className="text-xs text-gray-500">Currently active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3 bg-yellow-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold">{isLoading ? "..." : getStatusCount(ContractStatus.PENDING)}</p>
                <p className="text-xs text-gray-500">Awaiting signatures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="mr-3 bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-gray-500">Next 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Contracts by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            ) : (
              <PieChart
                  data={getContractsByType()}
                  width={400}
                  height={300}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  valueAccessor={(d: PieArcDatum<any>) => d.data.value}
                  labelAccessor={(d: PieArcDatum<any>) => d.data.name}
                  colors={["#4CAF50", "#2196F3", "#FFC107", "#9C27B0", "#FF5722"]}
                />
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Contracts Created by Month</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Loading chart data...</p>
              </div>
            ) : (
              <BarChart
                  data={getContractsByMonth()}
                  xField="name"
                  yField="contracts"
                  height={300}
                  color="#2196F3"
                />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contract Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Contract Value</h3>
                <p className="text-2xl font-bold">
                  {isLoading ? "..." : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(getTotalValue())}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Expired Contracts</h3>
                <p className="text-2xl font-bold">
                  {isLoading ? "..." : getStatusCount(ContractStatus.EXPIRED)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Draft Contracts</h3>
                <p className="text-2xl font-bold">
                  {isLoading ? "..." : getStatusCount(ContractStatus.DRAFT)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;