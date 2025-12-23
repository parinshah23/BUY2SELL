import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;

    // Use environment variable for backend URL or default to localhost
    // We strip /api/v1 if it's included in the env var, or just use the base
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')
        : "http://localhost:5000";

    return `${backendUrl}${path}`;
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
    }).format(price);
};
