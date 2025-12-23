import React, { useState } from "react";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import Footer from  "@/components/Footer"

const Card = ({ children, className }) => <div className={`rounded-xl border bg-white text-slate-900 shadow ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;


function AboutUs({ user, onLogin, onLogout }) {
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
          user={user} // Pass the global user prop
          onLogout={onLogout} // Pass the global onLogout prop
          onShowLogin={() => setShowLoginForm(true)}
      />
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-800">About Our Platform</h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">Reuniting owners with their lost belongings, one item at a time. We're dedicated to creating a trustworthy and efficient lost and found service for our community.</p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Losing a valuable or sentimental item can be a stressful experience. Our mission is to simplify the process of reporting and claiming lost items, leveraging technology to increase the chances of a happy reunion. We believe in the power of community and honesty to make our campus and city a better place.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">1. Report a Found Item</h4>
              <p className="text-sm text-slate-600">If you find something, quickly post a description and photo. Your report helps an owner get closer to finding their item.</p>
            </div>
            <div>
              <h4 className="font-semibold">2. Search for a Lost Item</h4>
              <p className="text-sm text-slate-600">Browse our database of found items. Use filters and keywords to narrow your search.</p>
            </div>
            <div>
              <h4 className="font-semibold">3. Make a Claim</h4>
              <p className="text-sm text-slate-600">Once you find your item, submit a claim with proof of ownership. Our administrators will review and verify it.</p>
            </div>
            <div>
              <h4 className="font-semibold">4. Get Reunited</h4>
              <p className="text-sm text-slate-600">After claim approval, we'll help coordinate a safe and secure pickup.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Community</h4>
              <p className="text-sm text-slate-600">We foster a supportive environment where people help one another.</p>
            </div>
            <div>
              <h4 className="font-semibold">Integrity</h4>
              <p className="text-sm text-slate-600">We operate with honesty and transparency in every interaction.</p>
            </div>
            <div>
              <h4 className="font-semibold">Efficiency</h4>
              <p className="text-sm text-slate-600">We use technology to make the recovery process as fast and easy as possible.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {showLoginForm && (
        <LoginForm
          onClose={() => setShowLoginForm(false)}
          onLogin={onLogin}
        />
      )}
      <Footer />
    </div>
  );
}
export default AboutUs;