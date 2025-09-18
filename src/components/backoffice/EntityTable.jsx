import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/GlassCard";
import { Pencil, Plus, Eye } from "lucide-react";

const preferredFields = ["name","title","email","status","category","priority","role"];

function deriveColumns(schema) {
  const props = schema?.properties || {};
  const keys = Object.keys(props).filter(k => !["id","created_date","updated_date","created_by"].includes(k));
  const ordered = [...preferredFields.filter(k => keys.includes(k)), ...keys.filter(k => !preferredFields.includes(k))];
  // keep first 5 columns
  return ordered.slice(0, 5);
}

function Cell({ v }) {
  if (v === null || typeof v === "undefined") return <span className="text-gray-400">—</span>;
  if (Array.isArray(v)) return <span className="text-gray-700">{v.join(", ")}</span>;
  if (typeof v === "object") return <span className="text-gray-500 text-xs">{JSON.stringify(v)}</span>;
  return <span className="text-gray-800">{String(v)}</span>;
}

export default function EntityTable({ entityName, sdk, schema, onCreate, onView, onEdit }) {
  const [items, setItems] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const cols = React.useMemo(() => deriveColumns(schema), [schema]);

  const load = React.useCallback(async () => {
    setLoading(true);
    const list = await sdk.list({orderBy: ['updated_date', 'desc']});
    setItems(list || []);
    setLoading(false);
  }, [sdk]);

  React.useEffect(() => { load(); }, [load]);

  const filtered = items.filter((it) => {
    if (!query) return true;
    const str = JSON.stringify(it).toLowerCase();
    return str.includes(query.toLowerCase());
  });

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-800">{entityName} ({items.length})</div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search..." value={query} onChange={(e)=>setQuery(e.target.value)} className="h-9 bg-white/70 border-white/70" />
          <Button onClick={onCreate} className="h-9 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-1" /> New
          </Button>
        </div>
      </div>

      <div className="w-full overflow-auto rounded-lg border border-white/60 bg-white/60 backdrop-blur">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              {cols.map((c) => <th key={c} className="px-3 py-2 border-b border-white/70">{c}</th>)}
              <th className="px-3 py-2 border-b border-white/70 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={cols.length+1} className="px-3 py-8 text-center text-gray-500">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={cols.length+1} className="px-3 py-8 text-center text-gray-500">No data</td></tr>
            ) : filtered.map((row) => (
              <tr key={row.id} className="hover:bg-white/70">
                {cols.map((c) => (
                  <td key={c} className="px-3 py-2 border-b border-white/60"><Cell v={row[c]} /></td>
                ))}
                <td className="px-3 py-2 border-b border-white/60">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={()=>onView(row)}><Eye className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={()=>onEdit(row)}><Pencil className="w-4 h-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
