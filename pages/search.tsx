"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchPropertyProps {
  filters: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export default function SearchProperty({ filters, handleChange, handleSearch }: SearchPropertyProps) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Search Property In Nigeria</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter location (e.g Lagos)"
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            name="category"
            value={filters.category}
            onValueChange={(val) => handleChange({ target: { name: "category", value: val } } as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="lease">Lease</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Bedrooms</Label>
          <Input
            type="number"
            name="bedroom"
            value={filters.bedroom}
            onChange={handleChange}
            placeholder="1, 2, 3..."
          />
        </div>

        <div className="space-y-2">
          <Label>Minimum Price</Label>
          <Input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="₦ Minimum"
          />
        </div>

        <div className="space-y-2">
          <Label>Maximum Price</Label>
          <Input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="₦ Maximum"
          />
        </div>

        <div className="space-y-2">
          <Label>Time Added</Label>
          <Select
            name="time"
            value={filters.time}
            onValueChange={(val) => handleChange({ target: { name: "time", value: val } } as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Anytime" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Anytime</SelectItem>
              <SelectItem value="24">Last 24 hours</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" onClick={handleSearch}>
          Search
        </Button>
      </CardContent>
    </Card>
  );
}
