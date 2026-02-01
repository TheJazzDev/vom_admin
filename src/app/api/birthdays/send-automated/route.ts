import { type NextRequest, NextResponse } from 'next/server';
import { getTodaysBirthdays } from '@/services/birthday/birthdayService';
import { sendBatchPushNotifications } from '@/services/notifications/expoClient';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/config/firebase';

export const dynamic = 'force-dynamic';

/**
 * POST /api/birthdays/send-automated - Send automated birthday notifications (cron job)
 *
 * This endpoint should be triggered by a cron job once daily (e.g., 8:00 AM)
 * to send birthday wishes to members celebrating their birthday today.
 *
 * Security: Add API key authorization in production
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add API key validation for cron security
    // const apiKey = request.headers.get('x-api-key');
    // if (apiKey !== process.env.CRON_API_KEY) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    // Get members with birthdays today
    const birthdayMembers = await getTodaysBirthdays();

    if (birthdayMembers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No birthdays today',
        count: 0,
      });
    }

    // Prepare push notifications for members with tokens
    const membersWithTokens = birthdayMembers.filter((m) => m.expoPushToken);

    if (membersWithTokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: `${birthdayMembers.length} birthday(s) today, but no push tokens available`,
        count: 0,
      });
    }

    // Send push notifications
    const pushMessages = membersWithTokens.map((member) => ({
      to: member.expoPushToken!,
      sound: 'default' as const,
      title: `🎂 Happy Birthday ${member.firstName}!`,
      body: `Wishing you a blessed and joyful birthday! May this special day bring you happiness and God's abundant blessings. 🎉`,
      data: {
        type: 'birthday',
        memberId: member.id,
      },
    }));

    const results = await sendBatchPushNotifications(pushMessages);

    // Log notifications sent
    const db = getFirebaseDb();
    const notificationLogsRef = collection(db, 'notificationLogs');

    for (const member of membersWithTokens) {
      await addDoc(notificationLogsRef, {
        type: 'birthday',
        memberId: member.id,
        memberName: `${member.firstName} ${member.lastName}`,
        title: `🎂 Happy Birthday ${member.firstName}!`,
        message: 'Automated birthday notification',
        sentBy: 'system',
        sentByName: 'Automated System',
        sentAt: serverTimestamp(),
        pushToken: member.expoPushToken,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Birthday notifications sent to ${membersWithTokens.length} member(s)`,
      count: membersWithTokens.length,
      members: birthdayMembers.map((m) => ({
        id: m.id,
        name: `${m.firstName} ${m.lastName}`,
        hasPushToken: !!m.expoPushToken,
      })),
      results,
    });
  } catch (error) {
    console.error('[API /birthdays/send-automated] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send birthday notifications',
      },
      { status: 500 }
    );
  }
}
