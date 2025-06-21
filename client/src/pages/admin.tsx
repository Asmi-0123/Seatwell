import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  TicketIcon, 
  Users, 
  ArrowUpDown, 
  TrendingUp, 
  RefreshCw,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";

export default function Admin() {
  const [lastUpdated] = useState(new Date());

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ["/api/tickets"],
  });

  const { data: games = [] } = useQuery({
    queryKey: ["/api/games"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Calculate stats
  const activeListings = tickets.filter((ticket: any) => ticket.status === "available").length;
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum: number, t: any) => sum + t.amount, 0);

  const getGameName = (gameId: number) => {
    const game = games.find((g: any) => g.id === gameId);
    return game ? `${game.homeTeam} vs ${game.awayTeam}` : "Unknown Game";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      available: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800", 
      sold: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    
    return (
      <Badge className={variants[status] || variants.cancelled}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Admin Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage tickets, users, and platform activity</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <TicketIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeListings}</div>
            <p className="text-xs text-green-600 font-medium">
              +12% vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-green-600 font-medium">
              +8% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-green-600 font-medium">
              +24% this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            <p className="text-xs text-green-600 font-medium">
              +18% vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Card>
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tickets">Ticket Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="games">Game Schedule</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Ticket Management Tab */}
          <TabsContent value="tickets" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Ticket Listings</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            {ticketsLoading ? (
              <div className="text-center py-8">Loading tickets...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Game</TableHead>
                    <TableHead>Seat</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket: any) => (
                    <TableRow key={ticket.id}>
                      <TableCell>#{ticket.id.toString().padStart(3, '0')}</TableCell>
                      <TableCell>{getGameName(ticket.gameId)}</TableCell>
                      <TableCell>{ticket.seatNumber}</TableCell>
                      <TableCell>{formatPrice(ticket.price)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">User Management</h2>
              <Button className="seatwell-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>#001</TableCell>
                  <TableCell>Max Mustermann</TableCell>
                  <TableCell>max.muster@email.ch</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800">Season Holder</Badge>
                  </TableCell>
                  <TableCell>Dec 15, 2024</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Suspend</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#002</TableCell>
                  <TableCell>Anna Weber</TableCell>
                  <TableCell>anna.weber@email.ch</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Buyer</Badge>
                  </TableCell>
                  <TableCell>Dec 18, 2024</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">View</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Suspend</Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          {/* Game Schedule Tab */}
          <TabsContent value="games" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Game Schedule</h2>
              <Button className="seatwell-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Game
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game: any) => (
                <Card key={game.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {game.homeTeam} vs {game.awayTeam}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatDateTime(game.date)}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">{game.venue}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Tickets: {tickets.filter((t: any) => t.gameId === game.id).length} listed
                      </span>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>#{transaction.id.toString().padStart(3, '0')}</TableCell>
                    <TableCell>{getGameName(transaction.ticketId)}</TableCell>
                    <TableCell>{formatPrice(transaction.amount)}</TableCell>
                    <TableCell>{formatDateTime(transaction.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
