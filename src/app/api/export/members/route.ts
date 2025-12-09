import { NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/export/members - Export members to CSV
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const band = searchParams.get('band');
    const department = searchParams.get('department');

    const db = getAdminFirestore();
    let query = db.collection('members');

    // Apply filters if provided
    if (status) {
      query = query.where('status', '==', status) as any;
    }
    if (band) {
      query = query.where('bandKeys', 'array-contains', band) as any;
    }
    if (department) {
      query = query.where('departmentKeys', 'array-contains', department) as any;
    }

    const snapshot = await query.get();
    const members: UserProfile[] = [];

    snapshot.forEach((doc) => {
      members.push({
        id: doc.id,
        ...doc.data(),
      } as UserProfile);
    });

    // Generate CSV
    const headers = [
      'Serial',
      'Title',
      'First Name',
      'Middle Name',
      'Last Name',
      'Gender',
      'Marital Status',
      'Email',
      'Primary Phone',
      'Secondary Phone',
      'Address',
      'Occupation',
      'DOB',
      'Position',
      'Department',
      'Band',
      'Member Since',
      'Status',
      'Role',
    ];

    const csvRows = [headers.join(',')];

    members.forEach((member, index) => {
      const row = [
        index + 1,
        member.title || '',
        member.firstName || '',
        member.middleName || '',
        member.lastName || '',
        member.gender || '',
        member.maritalStatus || '',
        member.email || '',
        member.primaryPhone || '',
        member.secondaryPhone || '',
        `"${member.address || ''}"`, // Wrap address in quotes for CSV
        member.occupation || '',
        member.dob || '',
        member.position?.join('; ') || '',
        member.department?.map((d: any) => `${d.name} (${d.role})`).join('; ') || '',
        member.band?.map((b: any) => `${b.name} (${b.role})`).join('; ') || '',
        member.joinDate || '',
        member.status || '',
        member.role || '',
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    // Return as downloadable CSV
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="members-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting members:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export members',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
