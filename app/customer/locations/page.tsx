"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  note: string;
  isPrimary: boolean;
}

type LocationDialog = "add" | "edit" | null;

const initialLocations: SavedLocation[] = [
  {
    id: "primary-hub",
    name: "Victoria Island Hub",
    address: "Floor 4, Corporate Tower Reception Drop Zone.",
    note: "Call upon arrival",
    isPrimary: true,
  },
  {
    id: "residential-hub",
    name: "Residential Drop",
    address: "Lekki Phase 1, Gate 3, Street 42.",
    note: "Leave with security",
    isPrimary: false,
  },
];

const emptyLocationForm = {
  name: "",
  address: "",
  note: "",
};

export default function LocationsPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<SavedLocation[]>(initialLocations);
  const [dialog, setDialog] = useState<LocationDialog>(null);
  const [editingLocation, setEditingLocation] = useState<SavedLocation | null>(null);
  const [menuLocationId, setMenuLocationId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLocationForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!dialog) return;
    const focusTimer = window.setTimeout(() => nameInputRef.current?.focus(), 0);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) setDialog(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialog, isSaving]);

  const openAddLocation = () => {
    setDialog("add");
    setEditingLocation(null);
    setForm(emptyLocationForm);
    setFormError("");
    setStatusMessage("");
  };

  const openEditLocation = (location: SavedLocation) => {
    setDialog("edit");
    setEditingLocation(location);
    setForm({
      name: location.name,
      address: location.address,
      note: location.note,
    });
    setMenuLocationId(null);
    setFormError("");
    setStatusMessage("");
  };

  const closeDialog = () => {
    if (isSaving) return;
    setDialog(null);
    setEditingLocation(null);
    setFormError("");
  };

  const submitLocation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const address = form.address.trim();
    const note = form.note.trim();

    if (!name || !address) {
      setFormError("Hub name and address are required.");
      return;
    }

    setFormError("");
    setIsSaving(true);
    saveTimerRef.current = window.setTimeout(() => {
      const nextLocation: SavedLocation = {
        id: dialog === "edit" && editingLocation ? editingLocation.id : `location-${Date.now()}`,
        name,
        address,
        note,
        isPrimary: dialog === "edit" ? editingLocation?.isPrimary ?? false : !locations.some((location) => location.isPrimary),
      };

      setLocations((currentLocations) => {
        if (dialog === "edit") {
          return currentLocations.map((location) =>
            location.id === nextLocation.id ? nextLocation : location,
          );
        }
        return nextLocation.isPrimary
          ? currentLocations.map((location) => ({ ...location, isPrimary: false })).concat(nextLocation)
          : currentLocations.concat(nextLocation);
      });
      setDialog(null);
      setEditingLocation(null);
      setIsSaving(false);
      setStatusMessage(`${name} ${dialog === "edit" ? "was updated" : "was saved"} successfully.`);
    }, 600);
  };

  const setPrimaryLocation = (locationId: string) => {
    setLocations((currentLocations) =>
      currentLocations.map((location) => ({
        ...location,
        isPrimary: location.id === locationId,
      })),
    );
    setMenuLocationId(null);
    const location = locations.find((item) => item.id === locationId);
    setStatusMessage(`${location?.name ?? "Location"} set as your primary hub.`);
  };

  const removeLocation = (locationId: string) => {
    const remaining = locations.filter((location) => location.id !== locationId);
    const nextLocations =
      remaining.length > 0 && !remaining.some((location) => location.isPrimary)
        ? remaining.map((location, index) => ({ ...location, isPrimary: index === 0 }))
        : remaining;
    setLocations(nextLocations);
    setMenuLocationId(null);
    setStatusMessage("Saved hub removed.");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-[112px] pt-4 dark:bg-zinc-950 md:pb-16">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Saved Hubs</h1>
        <button
          type="button"
          onClick={openAddLocation}
          aria-label="Add a saved hub"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FC6B31]/10 text-[#FC6B31] transition-colors hover:bg-[#FC6B31]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      <main className="mx-auto w-full max-w-3xl">
        {statusMessage && (
          <div role="status" className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-[13px] font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
            {statusMessage}
          </div>
        )}

        <div className="mt-6 space-y-4">
          {locations.length === 0 ? (
            <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <MapPin className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">No saved hubs</h3>
              <p className="mt-1 text-[13px] text-gray-500">Add a home, office, or regular drop-off location.</p>
              <button
                type="button"
                onClick={openAddLocation}
                className="mt-4 flex items-center gap-2 rounded-full bg-[#FC6B31] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
              >
                <Plus className="h-4 w-4" /> Add your first hub
              </button>
            </div>
          ) : (
            locations.map((location) => (
              <article
                key={location.id}
                className={`relative rounded-[24px] border p-5 shadow-sm dark:p-5 ${
                  location.isPrimary
                    ? "border-2 border-[#FC6B31] bg-orange-50/50 dark:border-[#FC6B31]/50 dark:bg-orange-950/10"
                    : "border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
                      location.isPrimary
                        ? "bg-white text-[#FC6B31] dark:bg-zinc-900"
                        : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400"
                    }`}
                  >
                    {location.isPrimary ? "Primary" : "Saved"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMenuLocationId(menuLocationId === location.id ? null : location.id)}
                    aria-label={`Open actions for ${location.name}`}
                    aria-haspopup="menu"
                    aria-expanded={menuLocationId === location.id}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                {menuLocationId === location.id && (
                  <div
                    role="menu"
                    aria-label={`Actions for ${location.name}`}
                    className="absolute right-4 top-[4.75rem] z-30 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => openEditLocation(location)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FC6B31] dark:text-gray-200 dark:hover:bg-zinc-800"
                    >
                      <Pencil className="h-4 w-4" /> Edit hub
                    </button>
                    {!location.isPrimary && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => setPrimaryLocation(location.id)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FC6B31] dark:text-gray-200 dark:hover:bg-zinc-800"
                      >
                        <MapPin className="h-4 w-4" /> Set as primary
                      </button>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => removeLocation(location.id)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-bold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                )}

                <div className="mt-3 flex gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    location.isPrimary ? "bg-[#FC6B31] text-white" : "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400"
                  }`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="break-words text-[15px] font-bold text-gray-900 dark:text-white">{location.name}</h4>
                    <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">{location.address}</p>
                    {location.note && (
                      <p
                        className={`mt-3 inline-block rounded-lg px-3 py-1.5 text-[12px] font-medium ${
                          location.isPrimary
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-gray-50 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
                        }`}
                      >
                        Note: {location.note}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {dialog && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-dialog-title"
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-zinc-950 sm:rounded-[28px]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="location-dialog-title" className="text-[18px] font-extrabold text-gray-900 dark:text-white">
                  {dialog === "add" ? "Add saved hub" : "Edit saved hub"}
                </h2>
                <p className="mt-1 text-[13px] text-gray-500">Keep delivery instructions clear and easy to find.</p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                disabled={isSaving}
                aria-label="Close location form"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitLocation} className="space-y-4" noValidate>
              <div>
                <label htmlFor="location-name" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                  Hub name
                </label>
                <input
                  ref={nameInputRef}
                  id="location-name"
                  type="text"
                  value={form.name}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, name: event.target.value }));
                    setFormError("");
                  }}
                  aria-invalid={Boolean(formError)}
                  placeholder="Office, home, or other label"
                  className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="location-address" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                  Address
                </label>
                <textarea
                  id="location-address"
                  rows={3}
                  value={form.address}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, address: event.target.value }));
                    setFormError("");
                  }}
                  placeholder="Building, gate, floor, or landmark"
                  className="w-full resize-none rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="location-note" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                  Delivery note <span className="font-medium text-gray-400">(optional)</span>
                </label>
                <input
                  id="location-note"
                  type="text"
                  value={form.note}
                  onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                  placeholder="Leave with security"
                  className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
              {formError && (
                <p role="alert" className="text-[12px] font-medium text-red-600 dark:text-red-400">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#FC6B31] py-4 text-[14px] font-extrabold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : dialog === "add" ? (
                  "Save hub"
                ) : (
                  "Save changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
