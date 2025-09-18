import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { GlassCard } from "../GlassCard";

export default function PlanSection({ id, title, children }) {
  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-gray-900">
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35 }}>
          <GlassCard className="p-4 md:p-5">
            <div className="prose prose-slate max-w-none text-sm md:text-base">
              {children}
            </div>
          </GlassCard>
        </motion.div>
      </AccordionContent>
    </AccordionItem>
  );
}
