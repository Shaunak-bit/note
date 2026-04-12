import React, { useState, useEffect } from "react";
import { User, Bell, Palette } from "lucide-react";
import { updateSettings, getSettings } from "../lib/api";

type User = {
    id: number;
    name: string;
    email: string;
};

export function SettingsContent({
    user,
    setUser,
}: {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [emailN, setEmailN] = useState(true);
    const [section, setSection] = useState("Profile");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            const res = await getSettings();
            if (res.success) {
                setEmailN(res.data.emailNotifications);
            }
        };
        fetchSettings();
    }, []);

    const showSaved = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const save = async () => {
        setError("");

        if (section === "Profile") {
            if (!name.trim() || !email.trim()) {
                setError("Name and email cannot be empty.");
                return;
            }
            showSaved();
        } else if (section === "Notifications") {
            const res = await updateSettings({ emailNotifications: emailN });
            if (res.success) {
                showSaved();
            } else {
                setError(res.message || "Failed to update settings.");
            }
        }
    };

    const Toggle = ({ v, on }: { v: boolean; on: () => void }) => (
        <button
            type="button"
            onClick={(e) => { e.stopPropagation(); on(); }}
            className={`w-11 h-6 rounded-full transition-colors duration-300 relative shrink-0 ${v ? "bg-orange-500" : "bg-stone-300"}`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${v ? "translate-x-5" : "translate-x-0"}`}
            />
        </button>
    );

    const tabs = [
        { k: "Profile", icon: <User size={15} /> },
        { k: "Notifications", icon: <Bell size={15} /> },
        { k: "Appearance", icon: <Palette size={15} /> },
    ];

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-stone-800">Settings</h1>
                <p className="text-sm text-stone-500 mt-0.5">Manage your account preferences</p>
            </div>

            <div className="flex gap-5">
                {/* Tabs */}
                <div className="shrink-0 w-44 flex flex-col gap-1">
                    {tabs.map((t) => (
                        <button
                            key={t.k}
                            type="button"
                            onClick={() => { setSection(t.k); setSaved(false); setError(""); }}
                            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${section === t.k
                                    ? "bg-orange-50 text-orange-600"
                                    : "text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                                }`}
                        >
                            {t.icon}
                            {t.k}
                        </button>
                    ))}
                </div>

                {/* Panel */}
                <div className="flex-1 flex flex-col gap-4 animate-fadeIn" key={section}>
                    {section === "Profile" && (
                        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col gap-4">
                            <h3 className="font-semibold text-stone-700 text-sm">Profile Information</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
                                    👤
                                </div>
                                <div>
                                    <p className="font-semibold text-stone-800">{name}</p>
                                    <p className="text-xs text-stone-400">{email}</p>
                                </div>
                            </div>
                            <div className="h-px bg-stone-100" />
                            {[
                                { l: "Full Name", v: name, s: setName },
                                { l: "Email Address", v: email, s: setEmail },
                            ].map((f, i) => (
                                <div key={i}>
                                    <label className="block text-xs font-semibold text-stone-400 mb-1.5">
                                        {f.l}
                                    </label>
                                    <input
                                        value={f.v}
                                        onChange={(e) => f.s(e.target.value)}
                                        className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {section === "Notifications" && (
                        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col gap-4">
                            <h3 className="font-semibold text-stone-700 text-sm">Notification Preferences</h3>
                            {[
                                { l: "Email Notifications", d: "Receive updates via email", v: emailN, on: () => setEmailN((p) => !p) },
                            ].map((n, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm font-medium text-stone-700">{n.l}</p>
                                            <p className="text-xs text-stone-400">{n.d}</p>
                                        </div>
                                        <Toggle v={n.v} on={n.on} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {section === "Appearance" && (
                        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col gap-5">
                            <h3 className="font-semibold text-stone-700 text-sm">Appearance</h3>
                            <div>
                                <label className="block text-xs font-semibold text-stone-400 mb-2">Theme</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { l: "Light", bg: "bg-white", active: true },
                                        { l: "Dark", bg: "bg-stone-800", active: false },
                                        { l: "System", bg: "bg-gradient-to-br from-white to-stone-800", active: false },
                                    ].map((t, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${t.active ? "border-orange-400" : "border-stone-200 hover:border-stone-300"
                                                }`}
                                        >
                                            <div className={`w-10 h-7 rounded-lg ${t.bg} border border-stone-200`} />
                                            <span className="text-xs font-medium text-stone-600">{t.l}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-stone-400 mb-2">Accent Color</label>
                                <div className="flex gap-2">
                                    {["bg-orange-400", "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-rose-500"].map((c, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            className={`w-8 h-8 rounded-full ${c} hover:scale-110 transition-transform ${i === 0 ? "ring-2 ring-offset-2 ring-orange-400" : ""
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500 px-1">{error}</p>}

                    <button
                        type="button"
                        onClick={save}
                        className={`py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${saved ? "bg-emerald-500 text-white" : "bg-orange-500 text-white hover:bg-orange-600"
                            }`}
                    >
                        {saved ? "✓ Changes Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}