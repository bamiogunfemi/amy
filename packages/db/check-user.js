const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'ayobamiarafat09@gmail.com' },
      include: { status: true }
    });
    
    console.log('User found:', user);
    
    if (user) {
      console.log('User status:', user.status);
      console.log('User hash exists:', !!user.hash);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
