import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { type Game } from "@shared/schema";

interface TicketListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TicketListingModal({ isOpen, onClose }: TicketListingModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    gameId: "",
    seatNumber: "",
    price: "",
  });

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Ticket Listed Successfully!",
      description: "Your ticket is now available for purchase.",
    });
    setFormData({ gameId: "", seatNumber: "", price: "" });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>List New Ticket</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="game">Game</Label>
            <Select value={formData.gameId} onValueChange={(value) => handleInputChange("gameId", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => (
                  <SelectItem key={game.id} value={game.id.toString()}>
                    {game.homeTeam} vs {game.awayTeam} - {new Date(game.date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="seat">Seat Number</Label>
            <Input
              id="seat"
              value={formData.seatNumber}
              onChange={(e) => handleInputChange("seatNumber", e.target.value)}
              placeholder="e.g., A5, B12, C7"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Price (CHF)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="85"
              className="mt-1"
              required
            />
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 seatwell-primary">
              List Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}