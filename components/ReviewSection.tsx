"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";

interface Review {
  user?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

interface ReviewSectionProps {
  id: string;
  reviews: Review[];
}

export default function ReviewSection({ id, reviews: initialReviews }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [loading, setLoading] = useState(false);

  const [review, setReview] = useState({
    name: "",
    rating: 0,
    comment: "",
  });

  // ⭐ Review breakdown
  const breakdown = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      counts[r.rating] += 1;
    });
    return counts;
  }, [reviews]);

  // ⭐ Average rating
  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  // ⭐ Submit review
  const submitReview = async () => {
    if (!review.comment || review.rating < 1) return;

    setLoading(true);
    try {
      const res = await axios.post(`/api/admin/properties/${id}/review`, {
        name: review.name, // optional if logged in
        rating: review.rating,
        comment: review.comment,
      });

      setReviews(res.data.reviews);
      setReview({ name: "", rating: 0, comment: "" });
    } catch (err: any) {
      console.error("Submit review error:", err);
      alert(err.response?.data?.message || "Failed to submit review");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Reviews</h2>
      <h3 className="text-sm font-semibold">
        Average Rating: {averageRating} ⭐ ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
      </h3>

      {/* ⭐ Breakdown */}
      <Card className="p-4 shadow text-xs">
        {[5, 4, 3, 2, 1].map((num) => (
          <div key={num} className="flex justify-between border-b">
            <span className="font-medium">{num} Stars</span>
            <span className="text-muted-foreground">{breakdown[num]}</span>
          </div>
        ))}
      </Card>

      {/* ⭐ Reviews */}
      {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet.</p>}
      {reviews.map((r, i) => (
        <Card key={i} className="shadow text-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-1 text-sm">
              {r.name || "Anonymous"}
              <span className="flex items-center gap-1 text-yellow-500 text-xs">
                <Star className="h-3 w-3" /> {r.rating}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{r.comment}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(r.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}

      {/* ⭐ Add Review */}
      <Card className="shadow">
        <CardContent className="space-y-2 p-2">
          <h3 className="text-sm font-semibold">Add Review</h3>

          {/* Name input: disabled if logged in */}
          <Input
            type="text"
            placeholder="Your name"
            className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
            value={session?.user?.name || review.name}
            onChange={(e) => setReview({ ...review, name: e.target.value })}
            disabled={!!session?.user?.name}
          />

          {/* ⭐ Star selector */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                className={`h-7 w-7 cursor-pointer ${num <= review.rating ? "text-yellow-500" : "text-gray-500"}`}
                onClick={() => setReview({ ...review, rating: num })}
              />
            ))}
          </div>

          <textarea
            className="w-full rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
            placeholder="Write your review..."
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
          />

          <Button disabled={loading} onClick={submitReview}>
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
