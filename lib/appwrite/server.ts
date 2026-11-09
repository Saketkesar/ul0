import "server-only"
import crypto from "crypto"
import { query, mapRow, isConflictError } from "../db"
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "./config"

export function isAppwriteConfigured(): boolean {
  return true
}

export const ID = {
  unique: () => crypto.randomUUID(),
}

export class QueryShim {
  method: string
  attribute?: string
  values?: any[]

  constructor(method: string, attribute?: string, values?: any[]) {
    this.method = method
    this.attribute = attribute
    this.values = values
  }

  static equal(attr: string, value: any) {
    return new QueryShim("equal", attr, [value])
  }

  static notEqual(attr: string, value: any) {
    return new QueryShim("notEqual", attr, [value])
  }

  static orderDesc(attr: string) {
    return new QueryShim("orderDesc", attr)
  }

  static orderAsc(attr: string) {
    return new QueryShim("orderAsc", attr)
  }

  static limit(limit: number) {
    return new QueryShim("limit", undefined, [limit])
  }

  static offset(offset: number) {
    return new QueryShim("offset", undefined, [offset])
  }

  static select(fields: string[]) {
    return new QueryShim("select", undefined, fields)
  }
}

export { QueryShim as Query }

class DatabasesShim {
  async getDocument<T = any>(databaseId: string, collectionId: string, documentId: string): Promise<T> {
    const res = await query(`SELECT * FROM ${collectionId} WHERE id = $1 LIMIT 1`, [documentId])
    if (res.rows.length === 0) {
      const err = new Error(`Document not found: ${documentId}`)
      ;(err as any).code = 404
      throw err
    }
    return mapRow<T>(res.rows[0])
  }

  async createDocument<T = any>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, any>
  ): Promise<T> {
    const id = documentId || crypto.randomUUID()
    const payload = { ...data, id }
    const keys = Object.keys(payload)
    const values = Object.values(payload)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ")
    const sql = `INSERT INTO ${collectionId} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING *`
    try {
      const res = await query(sql, values)
      return mapRow<T>(res.rows[0])
    } catch (err) {
      if (isConflictError(err)) {
        const e = new Error("Document already exists")
        ;(e as any).code = 409
        throw e
      }
      throw err
    }
  }

  async updateDocument<T = any>(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: Record<string, any>
  ): Promise<T> {
    const keys = Object.keys(data).filter((k) => k !== "id" && k !== "$id")
    if (keys.length === 0) {
      return this.getDocument(databaseId, collectionId, documentId)
    }
    const values = keys.map((k) => data[k])
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`).join(", ")
    values.push(documentId)
    const sql = `UPDATE ${collectionId} SET ${setClauses} WHERE id = $${values.length} RETURNING *`
    const res = await query(sql, values)
    if (res.rows.length === 0) {
      const err = new Error(`Document not found: ${documentId}`)
      ;(err as any).code = 404
      throw err
    }
    return mapRow<T>(res.rows[0])
  }

  async deleteDocument(databaseId: string, collectionId: string, documentId: string): Promise<void> {
    await query(`DELETE FROM ${collectionId} WHERE id = $1`, [documentId])
  }

  async listDocuments<T = any>(
    databaseId: string,
    collectionId: string,
    queries: QueryShim[] = []
  ): Promise<{ total: number; documents: T[] }> {
    const whereConditions: string[] = []
    const params: any[] = []
    let orderBy = ""
    let limitVal: number | null = null
    let offsetVal: number | null = null

    for (const q of queries) {
      if (!q || !q.method) continue
      if (q.method === "equal" && q.attribute && q.values) {
        const col = q.attribute === "$id" ? "id" : q.attribute
        params.push(q.values[0])
        whereConditions.push(`${col} = $${params.length}`)
      } else if (q.method === "notEqual" && q.attribute && q.values) {
        const col = q.attribute === "$id" ? "id" : q.attribute
        params.push(q.values[0])
        whereConditions.push(`${col} <> $${params.length}`)
      } else if (q.method === "orderDesc" && q.attribute) {
        const col = q.attribute === "$createdAt" ? "created_at" : q.attribute
        orderBy = `ORDER BY ${col} DESC`
      } else if (q.method === "orderAsc" && q.attribute) {
        const col = q.attribute === "$createdAt" ? "created_at" : q.attribute
        orderBy = `ORDER BY ${col} ASC`
      } else if (q.method === "limit" && q.values?.[0] !== undefined) {
        limitVal = Number(q.values[0])
      } else if (q.method === "offset" && q.values?.[0] !== undefined) {
        offsetVal = Number(q.values[0])
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

    // Count
    const countSql = `SELECT count(*) as total FROM ${collectionId} ${whereClause}`
    const countRes = await query(countSql, params)
    const total = parseInt(countRes.rows[0]?.total || "0", 10)

    // Select
    let selectSql = `SELECT * FROM ${collectionId} ${whereClause}`
    if (orderBy) {
      selectSql += ` ${orderBy}`
    }
    if (limitVal !== null) {
      params.push(limitVal)
      selectSql += ` LIMIT $${params.length}`
    }
    if (offsetVal !== null) {
      params.push(offsetVal)
      selectSql += ` OFFSET $${params.length}`
    }

    const docsRes = await query(selectSql, params)
    return {
      total,
      documents: docsRes.rows.map(mapRow<T>),
    }
  }
}

const singletonDb = new DatabasesShim()

export function getDatabases(): DatabasesShim {
  return singletonDb
}

export function getAdminClient(): any {
  return {}
}
