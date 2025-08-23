import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@amy/ui'

// Configuration
const SKILL_CATEGORIES = [
  'LANG', 'FRAMEWORK', 'DB', 'CLOUD', 'TOOL', 'SOFT', 'CERT', 'DOMAIN'
] as const

type SkillForm = {
  slug: string
  label: string
  category: typeof SKILL_CATEGORIES[number]
}

// Reusable components
const SkillForm = ({ 
  form, 
  setForm, 
  onSubmit, 
  isPending 
}: {
  form: SkillForm
  setForm: (form: SkillForm) => void
  onSubmit: () => void
  isPending: boolean
}) => (
  <div className="flex items-end space-x-2">
    <div className="grid grid-cols-3 gap-2 w-full">
      <Input 
        placeholder="slug" 
        value={form.slug} 
        onChange={(e) => setForm({ ...form, slug: e.target.value })} 
      />
      <Input 
        placeholder="label" 
        value={form.label} 
        onChange={(e) => setForm({ ...form, label: e.target.value })} 
      />
      <select 
        className="border rounded-md h-10 px-3" 
        value={form.category} 
        onChange={(e) => setForm({ ...form, category: e.target.value as typeof SKILL_CATEGORIES[number] })}
      >
        {SKILL_CATEGORIES.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
    <Button onClick={onSubmit} disabled={isPending}>Add</Button>
  </div>
)

const SkillItem = ({ 
  skill, 
  onUpdate, 
  onDelete 
}: {
  skill: any
  onUpdate: () => void
  onDelete: () => void
}) => (
  <div className="flex items-center justify-between p-3 border rounded-md">
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium">{skill.label}</span>
      <span className="text-xs text-muted-foreground">@{skill.slug}</span>
      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{skill.category}</span>
    </div>
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" onClick={onUpdate}>Save</Button>
      <Button variant="outline" size="sm" onClick={onDelete}>Delete</Button>
    </div>
  </div>
)

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600" />
  </div>
)

export default function SkillsManagement() {
  const { data: skills = [], isLoading } = useSkills()
  const createSkill = useCreateSkill()
  const updateSkill = useUpdateSkill()
  const deleteSkill = useDeleteSkill()

  const [form, setForm] = useState<SkillForm>({ 
    slug: '', 
    label: '', 
    category: 'LANG' 
  })

  const handleCreateSkill = () => {
    createSkill.mutate(form)
    setForm({ slug: '', label: '', category: 'LANG' })
  }

  const handleUpdateSkill = (skill: any) => {
    updateSkill.mutate({ 
      id: skill.id, 
      data: { label: skill.label + '' } 
    })
  }

  const handleDeleteSkill = (skillId: string) => {
    deleteSkill.mutate(skillId)
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <SkillForm
        form={form}
        setForm={setForm}
        onSubmit={handleCreateSkill}
        isPending={createSkill.isPending}
      />

      <div className="grid gap-3">
        {skills.map((skill) => (
          <SkillItem
            key={skill.id}
            skill={skill}
            onUpdate={() => handleUpdateSkill(skill)}
            onDelete={() => handleDeleteSkill(skill.id)}
          />
        ))}
      </div>
    </div>
  )
}


