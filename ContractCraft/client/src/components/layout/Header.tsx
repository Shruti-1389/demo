import { FC, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Menu, Bell, HelpCircle, Search } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  toggleSidebar: () => void;
  onSearch?: (query: string) => void;
}

const Header: FC<HeaderProps> = ({ toggleSidebar, onSearch }) => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add debounce to search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only trigger search on /contracts page, allow empty searches to reset
      if (location === "/contracts" && onSearch) {
        console.log("Header sending search query:", searchQuery);
        onSearch(searchQuery);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, location, onSearch]);
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-2 sm:px-4 py-2 sm:py-3">
        {/* Mobile menu button and title */}
        <div className="flex items-center lg:hidden">
          <button 
            onClick={toggleSidebar}
            className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded p-1"
            aria-label="Open main menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold ml-2 sm:ml-3">Contract Master</h1>
        </div>
        
        {/* Search input - shown in contracts page, hidden on very small screens */}
        {location === "/contracts" && (
          <>
            <div className="hidden sm:flex items-center flex-1 px-2 lg:px-4 max-w-lg mx-auto">
              <div className="relative w-full">
                <Input 
                  type="text" 
                  placeholder="Search contracts..." 
                  className="w-full pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Mobile search button */}
            <button 
              className="sm:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded p-1"
              onClick={() => {
                // Toggle mobile search view if we had one
                // For now just a placeholder
              }}
            >
              <Search className="h-5 w-5" />
            </button>
          </>
        )}
        
        {/* Right side icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            className="text-gray-600 relative p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="absolute top-0 right-0 bg-danger text-white rounded-full w-2 h-2"></span>
          </button>
          
          <button 
            className="text-gray-600 hidden sm:block p-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <div className="hidden sm:block">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile search bar for contracts page - alternative location */}
      {location === "/contracts" && (
        <div className="sm:hidden px-2 py-2 bg-gray-50">
          <div className="relative w-full">
            <Input 
              type="text" 
              placeholder="Search contracts..." 
              className="w-full pl-10 pr-4 h-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
