import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contract Status enum
export const ContractStatus = {
  DRAFT: "draft",
  PENDING: "pending",
  ACTIVE: "active",
  EXPIRED: "expired",
  TERMINATED: "terminated",
} as const;

// Contract Type enum
export const ContractType = {
  SERVICE: "service",
  NDA: "nda",
  PURCHASE: "purchase",
  EMPLOYMENT: "employment",
  LEASE: "lease",
  CONSULTING: "consulting",
  LICENSE: "license",
} as const;

// Contracts Table
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contractType: varchar("contract_type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default(ContractStatus.DRAFT),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  value: varchar("value", { length: 50 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: integer("created_by").references(() => users.id),
});

// Contract insert schema
export const insertContractSchema = createInsertSchema(contracts)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    contractType: z.enum([
      ContractType.SERVICE,
      ContractType.NDA,
      ContractType.PURCHASE,
      ContractType.EMPLOYMENT,
      ContractType.LEASE,
      ContractType.CONSULTING,
      ContractType.LICENSE,
    ]),
    status: z.enum([
      ContractStatus.DRAFT,
      ContractStatus.PENDING,
      ContractStatus.ACTIVE,
      ContractStatus.EXPIRED,
      ContractStatus.TERMINATED,
    ]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    value: z.string().optional(),
  });

// Contract update schema
export const updateContractSchema = insertContractSchema.partial();

export type InsertContract = z.infer<typeof insertContractSchema>;
export type UpdateContract = z.infer<typeof updateContractSchema>;
export type Contract = typeof contracts.$inferSelect;
