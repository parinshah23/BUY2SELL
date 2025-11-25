"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SubSelectToggleProps {
    options: {
        label: string;
        value: string;
    }[];
    selected: string;
    onChange: (value: any) => void;
    className?: string;
}

export const SubSelectToggle = ({
    options,
    selected,
    onChange,
    className,
}: SubSelectToggleProps) => {
    return (
        <div
            className={cn(
                "flex space-x-1 bg-secondary-100 p-1 rounded-xl w-fit",
                className
            )}
        >
            {options.map((option) => {
                const isSelected = selected === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg z-10",
                            isSelected ? "text-secondary-900" : "text-secondary-500 hover:text-secondary-700"
                        )}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="active-toggle"
                                className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            />
                        )}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
