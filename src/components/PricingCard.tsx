"use client";

import { Pricing, PricingMode } from "@/types/interfaces";
import { FC, useEffect, useState } from "react";
import Button from "@/components/Button";
import { Check } from "lucide-react";
import { motion } from "motion/react";

interface PricingCardProps extends Pricing {
  mode: PricingMode;
}

const PricingCard: FC<PricingCardProps> = ({
  title,
  description,
  monthlyPrice,
  annuallyPrice,
  features,
  glowPosition,
  isMostPopular,
  mode,
}) => {
  const targetPrice = mode === "monthly" ? monthlyPrice : annuallyPrice;

  const [displayPrice, setDisplayPrice] = useState(targetPrice);

  useEffect(() => {
    const startPrice = displayPrice;
    const difference = targetPrice - startPrice;
    const duration = 500;

    let startTime: number | null = null;
    let animationFrame: number;

    const animatePrice = (currentTime: number) => {
      if (!startTime) startTime = currentTime;

      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayPrice(Math.round(startPrice + difference * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animatePrice);
      }
    };

    animationFrame = requestAnimationFrame(animatePrice);

    return () => cancelAnimationFrame(animationFrame);
  }, [targetPrice]);

  return (
    <article
      className={`relative w-full py-6 px-4 flex flex-col space-y-4 lg:space-y-6 ${
        isMostPopular
          ? "border-2 border-sky-700 bg-slate-800"
          : "border border-slate-700"
      } rounded-lg overflow-hidden`}
    >
      <figure
        className={`absolute w-72 h-60 bg-sky-600 -z-10 rounded-full blur-3xl opacity-20 -top-12${
          glowPosition === "left" ? " -left-8" : " -right-8"
        }`}
      />

      {isMostPopular && (
        <p className="absolute top-5 right-6 bg-sky-600 text-white text-xs font-semibold capitalize py-2 px-3 rounded-3xl">
          Most Popular
        </p>
      )}

      <h1 className="font-bold text-slate-100 text-base capitalize">{title}</h1>

      <p>{description}</p>

      {/* Price */}
      <div className="flex items-baseline">
        <div className="flex items-baseline">
          <motion.h1
            className="font-extrabold text-slate-100 text-4xl"
            initial={false}
          >
            ${displayPrice}
          </motion.h1>

          <motion.small
            key={mode}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-base text-slate-300 font-semibold ps-1"
          >
            /{mode === "monthly" ? "month" : "year"}
          </motion.small>
        </div>
      </div>

      <Button variant={isMostPopular ? "primary" : "secondary"} isFullSize>
        buy plan
      </Button>

      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-4">
            <Check className="text-sky-600" />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default PricingCard;
