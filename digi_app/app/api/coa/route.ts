import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List all chart of accounts
export async function GET(req: NextRequest) {
  try {
    const coa = await prisma.chartOfAccounts.findMany({
      orderBy: { nomorAkun: 'asc' },
    });
    return NextResponse.json({ coa });
  } catch (error: any) {
    console.error('Fetch CoA error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

// POST: Create a new chart of accounts (Admin Keuangan only)
export async function POST(req: NextRequest) {
  try {
    const role = req.headers.get('x-user-role');
    const userId = req.headers.get('x-user-id');

    if (role !== 'Tim Keuangan') {
      return NextResponse.json({ message: 'Forbidden: Only Tim Keuangan can manage Chart of Accounts' }, { status: 403 });
    }

    const body = await req.json();
    const { nomorAkun, namaAkun, tipe, standar } = body;

    if (!nomorAkun || !namaAkun || !tipe || !standar) {
      return NextResponse.json({ message: 'nomorAkun, namaAkun, tipe, and standar are required' }, { status: 400 });
    }

    // Check if account number already exists
    const existing = await prisma.chartOfAccounts.findUnique({
      where: { nomorAkun },
    });

    if (existing) {
      return NextResponse.json({ message: `Chart of Accounts with account number ${nomorAkun} already exists` }, { status: 400 });
    }

    const newCoa = await prisma.chartOfAccounts.create({
      data: {
        nomorAkun,
        namaAkun,
        tipe,
        standar,
      },
    });

    // Write to audit trail
    if (userId) {
      await prisma.auditTrail.create({
        data: {
          userId,
          aksi: 'create_coa',
          detail: `Membuat Chart of Accounts baru: ${nomorAkun} - ${namaAkun}`,
        },
      });
    }

    return NextResponse.json({ message: 'Chart of Accounts created successfully', coa: newCoa }, { status: 201 });
  } catch (error: any) {
    console.error('Create CoA error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
