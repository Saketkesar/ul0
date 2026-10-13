import test from "node:test"
import assert from "node:assert/strict"
import vm from "node:vm"
import { generateAppsScript } from "../lib/forms/appscript.js"

function createGoogleAppsScriptMock(initialHeaders = ["_id", "_submitted_at", "full_name", "email"]) {
  const rows = [initialHeaders] // row 1 is headers
  const numberFormats = [initialHeaders.map(() => "@")]

  const mockSheet = {
    getLastColumn: () => rows[0].length,
    getLastRow: () => rows.length,
    getRange: (startRow, startCol, numRows = 1, numCols = 1) => {
      return {
        getValues: () => {
          const res = []
          for (let r = 0; r < numRows; r++) {
            const rowIndex = startRow - 1 + r
            const rowData = rows[rowIndex] || []
            const slice = []
            for (let c = 0; c < numCols; c++) {
              const colIndex = startCol - 1 + c
              slice.push(rowData[colIndex] ?? "")
            }
            res.push(slice)
          }
          return res
        },
        setNumberFormat: (fmt) => {
          for (let r = 0; r < numRows; r++) {
            const rowIndex = startRow - 1 + r
            if (!numberFormats[rowIndex]) numberFormats[rowIndex] = []
            for (let c = 0; c < numCols; c++) {
              const colIndex = startCol - 1 + c
              numberFormats[rowIndex][colIndex] = fmt
            }
          }
        },
        setValues: (newVals) => {
          for (let r = 0; r < numRows; r++) {
            const rowIndex = startRow - 1 + r
            if (!rows[rowIndex]) rows[rowIndex] = []
            for (let c = 0; c < numCols; c++) {
              const colIndex = startCol - 1 + c
              rows[rowIndex][colIndex] = newVals[r][c]
            }
          }
        },
        setValue: (val) => {
          const rowIndex = startRow - 1
          const colIndex = startCol - 1
          if (!rows[rowIndex]) rows[rowIndex] = []
          rows[rowIndex][colIndex] = val
        },
      }
    },
    deleteRow: (rowIndex) => {
      rows.splice(rowIndex - 1, 1)
      numberFormats.splice(rowIndex - 1, 1)
    },
  }

  const mockSpreadsheet = {
    getSheetByName: (name) => (name === "Responses" ? mockSheet : null),
  }

  const mockLock = {
    waitLock: () => true,
    releaseLock: () => true,
  }

  const mockContentService = {
    MimeType: { JSON: "application/json" },
    createTextOutput: (jsonStr) => {
      return {
        jsonStr,
        setMimeType: () => JSON.parse(jsonStr),
      }
    },
  }

  return {
    rows,
    numberFormats,
    mockSheet,
    context: {
      SpreadsheetApp: {
        getActiveSpreadsheet: () => mockSpreadsheet,
      },
      LockService: {
        getScriptLock: () => mockLock,
      },
      ContentService: mockContentService,
      console,
    },
  }
}

test("Apps Script generator: unauthorized secret rejection", () => {
  const code = generateAppsScript({
    title: "Test Form",
    secret: "test_secret_123",
    keys: ["full_name", "email"],
    permissions: { read: true, edit: true, delete: true },
  })

  const { context } = createGoogleAppsScriptMock()
  vm.createContext(context)
  vm.runInContext(code, context)

  const res = context.doPost({
    postData: { contents: JSON.stringify({ secret: "wrong_secret", action: "ping" }) },
  })

  assert.equal(res.ok, false)
  assert.equal(res.error, "unauthorized")
})

test("Apps Script generator: ping action", () => {
  const code = generateAppsScript({
    title: "Test Form",
    secret: "test_secret_123",
    keys: ["full_name", "email"],
    permissions: { read: true, edit: true, delete: true },
  })

  const { context } = createGoogleAppsScriptMock()
  vm.createContext(context)
  vm.runInContext(code, context)

  const res = context.doPost({
    postData: { contents: JSON.stringify({ secret: "test_secret_123", action: "ping" }) },
  })

  assert.equal(res.ok, true)
})

test("Apps Script generator: append, anti-formula injection, and deduplication", () => {
  const code = generateAppsScript({
    title: "Test Form",
    secret: "test_secret_123",
    keys: ["full_name", "email"],
    permissions: { read: true, edit: true, delete: true },
  })

  const { rows, numberFormats, context } = createGoogleAppsScriptMock()
  vm.createContext(context)
  vm.runInContext(code, context)

  // 1. Append new row with formula-like text
  const res1 = context.doPost({
    postData: {
      contents: JSON.stringify({
        secret: "test_secret_123",
        action: "append",
        row: {
          _id: "entry_1",
          _submitted_at: "2026-10-13T10:00:00Z",
          full_name: "=1+1",
          email: "user@example.com",
        },
      }),
    },
  })

  assert.equal(res1.ok, true)
  assert.equal(res1.id, "entry_1")
  assert.equal(rows.length, 2)
  // Verify row values
  assert.equal(rows[1][0], "entry_1")
  assert.equal(rows[1][1], "2026-10-13T10:00:00Z")
  assert.equal(rows[1][2], "'=1+1") // Anti-formula leading quote added
  assert.equal(rows[1][3], "user@example.com")
  // Verify plain text number format '@' was applied
  assert.equal(numberFormats[1][2], "@")

  // 2. Double-click retry with same _id should deduplicate cleanly
  const resDedupe = context.doPost({
    postData: {
      contents: JSON.stringify({
        secret: "test_secret_123",
        action: "append",
        row: {
          _id: "entry_1",
          _submitted_at: "2026-10-13T10:00:00Z",
          full_name: "Different Name",
          email: "different@example.com",
        },
      }),
    },
  })

  assert.equal(resDedupe.ok, true)
  assert.equal(resDedupe.deduplicated, true)
  assert.equal(rows.length, 2) // No extra row added
})

test("Apps Script generator: list paging, update, and delete", () => {
  const code = generateAppsScript({
    title: "Test Form",
    secret: "sec_abc",
    keys: ["full_name", "email"],
    permissions: { read: true, edit: true, delete: true },
  })

  const { rows, context } = createGoogleAppsScriptMock()
  vm.createContext(context)
  vm.runInContext(code, context)

  // Append 2 rows
  context.doPost({
    postData: {
      contents: JSON.stringify({
        secret: "sec_abc",
        action: "append",
        row: { _id: "uuid_1", _submitted_at: "t1", full_name: "Alice", email: "alice@test.com" },
      }),
    },
  })
  context.doPost({
    postData: {
      contents: JSON.stringify({
        secret: "sec_abc",
        action: "append",
        row: { _id: "uuid_2", _submitted_at: "t2", full_name: "Bob", email: "bob@test.com" },
      }),
    },
  })

  // List (newest first)
  const listRes = context.doPost({
    postData: {
      contents: JSON.stringify({ secret: "sec_abc", action: "list", offset: 0, limit: 10 }),
    },
  })

  assert.equal(listRes.ok, true)
  assert.equal(listRes.total, 2)
  assert.equal(listRes.entries[0]._id, "uuid_2") // Bob is newest
  assert.equal(listRes.entries[1]._id, "uuid_1")

  // Update Alice
  const updateRes = context.doPost({
    postData: {
      contents: JSON.stringify({
        secret: "sec_abc",
        action: "update",
        id: "uuid_1",
        updates: { full_name: "Alice Updated" },
      }),
    },
  })
  assert.equal(updateRes.ok, true)
  assert.equal(rows[1][2], "Alice Updated")

  // Delete Bob
  const deleteRes = context.doPost({
    postData: {
      contents: JSON.stringify({ secret: "sec_abc", action: "delete", id: "uuid_2" }),
    },
  })
  assert.equal(deleteRes.ok, true)
  assert.equal(rows.length, 2) // Header + Alice left
})

test("Apps Script generator: omits functions when permissions are false", () => {
  const code = generateAppsScript({
    title: "Read-Only Form",
    secret: "sec_ro",
    keys: ["full_name"],
    permissions: { read: true, edit: false, delete: false },
  })

  assert.equal(code.includes("function update_"), false)
  assert.equal(code.includes("function delete_"), false)
  assert.equal(code.includes("function list_"), true)
})
