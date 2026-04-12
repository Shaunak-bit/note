"use client";
import { useState, useEffect } from "react";
import {
    LayoutDashboard, FolderOpen, BarChart2, Settings, LogOut,
    Bell, ChevronLeft, ChevronRight, Briefcase, TrendingUp,
    CheckCircle2, Plus, Eye, Trash2, Clock, Pencil,
    X,
} from "lucide-react";
import { MyItemsContent } from "./MyItemsContent";
import { AnalyticsContent } from "./AnalyticsContent";
import { SettingsContent } from "./SettingsContent";
import { getProfile } from "../lib/api";
import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/api";
import { getItems, createItem, deleteItem, updateItem } from "../lib/api";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
export type Status = "PENDING" | "COMPLETED";
type NavKey = "Dashboard" | "My Items" | "Analytics" | "Settings";

export interface Item {
    id: number;
    title: string;
    description: string;
    date: string;
    status: Status;
    createdAt: string;
    updatedAt: string;
}

type User = {
    id: number;
    name: string;
    email: string;
}

// Shape of a computed activity row passed into DashboardContent
interface ActivityRow {
    label: string;
    task: string;
    time: string;
    icon: React.ReactNode;
    color: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED — STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════
function StatCard({ icon, iconBg, label, value, badge, delayMs = 0 }: {
    icon: React.ReactNode; iconBg: string; label: string;
    value: string; badge?: string; delayMs?: number;
}) {
    const [show, setShow] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShow(true), delayMs); return () => clearTimeout(t); }, [delayMs]);
    return (
        <div className={`bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col gap-3
        transition-all duration-500 hover:shadow-md hover:-translate-y-1
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>{icon}</div>
            <p className="text-sm text-stone-500 font-medium">{label}</p>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-stone-800 tracking-tight">{value}</span>
                {badge && <span className="text-xs font-semibold text-emerald-500 mb-1">{badge}</span>}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED — ITEM CARD
// ═══════════════════════════════════════════════════════════════════════════════
export function ItemCard({ item, onDelete, onView, delayMs = 0 }: {
    item: Item; onDelete: (id: number) => void;
    onView: (item: Item) => void; delayMs?: number;
}) {
    const [show, setShow] = useState(false);
    useEffect(() => { const t = setTimeout(() => setShow(true), delayMs); return () => clearTimeout(t); }, [delayMs]);
    return (
        <div className={`bg-white rounded-2xl p-5 border border-stone-100 shadow-sm flex flex-col gap-3
        transition-all duration-500 hover:shadow-md hover:-translate-y-1
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-1">{item.title}</h3>
                <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1
            ${item.status === "PENDING" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                    {item.status === "PENDING" ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                    {item.status === "PENDING" ? "Active" : "Completed"}
                </span>
            </div>
            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{item.description}</p>
            <p className="text-xs text-stone-400">{item.date}</p>
            <div className="flex gap-2 pt-1">
                <button onClick={() => onView(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium
            text-stone-600 border border-stone-200 rounded-lg py-2 hover:bg-stone-50 transition-colors">
                    <Eye size={12} /> View Details
                </button>
                <button onClick={() => onDelete(item.id)}
                    className="p-2 text-red-400 border border-stone-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors">
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED — MODALS
// ═══════════════════════════════════════════════════════════════════════════════
export function CreateModal({ onClose, onCreate }: { onClose: () => void; onCreate: (i: Omit<Item, "id">) => void }) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState<Status>("PENDING");

    const submit = () => {
        if (!title.trim()) return;
        onCreate({
            title,
            description: desc,
            date: "",
            status,
            createdAt: "",
            updatedAt: "",
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-slideUp">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-stone-800">Create New Item</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition"><X size={17} /></button>
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-stone-400 mb-1.5">Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title..."
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-stone-400 mb-1.5">Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Enter description..."
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-stone-400 mb-1.5">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as Status)}
                            className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition bg-white">
                            <option value="PENDING">Active</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-600 hover:bg-stone-50 transition">Cancel</button>
                        <button onClick={submit} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition">Create Item</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ViewModal({ item, onClose, onUpdate }: { item: Item; onClose: () => void; onUpdate: (id: number, newStatus: Status) => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-slideUp">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-stone-800">Item Details</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition"><X size={17} /></button>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Title</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.status === "PENDING" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>{item.status === "PENDING" ? "Active" : "Completed"}</span>
                    </div>
                    <p className="text-base font-semibold text-stone-800">{item.title}</p>
                    <div className="h-px bg-stone-100" />
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Description</span>
                    <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
                    <div className="h-px bg-stone-100" />
                    <p className="text-xs text-stone-400 flex items-center gap-1.5"><Clock size={11} /> Created {item.date}</p>
                    <div className="mt-1 flex gap-2">
                        <button onClick={() => onUpdate(item.id, item.status === "PENDING" ? "COMPLETED" : "PENDING")} className="w-2/3 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition">Updated</button>
                        <button onClick={onClose} className="w-1/3 py-2.5 rounded-xl bg-stone-200 text-stone-800 text-sm font-semibold hover:bg-stone-300 transition">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER — compute activity rows from items
// ═══════════════════════════════════════════════════════════════════════════════
function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

function buildActivity(items: Item[]): ActivityRow[] {
    return [...items]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5)
        .map(item => {
            const isNew = item.createdAt === item.updatedAt;
            const isDone = item.status === "COMPLETED";

            if (isNew) return {
                label: "Created",
                task: item.title,
                time: timeAgo(item.createdAt),
                icon: <Plus size={15} />,
                color: "bg-blue-100 text-blue-600",
            };
            if (isDone) return {
                label: "Completed",
                task: item.title,
                time: timeAgo(item.updatedAt),
                icon: <CheckCircle2 size={15} />,
                color: "bg-emerald-100 text-emerald-600",
            };
            return {
                label: "Updated",
                task: item.title,
                time: timeAgo(item.updatedAt),
                icon: <Pencil size={15} />,
                color: "bg-orange-100 text-orange-600",
            };
        });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE — DASHBOARD CONTENT
// ═══════════════════════════════════════════════════════════════════════════════
function DashboardContent({ items, activity, onDelete, onView, onCreateClick, onViewAll }: {
    items: Item[];
    activity: ActivityRow[];   // ← correctly typed, passed from parent
    onDelete: (id: number) => void;
    onView: (i: Item) => void;
    onCreateClick: () => void;
    onViewAll: () => void;
}) {
    const active = items.filter(i => i.status === "PENDING").length;
    const completed = items.filter(i => i.status === "COMPLETED").length;
    const rate = items.length ? Math.round((completed / items.length) * 100) : 0;

    // ── Dynamic Quick Stats ──────────────────────────────────────────────────
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const createdThisWeek = items.filter(i => i.createdAt && new Date(i.createdAt) >= startOfWeek).length;
    const createdThisMonth = items.filter(i => i.createdAt && new Date(i.createdAt) >= startOfMonth).length;

    // Progress = share of total items, capped at 100 %
    const weekProgress = items.length ? Math.min(Math.round((createdThisWeek / items.length) * 100), 100) : 0;
    const monthProgress = items.length ? Math.min(Math.round((createdThisMonth / items.length) * 100), 100) : 0;

    const quickStats = [
        { label: "This Week", sublabel: "items created", value: createdThisWeek, progress: weekProgress },
        { label: "This Month", sublabel: "items created", value: createdThisMonth, progress: monthProgress },
    ];

    return (
        <div className="flex flex-col gap-7 animate-fadeIn">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold text-stone-800">Welcome Back!</h1>
                <p className="text-stone-500 text-sm mt-1">
                    You have <span className="font-semibold text-stone-700">{active} active items</span> and{" "}
                    <span className="font-semibold text-stone-700">{completed} completed items</span>
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Briefcase size={20} className="text-orange-500" />} iconBg="bg-orange-50" label="Total Items" value={`${items.length}`} delayMs={100} />
                <StatCard icon={<TrendingUp size={20} className="text-blue-500" />} iconBg="bg-blue-50" label="Active Items" value={`${active}`} badge="+12%" delayMs={200} />
                <StatCard icon={<CheckCircle2 size={20} className="text-emerald-500" />} iconBg="bg-emerald-50" label="Completed Items" value={`${completed}`} badge="+8%" delayMs={300} />
                <StatCard icon={<TrendingUp size={20} className="text-violet-500" />} iconBg="bg-violet-50" label="Completion Rate" value={`${rate}%`} delayMs={400} />
            </div>

            {/* Create Button */}
            <button onClick={onCreateClick}
                className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-white font-semibold rounded-xl
          w-fit hover:bg-orange-600 active:scale-95 transition-all shadow-sm shadow-orange-200">
                <Plus size={16} /> Create New Item
            </button>

            {/* Your Items */}
            <div>
                <h2 className="text-xl font-bold text-stone-800">Your Items</h2>
                <p className="text-sm text-stone-500 mb-4">Manage and track all your projects and tasks</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.slice(0, 6).map((item, i) => (
                        <ItemCard key={item.id} item={item} onDelete={onDelete} onView={onView} delayMs={80 + i * 70} />
                    ))}
                </div>
                {items.length > 6 && (
                    <button onClick={onViewAll} className="mt-4 flex items-center gap-1 text-sm text-orange-500 font-medium hover:gap-2 transition-all">
                        View all items <ChevronRight size={14} />
                    </button>
                )}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Activity — now uses the correctly typed ActivityRow[] */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                    <h3 className="font-bold text-stone-800 mb-5">Recent Activity</h3>
                    {activity.length === 0 ? (
                        <p className="text-sm text-stone-400">No recent activity yet.</p>
                    ) : (
                        <div className="flex flex-col gap-5">
                            {activity.map((a, i) => (
                                <div key={i} className="flex items-start gap-3 relative">
                                    <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center shrink-0 z-10`}>
                                        {a.icon}
                                    </div>
                                    {i < activity.length - 1 && (
                                        <div className="absolute left-4 top-8 w-px h-full bg-stone-100" />
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-stone-700">{a.label}</p>
                                        <p className="text-sm text-stone-500">{a.task}</p>
                                        <p className="text-xs text-stone-400 mt-0.5">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col gap-4">
                    <h3 className="font-bold text-stone-800">Quick Stats</h3>

                    {quickStats.map((s, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm text-stone-600">{s.label}</span>
                                    <p className="text-xs text-stone-400">{s.sublabel}</p>
                                </div>
                                <span className="text-sm font-bold text-stone-800">
                                    {s.value > 0 ? `+${s.value}` : s.value}
                                </span>
                            </div>
                            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-orange-400 rounded-full transition-all duration-700"
                                    style={{ width: `${s.progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-stone-400 text-right">{s.progress}% of total</p>
                        </div>
                    ))}

                    {/* Completion rate row */}
                    <div className="pt-1 border-t border-stone-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-sm text-stone-600">Completion Rate</span>
                                <p className="text-xs text-stone-400">all time</p>
                            </div>
                            <span className="text-sm font-bold text-stone-800">{rate}%</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                                style={{ width: `${rate}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-stone-400 mt-auto pt-1">Last updated: {new Date().toLocaleDateString("en-GB")}</p>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT EXPORT — SIDEBAR + HEADER + ROUTER
// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [items, setItems] = useState<Item[]>([]);
    const [activeNav, setActiveNav] = useState<NavKey>("Dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [viewItem, setViewItem] = useState<Item | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const navItems: { key: NavKey; icon: React.ReactNode; label: string }[] = [
        { key: "Dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
        { key: "My Items", icon: <FolderOpen size={18} />, label: "My Items" },
        { key: "Analytics", icon: <BarChart2 size={18} />, label: "Analytics" },
        { key: "Settings", icon: <Settings size={18} />, label: "Settings" },
    ];

    const handleCreate = async (data: Omit<Item, "id">) => {
        const res = await createItem(data.title, data.description, data.status);
        if (res.success && res.data) {
            setItems(prev => [res.data as Item, ...prev]);
            setShowCreate(false);
        } else {
            console.error("Creation failed:", res.message);
            alert(res.message || "Failed to create item. Please try again.");
        }
    };

    const handleDelete = async (id: number) => {
        const res = await deleteItem(id);
        if (res.success) {
            setItems(prev => prev.filter(i => i.id !== id));
        }
    };

    const handleUpdateItem = async (id: number, newStatus: Status) => {
        const res = await updateItem(id, newStatus);
        if (res.success && res.data) {
            setItems(prev => prev.map(i => i.id === id ? res.data : i));
            setViewItem(res.data);
        }
    };

    const greeting = () => {
        const h = new Date().getHours();
        return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getProfile();
                if (!res || !res.data) { router.push("/signin"); return; }
                setUser(res.data);
                const res2 = await getItems();
                if (res2.success) setItems(res2.data);
            } catch (err) {
                console.log(err);
                router.push("/signin");
            }
        };
        fetchUser();
    }, [router]);

    // Compute activity rows once here and pass them down — no more property mismatches
    const activity = buildActivity(items);

    const renderPage = () => {
        switch (activeNav) {
            case "Dashboard": return (
                <DashboardContent
                    items={items}
                    activity={activity}   // ← passed correctly
                    onDelete={handleDelete}
                    onView={setViewItem}
                    onCreateClick={() => setShowCreate(true)}
                    onViewAll={() => setActiveNav("My Items")}
                />
            );
            case "My Items": return (
                <MyItemsContent items={items} onDelete={handleDelete} onView={setViewItem} onCreate={handleCreate} />
            );
            case "Analytics": return <AnalyticsContent items={items} />;
            case "Settings": return (
                <SettingsContent user={user} setUser={setUser} />
            );
        }
    };

    return (
        <>
            <style>{`
        @keyframes fadeIn  { from { opacity:0 }                             to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes grow    { from { transform:scaleY(0) }                   to { transform:scaleY(1) } }
        @keyframes growX   { from { width:0 }                               to { } }
        .animate-fadeIn  { animation: fadeIn  0.4s ease both; }
        .animate-slideUp { animation: slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-grow    { animation: grow    0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .animate-growX   { animation: growX   0.7s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

            <div className="flex h-screen bg-stone-50 font-sans overflow-hidden">

                {/* ━━━━━━━━━━━━━━━ SIDEBAR ━━━━━━━━━━━━━━━ */}
                <aside className={`flex flex-col bg-white border-r border-stone-100 transition-all duration-300 shrink-0 ${collapsed ? "w-16" : "w-60"}`}>
                    <div className="flex items-center justify-between px-4 py-5 border-b border-stone-100">
                        {!collapsed && <span className="text-base font-bold text-stone-800 tracking-tight">Dashboard</span>}
                        <button onClick={() => setCollapsed(!collapsed)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition ml-auto">
                            <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
                        {navItems.map(n => (
                            <button key={n.key} onClick={() => setActiveNav(n.key)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${activeNav === n.key
                                        ? "bg-stone-100 text-stone-900"
                                        : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"}`}>
                                {n.icon}
                                {!collapsed && <span>{n.label}</span>}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ━━━━━━━━━━━━━━━ MAIN ━━━━━━━━━━━━━━━ */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* HEADER */}
                    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-stone-100 shrink-0">
                        <div>
                            <h2 className="text-base font-bold text-stone-800">{greeting()}, {user?.name || "User"} 👋</h2>
                            <p className="text-xs text-stone-400">Here's your activity overview</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="relative p-2 rounded-xl hover:bg-stone-50 text-stone-400 transition">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
                            </button>

                            <div className="relative">
                                <div
                                    onClick={() => setShowProfileMenu(prev => !prev)}
                                    className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-lg cursor-pointer hover:ring-2 hover:ring-orange-300 transition select-none"
                                >
                                    👤
                                </div>

                                {showProfileMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                                        <div className="absolute right-0 top-11 z-50 w-56 bg-white rounded-2xl shadow-lg border border-stone-100 overflow-hidden animate-slideUp">
                                            <div className="px-4 py-3.5 border-b border-stone-100">
                                                <p className="text-sm font-bold text-stone-800 truncate">{user?.name || "User"}</p>
                                                <p className="text-xs text-stone-400 mt-0.5 truncate">{user?.email || "user@example.com"}</p>
                                            </div>
                                            <button
                                                onClick={() => { setActiveNav("Settings"); setShowProfileMenu(false); }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                                            >
                                                <Settings size={15} className="text-stone-400" /> Settings
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    setShowProfileMenu(false);
                                                    const res = await logoutUser();
                                                    if (res?.success) router.push("/signin");
                                                }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={15} /> Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* PAGE */}
                    <main className="flex-1 overflow-y-auto px-8 py-7" key={activeNav}>
                        {renderPage()}
                    </main>
                </div>
            </div>

            {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
            {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} onUpdate={handleUpdateItem} />}
        </>
    );
}