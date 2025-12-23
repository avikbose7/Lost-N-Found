import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
// Reverting to @/ alias for imports
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import FilterBar from "@/components/FilterBar";
import ReportForm from "@/components/ReportForm";
import LoginForm from "@/components/LoginForm";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/lost-found-hero.jpg"; // Reverted path
import Footer from "@/components/Footer";

// Component now receives global state props from App.jsx
const Index = ({ user, onLogin, onLogout }) => {
  const { toast } = useToast();

  // Page-specific state
  const [items, setItems] = useState([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [reportType, setReportType] = useState("lost");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        const formattedItems = response.data.map(item => ({ ...item, id: item._id }));
        setItems(formattedItems);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        toast({
          title: "Error",
          description: "Could not load items from the server.",
          variant: "destructive",
        });
      }
    };
    fetchItems();
  }, [toast]);

  // Filtering logic remains the same
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "" ||
        item.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || item.status === selectedStatus;

      const matchesDate =
        !selectedDate ||
        new Date(item.dateReported).toDateString() ===
          selectedDate.toDateString();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [items, searchQuery, selectedCategory, selectedLocation, selectedStatus, selectedDate]);

  const lostItems = filteredItems.filter((item) => item.status === "lost");
  const foundItems = filteredItems.filter((item) => item.status === "found");

  // --- UPDATED handleClaim function ---
  const handleClaim = async (itemId) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to claim an item.",
        variant: "destructive",
      });
      setShowLoginForm(true);
      return;
    }

    try {
      // 1. Get the auth token from storage
      const token = localStorage.getItem('token');
      if (!token) {
         toast({ title: "Login Required", description: "Your session has expired. Please log in again.", variant: "destructive" });
         setShowLoginForm(true);
         return;
      }

      // 2. Set up the authorization headers
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      // 3. Send the POST request to the backend 'claims' route
      const body = { itemId };
      await axios.post('http://localhost:5000/api/claims', body, config);

      // 4. Show success toast
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted for admin review.",
      });
      
    } catch (error) {
      // 5. Show an error toast if something went wrong
      console.error("Claim submission failed:", error);
      toast({
        title: "Claim Failed",
        description: error.response?.data?.message || "You may have already claimed this item.",
        variant: "destructive",
      });
    }
  };
  // --- END OF UPDATE ---

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedLocation("");
    setSelectedDate(undefined);
    setSelectedStatus("All");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header now receives the global user and auth handlers */}
      <Header
        user={user}
        onLogout={onLogout}
        onSearchChange={setSearchQuery}
        onShowReportForm={() => setShowReportForm(true)}
        onShowLogin={() => setShowLoginForm(true)}
      />

      <main>
        {/* Hero Section (unchanged) */}
        <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Find What You've <span className="text-primary">Lost</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Our comprehensive Lost & Found system helps you quickly report
                  and recover lost items. Join our community of students and
                  faculty working together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary-hover"
                    onClick={() => {
                      setReportType("lost");
                      setShowReportForm(true);
                    }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Report Lost Item
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setReportType("found");
                      setShowReportForm(true);
                    }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Report Found Item
                  </Button>
                </div>
              </div>

              <div className="relative">
                <img
                  src={heroImage}
                  alt="Lost and Found Office"
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filter + Tabs Section (unchanged) */}
        <div className="container mx-auto px-4 py-8">
          <FilterBar
            onCategoryChange={setSelectedCategory}
            onLocationChange={setSelectedLocation}
            onDateChange={setSelectedDate}
            onStatusChange={setSelectedStatus}
            onClearFilters={clearFilters}
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            selectedDate={selectedDate}
            selectedStatus={selectedStatus}
          />

          <Tabs defaultValue="lost" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lost" className="text-lg">
                Lost Items ({lostItems.length})
              </TabsTrigger>
              <TabsTrigger value="found" className="text-lg">
                Found Items ({foundItems.length})
              </TabsTrigger>
            </TabsList>

            {/* Lost Items */}
            <TabsContent value="lost" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Recently Lost Items</h2>
              </div>
              {lostItems.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No lost items found
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostItems.map((item) => (
                    <ItemCard key={item.id} {...item} onClaim={handleClaim} />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Found Items */}
            <TabsContent value="found" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Recently Found Items</h2>
              </div>
              {foundItems.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No found items available
                  </h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or check back later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {foundItems.map((item) => (
                    <ItemCard key={item.id} {...item} onClaim={handleClaim} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      {showReportForm && (
        <ReportForm type={reportType} onClose={() => setShowReportForm(false)} />
      )}
      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLogin={onLogin}
        />
      )}
      <Footer />
    </div>
  );
};

export default Index;