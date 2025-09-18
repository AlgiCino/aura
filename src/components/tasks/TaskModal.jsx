import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "blocked", label: "Blocked" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const categoryOptions = [
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "database", label: "Database" },
  { value: "deployment", label: "Deployment" },
  { value: "design", label: "Design" },
  { value: "testing", label: "Testing" },
  { value: "documentation", label: "Documentation" },
];

export default function TaskModal({ open, onClose, onSubmit, task, phases }) {
  const defaultState = {
    phase_id: phases?.[0]?.id || "",
    title: "",
    description: "",
    category: "backend",
    status: "todo",
    priority: "medium",
    estimated_hours: "",
    due_date: "",
    tags: "",
    notes: ""
  };

  const [form, setForm] = useState(defaultState);
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({
        phase_id: task.phase_id || phases?.[0]?.id || "",
        title: task.title || "",
        description: task.description || "",
        category: task.category || "backend",
        status: task.status || "todo",
        priority: task.priority || "medium",
        estimated_hours: task.estimated_hours ?? "",
        due_date: task.due_date || "",
        tags: Array.isArray(task.tags) ? task.tags.join(", ") : (task.tags || ""),
        notes: task.notes || ""
      });
    } else {
      setForm(defaultState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task]);

  const phaseSelect = useMemo(() => (phases || []).map(p => ({ value: p.id, label: p.name ? `Phase ${p.phase_number || ""}: ${p.name}` : p.id })), [phases]);

  const save = (e) => {
    e?.preventDefault?.();
    const payload = {
      ...form,
      estimated_hours: form.estimated_hours === "" ? undefined : Number(form.estimated_hours),
      tags: (form.tags || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
    };
    onSubmit(payload, task);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-gray-900">{task ? "Edit Task" : "New Task"}</div>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Close</button>
        </div>

        <form onSubmit={save} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700">Phase</label>
              <Select value={form.phase_id} onValueChange={v => setForm({ ...form, phase_id: v })}>
                <SelectTrigger className="bg-white/70 border-white/70">
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  {phaseSelect.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Status</label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger className="bg-white/70 border-white/70">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-white/70 border-white/70" placeholder="Task title" />
          </div>

          <div>
            <label className="text-sm text-gray-700">Description</label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/70 border-white/70 min-h-[80px]" placeholder="Task description" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-700">Category</label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-white/70 border-white/70">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Priority</label>
              <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                <SelectTrigger className="bg-white/70 border-white/70">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-700">Estimated hours</label>
              <Input type="number" min="0" step="0.5" value={form.estimated_hours} onChange={(e) => setForm({ ...form, estimated_hours: e.target.value })} className="bg-white/70 border-white/70" placeholder="e.g., 4" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-700">Due date</label>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className="w-full justify-start bg-white/70 border-white/70">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {form.due_date ? format(new Date(form.due_date), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={form.due_date ? new Date(form.due_date) : undefined}
                    onSelect={(d) => {
                      setForm({ ...form, due_date: d ? new Date(d).toISOString() : "" });
                      setDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-sm text-gray-700">Tags (comma-separated)</label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="bg-white/70 border-white/70" placeholder="e.g., api, dashboard" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700">Notes</label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-white/70 border-white/70 min-h-[60px]" placeholder="Internal notes" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{task ? "Update Task" : "Create Task"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}