import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GameCard } from "@/components/game-card";
import { EnhancedSeatSelection } from "@/components/enhanced-seat-selection";
import { EnhancedPurchaseModal } from "@/components/enhanced-purchase-modal";
import { BackgroundWrapper } from "@/components/background-wrapper";
import { type Game } from "@shared/schema";

export default function BuyTicket() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [seatSelectionOpen, setSeatSelectionOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchasedSeats, setPurchasedSeats] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: tickets = [] } = useQuery({
    queryKey: ["/api/tickets"],
  });

  // Enhanced ticket availability logic
  const getTicketStatus = (gameId: number) => {
    const gameTickets = tickets.filter((ticket: any) => 
      ticket.gameId === gameId && ticket.status === "available"
    );
    
    if (gameTickets.length === 0) return "none";
    if (gameTickets.length <= 3) return "few-left";
    return "available";
  };

  // Sort games chronologically
  const sortedGames = games.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleGameClick = (game: Game) => {
    const ticketStatus = getTicketStatus(game.id);
    if (ticketStatus === "available" || ticketStatus === "few-left") {
      setSelectedGame(game);
      setSeatSelectionOpen(true);
    }
  };

  const handlePurchase = (seats: string[], price: number) => {
    // Mock purchase logic - simulate success
    setPurchasedSeats(seats);
    setTotalPrice(price);
    setSeatSelectionOpen(false);
    setPurchaseModalOpen(true);
  };

  const closePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedGame(null);
    setPurchasedSeats([]);
    setTotalPrice(0);
  };

  return (
    <BackgroundWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Find your Ticket here!
        </h1>
        <p className="text-red-500 text-sm">
          *This page is personalized for every club individually*
        </p>
      </div>

      {/* Games Section */}
      <div className="mb-16">
        <h2 className="text-6xl font-bold text-gray-300 text-center mb-12">
          GAMES
        </h2>
        
        {isLoading ? (
          <div className="text-center">Loading games...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {sortedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                ticketStatus={getTicketStatus(game.id)}
                onClick={() => handleGameClick(game)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Seat Selection Modal */}
      <EnhancedSeatSelection
        isOpen={seatSelectionOpen}
        onClose={() => setSeatSelectionOpen(false)}
        game={selectedGame}
        onPurchase={handlePurchase}
      />

      {/* Enhanced Purchase Modal */}
      <EnhancedPurchaseModal
        isOpen={purchaseModalOpen}
        onClose={closePurchaseModal}
        game={selectedGame}
        seatNumbers={purchasedSeats}
        totalPrice={totalPrice}
      />
      </div>
    </BackgroundWrapper>
  );
}
