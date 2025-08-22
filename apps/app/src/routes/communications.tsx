import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@amy/ui'
import { MessageSquare, Send, Mail, Phone } from 'lucide-react'

export function CommunicationsPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Communications</h1>
            <p className="text-slate-600 mt-1">Manage candidate communications</p>
          </div>
        </div>

        {/* Communication Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Email Campaigns</h3>
                  <p className="text-sm text-slate-600">Send bulk emails</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Templates</h3>
                  <p className="text-sm text-slate-600">Manage email templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Call Logs</h3>
                  <p className="text-sm text-slate-600">Track phone calls</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Communications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Send className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No communications yet</h3>
              <p className="text-slate-600 mb-4">Start by sending your first message to candidates</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
