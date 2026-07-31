import { accent, type AccentKey } from "@/utils/accentColors";

export interface DataTableColumn {
  key: string; // matches a key in each row object
  label: string; // real column header text shown to the reader
}

// A real, literal spreadsheet-style table — rows and columns, exactly how
// a real database table (or a real query result) actually looks. Used
// specifically so relational data (which row points at which other row,
// what a JOIN result actually contains) is SEEN, not just described in a
// bespoke card/box diagram. See co-founder/build-conventions.md.
export default function DataTable({
  caption,
  columns,
  rows,
  accentKey = "cyan",
}: {
  caption: string;
  columns: DataTableColumn[];
  rows: Record<string, string | number>[];
  accentKey?: AccentKey;
}) {
  const colors = accent[accentKey];
  return (
    <div className="rounded-card border border-border bg-surface-raised overflow-x-auto my-2 inline-block max-w-full align-top">
      <div className={`text-xs font-semibold px-3 py-2 border-b border-border ${colors.text}`}>{caption}</div>
      <table className="text-xs border-collapse">
        <thead>
          <tr className="bg-surface">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-3 py-1.5 text-sublabel font-mono font-semibold border-b border-border whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-1.5 font-mono text-body whitespace-nowrap">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
