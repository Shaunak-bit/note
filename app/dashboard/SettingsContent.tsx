import React, { useState, useEffect } from "react";
import { User as UserIcon, Bell, Palette } from "lucide-react";
import { updateSettings, getSettings, updateUsers } from "../lib/api";

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
    // 1. Initial Local State
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [emailN, setEmailN] = useState(true);
    const [section, setSection] = useState("Profile");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    // 2. Fix for Minified Error #418 (Hydration Mismatch)
    // This ensures the component only renders logic-heavy parts on the client.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 3. Sync Local State with Parent State
    // Without this, when you call setUser(), the inputs won't update!
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    // 4. Fetch Initial Settings
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

            const res = await updateUsers(name, email);
            if (res.success) {
                // This updates the global 'user' object
                setUser(res.data);
                showSaved();
            } else {
                setError(res.message || "Failed to update profile.");
            }

        } else if (section === "Notifications") {
            const res = await updateSettings({ emailNotifications: emailN });
            if (res.success) {
                showSaved();
            } else {
                setError(res.message || "Failed to update settings.");
            }
        }
    };

    // Prevent hydration errors by returning null (or a loader) until mounted
    if (!isMounted) return null;

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
        { k: "Profile", icon: <UserIcon size={15} /> },
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
                                    {/* These now update immediately because of the [user] useEffect */}
                                    <p className="font-semibold text-stone-800">{user?.name || name}</p>
                                    <p className="text-xs text-stone-400">{user?.email || email}</p>
                                </div>
                            </div>
                            <div className="h-px bg-stone-100" />

                            <div>
                                <label className="block text-xs font-semibold text-stone-400 mb-1.5">Full Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-stone-400 mb-1.5">Email Address</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 transition"
                                />
                            </div>
                        </div>
                    )}

                    {section === "Notifications" && (
                        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col gap-4">
                            <h3 className="font-semibold text-stone-700 text-sm">Notification Preferences</h3>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="text-sm font-medium text-stone-700">Email Notifications</p>
                                    <p className="text-xs text-stone-400">Receive updates via email</p>
                                </div>
                                <Toggle v={emailN} on={() => setEmailN(!emailN)} />
                            </div>
                        </div>
                    )}

                    {section === "Appearance" && (
                        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm flex flex-col gap-5">
                            <h3 className="font-semibold text-stone-700 text-sm">Appearance</h3>
                            <p className="text-xs text-stone-400 italic">Appearance settings are currently read-only.</p>
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