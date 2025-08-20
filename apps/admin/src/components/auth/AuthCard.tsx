import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@amy/ui'

interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-sm border-zinc-200">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          {description ? (
            <CardDescription className="text-zinc-500">{description}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer ? <CardFooter>{footer}</CardFooter> : null}
      </Card>
    </div>
  )
}


