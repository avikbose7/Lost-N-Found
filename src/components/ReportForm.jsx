import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import axios
// Reverting to @/ alias for imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = ["Books", "Electronics", "Clothing", "ID Cards", "Others"];

// --- New Regex Validation Function ---
const isValidContact = (contact) => {
  if (!contact) return false; // Contact is optional, so an empty string is valid

  // Simple regex for email or a common phone number format (e.g., 10 digits with optional spaces/dashes)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?(\d[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,15}$/;

  return emailRegex.test(contact) || phoneRegex.test(contact);
};
// ------------------------------------

export default function ReportForm({ onClose, type }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    contactInfo: "",
    image: null,
  });
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Drag and drop handlers (no change)
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setFormData((prev) => ({
          ...prev,
          image: file,
        }));
      }
    }
  };

  // --- UPDATED handleSubmit function with Contact Info Validation ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Client-side validation for required fields
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // 2. Contact Information Validation
    if (formData.contactInfo && !isValidContact(formData.contactInfo)) {
      toast({
        title: "Invalid Contact",
        description: "Please enter a valid email address or phone number.",
        variant: "destructive",
      });
      return;
    }

    // 3. Auth check
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Login Required",
        description: "You must be logged in to report an item.",
        variant: "destructive",
      });
      return;
    }

    // Prepare FormData
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('location', formData.location);
    data.append('contactInfo', formData.contactInfo);
    data.append('status', type); // 'lost' or 'found'
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // Set up headers for auth and multipart/form-data
      const config = {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      };

      // Send data to the backend
      await axios.post('http://localhost:5000/api/items', data, config);

      toast({
        title: "Item Reported Successfully",
        description: `Your ${type} item has been reported.`,
      });

      onClose(); // Close the modal on success

    } catch (error) {
      console.error('Report submission failed:', error);
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };
  // --- END OF UPDATE ---


  // cleanup preview object URLs (no change)
  useEffect(() => {
    if (!formData.image) return;
    const objectUrl = URL.createObjectURL(formData.image);
    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  // JSX for the form remains the same
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Report {type === "lost" ? "Lost" : "Found"} Item
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Item Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Black iPhone 13, Blue Textbook"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  {type === "lost" ? "Last Seen Location" : "Found Location"} *
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Library 2nd floor, Cafeteria"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">
                Contact Information (Email or Phone)
              </Label>
              <Input
                id="contact"
                placeholder="e.g., user@example.com or 123-456-7890"
                value={formData.contactInfo}
                onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Item Photo (Optional)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {formData.image ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-md"
                    />
                    <p className="text-sm text-muted-foreground">
                      {formData.image.name}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: null,
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Drag and drop an image here, or{" "}
                        <label className="text-primary cursor-pointer hover:underline">
                          browse
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-hover"
              >
                Report {type === "lost" ? "Lost" : "Found"} Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}