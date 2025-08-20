import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@amy/ui'

export default function SkillsManagement() {
  const { data: skills = [], isLoading } = useSkills()
  const createSkill = useCreateSkill()
  const updateSkill = useUpdateSkill()
  const deleteSkill = useDeleteSkill()

  const [form, setForm] = useState({ slug: '', label: '', category: 'LANG' as const })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end space-x-2">
        <div className="grid grid-cols-3 gap-2 w-full">
          <Input placeholder="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input placeholder="label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <select className="border rounded-md h-10 px-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
            {['LANG', 'FRAMEWORK', 'DB', 'CLOUD', 'TOOL', 'SOFT', 'CERT', 'DOMAIN'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Button onClick={() => createSkill.mutate(form)} disabled={createSkill.isPending}>Add</Button>
      </div>

      <div className="grid gap-3">
        {skills.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">{s.label}</span>
              <span className="text-xs text-muted-foreground">@{s.slug}</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{s.category}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => updateSkill.mutate({ id: s.id, data: { label: s.label + '' } })}>Save</Button>
              <Button variant="outline" size="sm" onClick={() => deleteSkill.mutate(s.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


