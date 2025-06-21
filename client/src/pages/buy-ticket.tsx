import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GameCard } from "@/components/game-card";
import { SeatSelectionModal } from "@/components/seat-selection-modal";
import { PurchaseModal } from "@/components/purchase-modal";
import { type Game } from "@shared/schema";

export default function BuyTicket() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [seatSelectionOpen, setSeatSelectionOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchasedSeat, setPurchasedSeat] = useState("");

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

  const handleGameClick = (game: Game) => {
    const ticketStatus = getTicketStatus(game.id);
    if (ticketStatus === "available" || ticketStatus === "few-left") {
      setSelectedGame(game);
      setSeatSelectionOpen(true);
    }
  };

  const handlePurchase = (seatNumber: string) => {
    setPurchasedSeat(seatNumber);
    setSeatSelectionOpen(false);
    setPurchaseModalOpen(true);
  };

  const closePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedGame(null);
    setPurchasedSeat("");
  };

  return (
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
            {games.map((game) => (
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

      {/* Seat Selection Modal */}
      <SeatSelectionModal
        isOpen={seatSelectionOpen}
        onClose={() => setSeatSelectionOpen(false)}
        game={selectedGame}
        onPurchase={handlePurchase}
      />

      {/* Purchase Confirmation Modal */}
      <PurchaseModal
        isOpen={purchaseModalOpen}
        onClose={closePurchaseModal}
        game={selectedGame}
        seatNumber={purchasedSeat}
        price={8500}
      />
    </div>
  );
}
