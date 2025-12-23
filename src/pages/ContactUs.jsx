import { useState } from "react";
// Reverting to aliased paths
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Building } from "lucide-react";

// The component now accepts the global auth state as props
function ContactUs({ user, onLogin, onLogout }) {
  const { toast } = useToast();
  
  // This local state is for the login modal, which is correct
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  // This local state is just for the contact form, which is also correct
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Remove the local user state
  // const [user, setUser] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you shortly."
    });
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };

  // Remove the local handleLogin function
  // const handleLogin = (userData) => { ... };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        user={user} // Pass the global user prop
        onLogout={onLogout} // Pass the global onLogout prop
        onShowLogin={() => setShowLoginForm(true)}
        // These props are no longer needed here as Header doesn't render them for this page
        // onSearchChange={() => {}} 
        // onShowReportForm={() => {}}
      />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800">Get in Touch</h1>
          <p className="text-lg text-slate-600">We're here to help. Send us a message or find our contact details below.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll reply as soon as possible.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <Input type="text" id="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <Input type="email" id="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <Textarea id="message" rows="4" value={formData.message} onChange={handleInputChange} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Submit</Button>
              </CardFooter>
            </form>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>You can also reach us through the following channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-slate-500" />
                <span>support@lostandfound.com</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-slate-500" />
                <span>+91 1234-456-789</span>
              </div>
              <div className="flex items-start gap-4">
                <Building className="w-6 h-6 text-slate-500 mt-1" />
                <span>123 University Ave<br />Kolkata, West Bengal, 700001<br />India</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLogin={onLogin} // Pass the global onLogin prop
        />
      )}
      <Footer />
    </div>
  );
}

export default ContactUs;