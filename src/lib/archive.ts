export const ARCHIVE_CATEGORIES = [
  { key: "roms", label: "ROMs" },
  { key: "kernels", label: "Kernels" },
  { key: "modules", label: "Modules" },
  { key: "ota", label: "X7 Max" },
  { key: "ota_cn", label: "GT Neo" },
  { key: "ota_cnf", label: "GT Neo Flash" },
  { key: "firmware", label: "Firmware" },
  { key: "sptool", label: "SP Tool" },
  { key: "recovery", label: "Recovery" },
  { key: "other", label: "Other" },
] as const;

export type ArchiveCategory = (typeof ARCHIVE_CATEGORIES)[number];
export type CategoryKey = ArchiveCategory["key"];

export function isArchiveDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return (
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === value
  );
}

export function formatArchiveDate(value: string): string {
  if (!isArchiveDate(value)) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function formatVersion(value?: string): string {
  if (typeof value !== "string" || value.trim() === "") return "—";
  const version = value.trim();
  return /^\d/.test(version) ? `v${version}` : version;
}

export function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[\s._/-]+/g, "");
}
