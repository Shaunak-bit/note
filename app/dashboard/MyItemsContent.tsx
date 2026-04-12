import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Item, Status, ItemCard, CreateModal } from "./page";

export function MyItemsContent({ items, onDelete, onView, onCreate }: {
    items: Item[]; onDelete: (id: number) => void;
    onView: (i: Item) => void; onCreate: (i: Omit<Item, "id">) => void;
}) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"All" | Status>("All");
    const [showCreate, setShowCreate] = useState(false);

    const filtered = items.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "All" || i.status === filter)
    );

    return (
        <>
            <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">My Items</h1>
                        <p className="text-sm text-stone-500 mt-0.5">Manage and track all your projects and tasks</p>
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl
              hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200 text-sm">
                        <Plus size={14} /> New Item
                    </button>
                </div>

                {/* Filters + Search */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl p-1">
                        {(["All", "PENDING", "COMPLETED"] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${filter === f ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-800"}`}>{f === "PENDING" ? "Active" : f === "COMPLETED" ? "Completed" : "All"}</button>
                        ))}
                    </div>
                    <div className="relative ml-auto">
                        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
                            className="pl-8 pr-3 py-2 text-xs border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition bg-white w-48" />
                    </div>
                </div>

                {/* Summary Pills */}
                <div className="flex gap-3">
                    {[
                        { label: "Total", count: items.length, c: "bg-stone-100 text-stone-600" },
                        { label: "PENDING", count: items.filter(i => i.status === "PENDING").length, c: "bg-blue-50 text-blue-600" },
                        { label: "COMPLETED", count: items.filter(i => i.status === "COMPLETED").length, c: "bg-emerald-50 text-emerald-600" },
                    ].map(s => (
                        <span key={s.label} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${s.c}`}>{s.label}: {s.count}</span>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.length > 0
                        ? filtered.map((item, i) => <ItemCard key={item.id} item={item} onDelete={onDelete} onView={onView} delayMs={i * 60} />)
                        : <div className="col-span-3 text-center py-16 text-stone-400 text-sm">No items match your search.</div>
                    }
                </div>
            </div>
            {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={item => { onCreate(item); setShowCreate(false); }} />}
        </>
    );
}
