import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT: Update a chart of account (Admin Keuangan only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const role = req.headers.get('x-user-role');
    const userId = req.headers.get('x-user-id');

    if (role !== 'Tim Keuangan') {
      return NextResponse.json({ message: 'Forbidden: Only Tim Keuangan can manage Chart of Accounts' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { nomorAkun, namaAkun, tipe, standar } = body;

    const existing = await prisma.chartOfAccounts.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ message: 'Chart of Accounts not found' }, { status: 404 });
    }

    // If changing nomorAkun, make sure it's not taken
    if (nomorAkun && nomorAkun !== existing.nomorAkun) {
      const duplicate = await prisma.chartOfAccounts.findUnique({
        where: { nomorAkun },
      });
      if (duplicate) {
        return NextResponse.json({ message: `Account number ${nomorAkun} is already in use` }, { status: 400 });
      }
    }

    const updated = await prisma.chartOfAccounts.update({
      where: { id },
      data: {
        nomorAkun: nomorAkun || undefined,
        namaAkun: namaAkun || undefined,
        tipe: tipe || undefined,
        standar: standar || undefined,
      },
    });

    // Write to audit trail
    if (userId) {
      await prisma.auditTrail.create({
        data: {
          userId,
          aksi: 'update_coa',
          detail: `Mengubah Chart of Accounts: ${existing.nomorAkun} -> ${updated.nomorAkun} (${updated.namaAkun})`,
        },
      });
    }

    return NextResponse.json({ message: 'Chart of Accounts updated successfully', coa: updated });
  } catch (error: any) {
    console.error('Update CoA error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a chart of account (Admin Keuangan only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const role = req.headers.get('x-user-role');
    const userId = req.headers.get('x-user-id');

    if (role !== 'Tim Keuangan') {
      return NextResponse.json({ message: 'Forbidden: Only Tim Keuangan can manage Chart of Accounts' }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.chartOfAccounts.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ message: 'Chart of Accounts not found' }, { status: 404 });
    }

    await prisma.chartOfAccounts.delete({
      where: { id },
    });

    // Write to audit trail
    if (userId) {
      await prisma.auditTrail.create({
        data: {
          userId,
          aksi: 'delete_coa',
          detail: `Menghapus Chart of Accounts: ${existing.nomorAkun} - ${existing.namaAkun}`,
        },
      });
    }

    return NextResponse.json({ message: 'Chart of Accounts deleted successfully' });
  } catch (error: any) {
    console.error('Delete CoA error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
