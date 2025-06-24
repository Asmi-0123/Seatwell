import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload, X } from "lucide-react";
import { type Game } from "@shared/schema";

interface GameManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  game?: Game | null;
  mode: "add" | "edit";
}

export function GameManagementModal({ isOpen, onClose, game, mode }: GameManagementModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    homeTeam: game?.homeTeam || "",
    awayTeam: game?.awayTeam || "",
    venue: game?.venue || "",
    date: game?.date ? new Date(game.date).toISOString().slice(0, 16) : "",
    status: game?.status || "upcoming",
  });
  const [gameImage, setGameImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const createGameMutation = useMutation({
    mutationFn: (gameData: any) => 
      fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      }).then(res => {
        if (!res.ok) throw new Error('Failed to create game');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({
        title: "Game Added Successfully!",
        description: `${formData.homeTeam} vs ${formData.awayTeam} has been added.`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add game. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateGameMutation = useMutation({
    mutationFn: (gameData: any) => 
      fetch(`/api/games/${game?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData)
      }).then(res => {
        if (!res.ok) throw new Error('Failed to update game');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      toast({
        title: "Game Updated Successfully!",
        description: `${formData.homeTeam} vs ${formData.awayTeam} has been updated.`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update game. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const gameData = {
      ...formData,
      date: new Date(formData.date).toISOString(),
    };

    if (mode === "add") {
      createGameMutation.mutate(gameData);
    } else {
      updateGameMutation.mutate(gameData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGameImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setGameImage(null);
    setImagePreview("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add New Game" : "Edit Game"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="homeTeam">Home Team</Label>
              <Select value={formData.homeTeam} onValueChange={(value) => handleInputChange("homeTeam", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select home team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HC Davos">HC Davos</SelectItem>
                  <SelectItem value="SC Bern">SC Bern</SelectItem>
                  <SelectItem value="Fribourg-Gottéron">Fribourg-Gottéron</SelectItem>
                  <SelectItem value="ZSC Lions">ZSC Lions</SelectItem>
                  <SelectItem value="HC Ambri-Piotta">HC Ambri-Piotta</SelectItem>
                  <SelectItem value="Lausanne HC">Lausanne HC</SelectItem>
                  <SelectItem value="Genève-Servette">Genève-Servette</SelectItem>
                  <SelectItem value="EV Zug">EV Zug</SelectItem>
                  <SelectItem value="EHC Kloten">EHC Kloten</SelectItem>
                  <SelectItem value="EHC Biel">EHC Biel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="awayTeam">Away Team</Label>
              <Select value={formData.awayTeam} onValueChange={(value) => handleInputChange("awayTeam", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select away team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HC Davos">HC Davos</SelectItem>
                  <SelectItem value="SC Bern">SC Bern</SelectItem>
                  <SelectItem value="Fribourg-Gottéron">Fribourg-Gottéron</SelectItem>
                  <SelectItem value="ZSC Lions">ZSC Lions</SelectItem>
                  <SelectItem value="HC Ambri-Piotta">HC Ambri-Piotta</SelectItem>
                  <SelectItem value="Lausanne HC">Lausanne HC</SelectItem>
                  <SelectItem value="Genève-Servette">Genève-Servette</SelectItem>
                  <SelectItem value="EV Zug">EV Zug</SelectItem>
                  <SelectItem value="EHC Kloten">EHC Kloten</SelectItem>
                  <SelectItem value="EHC Biel">EHC Biel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="venue">Venue</Label>
            <Select value={formData.venue} onValueChange={(value) => handleInputChange("venue", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Vaillant Arena">Vaillant Arena (Davos)</SelectItem>
                <SelectItem value="PostFinance Arena">PostFinance Arena (Bern)</SelectItem>
                <SelectItem value="BCF Arena">BCF Arena (Fribourg)</SelectItem>
                <SelectItem value="Swiss Life Arena">Swiss Life Arena (Zurich)</SelectItem>
                <SelectItem value="Gottardo Arena">Gottardo Arena (Ambri)</SelectItem>
                <SelectItem value="Vaudoise Arena">Vaudoise Arena (Lausanne)</SelectItem>
                <SelectItem value="Patinoire des Vernets">Patinoire des Vernets (Geneva)</SelectItem>
                <SelectItem value="Bossard Arena">Bossard Arena (Zug)</SelectItem>
                <SelectItem value="SWISS Arena">SWISS Arena (Kloten)</SelectItem>
                <SelectItem value="Tissot Arena">Tissot Arena (Biel)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Game Image Upload */}
          <div>
            <Label>Game Image</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Game preview" 
                    className="w-48 h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-48 h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="text-sm text-gray-500">Upload image</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 seatwell-primary"
              disabled={createGameMutation.isPending || updateGameMutation.isPending}
            >
              {createGameMutation.isPending || updateGameMutation.isPending 
                ? "Saving..." 
                : mode === "add" ? "Add Game" : "Update Game"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}