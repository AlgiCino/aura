import { GlassCard } from "../GlassCard";
import { GlassButton } from "../GlassButton";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function PlanCard({ plan, isCurrent, onSelect, yearly = false }) {
  const handleClick = () => {
    if (!isCurrent && onSelect) {
      onSelect(plan);
    }
  };

  const getPlanIcon = () => {
    switch (plan.id) {
      case "pro": return <Zap className="w-5 h-5 text-purple-600" />;
      case "enterprise": return <Shield className="w-5 h-5 text-indigo-600" />;
      default: return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCardStyle = () => {
    if (plan.featured) {
      return "border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-purple-50/80";
    }
    if (plan.enterprise) {
      return "border border-gray-200 bg-gradient-to-br from-gray-50/80 to-slate-50/80";
    }
    return "border border-white/60";
  };

  return (
    <GlassCard className={`relative p-8 h-full flex flex-col ${getCardStyle()}`}>
      {plan.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-indigo-600 text-white px-4 py-1">
            {plan.badge || "Most Popular"}
          </Badge>
        </div>
      )}

      {plan.savings && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-600 text-white px-3 py-1 text-xs">
            {plan.savings}
          </Badge>
        </div>
      )}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {getPlanIcon()}
          <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
            {plan.frequency && (
              <span className="text-gray-600">{plan.frequency}</span>
            )}
          </div>
          {yearly && plan.id === "pro" && (
            <div className="text-sm text-green-600 font-medium mt-1">
              Save $60 per year
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">{plan.description}</p>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {plan.features?.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3"
            >
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Limitations (for free plan) */}
        {plan.limitations && (
          <div className="space-y-2 mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Limitations
            </div>
            {plan.limitations.map((limitation, index) => (
              <div key={index} className="text-xs text-gray-600">
                • {limitation}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="mt-auto">
        <GlassButton
          variant={plan.featured ? "primary" : plan.enterprise ? "neutral" : "neutral"}
          onClick={handleClick}
          disabled={isCurrent}
          className="w-full py-3 font-semibold"
        >
          {isCurrent ? "Current Plan" : plan.cta}
        </GlassButton>

        {isCurrent && (
          <div className="mt-2 text-center">
            <Badge className="bg-green-100 text-green-700 border-green-200">
              Active Plan
            </Badge>
          </div>
        )}
      </div>
    </GlassCard>
  );
}