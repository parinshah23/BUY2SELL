"use client";

import { usePathname } from "next/navigation";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHomePage = pathname === "/";

    return (
        <main className={`flex-grow ${isHomePage ? "" : "pt-36"}`}>
            {children}
        </main>
    );
}
