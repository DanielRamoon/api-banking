/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import PasswordHelper from '../src/helpers/PasswordHelper'
import { Role } from '../src/entities/CompanyUser'
import { AccountType } from '../src/entities/Holder'
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.admin.upsert({
    where: { email: 'doe@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'doe@example.com',
      encrypted_password: await PasswordHelper.encrypt('user@123')
    }
  })

  const company = await prisma.company.upsert({
    where: { id: '2ead5b92-a2b7-4e3a-a499-19d3afa07a52' },
    update: {},
    create: {
      id: '2ead5b92-a2b7-4e3a-a499-19d3afa07a52',
      name: 'John Doe',
      cnpj: '79292711000137',
      company_name: 'Doe Enterprise'
    }
  })

  const holder = await prisma.holder.upsert({
    where: { id: '3804b941-acd9-422e-8140-7a7cd5eaddf2' },
    update: {},
    create: {
      email: 'doe@example.com',
      account_type: AccountType.individual,
      taxpayer_id: '58987784037',
      id: '3804b941-acd9-422e-8140-7a7cd5eaddf2',
      name: 'John Doe',
      cnae: '0112101'
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'doe@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'doe@example.com',
      taxpayer_id: '64101946680',
      phone: '999999999',
      phone_prefix: '99',
      company_id: company.id,
      holder_id: holder.id,
      encrypted_password: await PasswordHelper.encrypt('user@123')
    }
  })

  const companyUser = await prisma.companyUser.upsert({
    where: { email: 'doe@example.com' },
    update: {},
    create: {
      name: 'John Doe Doe',
      email: 'doe@example.com',
      company_id: company.id,
      role: Role.admin,
      encrypted_password: await PasswordHelper.encrypt('user@123')
    }
  })

  console.log({ admin, user, companyUser, company, holder })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
