"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I enroll my child?", a: "You can enroll via our online portal or visit our campus to submit application forms." },
  { q: "What age groups do you accept?", a: "We accept children from ages 3 to 17, covering nursery through secondary school levels." },
  { q: "Do you offer extracurricular activities?", a: "Yes! We provide sports, arts, music, debate, and community service programs." },
  { q: "Can I schedule a campus tour?", a: "Absolutely. Contact our admissions office to schedule a guided tour." },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 space-y-8">
      <h1 className="text-4xl font-bold text-center">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="space-y-4 mt-8">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent>{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
