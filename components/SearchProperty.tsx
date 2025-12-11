"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  filters: {
    location: string;
    category: string;
    bedroom: string;
    minPrice: string;
    maxPrice: string;
    time: string;
  };
  handleChange: (e: any) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export default function SearchProperty({ filters, handleChange, handleSearch }: Props) {
  return (
    <Card className="shadow-lg text-black/80">
      <CardHeader>
        <CardTitle className="">Search Property In Nigeria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Location</Label>
          <Input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter location (e.g Lagos)"
            className="text-xs border border-b-blue-500"
          />
        </div>

        <div className="space-y-2 w-full">
          <Label className="text-xs">Category</Label>
          <Select
            value={filters.category || "any"}
            onValueChange={(val) =>
              handleChange({ target: { name: "category", value: val } })
            }
          >
            <SelectTrigger className="space-y-2 text-xs border border-b-blue-500 w-full">
              <SelectValue placeholder="Select category" 
            className="text-xs border border-b-blue-500"/>
            </SelectTrigger>
            <SelectContent className="space-y-4 text-xs border border-b-blue-500">
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="lease">Lease</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Bedrooms</Label>
          <Input
            type="number"
            name="bedroom"
            value={filters.bedroom}
            onChange={handleChange}
            placeholder="1, 2, 3..."
            className="text-xs border border-b-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Minimum Price</Label>
          <Input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="₦ Minimum"
            className="text-xs border border-b-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Maximum Price</Label>
          <Input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="₦ Maximum"
            className="text-xs border border-b-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Time Added</Label>
          <Select
            value={filters.time || "any"}
            onValueChange={(val) =>
              handleChange({ target: { name: "time", value: val } })
            }
          >
            <SelectTrigger className="space-y-2 w-full text-xs border border-b-blue-500">
              <SelectValue placeholder="Anytime" 
            className="text-xs w-full border border-b-blue-500" />
            </SelectTrigger>
            <SelectContent className="text-xs border border-b-blue-500">
              <SelectItem value="any">Anytime</SelectItem>
              <SelectItem value="24">Last 24 hours</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full" onClick={handleSearch}>Search</Button>
      </CardContent>
    </Card>
  );
}
