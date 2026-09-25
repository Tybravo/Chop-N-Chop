"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Car,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

interface SavedVehicle {
  id: string;
  label: string;
  make: string;
  color: string;
  plate: string;
  isPrimary: boolean;
}

type VehicleDialog = "add" | "edit" | null;

const initialVehicles: SavedVehicle[] = [
  {
    id: "primary-vehicle",
    label: "Primary",
    make: "Mercedes-Benz ML500",
    color: "Silver",
    plate: "KJA-203XX",
    isPrimary: true,
  },
];

const emptyVehicleForm = {
  label: "",
  make: "",
  color: "",
  plate: "",
};

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<SavedVehicle[]>(initialVehicles);
  const [dialog, setDialog] = useState<VehicleDialog>(null);
  const [editingVehicle, setEditingVehicle] = useState<SavedVehicle | null>(null);
  const [menuVehicleId, setMenuVehicleId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyVehicleForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const labelInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!dialog) return;
    const focusTimer = window.setTimeout(() => labelInputRef.current?.focus(), 0);
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) setDialog(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialog, isSaving]);

  const openAddVehicle = () => {
    setDialog("add");
    setEditingVehicle(null);
    setForm(emptyVehicleForm);
    setFormError("");
    setStatusMessage("");
  };

  const openEditVehicle = (vehicle: SavedVehicle) => {
    setDialog("edit");
    setEditingVehicle(vehicle);
    setForm({
      label: vehicle.label,
      make: vehicle.make,
      color: vehicle.color,
      plate: vehicle.plate,
    });
    setMenuVehicleId(null);
    setFormError("");
    setStatusMessage("");
  };

  const closeDialog = () => {
    if (isSaving) return;
    setDialog(null);
    setEditingVehicle(null);
    setFormError("");
  };

  const submitVehicle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = form.label.trim();
    const make = form.make.trim();
    const color = form.color.trim();
    const plate = form.plate.trim();

    if (!label || !make || !plate) {
      setFormError("Label, vehicle make, and plate number are required.");
      return;
    }

    setFormError("");
    setIsSaving(true);
    saveTimerRef.current = window.setTimeout(() => {
      const nextVehicle: SavedVehicle = {
        id: dialog === "edit" && editingVehicle ? editingVehicle.id : `vehicle-${Date.now()}`,
        label,
        make,
        color,
        plate,
        isPrimary: dialog === "edit" ? editingVehicle?.isPrimary ?? false : !vehicles.some((vehicle) => vehicle.isPrimary),
      };

      setVehicles((currentVehicles) => {
        if (dialog === "edit") {
          return currentVehicles.map((vehicle) =>
            vehicle.id === nextVehicle.id ? nextVehicle : vehicle,
          );
        }
        return nextVehicle.isPrimary
          ? currentVehicles.map((vehicle) => ({ ...vehicle, isPrimary: false })).concat(nextVehicle)
          : currentVehicles.concat(nextVehicle);
      });
      setDialog(null);
      setEditingVehicle(null);
      setIsSaving(false);
      setStatusMessage(`${make} ${dialog === "edit" ? "was updated" : "was saved"} successfully.`);
    }, 600);
  };

  const setPrimaryVehicle = (vehicleId: string) => {
    setVehicles((currentVehicles) =>
      currentVehicles.map((vehicle) => ({
        ...vehicle,
        isPrimary: vehicle.id === vehicleId,
      })),
    );
    setMenuVehicleId(null);
    const vehicle = vehicles.find((item) => item.id === vehicleId);
    setStatusMessage(`${vehicle?.make ?? "Vehicle"} set as your primary vehicle.`);
  };

  const removeVehicle = (vehicleId: string) => {
    const remaining = vehicles.filter((vehicle) => vehicle.id !== vehicleId);
    const nextVehicles =
      remaining.length > 0 && !remaining.some((vehicle) => vehicle.isPrimary)
        ? remaining.map((vehicle, index) => ({ ...vehicle, isPrimary: index === 0 }))
        : remaining;
    setVehicles(nextVehicles);
    setMenuVehicleId(null);
    setStatusMessage("Saved vehicle removed.");
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
        <h1 className="min-w-0 truncate px-2 text-lg font-extrabold text-gray-900 dark:text-white">Vehicles</h1>
        <button
          type="button"
          onClick={openAddVehicle}
          aria-label="Add a saved vehicle"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FC6B31]/10 text-[#FC6B31] transition-colors hover:bg-[#FC6B31]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
        >
          <Plus className="h-5 w-5" />
        </button>
      </header>

      <main className="mx-auto w-full max-w-3xl">
        <div className="mt-6 px-2 text-[13px] text-gray-500 dark:text-gray-400">
          Saved vehicles help our staff quickly identify you during drive-thru or hub pickups.
        </div>

        {statusMessage && (
          <div role="status" className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-[13px] font-medium text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
            {statusMessage}
          </div>
        )}

        <div className="mt-6 space-y-4 px-2">
          {vehicles.length === 0 ? (
            <div role="status" className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <Car className="mb-3 h-8 w-8 text-gray-300 dark:text-zinc-700" />
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-white">No saved vehicles</h3>
              <p className="mt-1 text-[13px] text-gray-500">Add a vehicle to make pickup identification faster.</p>
              <button
                type="button"
                onClick={openAddVehicle}
                className="mt-4 flex items-center gap-2 rounded-full bg-[#FC6B31] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31]"
              >
                <Plus className="h-4 w-4" /> Add your first vehicle
              </button>
            </div>
          ) : (
            vehicles.map((vehicle) => (
              <article key={vehicle.id} className="relative overflow-visible rounded-[24px] border border-gray-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                    {vehicle.label || "Saved"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMenuVehicleId(menuVehicleId === vehicle.id ? null : vehicle.id)}
                    aria-label={`Open actions for ${vehicle.make}`}
                    aria-haspopup="menu"
                    aria-expanded={menuVehicleId === vehicle.id}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                {menuVehicleId === vehicle.id && (
                  <div
                    role="menu"
                    aria-label={`Actions for ${vehicle.make}`}
                    className="absolute right-4 top-[4.75rem] z-30 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => openEditVehicle(vehicle)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FC6B31] dark:text-gray-200 dark:hover:bg-zinc-800"
                    >
                      <Pencil className="h-4 w-4" /> Edit vehicle
                    </button>
                    {!vehicle.isPrimary && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => setPrimaryVehicle(vehicle.id)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-bold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FC6B31] dark:text-gray-200 dark:hover:bg-zinc-800"
                      >
                        <Car className="h-4 w-4" /> Set as primary
                      </button>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => removeVehicle(vehicle.id)}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] font-bold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                )}

                <div className="mt-4 flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                    <Car className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 pt-1">
                    <h4 className="break-words text-[16px] font-black leading-tight text-gray-900 dark:text-white">{vehicle.make}</h4>
                    <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
                      {vehicle.color} <span aria-hidden="true">•</span> Plate:{" "}
                      <span className="break-all">{vehicle.plate}</span>
                    </p>
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
            aria-labelledby="vehicle-dialog-title"
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl dark:bg-zinc-950 sm:rounded-[28px]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 id="vehicle-dialog-title" className="text-[18px] font-extrabold text-gray-900 dark:text-white">
                  {dialog === "add" ? "Add saved vehicle" : "Edit saved vehicle"}
                </h2>
                <p className="mt-1 text-[13px] text-gray-500">Use the details staff will see during pickup.</p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                disabled={isSaving}
                aria-label="Close vehicle form"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6B31] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submitVehicle} className="space-y-4" noValidate>
              <div>
                <label htmlFor="vehicle-label" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                  Label
                </label>
                <input
                  ref={labelInputRef}
                  id="vehicle-label"
                  type="text"
                  value={form.label}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, label: event.target.value }));
                    setFormError("");
                  }}
                  aria-invalid={Boolean(formError)}
                  placeholder="Primary, weekend car, or family car"
                  className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="vehicle-make" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                    Make and model
                  </label>
                  <input
                    id="vehicle-make"
                    type="text"
                    value={form.make}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, make: event.target.value }));
                      setFormError("");
                    }}
                    placeholder="Mercedes-Benz ML500"
                    className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="vehicle-color" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                    Color
                  </label>
                  <input
                    id="vehicle-color"
                    type="text"
                    value={form.color}
                    onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))}
                    placeholder="Silver"
                    className="w-full rounded-[18px] border border-gray-200 bg-white px-4 py-4 text-[15px] font-bold text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#FC6B31] dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="vehicle-plate" className="mb-1.5 block text-[13px] font-bold text-gray-700 dark:text-gray-200">
                  Plate number
                </label>
                <input
                  id="vehicle-plate"
                  type="text"
                  value={form.plate}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, plate: event.target.value }));
                    setFormError("");
                  }}
                  placeholder="KJA-203XX"
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
                  "Save vehicle"
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
