import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { useQuery } from "@tanstack/react-query";
import { type Game } from "@shared/schema";

export default function Home() {
  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["/api/tickets"],
  });

  // Calculate ticket availability for each game
  const getTicketStatus = (gameId: number) => {
    const gameTickets = tickets.filter((ticket: any) => 
      ticket.gameId === gameId && ticket.status === "available"
    );
    
    if (gameTickets.length === 0) return "none";
    if (gameTickets.length <= 2) return "few-left";
    return "available";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Seatwell: Get Your Seat and Game on!
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Do you want to attend a game but it is sold out? We got you covered!
        </p>
        <p className="text-lg text-gray-500 mb-8">
          Resell or buy tickets here
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          We believe in sharing value. Our platform ensures that every empty seat becomes an opportunity for someone to feel good, fans smiling to buyer.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/buy">
            <Button size="lg" className="bg-gray-800 text-white px-8 py-4 text-lg hover:bg-gray-900">
              Buy a Ticket
            </Button>
          </Link>
          <Link href="/sell">
            <Button size="lg" variant="outline" className="seatwell-secondary px-8 py-4 text-lg">
              Sell a Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Games on the Horizon */}
      <div className="mb-16">
        <h2 className="text-5xl font-bold text-gray-300 text-center mb-12">
          GAMES ON THE HORIZON
        </h2>
        
        {isLoading ? (
          <div className="text-center">Loading games...</div>
        ) : (
          <>
            {/* Featured Game */}
            {games.length > 0 && (
              <div className="flex justify-center mb-8">
                <div className="w-64">
                  <Link href="/buy">
                    <GameCard
                      game={games[0]}
                      ticketStatus={getTicketStatus(games[0].id)}
                      className="transform hover:scale-105 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            )}

            {/* Game Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {games.slice(1).map((game) => (
                <Link key={game.id} href="/buy">
                  <GameCard
                    game={game}
                    ticketStatus={getTicketStatus(game.id)}
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
