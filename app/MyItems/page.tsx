"use client";
import { useState } from "react";
import { Eye, Trash2, Clock, CheckCircle2, Search, X, Plus } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
export type Status = "Active" | "Completed";
export interface Item {
    id: number;
    title: string;
    description: string;
    date: string;
    status: Status;
}

// ─── Item Card ─────────────────────────────────────────────────────────────────
function ItemCard({
    item,
    onDelete,
    onView,
    delay,
}: {
    item: Item;
    onDelete: (id: number) => void;
    onView: (item: Item) => void;
    delay: string;
}) {
    return (
        <div
            className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex flex-col gap-3
        transition-all duration-500 hover:shadow-md hover:-translate-y-1 opacity-0 translate-y-4
        animate-fadeSlideUp"
            style={{ animationDelay: delay, animationFillMode: "forwards" }}
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-1">
                    {item.title}
                </h3>
                <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${item.status === "Active"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600"
                        }`}
                >
                    {item.status === "Active" ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                    {item.status}
                </span>
            </div>
            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{item.description}</p>
            <p className="text-xs text-stone-400">{item.date}</p>
            <div className="flex items-center gap-2 pt-1">
                <button
                    onClick={() => onView(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium
            text-stone-600 border border-stone-200 rounded-lg py-2 hover:bg-stone-50 transition-colors"
                >
                    <Eye size={13} /> View Details
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-400 border border-stone-200 rounded-lg
            hover:bg-red-50 hover:border-red-200 transition-colors"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    );
}

// ─── View Details Modal ────────────────────────────────────────────────────────
function ViewModal({ item, onClose }: { item: Item; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4 animate-slideUp">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-stone-800">Item Details</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Title</span>
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.status === "Active" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                                }`}
                        >
                            {item.status}
                        </span>
                    </div>
                    <p className="text-base font-semibold text-stone-800">{item.title}</p>
                    <div className="h-px bg-stone-100" />
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Description</span>
                    <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
                    <div className="h-px bg-stone-100" />
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Clock size={12} /> Created {item.date}
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-2 w-full py-2.5 rounded-xl bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Create Item Modal ─────────────────────────────────────────────────────────
function CreateModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (item: Omit<Item, "id">) => void;
}) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState<Status>("Active");

    const handle = () => {
        if (!title.trim()) return;
        onCreate({
            title,
            description: desc,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status,
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4 animate-slideUp">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-stone-800">Create New Item</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-stone-500 mb-1.5">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title..."
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-stone-500 mb-1.5">Description</label>
                        <textarea
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            placeholder="Enter description..."
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-stone-500 mb-1.5">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as Status)}
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition bg-white"
                        >
                            <option>Active</option>
                            <option>Completed</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handle}
                            className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition"
                        >
                            Create Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── MyItems Page ──────────────────────────────────────────────────────────────
interface MyItemsProps {
    items: Item[];
    onDelete: (id: number) => void;
    onCreate: (item: Omit<Item, "id">) => void;
}

export default function MyItems({ items, onDelete, onCreate }: MyItemsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [viewItem, setViewItem] = useState<Item | null>(null);
    const [filter, setFilter] = useState<"All" | Status>("All");

    const filtered = (items || []).filter((i) => {
        const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "All" || i.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn { animation: fadeIn 0.4s ease both; }
        .animate-slideUp { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-fadeSlideUp { animation: fadeSlideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

            <div className="flex flex-col gap-6 animate-fadeIn">
                {/* Header */}
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">My Items</h1>
                        <p className="text-sm text-stone-500 mt-0.5">Manage and track all your projects and tasks</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl
              hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200 text-sm"
                    >
                        <Plus size={15} /> New Item
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl p-1">
                        {(["All", "Active", "Completed"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-800"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="relative ml-auto">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search items..."
                            className="pl-8 pr-3 py-2 text-xs border border-stone-200 rounded-xl outline-none
                focus:ring-2 focus:ring-orange-300 transition bg-white w-48"
                        />
                    </div>
                </div>

                {/* Summary Pills */}
                <div className="flex items-center gap-3">
                    {[
                        { label: "Total", count: (items || []).length, color: "bg-stone-100 text-stone-600" },
                        { label: "Active", count: (items || []).filter((i) => i.status === "Active").length, color: "bg-blue-50 text-blue-600" },
                        { label: "Completed", count: (items || []).filter((i) => i.status === "Completed").length, color: "bg-emerald-50 text-emerald-600" },
                    ].map((s) => (
                        <span key={s.label} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${s.color}`}>
                            {s.label}: {s.count}
                        </span>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(filtered || []).length > 0 ? (
                        filtered.map((item, i) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onDelete={onDelete}
                                onView={setViewItem}
                                delay={`${i * 60}ms`}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-16 text-stone-400 text-sm">
                            No items match your search.
                        </div>
                    )}
                </div>
            </div>

            {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={onCreate} />}
            {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} />}
        </>
    );
}