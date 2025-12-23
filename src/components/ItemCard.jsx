import React from "react";
import { CalendarDays, MapPin, Tag, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
const categoryColors = {
  "Books": "bg-blue-100 text-blue-800",
  "Electronics": "bg-purple-100 text-purple-800",
  "Clothing": "bg-green-100 text-green-800",
  "ID Cards": "bg-red-100 text-red-800",
  "Others": "bg-gray-100 text-gray-800"
};
const statusColors = {
  "lost": "bg-red-100 text-red-800",
  "found": "bg-green-100 text-green-800",
  "claimed": "bg-gray-100 text-gray-800"
};
export default function ItemCard({
  id,
  title,
  description,
  category,
  status,
  dateReported,
  location,
  image,
  reportedBy,
  onClaim,
  showClaimButton = true
}) {
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "overflow-hidden hover:shadow-lg transition-shadow duration-200"
  }, /*#__PURE__*/React.createElement(CardHeader, {
    className: "pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-semibold text-lg leading-tight"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement(Badge, {
    className: categoryColors[category] || categoryColors.Others
  }, /*#__PURE__*/React.createElement(Tag, {
    className: "w-3 h-3 mr-1"
  }), category), /*#__PURE__*/React.createElement(Badge, {
    className: statusColors[status]
  }, status.charAt(0).toUpperCase() + status.slice(1)))))), image && /*#__PURE__*/React.createElement("div", {
    className: "px-6 pb-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    className: "w-full h-48 object-cover rounded-md border"
  })), /*#__PURE__*/React.createElement(CardContent, {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground text-sm leading-relaxed"
  }, description), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center text-sm text-muted-foreground"
  }, /*#__PURE__*/React.createElement(MapPin, {
    className: "w-4 h-4 mr-2"
  }), /*#__PURE__*/React.createElement("span", null, location)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center text-sm text-muted-foreground"
  }, /*#__PURE__*/React.createElement(CalendarDays, {
    className: "w-4 h-4 mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "Reported on ", formatDate(dateReported))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center text-sm text-muted-foreground"
  }, /*#__PURE__*/React.createElement(Clock, {
    className: "w-4 h-4 mr-2"
  }), /*#__PURE__*/React.createElement("span", null, "By ", reportedBy)))), showClaimButton && status !== "claimed" && onClaim && /*#__PURE__*/React.createElement(CardFooter, null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => onClaim(id),
    className: "w-full bg-primary hover:bg-primary-hover"
  }, status === "lost" ? "I Found This" : "This is Mine")));
}