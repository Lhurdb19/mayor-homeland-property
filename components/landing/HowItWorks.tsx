"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Home, ClipboardCheck } from "lucide-react";

type StepType = {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function HowItWorks() {
  const [steps, setSteps] = useState<StepType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setSteps([
        {
          step: 1,
          title: "Find the Perfect Property",
          description:
            "Use our smart filters to browse verified listings and discover homes that match your taste and budget.",
          icon: <Search size={30} className="text-blue-600" />,
        },
        {
          step: 2,
          title: "Schedule a Visit",
          description:
            "Book an inspection with trusted agents. View the property physically or virtually, hassle-free.",
          icon: <Home size={30} className="text-blue-600" />,
        },
        {
          step: 3,
          title: "Secure Your Home",
          description:
            "Complete the process confidently with expert guidance and verified documentation.",
          icon: <ClipboardCheck size={30} className="text-blue-600" />,
        },
      ]);
      setLoading(false);
    }, 1800);
  }, []);

  return (
    <div className="py-20 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-center mb-6"
      >
        How It Works
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => <StepSkeleton key={i} />)
          : steps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <StepCard step={item} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}

function StepCard({ step }: { step: StepType }) {
  return (
    <Card className="rounded-xl shadow-md p-4 text-center hover:shadow-xl transition-all">
      <div className="flex justify-center ">{step.icon}</div>

      <div className="flex justify-center items-center">
        <span className="h-5 md:h-10 w-5 md:w-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs md:text-lg">
          {step.step}
        </span>
      </div>

      <h3 className="text-sm md:text-xl font-semibold mt-0 md:mt-2">{step.title}</h3>
      <p className="text-gray-300 text-xs md:text-sm">{step.description}</p>
    </Card>
  );
}

function StepSkeleton() {
  return (
    <Card className="rounded-xl shadow-md p-8 text-center space-y-5">
      <div className="flex justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mx-auto" />
    </Card>
  );
}
