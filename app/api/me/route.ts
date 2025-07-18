
import { BuyerProfile, SupplierProfile, UserRole } from '@/generated/prisma'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // @ts-ignore
    const role = session.user.role;
    let user: SupplierProfile | BuyerProfile | null = null;

    if (role === UserRole.SUPPLIER ) {
        user = await prisma.supplierProfile.findFirst({ where: { userId: session.user.id }});
    } else {
        user = await prisma.buyerProfile.findFirst({ where: { userId: session.user.id }});
    }
    return res.status(200).json(user)
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}
