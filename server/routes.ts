import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContractSchema, updateContractSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = app.use("/api", (req, res, next) => {
    next();
  });

  // Get all contracts
  app.get("/api/contracts", async (req, res) => {
    try {
      const { status, type, dateRange, search } = req.query;
      
      // Log the search query for debugging
      if (search) console.log("Search query received:", search);
      
      const filters = {
        status: status as string,
        contractType: type as string,
        dateRange: dateRange as string,
        searchQuery: search as string
      };
      
      // Always use filtered contracts but with potentially empty filters
      const contracts = await storage.getFilteredContracts(filters);
      
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });
  
  // Get a single contract by ID
  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contract ID" });
      }
      
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.json(contract);
    } catch (error) {
      console.error("Error fetching contract:", error);
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });
  
  // Create a new contract
  app.post("/api/contracts", async (req, res) => {
    try {
      const contractData = insertContractSchema.parse(req.body);
      const newContract = await storage.createContract(contractData);
      res.status(201).json(newContract);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating contract:", error);
      res.status(500).json({ message: "Failed to create contract" });
    }
  });
  
  // Update a contract
  app.patch("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contract ID" });
      }
      
      const contractData = updateContractSchema.parse(req.body);
      const updatedContract = await storage.updateContract(id, contractData);
      
      if (!updatedContract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.json(updatedContract);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating contract:", error);
      res.status(500).json({ message: "Failed to update contract" });
    }
  });
  
  // Delete a contract
  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid contract ID" });
      }
      
      const success = await storage.deleteContract(id);
      if (!success) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting contract:", error);
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
