# Export & Print Guide - VOM Admin Panel

## Overview

The VOM Admin Panel now includes comprehensive export and print functionality for member data, allowing you to export filtered data to CSV or print professional reports.

---

## 🎯 Features

### Export to CSV
- Export all members or filtered subsets
- Filter by:
  - **Band** (CHOIR, LOVE_DIVINE, DANIEL, etc.)
  - **Department** (MEDIA, IT, PROGRAMME, etc.)
  - **Status** (Active, Inactive)
- Downloads as CSV file with timestamp
- Compatible with Excel, Google Sheets, etc.

### Print Reports
- Professional print-friendly layout
- Automatic page breaks for large datasets
- Includes:
  - Church header with logo placeholder
  - Report title based on filters
  - Generation timestamp
  - Summary statistics
  - Formatted member table
  - Confidentiality footer

---

## 📤 How to Export Members

### Step 1: Open Export Dialog

On the Members page, click the **"Export"** button in the top right corner.

### Step 2: Choose Filter Options

The export dialog will appear with the following options:

#### Filter By: All Members
- Exports every member in the database
- No additional selection needed

#### Filter By: Band
1. Select "Band" from the "Filter By" dropdown
2. Choose a band from the list:
   - CHOIR
   - LOVE DIVINE
   - DANIEL
   - DEBORAH
   - QUEEN ESTHER
   - GOOD WOMEN
   - WARDEN
   - JOHN BELOVED
   - FAITH
   - HOLY MARY
   - UNASSIGNED

Example: To export all CHOIR members, select "Band" then choose "CHOIR"

#### Filter By: Department
1. Select "Department" from the "Filter By" dropdown
2. Choose a department:
   - INTERPRETATION
   - PROGRAMME
   - MEDIA
   - TREASURY
   - TECHNICAL
   - DRAMA
   - IT
   - EVANGELISM
   - SANITATION
   - SECRETARIAT

Example: To export all MEDIA department members, select "Department" then choose "MEDIA"

#### Filter By: Status
1. Select "Status" from the "Filter By" dropdown
2. Choose:
   - **Active** - Currently active members
   - **Inactive** - Inactive members

### Step 3: Export

Click the **"Export CSV"** button. The file will download automatically with a filename like:

```
members-export-2025-12-08.csv
```

### CSV Format

The exported CSV includes these columns:

| Column | Description |
|--------|-------------|
| Serial | Row number |
| Title | Mr, Mrs, Dr, etc. |
| First Name | Member's first name |
| Middle Name | Member's middle name |
| Last Name | Member's last name |
| Gender | Male or Female |
| Marital Status | Single, Married, etc. |
| Email | Email address |
| Primary Phone | Main contact number |
| Secondary Phone | Alternative contact |
| Address | Full address |
| Occupation | Job/profession |
| DOB | Date of birth |
| Position | Church positions held |
| Department | Department & role |
| Band | Band & role |
| Member Since | Join date |
| Status | Active or Inactive |
| Role | User, Admin, Super Admin |

---

## 🖨️ How to Print Members

### Option 1: Print from Export Dialog

1. Click the **"Export"** button on Members page
2. Select your filter options (optional)
3. Click the **"Print"** button
4. Your browser's print dialog will open
5. Adjust print settings if needed:
   - **Layout**: Portrait or Landscape
   - **Paper**: A4 (recommended)
   - **Margins**: Default
6. Click "Print" or "Save as PDF"

### Option 2: Direct Browser Print

1. Navigate to the Members page
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. The page will automatically format for printing
4. Select your printer or save as PDF
5. Click "Print"

### Print Features

#### What Gets Printed
✅ Church name and header
✅ Report title (e.g., "CHOIR Band Members")
✅ Generation date and time
✅ Summary statistics (Active, Inactive, Male, Female counts)
✅ Member table with key information
✅ Confidentiality footer

#### What Doesn't Print
❌ Sidebar navigation
❌ Action buttons
❌ Page header
❌ Filters and controls
❌ Pagination

#### Print Layout

```
┌─────────────────────────────────────────┐
│ Valley of Mercy Church                   │
│ [Report Title]                           │
│ Generated on: [Date] at [Time]          │
│ Total Members: [Count]                   │
├─────────────────────────────────────────┤
│ [Stats Cards]                            │
├─────────────────────────────────────────┤
│ # | Name | Email | Phone | Band | ...   │
│ 1 | ...  | ...   | ...   | ...  | ...   │
│ 2 | ...  | ...   | ...   | ...  | ...   │
│ ...                                      │
├─────────────────────────────────────────┤
│ Valley of Mercy Church - Members Dir.   │
│ This document is confidential...        │
└─────────────────────────────────────────┘
```

### Print Settings Recommendations

**For Member Lists (10-50 members)**
- **Orientation**: Portrait
- **Paper**: A4
- **Scale**: 100%
- **Margins**: Default

**For Large Lists (50+ members)**
- **Orientation**: Landscape
- **Paper**: A4
- **Scale**: 90-95%
- **Margins**: Narrow

**For Detailed Reports**
- **Orientation**: Landscape
- **Paper**: A4
- **Color**: Yes (if available)
- **Background graphics**: On

---

## 💡 Use Cases & Examples

### Example 1: Export All CHOIR Members
```
1. Click "Export" button
2. Select "Filter By" → "Band"
3. Select "CHOIR" from band dropdown
4. Click "Export CSV"
```

Result: `members-export-2025-12-08.csv` containing only CHOIR members

### Example 2: Print Active Members Only
```
1. Click "Export" button
2. Select "Filter By" → "Status"
3. Select "Active"
4. Click "Print" button
5. Choose your printer
6. Click "Print"
```

Result: Printed report of all active members

### Example 3: Export Media Department for Email Campaign
```
1. Click "Export" button
2. Select "Filter By" → "Department"
3. Select "MEDIA"
4. Click "Export CSV"
5. Open in Excel/Sheets
6. Copy email column for email campaign
```

### Example 4: Print Band Attendance Sheet
```
1. Click "Export" button
2. Select "Filter By" → "Band"
3. Select desired band (e.g., "DANIEL")
4. Click "Print"
5. Print or save as PDF
6. Use as attendance sheet for rehearsals
```

---

## 🔧 Technical Details

### CSV Export Process

```
User clicks Export
  ↓
Select filters in dialog
  ↓
Click "Export CSV"
  ↓
API call to /api/export/members?band=CHOIR
  ↓
Server queries Firestore with filters
  ↓
Data formatted as CSV
  ↓
Browser downloads file
```

### Print Process

```
User clicks Print
  ↓
Dialog closes
  ↓
Browser print dialog opens
  ↓
CSS @media print styles applied
  ↓
Sidebar, buttons hidden
  ↓
PrintableView component shown
  ↓
User prints or saves PDF
```

### API Endpoint

**Endpoint**: `GET /api/export/members`

**Query Parameters**:
- `status` - Filter by status (active, inactive)
- `band` - Filter by band (CHOIR, DANIEL, etc.)
- `department` - Filter by department (MEDIA, IT, etc.)

**Example Requests**:
```bash
# Export all members
GET /api/export/members

# Export CHOIR members
GET /api/export/members?band=CHOIR

# Export active members only
GET /api/export/members?status=active

# Export MEDIA department
GET /api/export/members?department=MEDIA
```

**Response**: CSV file download

---

## 📱 Browser Compatibility

### Export (CSV)
✅ Chrome/Edge - Works perfectly
✅ Firefox - Works perfectly
✅ Safari - Works perfectly
✅ Mobile browsers - Works perfectly

### Print
✅ Chrome/Edge - Full support
✅ Firefox - Full support
✅ Safari - Full support
⚠️ Mobile browsers - Limited (save as PDF recommended)

---

## 🎨 Customization

### Changing Print Header

Edit `src/components/Directory/Members/PrintableView.tsx`:

```typescript
<h1 className="text-2xl font-bold mb-2">
  Your Church Name Here  {/* Change this */}
</h1>
```

### Adjusting Print Columns

In `PrintableView.tsx`, modify the table headers:

```typescript
<thead>
  <tr>
    <th className="text-left">#</th>
    <th className="text-left">Name</th>
    {/* Add or remove columns here */}
  </tr>
</thead>
```

### Modifying Print Styles

Edit `src/app/globals.css` in the `@media print` section:

```css
@media print {
  /* Your custom print styles */
}
```

---

## ❓ Troubleshooting

### Export Issues

**Problem**: Export button disabled
**Solution**: Make sure members data has loaded. Refresh the page.

**Problem**: CSV downloads empty
**Solution**: Check if filters match any members. Try "All Members" first.

**Problem**: CSV not downloading
**Solution**: Check browser popup blocker. Allow downloads from localhost/domain.

### Print Issues

**Problem**: Print shows sidebar and buttons
**Solution**: Make sure you're using a modern browser. Try Ctrl+P instead of clicking browser menu.

**Problem**: Table cuts off on page
**Solution**: Switch to Landscape orientation or reduce scale to 90%.

**Problem**: No page breaks between members
**Solution**: This is expected for better readability. Each page shows as many members as fit.

**Problem**: Stats cards not showing
**Solution**: Enable "Background graphics" in print settings.

---

## 🔐 Security & Privacy

### Data Protection
- All exports go through authenticated API routes
- Only users with admin privileges can export
- Session validation required

### Confidentiality
- Print reports include confidentiality notice
- Reminder: "This document is confidential and for internal use only"
- Handle exported data according to your church's data protection policy

### Recommendations
- Don't email member lists unless encrypted
- Shred printed reports when no longer needed
- Delete downloaded CSV files after use
- Store securely if archival is required

---

## 📊 Export Statistics

After exporting or printing, you'll see:
- Total member count
- Active vs Inactive breakdown
- Male vs Female counts
- Generation timestamp

This helps verify the export matches your expectations.

---

## 🚀 Future Enhancements

Planned features:
- [ ] PDF export with advanced formatting
- [ ] Excel export (.xlsx) with multiple sheets
- [ ] Custom column selection
- [ ] Scheduled automated exports
- [ ] Email export to admin
- [ ] Export history/audit log
- [ ] Multi-filter combination (Band + Status)
- [ ] Custom date range filtering

---

## 📝 Summary

### Quick Export Workflow
1. Click "Export" → Select filters → Click "Export CSV" ✅

### Quick Print Workflow
1. Click "Export" → Click "Print" → Print/Save PDF ✅

### Supported Filters
- ✅ All Members
- ✅ By Band
- ✅ By Department
- ✅ By Status

### Output Formats
- ✅ CSV (Excel/Sheets compatible)
- ✅ Print (PDF via browser)

**You now have full export and print capabilities for all member data! 🎉**
