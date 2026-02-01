'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Cake, Gift, Send } from 'lucide-react';
import { toast } from 'sonner';

interface BirthdayWidgetProps {
  maxDisplay?: number; // Maximum number of birthdays to display
  showSendButton?: boolean; // Show manual send button
}

export function BirthdayWidget({ maxDisplay = 5, showSendButton = true }: BirthdayWidgetProps) {
  const [summary, setSummary] = useState<BirthdaySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  useEffect(() => {
    fetchBirthdaySummary();
  }, []);

  const fetchBirthdaySummary = async () => {
    try {
      const response = await fetch('/api/birthdays/summary');
      const result = await response.json();
      if (result.success) {
        setSummary(result.summary);
      }
    } catch (error) {
      console.error('Failed to fetch birthday summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendWish = async (memberId: string, memberName: string) => {
    if (!confirm(`Send birthday wish to ${memberName}?`)) {
      return;
    }

    setSendingTo(memberId);
    try {
      const response = await fetch('/api/birthdays/send-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send birthday wish');
      }

      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send birthday wish');
    } finally {
      setSendingTo(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatBirthday = (dateOfBirth: string) => {
    const date = new Date(dateOfBirth);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Cake className="h-5 w-5 sm:h-6 sm:h-6" />
            Birthdays
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  const hasToday = summary.today.length > 0;
  const hasUpcoming = summary.upcoming.length > 0;
  const displayUpcoming = summary.upcoming.slice(0, maxDisplay);

  if (!hasToday && !hasUpcoming) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Cake className="h-5 w-5 sm:h-6 sm:h-6" />
            Birthdays
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Upcoming birthdays in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Gift className="mb-2 h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
            <p className="text-sm text-muted-foreground sm:text-base">No upcoming birthdays</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Cake className="h-5 w-5 sm:h-6 sm:h-6" />
          Birthdays
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          {hasToday
            ? `${summary.today.length} birthday${summary.today.length > 1 ? 's' : ''} today`
            : 'Upcoming birthdays'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today's Birthdays */}
          {hasToday && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-primary sm:text-base">🎉 Today</h3>
              {summary.today.map((member) => (
                <div key={member.id} className="flex items-center gap-3 rounded-lg bg-primary/5 p-2 sm:p-3">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                    <AvatarImage src={member.photoURL} alt={member.firstName} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {getInitials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium sm:text-base truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {formatBirthday(member.dateOfBirth)}
                    </p>
                  </div>
                  {showSendButton && (
                    <Button
                      size="sm"
                      variant="default"
                      className="shrink-0 px-2 py-1 sm:px-3 sm:py-2"
                      onClick={() =>
                        handleSendWish(member.id, `${member.firstName} ${member.lastName}`)
                      }
                      disabled={sendingTo === member.id}
                    >
                      {sendingTo === member.id ? (
                        <span className="text-xs sm:text-sm">Sending...</span>
                      ) : (
                        <>
                          <Send className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                          <span className="hidden sm:inline text-xs sm:text-sm">Send Wish</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Birthdays */}
          {hasUpcoming && (
            <div className="space-y-3">
              {hasToday && <div className="border-t pt-3" />}
              <h3 className="text-sm font-semibold sm:text-base">Upcoming</h3>
              {displayUpcoming.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 sm:p-3">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                    <AvatarImage src={member.photoURL} alt={member.firstName} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {getInitials(member.firstName, member.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium sm:text-base truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {formatBirthday(member.dateOfBirth)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1">
                    {member.daysUntilBirthday} {member.daysUntilBirthday === 1 ? 'day' : 'days'}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Show more indicator */}
          {summary.upcoming.length > maxDisplay && (
            <p className="text-center text-xs text-muted-foreground sm:text-sm">
              +{summary.upcoming.length - maxDisplay} more upcoming
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
