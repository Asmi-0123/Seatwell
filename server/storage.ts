import { users, games, tickets, transactions, type User, type InsertUser, type Game, type InsertGame, type Ticket, type InsertTicket, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Games
  getGame(id: number): Promise<Game | undefined>;
  getAllGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  
  // Tickets
  getTicket(id: number): Promise<Ticket | undefined>;
  getTicketsByGame(gameId: number): Promise<Ticket[]>;
  getTicketsBySeller(sellerId: number): Promise<Ticket[]>;
  getAllTickets(): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  
  // Transactions
  getTransaction(id: number): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private tickets: Map<number, Ticket>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentGameId: number;
  private currentTicketId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.tickets = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentGameId = 1;
    this.currentTicketId = 1;
    this.currentTransactionId = 1;
    
    this.seedData();
  }

  private seedData() {
    // Seed users
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      email: "admin@seatwell.ch",
      password: "admin123",
      type: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    const seasonalUser: User = {
      id: this.currentUserId++,
      username: "seasonal.holder",
      email: "seasonal@club.ch",
      password: "demo",
      type: "seller",
      createdAt: new Date(),
    };
    this.users.set(seasonalUser.id, seasonalUser);

    // Seed games
    const games = [
      {
        homeTeam: "HC Davos",
        awayTeam: "EV Zug",
        date: new Date("2024-12-30T20:00:00Z"),
        venue: "Vaillant Arena",
        status: "upcoming",
      },
      {
        homeTeam: "SC Bern",
        awayTeam: "Genève-Servette",
        date: new Date("2025-01-03T19:45:00Z"),
        venue: "PostFinance Arena",
        status: "upcoming",
      },
      {
        homeTeam: "Fribourg-Gottéron",
        awayTeam: "Lausanne HC",
        date: new Date("2025-01-05T20:00:00Z"),
        venue: "BCF Arena",
        status: "upcoming",
      },
      {
        homeTeam: "ZSC Lions",
        awayTeam: "EHC Kloten",
        date: new Date("2025-01-08T19:45:00Z"),
        venue: "Swiss Life Arena",
        status: "upcoming",
      },
      {
        homeTeam: "HC Ambri-Piotta",
        awayTeam: "EHC Biel",
        date: new Date("2025-01-10T20:00:00Z"),
        venue: "Gottardo Arena",
        status: "upcoming",
      },
    ];

    games.forEach(game => {
      const newGame: Game = {
        id: this.currentGameId++,
        ...game,
        createdAt: new Date(),
      };
      this.games.set(newGame.id, newGame);
    });

    // Seed some tickets
    const tickets = [
      { gameId: 1, sellerId: seasonalUser.id, seatNumber: "A1", price: 8500, status: "available" },
      { gameId: 1, sellerId: seasonalUser.id, seatNumber: "A2", price: 8500, status: "available" },
      { gameId: 2, sellerId: seasonalUser.id, seatNumber: "B5", price: 9200, status: "available" },
      { gameId: 4, sellerId: seasonalUser.id, seatNumber: "C3", price: 7800, status: "sold" },
    ];

    tickets.forEach(ticket => {
      const newTicket: Ticket = {
        id: this.currentTicketId++,
        ...ticket,
        buyerId: ticket.status === "sold" ? adminUser.id : null,
        createdAt: new Date(),
        soldAt: ticket.status === "sold" ? new Date() : null,
      };
      this.tickets.set(newTicket.id, newTicket);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Game methods
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }

  async getAllGames(): Promise<Game[]> {
    return Array.from(this.games.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const game: Game = {
      ...insertGame,
      id: this.currentGameId++,
      createdAt: new Date(),
    };
    this.games.set(game.id, game);
    return game;
  }

  async updateGame(id: number, gameUpdate: Partial<InsertGame>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;

    const updatedGame = { ...game, ...gameUpdate };
    this.games.set(id, updatedGame);
    return updatedGame;
  }

  // Ticket methods
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async getTicketsByGame(gameId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.gameId === gameId);
  }

  async getTicketsBySeller(sellerId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(ticket => ticket.sellerId === sellerId);
  }

  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const ticket: Ticket = {
      ...insertTicket,
      id: this.currentTicketId++,
      buyerId: null,
      createdAt: new Date(),
      soldAt: null,
    };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }

  async updateTicket(id: number, ticketUpdate: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;

    const updatedTicket = { ...ticket, ...ticketUpdate };
    if (ticketUpdate.status === "sold" && !ticket.soldAt) {
      updatedTicket.soldAt = new Date();
    }
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      ...insertTransaction,
      id: this.currentTransactionId++,
      createdAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }
}

export const storage = new MemStorage();
