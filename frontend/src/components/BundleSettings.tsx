import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Plus, Trash2, Save, Tag } from "lucide-react";
import Loader from "@/components/Loader";

interface BundleDiscount {
    quantity: number;
    discount: number; // Percent
}

export default function BundleSettings() {
    const [discounts, setDiscounts] = useState<BundleDiscount[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/user/bundle-settings");
                // Convert JSON map { "2": 10 } to array [{quantity: 2, discount: 10}]
                if (res.data.bundleSettings) {
                    const loaded = Object.entries(res.data.bundleSettings).map(([qty, disc]) => ({
                        quantity: parseInt(qty),
                        discount: Number(disc)
                    })).sort((a, b) => a.quantity - b.quantity);
                    setDiscounts(loaded);
                }
            } catch (error) {
                console.error("Error fetching bundle settings:", error);
                // toast.error("Failed to load discount settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleAdd = () => {
        setDiscounts([...discounts, { quantity: 2, discount: 5 }]);
    };

    const handleRemove = (index: number) => {
        const newDiscounts = [...discounts];
        newDiscounts.splice(index, 1);
        setDiscounts(newDiscounts);
    };

    const handleChange = (index: number, field: keyof BundleDiscount, value: number) => {
        const newDiscounts = [...discounts];
        newDiscounts[index] = { ...newDiscounts[index], [field]: value };
        setDiscounts(newDiscounts);
    };

    const handleSave = async () => {
        if (discounts.some(d => d.quantity < 2 || d.discount < 0 || d.discount > 100)) {
            toast.error("Please enter valid quantities and discount percentages (0-100%)");
            return;
        }

        setSaving(true);
        try {
            // Convert array back to map { "2": 10 }
            const settingsMap = discounts.reduce((acc, curr) => {
                acc[curr.quantity] = curr.discount;
                return acc;
            }, {} as Record<string, number>);

            await api.put("/user/bundle-settings", { bundleSettings: settingsMap });
            toast.success("Bundle discounts saved!");
        } catch (error) {
            console.error("Error saving bundle settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="bg-white p-6 rounded-2xl border border-secondary-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="text-primary-600" />
                <h2 className="text-xl font-bold text-secondary-900">Bundle Discounts</h2>
            </div>

            <p className="text-secondary-600 text-sm mb-6">
                Encourage buyers to purchase multiple items by offering discounts.
            </p>

            <div className="space-y-4">
                {discounts.map((discount, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm font-medium text-secondary-700">Buy</span>
                            <select
                                value={discount.quantity}
                                onChange={(e) => handleChange(index, 'quantity', parseInt(e.target.value))}
                                className="border border-secondary-200 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                            >
                                {[2, 3, 5].map(n => (
                                    <option key={n} value={n}>{n} items</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-sm font-medium text-secondary-700">Get</span>
                            <div className="relative w-24">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discount.discount}
                                    onChange={(e) => handleChange(index, 'discount', parseInt(e.target.value))}
                                    className="w-full border border-secondary-200 rounded-md p-2 pr-8 text-sm focus:ring-primary-500 focus:border-primary-500"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-500">%</span>
                            </div>
                            <span className="text-sm font-medium text-secondary-700">off</span>
                        </div>

                        <button
                            onClick={() => handleRemove(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-3">
                <button
                    onClick={handleAdd}
                    disabled={discounts.length >= 3}
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-secondary-300 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors disabled:opacity-50"
                >
                    <Plus size={18} /> Add Discount
                </button>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 ml-auto disabled:opacity-70"
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                    Save
                </button>
            </div>
        </div>
    );
}
