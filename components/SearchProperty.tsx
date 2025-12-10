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
    <Card className="shadow-md bg-black">
      <CardHeader>
        <CardTitle className="text-white">Search Property In Nigeria</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label className="text-white">Location</Label>
          <Input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Enter location (e.g Lagos)"
          />
        </div>

        <div>
          <Label className="text-white">Category</Label>
          <Select
            value={filters.category || "any"}
            onValueChange={(val) =>
              handleChange({ target: { name: "category", value: val } })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="lease">Lease</SelectItem>
              <SelectItem value="land">Land</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white">Bedrooms</Label>
          <Input
            type="number"
            name="bedroom"
            value={filters.bedroom}
            onChange={handleChange}
            placeholder="1, 2, 3..."
          />
        </div>

        <div>
          <Label className="text-white">Minimum Price</Label>
          <Input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="₦ Minimum"
          />
        </div>

        <div>
          <Label className="text-white">Maximum Price</Label>
          <Input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="₦ Maximum"
          />
        </div>

        <div>
          <Label className="text-white">Time Added</Label>
          <Select
            value={filters.time || "any"}
            onValueChange={(val) =>
              handleChange({ target: { name: "time", value: val } })
            }
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

        <Button className="w-full" onClick={handleSearch}>Search</Button>
      </CardContent>
    </Card>
  );
}
