import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@amy/ui'
import { useCreateCandidateForm } from '@amy/ui'
import { toast } from 'sonner'
import { Layout } from '@/components/layout'
import { ArrowLeft, Save, X } from 'lucide-react'

export function NewCandidatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useCreateCandidateForm()

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // This would call the API to create a candidate
      console.log('Creating candidate:', data)
      toast.success('Candidate created successfully!')
      navigate({ to: '/candidates' })
    } catch (error) {
      toast.error('Failed to create candidate')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/candidates' })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Candidates
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">New Candidate</h1>
              <p className="text-slate-600 mt-1">Add a new candidate to your pool</p>
            </div>
          </div>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Enter candidate's full name"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter candidate's email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <Input
                    placeholder="Enter candidate's phone number"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Years of Experience
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter years of experience"
                    {...register('experience', { valueAsNumber: true })}
                    className={errors.experience ? 'border-red-500' : ''}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Source
                </label>
                <select
                  {...register('source')}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="MANUAL">Manual Entry</option>
                  <option value="UPLOAD">File Upload</option>
                  <option value="DRIVE">Google Drive</option>
                  <option value="CSV">CSV Import</option>
                  <option value="EXCEL">Excel Import</option>
                  <option value="AIRTABLE">Airtable</option>
                  <option value="GOOGLE_SHEETS">Google Sheets</option>
                  <option value="ADMIN_ASSIGN">Admin Assignment</option>
                </select>
                {errors.source && (
                  <p className="text-red-500 text-sm mt-1">{errors.source.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  placeholder="Add any additional notes about the candidate..."
                  className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                {errors.notes && (
                  <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
                )}
              </div>


              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Candidate'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

