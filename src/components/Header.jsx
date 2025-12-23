import React, { useState } from "react";
// Import Link, useNavigate, and useLocation
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Plus, LogIn, User, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { X } from 'lucide-react';

export default function Header({
  user,
  onSearchChange,
  onShowReportForm,
  onShowLogin,
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // --- NEW: Get current location ---
  const location = useLocation();
  // Check if the current path is the homepage
  const isHomePage = location.pathname === '/';
  // --- END NEW ---

  const isAuthenticated = !!user;
  const userRole = user?.role;

  const handleSearch = (value) => {
    // Only call onSearchChange if it was provided (it's only provided on home page)
    if (onSearchChange) {
      setSearchQuery(value);
      onSearchChange(value);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleMobileLogin = () => {
    closeMenu();
    onShowLogin();
  };

  const handleMobileReport = () => {
    closeMenu();
    // Only call if it exists
    if (onShowReportForm) {
      onShowReportForm();
    }
  };
  
  const handleMobileLogout = () => {
    closeMenu();
    onLogout();
  };

  const goToAdmin = () => {
    navigate('/admin');
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Lost & Found
          </Link>
          {/* Desktop Navigation Links */}
          <ul className="flex space-x-4 text-sm font-medium hidden md:flex">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/contactus" className="text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* --- MODIFIED: Search bar (desktop) --- */}
        {/* Only show on home page */}
        {isHomePage && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            {/* Search Icon (remains on the left) */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            
            {/* Input Field */}
            <Input
              placeholder="Search for lost items..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              // Adjust padding to make space for the clear button on the right
              className="pl-10 pr-8" 
            />

            {/* Conditional Clear Button (the "cross") */}
            {searchQuery && (
              <button
                onClick={() => handleSearch('')} // Call handleSearch with an empty string to clear the query
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" /> {/* The 'X' icon */}
              </button>
            )}
          </div>
  </div>
        )}
        {/* --- END MODIFICATION --- */}


        {/* Desktop buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* --- MODIFIED: Report Item Button (desktop) --- */}
              {/* Only show on home page */}
              {isHomePage && (
                <Button
                  onClick={onShowReportForm}
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Report Item
                </Button>
              )}
              {/* --- END MODIFICATION --- */}

              {userRole === "admin" && (
                <Button asChild variant="outline">
                  <Link to="/admin">
                    <User className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}

              <Button variant="ghost" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={onShowLogin} variant="outline">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6">
              
              {/* --- MODIFIED: Search (mobile) --- */}
              {/* Only show on home page */}
              {isHomePage && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search for lost items..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              )}
              {/* --- END MODIFICATION --- */}


              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-2">
                <Link to="/" onClick={closeMenu} className="px-3 py-2 rounded-md hover:bg-muted font-medium">Home</Link>
                <Link to="/contactus" onClick={closeMenu} className="px-3 py-2 rounded-md hover:bg-muted font-medium">Contact Us</Link>
                <Link to="/aboutus" onClick={closeMenu} className="px-3 py-2 rounded-md hover:bg-muted font-medium">About Us</Link>
              </nav>

              {/* Divider */}
              <div className="border-t border-border pt-4"></div>

              {/* Authenticated / Guest Actions */}
              {isAuthenticated ? (
                <>
                  {/* --- MODIFIED: Report Item Button (mobile) --- */}
                  {/* Only show on home page */}
                  {isHomePage && (
                    <Button
                      onClick={handleMobileReport}
                      className="bg-primary hover:bg-primary-hover w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Report Item
                    </Button>
                  )}
                  {/* --- END MODIFICATION --- */}

                  {userRole === "admin" && (
                    <Button variant="outline" className="w-full" onClick={goToAdmin}>
                      <User className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  )}

                  <Button variant="ghost" className="w-full" onClick={handleMobileLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleMobileLogin}
                  variant="outline"
                  className="w-full"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}