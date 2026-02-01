import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, getUserDisplayName } from '@/lib/session';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/config/firebase';
import { sendBatchPushNotifications } from '@/services/notifications/expoClient';

export const dynamic = 'force-dynamic';

/**
 * POST /api/birthdays/send-wish - Send manual birthday wish to a member
 */
export async function POST(request: NextRequest) {
  try {
    // Get current authenticated user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: SendBirthdayWishInput = await request.json();

    // Validate required fields
    if (!body.memberId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member ID is required',
        },
        { status: 400 }
      );
    }

    // Get member details
    const db = getFirebaseDb();
    const memberRef = doc(db, 'members', body.memberId);
    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Member not found',
        },
        { status: 404 }
      );
    }

    const memberData = memberSnap.data();
    const memberName = `${memberData.firstName || ''} ${memberData.lastName || ''}`.trim();

    // Default birthday message if no custom message provided
    const defaultMessage = `Wishing you a blessed and joyful birthday! May this special day bring you happiness and God's abundant blessings. 🎉`;
    const messageBody = body.customMessage || defaultMessage;

    let pushSent = false;
    let pushError = null;

    // Send push notification if member has a token
    if (memberData.expoPushToken) {
      try {
        await sendBatchPushNotifications([
          {
            to: memberData.expoPushToken,
            sound: 'default' as const,
            title: `🎂 Happy Birthday ${memberData.firstName}!`,
            body: messageBody,
            data: {
              type: 'birthday',
              memberId: body.memberId,
            },
          },
        ]);
        pushSent = true;
      } catch (error) {
        console.error('[API /birthdays/send-wish] Push notification error:', error);
        pushError = error instanceof Error ? error.message : 'Failed to send push notification';
      }
    }

    // Log the birthday wish
    const notificationLogsRef = collection(db, 'notificationLogs');
    const senderName = getUserDisplayName(currentUser);

    await addDoc(notificationLogsRef, {
      type: 'birthday',
      memberId: body.memberId,
      memberName,
      title: `🎂 Happy Birthday ${memberData.firstName}!`,
      message: messageBody,
      sentBy: currentUser.id,
      sentByName: senderName,
      sentAt: serverTimestamp(),
      pushToken: memberData.expoPushToken || null,
      pushSent,
    });

    return NextResponse.json({
      success: true,
      message: pushSent
        ? 'Birthday wish sent successfully'
        : 'Birthday wish logged (member has no push notification token)',
      pushSent,
      pushError,
      memberName,
    });
  } catch (error) {
    console.error('[API /birthdays/send-wish] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send birthday wish',
      },
      { status: 500 }
    );
  }
}
