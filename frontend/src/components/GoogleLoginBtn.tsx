"use client";

import { GoogleLogin } from "@react-oauth/google";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GoogleLoginBtn() {
    const { login } = useAuth(); // destructure login from context
    const router = useRouter();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await axios.post("/auth/google", {
                credential: credentialResponse.credential,
            });

            const { token, user } = res.data;
            login(user, token); // Update auth context and local storage
            toast.success("Logged in with Google!");
            router.push("/");
        } catch (error: any) {
            console.error("Google Login Error:", error);
            toast.error(error.response?.data?.message || "Google Login Failed");
        }
    };

    return (
        <div className="w-full flex justify-center py-2">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    console.error("Login Failed");
                    toast.error("Google Login Failed");
                }}
                useOneTap
                theme="outline"
                size="large"
                shape="pill"
                width="100%"
            />
        </div>
    );
}
