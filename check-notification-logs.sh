#!/bin/bash
echo "=== Checking for notification-related logs ==="
echo ""
echo "Tailing the last 100 lines of your dev server output..."
echo "Look for lines starting with:"
echo "  - [API /notifications/send]"
echo "  - [NotificationService]"
echo "  - [ExpoClient]"
echo ""
echo "Press Ctrl+C to stop"
echo ""
echo "=== Logs ==="
# Find the process running on port 3555 and show recent logs
lsof -ti:3555 | head -1 | xargs -I {} sh -c 'echo "Process PID: {}"; ps -p {} -o command='
