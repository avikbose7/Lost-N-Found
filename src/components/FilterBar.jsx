import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
const categories = ["All", "Books", "Electronics", "Clothing", "ID Cards", "Others"];
const statuses = ["All", "lost", "found", "claimed"];
export default function FilterBar({
  onCategoryChange,
  onLocationChange,
  onDateChange,
  onStatusChange,
  onClearFilters,
  selectedCategory,
  selectedLocation,
  selectedDate,
  selectedStatus
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const hasActiveFilters = selectedCategory !== "All" || selectedLocation !== "" || selectedDate !== undefined || selectedStatus !== "All";
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-card border rounded-lg p-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement(Filter, {
    className: "w-4 h-4 text-muted-foreground"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "font-medium"
  }, "Filter Items"), hasActiveFilters && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: onClearFilters,
    className: "ml-auto"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-4 h-4 mr-1"
  }), "Clear Filters")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, "Category"), /*#__PURE__*/React.createElement(Select, {
    value: selectedCategory,
    onValueChange: onCategoryChange
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select category"
  })), /*#__PURE__*/React.createElement(SelectContent, null, categories.map(category => /*#__PURE__*/React.createElement(SelectItem, {
    key: category,
    value: category
  }, category))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, "Status"), /*#__PURE__*/React.createElement(Select, {
    value: selectedStatus,
    onValueChange: onStatusChange
  }, /*#__PURE__*/React.createElement(SelectTrigger, null, /*#__PURE__*/React.createElement(SelectValue, {
    placeholder: "Select status"
  })), /*#__PURE__*/React.createElement(SelectContent, null, statuses.map(status => /*#__PURE__*/React.createElement(SelectItem, {
    key: status,
    value: status
  }, status.charAt(0).toUpperCase() + status.slice(1)))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, "Location"), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Enter location",
    value: selectedLocation,
    onChange: e => onLocationChange(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm font-medium"
  }, "Date Reported"), /*#__PURE__*/React.createElement(Popover, {
    open: isCalendarOpen,
    onOpenChange: setIsCalendarOpen
  }, /*#__PURE__*/React.createElement(PopoverTrigger, {
    asChild: true
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    className: "w-full justify-start text-left font-normal"
  }, /*#__PURE__*/React.createElement(CalendarIcon, {
    className: "mr-2 h-4 w-4"
  }), selectedDate ? format(selectedDate, "PPP") : "Pick a date")), /*#__PURE__*/React.createElement(PopoverContent, {
    className: "w-auto p-0",
    align: "start"
  }, /*#__PURE__*/React.createElement(Calendar, {
    mode: "single",
    selected: selectedDate,
    onSelect: date => {
      onDateChange(date);
      setIsCalendarOpen(false);
    },
    initialFocus: true
  }))))));
}