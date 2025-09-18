import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function fieldType(key, def) {
  if (!def) return "text";
  if (def.enum && Array.isArray(def.enum)) return "enum";
  if (def.type === "boolean") return "boolean";
  if (def.type === "number" || def.type === "integer") return "number";
  if (def.type === "array") return "array";
  if (def.type === "string" && (def.format === "date" || key.toLowerCase().includes("date"))) return "date";
  if (def.type === "string" && (key.toLowerCase().includes("description") || key.toLowerCase().includes("notes"))) return "textarea";
  return "text";
}

export default function EntityForm({ schema, initial = {}, onSubmit, onCancel, submitLabel = "Save" }) {
  const [data, setData] = React.useState(() => {
    const d = { ...initial };
    // Normalize arrays to comma-separated for editing
    Object.entries(schema?.properties || {}).forEach(([k, def]) => {
      if (def?.type === "array" && Array.isArray(d[k])) d[k] = d[k].join(", ");
    });
    return d;
  });

  const required = new Set(schema?.required || []);

  const handleChange = (k, v, def) => {
    if (def?.type === "number" || def?.type === "integer") {
      const num = v === "" ? "" : Number(v);
      setData((p) => ({ ...p, [k]: num }));
    } else if (def?.type === "array") {
      // Keep as string in state; convert on submit
      setData((p) => ({ ...p, [k]: v }));
    } else {
      setData((p) => ({ ...p, [k]: v }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const out = { ...data };
    // Convert comma-separated arrays back
    Object.entries(schema?.properties || {}).forEach(([k, def]) => {
      if (def?.type === "array") {
        const raw = out[k];
        if (typeof raw === "string") {
          out[k] = raw.split(",").map(s => s.trim()).filter(Boolean);
        }
      }
    });
    onSubmit(out);
  };

  if (!schema) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {Object.entries(schema.properties || {})
        .filter(([k]) => !["id", "created_date", "updated_date", "created_by"].includes(k))
        .map(([k, def]) => {
          const t = fieldType(k, def);
          const value = data[k] ?? (def?.default ?? "");
          return (
            <div key={k} className="space-y-1.5">
              <label className="text-sm text-gray-700">
                {k} {required.has(k) && <span className="text-rose-500">*</span>}
              </label>
              {t === "enum" ? (
                <Select value={String(value)} onValueChange={(v) => handleChange(k, v, def)}>
                  <SelectTrigger className="bg-white/70 border-white/70"><SelectValue placeholder={k} /></SelectTrigger>
                  <SelectContent>
                    {def.enum.map((opt) => (<SelectItem key={String(opt)} value={String(opt)}>{String(opt)}</SelectItem>))}
                  </SelectContent>
                </Select>
              ) : t === "boolean" ? (
                <div className="flex items-center gap-2">
                  <Switch checked={!!value} onCheckedChange={(v)=>handleChange(k, v, def)} />
                  <span className="text-sm text-gray-600">{value ? "true" : "false"}</span>
                </div>
              ) : t === "number" ? (
                <Input type="number" value={value === "" ? "" : Number(value)} onChange={(e)=>handleChange(k, e.target.value, def)} className="bg-white/70 border-white/70" />
              ) : t === "date" ? (
                <Input type="date" value={value ? String(value).slice(0,10) : ""} onChange={(e)=>handleChange(k, e.target.value, def)} className="bg-white/70 border-white/70" />
              ) : t === "textarea" ? (
                <Textarea value={value || ""} onChange={(e)=>handleChange(k, e.target.value, def)} className="bg-white/70 border-white/70 min-h-[90px]" />
              ) : t === "array" ? (
                <Input placeholder="item1, item2, ..." value={value || ""} onChange={(e)=>handleChange(k, e.target.value, def)} className="bg-white/70 border-white/70" />
              ) : (
                <Input value={value || ""} onChange={(e)=>handleChange(k, e.target.value, def)} className="bg-white/70 border-white/70" />
              )}
            </div>
          );
        })}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">{submitLabel}</Button>
      </div>
    </form>
  );
}