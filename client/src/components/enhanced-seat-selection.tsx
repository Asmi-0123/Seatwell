import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { type Game } from "@shared/schema";
import { Minus, Plus } from "lucide-react";

interface EnhancedSeatSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onPurchase: (seats: string[], totalPrice: number) => void;
}

interface Seat {
  id: string;
  available: boolean;
  price: number;
  section: string;
}

export function EnhancedSeatSelection({ isOpen, onClose, game, onPurchase }: EnhancedSeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());

  // Generate realistic Vaudoise Arena-style layout
  const generateVaudoiseArenaSeats = () => {
    const seats: Seat[] = [];
    
    // Lower Bowl Sections
    const lowerSections = [
      { name: "101", rows: 15, seatsPerRow: 20, price: 9500 },
      { name: "102", rows: 15, seatsPerRow: 18, price: 9000 },
      { name: "103", rows: 15, seatsPerRow: 16, price: 8500 },
      { name: "104", rows: 15, seatsPerRow: 18, price: 9000 },
      { name: "105", rows: 15, seatsPerRow: 20, price: 9500 },
    ];

    // Upper Bowl Sections
    const upperSections = [
      { name: "201", rows: 12, seatsPerRow: 16, price: 7500 },
      { name: "202", rows: 12, seatsPerRow: 14, price: 7000 },
      { name: "203", rows: 12, seatsPerRow: 12, price: 6500 },
      { name: "204", rows: 12, seatsPerRow: 14, price: 7000 },
      { name: "205", rows: 12, seatsPerRow: 16, price: 7500 },
    ];

    [...lowerSections, ...upperSections].forEach(section => {
      for (let row = 1; row <= section.rows; row++) {
        for (let seat = 1; seat <= section.seatsPerRow; seat++) {
          seats.push({
            id: `${section.name}-${row}-${seat}`,
            available: Math.random() > 0.25, // 75% available
            price: section.price,
            section: section.name
          });
        }
      }
    });

    return seats;
  };

  const [seats] = useState(generateVaudoiseArenaSeats());

  const handleSeatClick = (seatId: string, available: boolean) => {
    if (!available) return;
    
    const newSelected = new Set(selectedSeats);
    if (newSelected.has(seatId)) {
      newSelected.delete(seatId);
    } else {
      newSelected.add(seatId);
    }
    setSelectedSeats(newSelected);
  };

  const getTotalPrice = () => {
    return Array.from(selectedSeats).reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handlePurchase = () => {
    if (selectedSeats.size > 0) {
      onPurchase(Array.from(selectedSeats), getTotalPrice());
      setSelectedSeats(new Set());
    }
  };

  const handleClose = () => {
    setSelectedSeats(new Set());
    onClose();
  };

  const getSectionSeats = (sectionName: string) => {
    return seats.filter(seat => seat.section === sectionName);
  };

  const renderSection = (sectionName: string, title: string) => {
    const sectionSeats = getSectionSeats(sectionName);
    const rows = [...new Set(sectionSeats.map(seat => parseInt(seat.id.split('-')[1])))].sort((a, b) => a - b);
    
    return (
      <div key={sectionName} className="mb-6">
        <h3 className="text-sm font-semibold text-center mb-2">{title}</h3>
        <div className="border rounded-lg p-3 bg-gray-50">
          {rows.map(rowNumber => {
            const rowSeats = sectionSeats.filter(seat => seat.id.includes(`-${rowNumber}-`));
            return (
              <div key={`${sectionName}-${rowNumber}`} className="flex justify-center items-center mb-1">
                <span className="text-xs text-gray-500 w-8 text-right mr-2">{rowNumber}</span>
                <div className="flex gap-0.5">
                  {rowSeats.map(seat => (
                    <button
                      key={seat.id}
                      className={`w-4 h-4 text-xs rounded-sm transition-colors ${
                        selectedSeats.has(seat.id)
                          ? "bg-blue-500 text-white"
                          : seat.available
                          ? "bg-green-300 hover:bg-green-400 text-green-800"
                          : "bg-red-300 cursor-not-allowed text-red-800"
                      }`}
                      onClick={() => handleSeatClick(seat.id, seat.available)}
                      title={seat.available ? `${seat.id} - ${formatPrice(seat.price)}` : "Taken"}
                      disabled={!seat.available}
                    >
                      {seat.id.split('-')[2]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Your Seats - Vaudoise Arena</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Arena Layout */}
          <div className="bg-gray-100 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="bg-green-600 text-white py-3 px-6 rounded-lg inline-block font-semibold">
                ICE RINK
              </div>
              <p className="text-sm text-gray-600 mt-2">{game.homeTeam} vs {game.awayTeam}</p>
            </div>
            
            {/* Upper Bowl */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-center mb-4">Upper Bowl</h2>
              <div className="grid grid-cols-5 gap-4">
                {renderSection("201", "Section 201")}
                {renderSection("202", "Section 202")}
                {renderSection("203", "Section 203")}
                {renderSection("204", "Section 204")}
                {renderSection("205", "Section 205")}
              </div>
            </div>

            {/* Lower Bowl */}
            <div>
              <h2 className="text-lg font-bold text-center mb-4">Lower Bowl (Premium)</h2>
              <div className="grid grid-cols-5 gap-4">
                {renderSection("101", "Section 101")}
                {renderSection("102", "Section 102")}
                {renderSection("103", "Section 103")}
                {renderSection("104", "Section 104")}
                {renderSection("105", "Section 105")}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center space-x-8 text-sm mt-6 pt-4 border-t">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-300 rounded-sm mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-300 rounded-sm mr-2"></div>
                <span>Taken</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
          
          {/* Selection Summary */}
          {selectedSeats.size > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Selected Seats ({selectedSeats.size})</h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedSeats).map(seatId => {
                    const seat = seats.find(s => s.id === seatId);
                    return (
                      <Badge key={seatId} variant="secondary" className="text-sm">
                        {seatId} - {seat ? formatPrice(seat.price) : ""}
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <span className="font-medium text-lg">Total: {formatPrice(getTotalPrice())}</span>
                    <span className="text-gray-500 ml-2">incl. fees</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Game: {game.homeTeam} vs {game.awayTeam}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Purchase Button */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={selectedSeats.size === 0}
              className="seatwell-primary"
            >
              Purchase {selectedSeats.size} Ticket{selectedSeats.size !== 1 ? 's' : ''} - {formatPrice(getTotalPrice())}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}