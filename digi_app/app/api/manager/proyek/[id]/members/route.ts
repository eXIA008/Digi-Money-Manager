import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Fetch all members assigned to this project
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const role = req.headers.get('x-user-role');
    if (role !== 'Direktur / Manajemen') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id: proyekIdStr } = await params;
    const proyekId = parseInt(proyekIdStr, 10);

    const members = await prisma.userProyek.findMany({
      where: { proyekId },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            role: true,
            divisi: true,
          },
        },
      },
    });

    const mapped = members.map((m) => ({
      id: m.user.id,
      nama: m.user.nama,
      email: m.user.email,
      role: m.user.role,
      divisi: m.user.divisi,
      roleInProyek: m.role,
    }));

    return NextResponse.json({ members: mapped });
  } catch (error: any) {
    console.error('Get project members error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

// PUT: Set the list of assigned members for this project
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const role = req.headers.get('x-user-role');
    const direktorId = req.headers.get('x-user-id');
    if (role !== 'Direktur / Manajemen') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id: proyekIdStr } = await params;
    const proyekId = parseInt(proyekIdStr, 10);

    const body = await req.json();
    const { userIds } = body; // Array of user IDs (numbers)

    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ message: 'userIds array is required' }, { status: 400 });
    }

    // Verify project exists
    const project = await prisma.proyek.findUnique({ where: { id: proyekId } });
    if (!project) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    // Update members inside a transaction
    await prisma.$transaction(async (tx) => {
      // Delete existing assignments for this project
      await tx.userProyek.deleteMany({
        where: { proyekId },
      });

      // Insert new assignments
      if (userIds.length > 0) {
        // Fetch user roles
        const users = await tx.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, role: true },
        });

        const userProyeks = users.map((u) => ({
          proyekId,
          userId: u.id,
          role: u.role === 'Project Manager' ? 'Project Manager' : 'Anggota Lapangan',
        }));

        await tx.userProyek.createMany({
          data: userProyeks,
        });
      }
    });

    // Audit trail
    if (direktorId) {
      await prisma.auditTrail.create({
        data: {
          userId: parseInt(direktorId, 10),
          aksi: 'assign_project_members',
          detail: `Direktur mengatur ulang anggota proyek ${project.nama} (${userIds.length} orang)`,
        },
      });
    }

    return NextResponse.json({ message: 'Anggota proyek berhasil diperbarui' }, { status: 200 });
  } catch (error: any) {
    console.error('Update project members error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
