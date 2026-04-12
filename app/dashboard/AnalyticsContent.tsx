import React from "react";
import { Item } from "./page";

export function AnalyticsContent({ items }: { items: Item[] }) {
    const active = items.filter(i => i.status === "PENDING").length;
    const completed = items.filter(i => i.status === "COMPLETED").length;
    const rate = items.length ? Math.round((completed / items.length) * 100) : 0;

    // ── Dynamic Weekly Activity (last 7 days) ─────────────────────────────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i)); // oldest → newest
        return d;
    });

    const weekBars = weekDays.map(day => {
        const next = new Date(day);
        next.setDate(day.getDate() + 1);
        return items.filter(item => {
            const t = new Date(item.createdAt);
            return t >= day && t < next;
        }).length;
    });

    const maxWeek = Math.max(...weekBars, 1); // avoid division by zero

    const dayLabels = weekDays.map((d, i) => {
        if (i === 6) return "Today";
        return d.toLocaleDateString("en-US", { weekday: "short" });
    });

    // ── Dynamic Monthly Trend (last 6 months) ─────────────────────────────────
    const monthSlots = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
        return d;
    });

    const monthly = monthSlots.map(slot => {
        const year = slot.getFullYear();
        const month = slot.getMonth();
        return items.filter(item => {
            const t = new Date(item.createdAt);
            return t.getFullYear() === year && t.getMonth() === month;
        }).length;
    });

    const monthLabels = monthSlots.map(d =>
        d.toLocaleDateString("en-US", { month: "short" })
    );

    const maxM = Math.max(...monthly, 1);



    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-stone-800">Analytics</h1>
                <p className="text-sm text-stone-500 mt-0.5">Performance overview and insights</p>
            </div>

            {/* Stat row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { l: "Total Items", v: `${items.length}`, c: "text-stone-800", bg: "bg-stone-50", b: "border-stone-200" },
                    { l: "Active", v: `${active}`, c: "text-blue-600", bg: "bg-blue-50", b: "border-blue-100" },
                    { l: "Completed", v: `${completed}`, c: "text-emerald-600", bg: "bg-emerald-50", b: "border-emerald-100" },
                    { l: "Completion Rate", v: `${rate}%`, c: "text-orange-500", bg: "bg-orange-50", b: "border-orange-100" },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-5 border ${s.b} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
                        <p className="text-xs text-stone-500 font-medium mb-2">{s.l}</p>
                        <p className={`text-3xl font-bold ${s.c}`}>{s.v}</p>
                    </div>
                ))}
            </div>

            {/* Weekly Bar Chart — dynamic */}
            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold text-stone-700 text-sm">Weekly Activity</h3>
                    <span className="text-xs text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg">Last 7 days</span>
                </div>

                {weekBars.every(v => v === 0) ? (
                    <div className="h-40 flex items-center justify-center text-sm text-stone-400">
                        No items created in the last 7 days
                    </div>
                ) : (
                    <div className="flex items-end gap-3 h-40">
                        {weekBars.map((count, i) => {
                            const isToday = i === 6;
                            const heightPx = Math.round((count / maxWeek) * 140); // max 140 px
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    {/* bar */}
                                    <div className="w-full flex flex-col justify-end" style={{ height: "140px" }}>
                                        {count > 0 && (
                                            <div
                                                className="w-full rounded-t-xl relative overflow-hidden"
                                                style={{ height: `${Math.max(heightPx, 6)}px` }}
                                            >
                                                <div
                                                    className="absolute inset-0 rounded-t-xl origin-bottom animate-grow"
                                                    style={{
                                                        background: isToday ? "#f97316" : "#fed7aa",
                                                        animationDelay: `${i * 80}ms`,
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    {/* count label */}
                                    <span className={`text-xs font-semibold ${isToday ? "text-orange-500" : "text-stone-500"}`}>
                                        {count}
                                    </span>
                                    {/* day label */}
                                    <span className={`text-xs ${isToday ? "text-orange-500 font-semibold" : "text-stone-400"}`}>
                                        {dayLabels[i]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Monthly Trend + Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Monthly Trend — dynamic */}
                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                    <h3 className="font-semibold text-stone-700 text-sm mb-4">Monthly Trend</h3>
                    <div className="flex flex-col gap-3">
                        {monthly.map((v, i) => {
                            const isCurrent = i === monthly.length - 1;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-xs text-stone-400 w-8">{monthLabels[i]}</span>
                                    <div className="flex-1 h-3 bg-stone-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full animate-growX"
                                            style={{
                                                width: `${(v / maxM) * 100}%`,
                                                background: isCurrent ? "#f97316" : "#fdba74",
                                                animationDelay: `${i * 80}ms`,
                                                animationFillMode: "both",
                                                minWidth: v > 0 ? "6px" : "0px",
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-stone-600 w-4 text-right">{v}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Total label */}
                    <p className="text-xs text-stone-400 mt-4 pt-3 border-t border-stone-100">
                        {items.length} total item{items.length !== 1 ? "s" : ""} across 6 months
                    </p>
                </div>

                {/* Status Breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                    <h3 className="font-semibold text-stone-700 text-sm mb-4">Status Breakdown</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { l: "Active", count: active, c: "bg-blue-400", tc: "text-blue-600" },
                            { l: "Completed", count: completed, c: "bg-emerald-400", tc: "text-emerald-600" },
                        ].map((b, i) => (
                            <div key={i} className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className={`font-medium ${b.tc}`}>{b.l}</span>
                                    <span className="text-stone-500">
                                        {b.count}/{items.length} ({items.length ? Math.round((b.count / items.length) * 100) : 0}%)
                                    </span>
                                </div>
                                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${b.c} rounded-full animate-growX`}
                                        style={{
                                            width: `${items.length ? (b.count / items.length) * 100 : 0}%`,
                                            animationDelay: `${i * 150}ms`,
                                            animationFillMode: "both",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}