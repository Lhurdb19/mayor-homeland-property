// pages/admin/about.tsx
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout"; // your admin layout
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { LucideFacebook, LucideInstagram, LucideLinkedin, LucideTwitter } from "lucide-react";


type TeamMember = {
    id: string;
    name: string;
    role: string;
    image: string;
    preview?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
};


export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [foundedYear, setFoundedYear] = useState("");
    const [foundedLocation, setFoundedLocation] = useState("");
    const [mission, setMission] = useState("");
    const [vision, setVision] = useState("");
    const [story, setStory] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerImage, setOwnerImage] = useState<string>(""); // base64 or url
    const [ownerPreview, setOwnerPreview] = useState<string>("");

    const [savedAbout, setSavedAbout] = useState<any>(null);

    const [bannerImage, setBannerImage] = useState<string>("");
    const [bannerPreview, setBannerPreview] = useState<string>("");

    const [team, setTeam] = useState<TeamMember[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/admin/about");
                const json = await res.json();
                if (res.ok && json.data) {
                    const a = json.data;
                    setFoundedYear(a.foundedYear || "");
                    setFoundedLocation(a.foundedLocation || "");
                    setMission(a.mission || "");
                    setVision(a.vision || "");
                    setStory(a.story || "");
                    setOwnerName(a.ownerName || "");
                    setOwnerImage(a.ownerImage || "");
                    setOwnerPreview(a.ownerImage || "");
                    setBannerImage(a.bannerImage || "");
                    setBannerPreview(a.bannerImage || "");
                    const teamMembers = (a.team || []).map((m: any, idx: number) => ({
                        id: String(idx) + "-" + (m.name || ""),
                        name: m.name || "",
                        role: m.role || "",
                        image: m.image || "",
                        preview: m.image || "",
                    }));
                    setTeam(teamMembers);
                    setSavedAbout(json.data);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load about data");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const fileToDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });

    const handleOwnerFile = async (f?: File) => {
        if (!f) return;
        const d = await fileToDataUrl(f);
        setOwnerImage(d);
        setOwnerPreview(d);
    };

    const handleBannerFile = async (f?: File) => {
        if (!f) return;
        const d = await fileToDataUrl(f);
        setBannerImage(d);
        setBannerPreview(d);
    };

    const addTeamMember = () => {
        setTeam((t) => [...t, { id: crypto.randomUUID?.() ?? Date.now().toString(), name: "", role: "", image: "", preview: "" }]);
    };
    const removeTeamMember = (id: string) => setTeam((t) => t.filter((m) => m.id !== id));
    const updateTeamMember = (id: string, patch: Partial<TeamMember>) =>
        setTeam((t) => t.map((m) => (m.id === id ? { ...m, ...patch } : m)));

    const handleTeamFile = async (id: string, f?: File) => {
        if (!f) return;
        const d = await fileToDataUrl(f);
        updateTeamMember(id, { image: d, preview: d });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                foundedYear,
                foundedLocation,
                mission,
                vision,
                story,
                ownerName,
                ownerImage, // dataURL or url
                bannerImage,
                team: team.map((m) => ({
                    name: m.name,
                    role: m.role,
                    image: m.image,
                    facebook: m.facebook || "",
                    instagram: m.instagram || "",
                    twitter: m.twitter || "",
                    linkedin: m.linkedin || "",
                })),
            };

            const res = await fetch("/api/admin/about", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to save");

            const saved = data.data; // <-- FIRST define saved

            // Now update the saved section
            setSavedAbout(saved);

            // Clear form
            setFoundedYear("");
            setFoundedLocation("");
            setMission("");
            setVision("");
            setStory("");
            setOwnerName("");
            setOwnerImage("");
            setOwnerPreview("");
            setBannerImage("");
            setBannerPreview("");
            setTeam([]);

            // Update previews
            setOwnerImage(saved.ownerImage || "");
            setOwnerPreview(saved.ownerImage || "");
            setBannerImage(saved.bannerImage || "");
            setBannerPreview(saved.bannerImage || "");

            setTeam(
                saved.team?.map((m: any, i: number) => ({
                    id: `saved-${i}`,
                    name: m.name,
                    role: m.role,
                    image: m.image,
                    preview: m.image,
                    facebook: m.facebook || "",
                    instagram: m.instagram || "",
                    twitter: m.twitter || "",
                    linkedin: m.linkedin || "",
                })) || []
            );
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto py-12">
                <h2 className="text-2xl font-semibold mb-6">About Page (Admin)</h2>

                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-12 w-48" />
                    </div>
                ) : (
                    <Card className="p-6 space-y-6">
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Founded Year</label>
                                    <Input value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} placeholder="e.g. 2018" className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Founded Location</label>
                                    <Input value={foundedLocation} onChange={(e) => setFoundedLocation(e.target.value)} placeholder="City, Country" className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Mission</label>
                                <Textarea value={mission} onChange={(e) => setMission(e.target.value)} placeholder="Short mission statement" className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0" />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Vision</label>
                                <Textarea value={vision} onChange={(e) => setVision(e.target.value)} placeholder="Vision statement" className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0" />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Our Story (detailed)</label>
                                <Textarea value={story} onChange={(e) => setStory(e.target.value)} placeholder="Longer company story" className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div>
                                    <label className="text-sm font-medium">Owner / Founder Name</label>
                                    <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Owner name" className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
                                    <div className="mt-3 flex items-center gap-4">
                                        <div className="w-28 h-28 rounded overflow-hidden bg-gray-100 border">
                                            {ownerPreview ? <img src={ownerPreview} alt="owner" className="w-full h-full object-cover" /> : <div className="p-3 text-sm text-gray-500">No image</div>}
                                        </div>
                                        <input
                                            onChange={async (e) => {
                                                const f = e.target.files?.[0];
                                                if (f) await handleOwnerFile(f);
                                            }}
                                            accept="image/*"
                                            type="file"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Banner Image</label>
                                    <div className="mt-3 flex items-center gap-4">
                                        <div className="w-full h-28 rounded overflow-hidden bg-gray-100 border">
                                            {bannerPreview ? <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" /> : <div className="p-3 text-sm text-gray-500">No image</div>}
                                        </div>
                                        <input
                                            onChange={async (e) => {
                                                const f = e.target.files?.[0];
                                                if (f) await handleBannerFile(f);
                                            }}
                                            accept="image/*"
                                            type="file"
                                            className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Team */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Team Members</label>
                                    <Button onClick={addTeamMember} variant="outline">Add Member</Button>
                                </div>

                                <div className="space-y-3 mt-3">
                                    {team.map((m) => (
                                        <div key={m.id} className="flex gap-3 items-center border rounded p-3">
                                            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                                                {m.preview ? <img src={m.preview} className="w-full h-full object-cover" /> : <div className="p-2 text-xs text-gray-500">No image</div>}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                <Input placeholder="Name"
                                                    value={m.name}
                                                    onChange={(e) => updateTeamMember(m.id, { name: e.target.value })} 
                                                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                                                    />

                                                <Input placeholder="Role"
                                                    value={m.role}
                                                    onChange={(e) => updateTeamMember(m.id, { role: e.target.value })} 
                                                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                                                    />

                                                <Input placeholder="Facebook URL"
                                                    value={m.facebook || ""}
                                                    onChange={(e) => updateTeamMember(m.id, { facebook: e.target.value })} 
                                                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                                                    />

                                                <Input placeholder="Instagram URL"
                                                    value={m.instagram || ""}
                                                    onChange={(e) => updateTeamMember(m.id, { instagram: e.target.value })} 
                                                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                                                    />

                                                <Input placeholder="Twitter URL"
                                                    value={m.twitter || ""}
                                                    onChange={(e) => updateTeamMember(m.id, { twitter: e.target.value })} 
                                                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                                                    />

                                                <Input placeholder="LinkedIn URL"
                                                    value={m.linkedin || ""}
                                                    onChange={(e) => updateTeamMember(m.id, { linkedin: e.target.value })} 
                                                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                                                    />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <input
                                                    onChange={async (e) => {
                                                        const f = e.target.files?.[0];
                                                        if (f) await handleTeamFile(m.id, f);
                                                    }}
                                                    accept="image/*"
                                                    type="file"
                                                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                                                />
                                                <Button variant="destructive" onClick={() => removeTeamMember(m.id)}>Remove</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving..." : "Save About"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>


                )}
                {savedAbout && (
                    <Card className="mt-10 p-6 space-y-4">
                        <CardHeader>
                            <CardTitle>Saved About Page Preview</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold">Founded</h3>
                                <p>{savedAbout.foundedYear} — {savedAbout.foundedLocation}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Mission</h3>
                                <p className="text-gray-700">{savedAbout.mission}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Vision</h3>
                                <p className="text-gray-700">{savedAbout.vision}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Our Story</h3>
                                <p className="text-gray-700 whitespace-pre-line">{savedAbout.story}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Owner / Founder</h3>
                                <p className="font-medium">{savedAbout.ownerName}</p>
                                {savedAbout.ownerImage && (
                                    <img
                                        src={savedAbout.ownerImage}
                                        className="w-32 h-32 object-cover rounded mt-3"
                                    />
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Banner</h3>
                                {savedAbout.bannerImage && (
                                    <img
                                        src={savedAbout.bannerImage}
                                        className="w-full max-h-48 object-cover rounded"
                                    />
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {savedAbout.team?.map((m: any, i: number) => (
                                        <div key={i} className="border rounded p-3">
                                            <img
                                                src={m.image}
                                                className="w-full h-32 object-cover rounded mb-2"
                                            />
                                            <p className="font-semibold">{m.name}</p>
                                            <p className="text-sm text-gray-600">{m.role}</p>
                                            <div className="flex gap-3 mt-2">
                                                {m.facebook && (
                                                    <a href={m.facebook} target="_blank" rel="noopener noreferrer">
                                                        <LucideFacebook className="text-blue-600 text-xl" />
                                                    </a>
                                                )}

                                                {m.instagram && (
                                                    <a href={m.instagram} target="_blank">
                                                        <LucideInstagram className="text-pink-500 text-xl" />
                                                    </a>
                                                )}

                                                {m.twitter && (
                                                    <a href={m.twitter} target="_blank">
                                                        <LucideTwitter className="text-sky-500 text-xl" />
                                                    </a>
                                                )}

                                                {m.linkedin && (
                                                    <a href={m.linkedin} target="_blank">
                                                        <LucideLinkedin className="text-blue-700 text-xl" />
                                                    </a>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

            </div>
        </AdminLayout>
    );
}
