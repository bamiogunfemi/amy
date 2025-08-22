import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@amy/ui'
import { Settings, Bell, Shield, Database, Palette } from 'lucide-react'

export function SettingsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">Manage your account and preferences</p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-rose-600" />
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500" />
                    <span className="text-sm text-slate-700">New candidate applications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500" />
                    <span className="text-sm text-slate-700">Pipeline updates</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500" />
                    <span className="text-sm text-slate-700">Import job completions</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-rose-600" />
                <span>Integrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Google Drive
                </label>
                <Button variant="outline" size="sm">
                  Connect Google Drive
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Airtable
                </label>
                <Button variant="outline" size="sm">
                  Connect Airtable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Display Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-rose-600" />
                <span>Display Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Theme
                </label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Language
                </label>
                <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-rose-600" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  In-App Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500" defaultChecked />
                    <span className="text-sm text-slate-700">Enable notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="h-4 w-4 text-rose-600 border-slate-300 rounded focus:ring-rose-500" defaultChecked />
                    <span className="text-sm text-slate-700">Sound alerts</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  )
}
