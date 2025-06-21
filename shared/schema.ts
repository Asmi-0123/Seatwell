import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  type: text("type").notNull().default("buyer"), // buyer, seller, admin
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  date: timestamp("date").notNull(),
  venue: text("venue").notNull(),
  status: text("status").notNull().default("upcoming"), // upcoming, active, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").references(() => games.id).notNull(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id),
  seatNumber: text("seat_number").notNull(),
  price: integer("price").notNull(), // price in cents
  status: text("status").notNull().default("available"), // available, pending, sold, cancelled
  createdAt: timestamp("created_at").defaultNow(),
  soldAt: timestamp("sold_at"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => tickets.id).notNull(),
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(), // amount in cents
  status: text("status").notNull().default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  type: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  homeTeam: true,
  awayTeam: true,
  date: true,
  venue: true,
  status: true,
});

export const insertTicketSchema = createInsertSchema(tickets).pick({
  gameId: true,
  sellerId: true,
  seatNumber: true,
  price: true,
  status: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  ticketId: true,
  buyerId: true,
  sellerId: true,
  amount: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
