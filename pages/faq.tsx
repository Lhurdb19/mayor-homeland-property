"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How do I purchase a property?", a: "You can purchase a property by contacting our sales team or using our online property portal. We'll guide you through the process step by step." },
  { q: "Do you offer financing options?", a: "Yes, we have multiple financing plans and mortgage assistance programs. Our team can help you choose the best option." },
  { q: "Can I schedule a site visit?", a: "Absolutely! Contact our support team or use the scheduling tool on our website to arrange a property visit." },
  { q: "Are the properties fully documented?", a: "Yes, all our properties come with full legal documentation and verified titles to ensure a safe purchase." },
  { q: "Do you provide property management services?", a: "Yes, we offer property management including maintenance, tenant management, and rent collection for investors." },
  { q: "Can I resell my property through Mayor Homeland Property?", a: "Yes, we can assist with resale by listing your property on our platform and connecting you with interested buyers." },
  { q: "What types of properties are available?", a: "We offer residential homes, apartments, commercial spaces, and land plots in various locations across the city." },
  { q: "How long does it take to complete a purchase?", a: "The purchase process typically takes 2-4 weeks, depending on financing and legal documentation." },
  { q: "Do you have customer support?", a: "Yes, our customer support team is available via phone, email, and live chat to assist you with any queries." },
  { q: "Can I customize my property?", a: "Certain properties allow customization. Contact our sales team to explore available options and upgrades." },
  { q: "Is there a warranty on the properties?", a: "Yes, new properties come with structural warranties, and our team will provide detailed information on each property." },
  { q: "How can I stay updated on new listings?", a: "Subscribe to our newsletter or enable notifications on our website to get alerts for new properties." },
];

export default function FAQPage() {
  return (
    <section className="bg-gray-50 py-20 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
        <p className="mt-4 text-gray-600 text-md">
          Find answers to the most common questions about buying, selling, and managing properties with Mayor Homeland Property.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full max-w-4xl space-y-4">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <AccordionTrigger className="flex justify-between items-center px-6 py-4 text-lg font-medium text-gray-800 hover:bg-gray-100 transition-colors duration-200">
              {f.q}
              {/* <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200 data-[state=open]:rotate-180" /> */}
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-gray-600 text-sm bg-white">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
