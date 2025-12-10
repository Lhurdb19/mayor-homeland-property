"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReviewSection from "@/components/ReviewSection";
import VisitForm from "@/components/VisitForm";
import { ChevronLeft, ChevronRight, Heart, MapPin } from "lucide-react";

import ShareButtons from "@/components/ShareButtons";
import MortgageCalculator from "@/components/calculator/MortgageCalculator";

import SearchProperty from "@/components/SearchProperty";
import PropertyMap from "@/components/PropertyMap";
import WhatsAppButton from "@/components/WhatsAppButton";

// Dynamically import react-leaflet components (client-side only)
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

interface ReviewType {
  user: string;
  rating: number;
  name: string;   // <--- add this
  comment: string;
  createdAt: string;
}

interface PropertyType {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  status: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  views: number;
  reviews: ReviewType[];
}

export default function PropertyDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // --- HOOKS AT TOP ---
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"details" | "map">("details");
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    bedroom: "",
    minPrice: "",
    maxPrice: "",
    time: "",
  });
  const [isFavorite, setIsFavorite] = useState(false);

  // --- EFFECTS ---
  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/admin/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    const interval = setInterval(fetchProperty, 5000);

    return () => clearInterval(interval);
  }, [id]);

  // --- CONDITIONAL RENDER ---
  if (loading || !property) return <p className="p-6">Loading...</p>;

  // --- FUNCTIONS ---
  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
  const handleNext = () => setActiveIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (filters.location) query.append("location", filters.location);
    if (filters.category) query.append("type", filters.category);
    if (filters.bedroom) query.append("bedrooms", filters.bedroom);
    if (filters.minPrice) query.append("minPrice", filters.minPrice);
    if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
    if (filters.time) query.append("time", filters.time);

    router.push(`/properties?${query.toString()}`);
  };

  // const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async () => {
    try {
      if (!isFavorite) {
        await axios.post("/api/favorites", { propertyId: property._id });
        setIsFavorite(true);
      } else {
        await axios.delete("/api/favorites", { data: { propertyId: property._id } });
        setIsFavorite(false);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="py-20 px-2 lg:p-25 max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* MAIN LEFT CONTENT */}
      <div className="lg:col-span-2 space-y-6">
        {/* Title & Price */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-lg md:text-4xl font-bold tracking-tight mb-2">{property.title}</h1>
            <p className="text-gray-600 flex items-center gap-1 text-sm"><MapPin className="w-3 h-3 md:w-6 md:h-6" /> {property.location}</p>
          </div>
          <p className="text-lg md:text-2xl font-semibold text-red-500">
            ₦{property.price.toLocaleString()}
          </p>
        </div>

        {/* Image Gallery */}
        <div className="relative h-[600px] rounded-xl overflow-hidden">
          <img src={property.images[activeIndex]} className="w-full h-full object-cover" />
          <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex mt-4 gap-2 overflow-x-auto">
          {property.images.map((img, idx) => (
            <div
              key={idx}
              className={`h-20 w-28 rounded-lg overflow-hidden cursor-pointer border-2 ${idx === activeIndex ? "border-blue-900" : "border-gray-500"}`}
              onClick={() => setActiveIndex(idx)}
            >
              <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <button
            onClick={handleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-md border 
    ${isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}>
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-white" : "text-red-500"}`} />
            {isFavorite ? "Remove Favorite" : "Add to Favorite"}
          </button>

          <div className="flex border-b mb-6 gap-4">
            <button
              className={`px-4 py-2 font-semibold ${activeTab === "details" ? "border-b-2 border-blue-600" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
            <button
              className={`px-4 py-2 font-semibold ${activeTab === "map" ? "border-b-2 border-blue-600" : ""}`}
              onClick={() => setActiveTab("map")}
            >
              Map
            </button>
          </div>

          {/* DETAILS */}
          {activeTab === "details" && (
            <Card className="mb-6 shadow-md">
              <CardContent className="p-2 md:p-4 space-y-1">
                <p className="text-[12px] md:text-lg"><strong>Type:</strong> {property.type ?? "N/A"}</p>
                <p className="text-[10px] md:text-lg"><strong>Bedrooms:</strong> {property.bedrooms ?? "N/A"}</p>
                <p className="text-[10px] md:text-lg"><strong>Bathrooms:</strong> {property.bathrooms ?? "N/A"}</p>
                <p className="text-[10px] md:text-lg"><strong>Sqft:</strong> {property.sqft ?? "N/A"}</p>
                <p className="text-[10px] md:text-lg">
                  <strong>Agent Phone:</strong>{" "}
                  <a href={`tel:${property.phone}`} className="text-blue-600 underline">
                    {property.phone}
                  </a>
                </p>
                <p className="text-[10px] md:text-lg">
                  <strong>Agent Email:</strong>{" "}
                  <a href={`mailto:${property.email}`} className="text-blue-600 underline">
                    {property.email}
                  </a>
                </p>

                <h3 className="font-semibold mt-4 mb-2 text-[12px] md:text-lg">Description</h3>
                <p className="text-[10px] md:text-lg">{property.description}</p>

                <div className="grid grid-cols-2 mt-4 text-sm text-muted-foreground">
                  <p className="text-[10px] md:text-lg">Status: <span className="font-medium text-[10px] md:text-lg">{property.status}</span></p>
                  <p className="text-[10px] md:text-lg">Views: <span className="font-medium ">{property.views}</span></p>
                  <WhatsAppButton title="Property Visit Inquiry" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* MAP */}
          {property.latitude && property.longitude ? (
            <PropertyMap
              latitude={property.latitude}
              longitude={property.longitude}
              title={property.title}
              hasLocation={!!(property.latitude && property.longitude)}
            />
          ) : (
            <p className="text-center text-gray-500 mt-10">No location available</p>
          )}
        </div>

        {/* Reviews */}
        <ReviewSection id={typeof id === "string" ? id : ""} reviews={property.reviews} />
      </div>

      {/* RIGHT SIDEBAR — SEARCH PROPERTY */}
      <div className="lg:col-span-1">
        {/* Visit Form */}
        <VisitForm propertyId={property._id} />

        {/* WhatsApp Button */}
        {/* {property.phone && <WhatsAppButton phone={property.phone} title={property.title} />} */}

        {/* Share Buttons */}
        <ShareButtons title={property.title} />

        {/* Mortgage Calculator */}
        <MortgageCalculator price={property.price} />

        {/* <div className="border rounded-xl shadow-md p-6 bg-gray-50"> */}
        <SearchProperty
          filters={filters}
          handleChange={handleChange}
          handleSearch={handleSearch}
        />
      </div>
    </div>
  );
}
