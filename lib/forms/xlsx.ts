import ExcelJS from "exceljs"
import { INPUT_FIELD_TYPES, type FormField } from "./schema"

/**
 * Generates an Excel workbook template with:
 * 1. Sheet "Responses": Headers _id, _submitted_at, and field keys in order.
 * 2. Sheet "README": Instructions and field schema reference.
 */
export async function generateFormXlsxTemplate(params: {
  title: string
  slug: string
  fields: FormField[]
}): Promise<Buffer> {
  const { title, slug, fields } = params

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "ul0.site"
  workbook.created = new Date()

  // --- SHEET 1: Responses ---
  const responsesSheet = workbook.addWorksheet("Responses", {
    views: [{ state: "frozen", ySplit: 1 }], // Freeze header row
  })

  // Filter input fields only (ignore non-input blocks like heading, paragraph, divider)
  const inputFields = fields.filter((f) => INPUT_FIELD_TYPES.includes(f.type as any))
  const headers = ["_id", "_submitted_at", ...inputFields.map((f) => f.key)]

  const headerRow = responsesSheet.addRow(headers)
  headerRow.font = { bold: true, color: { argb: "FF0B1412" }, name: "Calibri", size: 11 }
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF0FDF4" }, // subtle mint/green tint
  }
  headerRow.height = 24

  // Set generous column widths
  responsesSheet.columns = headers.map((h) => ({
    header: h,
    key: h,
    width: h === "_id" ? 36 : h === "_submitted_at" ? 24 : Math.max(18, h.length + 6),
  }))

  // Ensure all data rows format as plain text to prevent formula injection
  responsesSheet.getColumn("_id").numFmt = "@"
  responsesSheet.getColumn("_submitted_at").numFmt = "@"
  inputFields.forEach((f) => {
    responsesSheet.getColumn(f.key).numFmt = "@"
  })

  // --- SHEET 2: README ---
  const readmeSheet = workbook.addWorksheet("README")

  readmeSheet.addRow([`UL0 Forms — ${title}`])
  readmeSheet.getRow(1).font = { bold: true, size: 16, color: { argb: "FF1FA087" } }

  readmeSheet.addRow([`Public URL: https://ul0.site/e/${slug}`])
  readmeSheet.addRow([""])
  readmeSheet.addRow(["HOW TO CONNECT THIS SHEET TO UL0:"])
  readmeSheet.getRow(4).font = { bold: true }
  readmeSheet.addRow(["1. In Google Sheets: File -> Import -> Upload this .xlsx file."])
  readmeSheet.addRow(["2. Select 'Replace spreadsheet' or 'Insert new sheet' (Keep the tab named 'Responses')."])
  readmeSheet.addRow(["3. In Google Sheets: Extensions -> Apps Script."])
  readmeSheet.addRow(["4. Paste the script generated in your UL0 dashboard wizard."])
  readmeSheet.addRow(["5. Deploy as Web app (Execute as Me, Who has access: Anyone)."])
  readmeSheet.addRow(["6. Copy the Web app URL and paste it back in UL0 to test connection."])
  readmeSheet.addRow([""])
  readmeSheet.addRow(["FIELD REFERENCE:"])
  readmeSheet.getRow(12).font = { bold: true }

  const schemaHeader = readmeSheet.addRow(["Key (Header)", "Label", "Type", "Required", "Options / Notes"])
  schemaHeader.font = { bold: true }
  schemaHeader.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3F4F6" },
  }

  inputFields.forEach((f) => {
    const optsStr = f.options && f.options.length > 0 ? f.options.map((o) => o.label).join(", ") : "-"
    readmeSheet.addRow([f.key, f.label, f.type, f.required ? "Yes" : "No", optsStr])
  })

  readmeSheet.columns = [
    { width: 22 },
    { width: 28 },
    { width: 16 },
    { width: 12 },
    { width: 40 },
  ]

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
