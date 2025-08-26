import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, ImportWizard } from '@amy/ui'
import { Upload } from 'lucide-react'

export function ImportPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Import Data</h1>
            <p className="text-slate-600 mt-1">Import candidates from various sources</p>
          </div>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Start an Import</CardTitle>
          </CardHeader>
          <CardContent>
            <ImportWizard />
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Recent Imports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No imports yet</h3>
              <p className="text-slate-600 mb-4">Start by importing your first batch of candidates</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
