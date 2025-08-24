import { Button, useAdminCompanies, useCreateCompany } from '@amy/ui'
import { Building2, Users, Calendar, Plus } from 'lucide-react'

const CompanyCard = ({ company }: { company: any }) => (
  <div className="bg-card border rounded-lg p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
          <Building2 className="text-primary-foreground h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{company.name}</h3>
          <p className="text-sm text-muted-foreground">@{company.slug}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{company.users.length} users</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Created {new Date(company.createdAt).toLocaleDateString()}</span>
      </div>
    </div>

    {company.users.length > 0 && (
      <div>
        <h4 className="font-medium mb-3">Users</h4>
        <div className="space-y-2">
          {company.users.map((user: any) => (
            <UserItem key={user.id} user={user} />
          ))}
        </div>
      </div>
    )}
  </div>
)

const UserItem = ({ user }: { user: any }) => (
  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span className="text-primary-foreground text-sm font-medium">
          {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <p className="font-medium">{user.name || 'No name'}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN'
      ? 'bg-red-100 text-red-800'
      : 'bg-blue-100 text-blue-800'
      }`}>
      {user.role}
    </span>
  </div>
)

const EmptyState = ({ onCreateCompany }: { onCreateCompany: () => void }) => (
  <div className="text-center py-12">
    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium mb-2">No companies yet</h3>
    <p className="text-muted-foreground mb-4">
      Companies will appear here when users sign up with company information.
    </p>
    <Button onClick={onCreateCompany}>
      <Plus className="h-4 w-4 mr-2" />
      Create Company
    </Button>
  </div>
)

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

export function CompanyManagement() {
  const { data: companies = [], isLoading } = useAdminCompanies()
  const createCompany = useCreateCompany()

  const handleCreateCompany = () => {
    createCompany.mutate({
      name: 'New Company',
      slug: `company-${Date.now()}`
    })
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Management</h2>
        <Button
          onClick={handleCreateCompany}
          disabled={createCompany.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {companies.length === 0 ? (
        <EmptyState onCreateCompany={handleCreateCompany} />
      ) : (
        <div className="grid gap-6">
          {companies.map((company: any) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}
