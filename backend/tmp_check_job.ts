import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkJob() {
  const jobId = 'd939ebd1-6cf1-466c-8cc0-d749bd0f93ba';
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { company: true }
  });

  if (!job) {
    console.log('Job not found');
    const allJobs = await prisma.job.findMany({ include: { company: true } });
    console.log('\n--- All Jobs in DB ---');
    allJobs.forEach(j => {
      console.log(`ID: ${j.id}, Title: ${j.title}, Company: ${j.company?.name} (${j.companyId})`);
    });
    return;
  }

  console.log('--- Job Info ---');
  console.log('ID:', job.id);
  console.log('Title:', job.title);
  console.log('Company ID (in Job record):', job.companyId);
  console.log('Company (associated):', job.company ? job.company.name : 'NONE');
  console.log('Company Email:', job.company ? job.company.email : 'NONE');

  const allCompanies = await prisma.company.findMany();
  console.log('\n--- All Companies ---');
  allCompanies.forEach(c => {
    console.log(`ID: ${c.id}, Name: ${c.name}, Email: ${c.email}`);
  });

  await prisma.$disconnect();
}

checkJob().catch(e => {
  console.error(e);
  process.exit(1);
});
