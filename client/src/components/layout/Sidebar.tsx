import { FC, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  File, 
  Users, 
  Building2, 
  BarChart3, 
  Settings, 
  X 
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: ReactNode;
  active?: boolean;
  children: ReactNode;
}

const NavItem: FC<NavItemProps> = ({ href, icon, active, children }) => {
  return (
    <li className="mb-1">
      <Link href={href} className={`flex items-center px-3 md:px-4 py-3 ${
        active 
          ? "bg-primary bg-opacity-20 text-white border-l-4 border-primary" 
          : "hover:bg-sidebar-accent transition-colors duration-200"
      } text-white rounded-md md:rounded-none`}>
        <span className={`${children ? 'mr-0 md:mr-3' : 'mx-auto'} w-5 text-center`}>{icon}</span>
        {children}
      </Link>
    </li>
  );
};

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [location] = useLocation();
  
  const mobileClasses = isOpen 
    ? "fixed inset-0 z-40 lg:hidden block" 
    : "fixed inset-0 z-40 hidden";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-16 md:w-64 bg-secondary text-white hidden lg:flex flex-col h-screen">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-semibold hidden md:block">Contract Master</h1>
          <h1 className="text-xl font-semibold md:hidden text-center">CM</h1>
        </div>
        <nav className="mt-4 flex-1">
          <ul>
            <NavItem href="/" icon={<BarChart3 size={18} />} active={location === "/"}>
              <span className="hidden md:inline">Dashboard</span>
            </NavItem>
            <NavItem href="/contracts" icon={<File size={18} />} active={location === "/contracts"}>
              <span className="hidden md:inline">Contracts</span>
            </NavItem>
            <NavItem href="/clients" icon={<Users size={18} />} active={location === "/clients"}>
              <span className="hidden md:inline">Clients</span>
            </NavItem>
            <NavItem href="/vendors" icon={<Building2 size={18} />} active={location === "/vendors"}>
              <span className="hidden md:inline">Vendors</span>
            </NavItem>
            <NavItem href="/settings" icon={<Settings size={18} />} active={location === "/settings"}>
              <span className="hidden md:inline">Settings</span>
            </NavItem>
          </ul>
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div className={mobileClasses}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75" 
          onClick={() => setIsOpen(false)}
        ></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-secondary transform transition-all duration-300 ease-in-out z-50">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Close sidebar</span>
              <X className="text-white" size={24} />
            </button>
          </div>
          
          <div className="p-4 border-b border-sidebar-border">
            <h1 className="text-xl font-semibold text-white">Contract Master</h1>
          </div>
          <nav className="mt-4 flex-1 overflow-y-auto">
            <ul>
              <NavItem href="/" icon={<BarChart3 size={18} />} active={location === "/"}>
                Dashboard
              </NavItem>
              <NavItem href="/contracts" icon={<File size={18} />} active={location === "/contracts"}>
                Contracts
              </NavItem>
              <NavItem href="/clients" icon={<Users size={18} />} active={location === "/clients"}>
                Clients
              </NavItem>
              <NavItem href="/vendors" icon={<Building2 size={18} />} active={location === "/vendors"}>
                Vendors
              </NavItem>
              <NavItem href="/settings" icon={<Settings size={18} />} active={location === "/settings"}>
                Settings
              </NavItem>
            </ul>
          </nav>
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 w-14"></div>
      </div>
    </>
  );
};

export default Sidebar;
