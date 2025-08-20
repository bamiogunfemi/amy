import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../server/config/passport'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create plans
  console.log('Creating plans...')
  const freeTrialPlan = await prisma.plan.upsert({
    where: { id: 'free-trial' },
    update: {},
    create: {
      id: 'free-trial',
      name: 'Free Trial',
      priceCents: 0,
      trialDays: 14,
      features: {
        candidateLimit: 200,
        dailyImportLimit: 300,
        features: ['Basic candidate management', 'Resume parsing', 'Search']
      }
    }
  })

  const starterPlan = await prisma.plan.upsert({
    where: { id: 'starter' },
    update: {},
    create: {
      id: 'starter',
      name: 'Starter',
      priceCents: 2900, // $29/month
      trialDays: 14,
      features: {
        candidateLimit: 1000,
        dailyImportLimit: 1000,
        features: ['Advanced search', 'Pipeline management', 'Import integrations']
      }
    }
  })

  const proPlan = await prisma.plan.upsert({
    where: { id: 'pro' },
    update: {},
    create: {
      id: 'pro',
      name: 'Professional',
      priceCents: 7900, // $79/month
      trialDays: 14,
      features: {
        candidateLimit: 5000,
        dailyImportLimit: 5000,
        features: ['Team collaboration', 'Advanced analytics', 'Priority support']
      }
    }
  })

  // Create skills
  console.log('Creating skills...')
  const skills = [
    // Languages
    { slug: 'javascript', label: 'JavaScript', category: 'LANG' },
    { slug: 'typescript', label: 'TypeScript', category: 'LANG' },
    { slug: 'python', label: 'Python', category: 'LANG' },
    { slug: 'java', label: 'Java', category: 'LANG' },
    { slug: 'csharp', label: 'C#', category: 'LANG' },
    { slug: 'go', label: 'Go', category: 'LANG' },
    { slug: 'rust', label: 'Rust', category: 'LANG' },
    { slug: 'php', label: 'PHP', category: 'LANG' },
    { slug: 'ruby', label: 'Ruby', category: 'LANG' },
    { slug: 'swift', label: 'Swift', category: 'LANG' },
    { slug: 'kotlin', label: 'Kotlin', category: 'LANG' },
    { slug: 'scala', label: 'Scala', category: 'LANG' },

    // Frameworks
    { slug: 'react', label: 'React', category: 'FRAMEWORK' },
    { slug: 'vue', label: 'Vue.js', category: 'FRAMEWORK' },
    { slug: 'angular', label: 'Angular', category: 'FRAMEWORK' },
    { slug: 'nextjs', label: 'Next.js', category: 'FRAMEWORK' },
    { slug: 'nuxt', label: 'Nuxt.js', category: 'FRAMEWORK' },
    { slug: 'express', label: 'Express.js', category: 'FRAMEWORK' },
    { slug: 'fastapi', label: 'FastAPI', category: 'FRAMEWORK' },
    { slug: 'django', label: 'Django', category: 'FRAMEWORK' },
    { slug: 'flask', label: 'Flask', category: 'FRAMEWORK' },
    { slug: 'spring', label: 'Spring Boot', category: 'FRAMEWORK' },
    { slug: 'laravel', label: 'Laravel', category: 'FRAMEWORK' },
    { slug: 'rails', label: 'Ruby on Rails', category: 'FRAMEWORK' },

    // Databases
    { slug: 'postgresql', label: 'PostgreSQL', category: 'DB' },
    { slug: 'mysql', label: 'MySQL', category: 'DB' },
    { slug: 'mongodb', label: 'MongoDB', category: 'DB' },
    { slug: 'redis', label: 'Redis', category: 'DB' },
    { slug: 'elasticsearch', label: 'Elasticsearch', category: 'DB' },
    { slug: 'dynamodb', label: 'DynamoDB', category: 'DB' },
    { slug: 'sqlite', label: 'SQLite', category: 'DB' },
    { slug: 'oracle', label: 'Oracle', category: 'DB' },
    { slug: 'sqlserver', label: 'SQL Server', category: 'DB' },

    // Cloud
    { slug: 'aws', label: 'AWS', category: 'CLOUD' },
    { slug: 'azure', label: 'Azure', category: 'CLOUD' },
    { slug: 'gcp', label: 'Google Cloud', category: 'CLOUD' },
    { slug: 'docker', label: 'Docker', category: 'CLOUD' },
    { slug: 'kubernetes', label: 'Kubernetes', category: 'CLOUD' },
    { slug: 'terraform', label: 'Terraform', category: 'CLOUD' },
    { slug: 'serverless', label: 'Serverless', category: 'CLOUD' },

    // Tools
    { slug: 'git', label: 'Git', category: 'TOOL' },
    { slug: 'jenkins', label: 'Jenkins', category: 'TOOL' },
    { slug: 'github-actions', label: 'GitHub Actions', category: 'TOOL' },
    { slug: 'gitlab-ci', label: 'GitLab CI', category: 'TOOL' },
    { slug: 'webpack', label: 'Webpack', category: 'TOOL' },
    { slug: 'vite', label: 'Vite', category: 'TOOL' },
    { slug: 'jest', label: 'Jest', category: 'TOOL' },
    { slug: 'cypress', label: 'Cypress', category: 'TOOL' },
    { slug: 'playwright', label: 'Playwright', category: 'TOOL' },

    // Soft Skills
    { slug: 'leadership', label: 'Leadership', category: 'SOFT' },
    { slug: 'communication', label: 'Communication', category: 'SOFT' },
    { slug: 'teamwork', label: 'Teamwork', category: 'SOFT' },
    { slug: 'problem-solving', label: 'Problem Solving', category: 'SOFT' },
    { slug: 'time-management', label: 'Time Management', category: 'SOFT' },
    { slug: 'adaptability', label: 'Adaptability', category: 'SOFT' },
    { slug: 'creativity', label: 'Creativity', category: 'SOFT' },
    { slug: 'critical-thinking', label: 'Critical Thinking', category: 'SOFT' },

    // Certifications
    { slug: 'aws-certified', label: 'AWS Certified', category: 'CERT' },
    { slug: 'azure-certified', label: 'Azure Certified', category: 'CERT' },
    { slug: 'gcp-certified', label: 'GCP Certified', category: 'CERT' },
    { slug: 'pmp', label: 'PMP', category: 'CERT' },
    { slug: 'scrum-master', label: 'Scrum Master', category: 'CERT' },
    { slug: 'product-owner', label: 'Product Owner', category: 'CERT' },

    // Domain Knowledge
    { slug: 'fintech', label: 'FinTech', category: 'DOMAIN' },
    { slug: 'healthcare', label: 'Healthcare', category: 'DOMAIN' },
    { slug: 'ecommerce', label: 'E-commerce', category: 'DOMAIN' },
    { slug: 'edtech', label: 'EdTech', category: 'DOMAIN' },
    { slug: 'ai-ml', label: 'AI/ML', category: 'DOMAIN' },
    { slug: 'blockchain', label: 'Blockchain', category: 'DOMAIN' },
    { slug: 'cybersecurity', label: 'Cybersecurity', category: 'DOMAIN' },
    { slug: 'gaming', label: 'Gaming', category: 'DOMAIN' }
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: skill
    })
  }

  // Create admin user
  console.log('Creating admin user...')
  const adminPassword = await hashPassword('admin123')
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@amy.com' },
    update: {},
    create: {
      email: 'admin@amy.com',
      hash: adminPassword,
      name: 'Amy Admin',
      role: 'ADMIN'
    }
  })

  // Create admin subscription
  await prisma.subscription.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      planId: 'pro',
      status: 'active'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Admin email: admin@amy.com')
  console.log('🔑 Admin password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
