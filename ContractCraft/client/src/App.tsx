import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { createContext, useState, useContext } from "react";
import Contracts from "@/pages/Contracts";
import Dashboard from "@/pages/Dashboard";
import Reports from "@/pages/Reports";
import Vendors from "@/pages/Vendors";
import Clients from "@/pages/Clients";

// Create a context for search functionality
interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: "",
  setSearchQuery: () => {},
});

export const useSearch = () => useContext(SearchContext);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/contracts" component={Contracts} />
      <Route path="/reports" component={Reports} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/clients" component={Clients} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
          <div className="h-screen w-screen flex overflow-hidden bg-background">
            <Sidebar isOpen={mobileSidebarOpen} setIsOpen={setMobileSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden">
              <Header 
                toggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                onSearch={handleSearch}
              />

              <main className="flex-1 overflow-y-auto bg-background p-2 sm:p-4 md:p-6">
                <div className="container mx-auto max-w-7xl">
                  <Router />
                </div>
              </main>
            </div>
          </div>
          <Toaster />
        </SearchContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;