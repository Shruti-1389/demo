import { 
  User, 
  InsertUser, 
  Contract, 
  InsertContract, 
  UpdateContract, 
  ContractStatus, 
  ContractType,
  users,
  contracts
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or, gte, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contract CRUD operations
  getContract(id: number): Promise<Contract | undefined>;
  getContracts(): Promise<Contract[]>;
  getFilteredContracts(filters: ContractFilters): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: UpdateContract): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;
}

export interface ContractFilters {
  status?: string;
  contractType?: string;
  dateRange?: string;
  searchQuery?: string;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // We'll initialize the database with sample data when the app starts
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Check if we already have contracts in the database
      const existingContracts = await db.select({ count: contracts.id }).from(contracts);
      
      if (existingContracts.length === 0 || (existingContracts[0].count === null || existingContracts[0].count === 0)) {
        console.log("Initializing database with sample contracts...");
        await this.seedSampleContracts();
      }
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  private async seedSampleContracts() {
    const now = new Date();
    
    const sampleContracts = [
      {
        name: "Acme Corporation Service Agreement",
        contractType: ContractType.SERVICE,
        status: ContractStatus.ACTIVE,
        clientName: "Acme Corp.",
        value: "75000",
        startDate: new Date(now.getFullYear(), 0, 15),
        endDate: new Date(now.getFullYear() + 1, 0, 14),
        description: "Service agreement for software development services",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "TechVision Software License",
        contractType: ContractType.LICENSE,
        status: ContractStatus.PENDING,
        clientName: "TechVision Inc.",
        value: "45000",
        startDate: new Date(now.getFullYear(), 2, 1),
        endDate: new Date(now.getFullYear() + 1, 1, 28),
        description: "License agreement for enterprise software",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "GlobalTrade NDA 2023",
        contractType: ContractType.NDA,
        status: ContractStatus.ACTIVE,
        clientName: "GlobalTrade Partners",
        value: "0",
        startDate: new Date(now.getFullYear(), 1, 10),
        endDate: new Date(now.getFullYear() + 2, 1, 9),
        description: "Non-disclosure agreement for trade secrets",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Sunset Industries Lease Agreement",
        contractType: ContractType.LEASE,
        status: ContractStatus.EXPIRED,
        clientName: "Sunset Industries LLC",
        value: "120000",
        startDate: new Date(now.getFullYear() - 1, 5, 1),
        endDate: new Date(now.getFullYear(), 4, 31),
        description: "Lease agreement for office space",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "EcoSystems Consulting Agreement",
        contractType: ContractType.CONSULTING,
        status: ContractStatus.DRAFT,
        clientName: "EcoSystems Solutions",
        value: "25000",
        description: "Consulting services for environmental assessment",
        createdAt: now,
        updatedAt: now,
      }
    ];
    
    await db.insert(contracts).values(sampleContracts);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Contract methods
  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract || undefined;
  }
  
  async getContracts(): Promise<Contract[]> {
    return await db.select().from(contracts).orderBy(desc(contracts.createdAt));
  }
  
  async getFilteredContracts(filters: ContractFilters): Promise<Contract[]> {
    let query = db.select().from(contracts);
    const conditions: any[] = [];
    
    if (filters.status && filters.status !== "_all") {
      conditions.push(eq(contracts.status, filters.status.toLowerCase()));
    }
    
    if (filters.contractType && filters.contractType !== "_all") {
      conditions.push(eq(contracts.contractType, filters.contractType.toLowerCase()));
    }
    
    if (filters.dateRange) {
      const days = parseInt(filters.dateRange);
      if (!isNaN(days)) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        conditions.push(
          or(
            gte(contracts.createdAt, dateLimit),
            gte(contracts.updatedAt, dateLimit)
          )
        );
      }
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const searchTerm = filters.searchQuery.trim().toLowerCase();
      const searchPattern = `%${searchTerm}%`;
      
      conditions.push(
        or(
          like(sql`LOWER(${contracts.name})`, searchPattern),
          like(sql`CAST(${contracts.id} AS TEXT)`, searchPattern),
          like(sql`LOWER(${contracts.clientName})`, searchPattern)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(desc(contracts.createdAt));
  }
  
  async createContract(insertContract: InsertContract): Promise<Contract> {
    const now = new Date();
    
    // Prepare data for insertion
    const startDate = insertContract.startDate ? new Date(insertContract.startDate) : null;
    const endDate = insertContract.endDate ? new Date(insertContract.endDate) : null;
    
    // Create a clean object with the proper types
    const contractToInsert = {
      name: insertContract.name,
      contractType: insertContract.contractType,
      status: insertContract.status,
      clientName: insertContract.clientName,
      value: insertContract.value || null,
      startDate: startDate,
      endDate: endDate,
      description: insertContract.description || null,
      createdBy: insertContract.createdBy || null,
      createdAt: now,
      updatedAt: now
    };
    
    // Insert the contract
    const inserted = await db
      .insert(contracts)
      .values(contractToInsert)
      .returning();
      
    return inserted[0];
  }
  
  async updateContract(id: number, updateContract: UpdateContract): Promise<Contract | undefined> {
    const now = new Date();
    
    // Create update data object
    const updateData: Record<string, any> = {
      updatedAt: now
    };
    
    // Copy basic string properties
    if (updateContract.name !== undefined) updateData.name = updateContract.name;
    if (updateContract.contractType !== undefined) updateData.contractType = updateContract.contractType;
    if (updateContract.status !== undefined) updateData.status = updateContract.status;
    if (updateContract.clientName !== undefined) updateData.clientName = updateContract.clientName;
    if (updateContract.description !== undefined) updateData.description = updateContract.description;
    if (updateContract.value !== undefined) updateData.value = updateContract.value;
    
    // Handle date fields
    if (updateContract.startDate) {
      updateData.startDate = new Date(updateContract.startDate);
    } else if (updateContract.startDate === '') {
      updateData.startDate = null;
    }
    
    if (updateContract.endDate) {
      updateData.endDate = new Date(updateContract.endDate);
    } else if (updateContract.endDate === '') {
      updateData.endDate = null;
    }
    
    // Update the contract
    const updated = await db
      .update(contracts)
      .set(updateData)
      .where(eq(contracts.id, id))
      .returning();
    
    return updated.length > 0 ? updated[0] : undefined;
  }
  
  async deleteContract(id: number): Promise<boolean> {
    const result = await db
      .delete(contracts)
      .where(eq(contracts.id, id))
      .returning({ id: contracts.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
