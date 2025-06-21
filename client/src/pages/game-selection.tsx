import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { type Game } from "@shared/schema";

export default function GameSelection() {
  const [, setLocation] = useLocation();
  const [selectedGames, setSelectedGames] = useState<Set<number>>(new Set());

  const { data: games = [], isLoading } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const toggleGameSelection = (gameId: number) => {
    const newSelection = new Set(selectedGames);
    if (newSelection.has(gameId)) {
      newSelection.delete(gameId);
    } else {
      newSelection.add(gameId);
    }
    setSelectedGames(newSelection);
  };

  const getTeamColors = (homeTeam: string) => {
    const colors: Record<string, string> = {
      "HC Davos": "bg-blue-600",
      "SC Bern": "bg-red-600",
      "Fribourg-Gottéron": "bg-gray-600", 
      "ZSC Lions": "bg-green-600",
      "HC Ambri-Piotta": "bg-purple-600",
    };
    return colors[homeTeam] || "bg-blue-600";
  };

  const handleContinue = () => {
    if (selectedGames.size > 0) {
      // Store selected games in localStorage for next step
      localStorage.setItem('selectedGames', JSON.stringify(Array.from(selectedGames)));
      setLocation("/sell/confirm");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Choose the games you cannot attend
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          <div>1. Select all games you cannot attend</div>
          <div>2. Confirm your choices</div>
          <div>3. Add your payment info to receive your payout</div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading games...</div>
      ) : (
        <>
          {/* Game Selection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {games.map((game) => (
              <div key={game.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-16 h-16 ${getTeamColors(game.homeTeam)} rounded-full flex items-center justify-center mr-4`}>
                      <div className="text-white text-center">
                        <div className="font-bold text-sm">{game.homeTeam.split(' ')[0]}</div>
                        <div className="text-xs">{formatDateTime(game.date).split(' • ')[0].split(' ')[0]}</div>
                        <div className="text-xs">{formatDateTime(game.date).split(' • ')[1]}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-semibold text-gray-800">
                        {formatDateTime(game.date)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {game.homeTeam} vs {game.awayTeam}
                      </div>
                      <div className="text-sm text-gray-500">
                        Location: {game.venue}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => toggleGameSelection(game.id)}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${
                        selectedGames.has(game.id)
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-800 hover:bg-gray-900 text-white"
                      }`}
                    >
                      <span>I want to sell</span>
                      {selectedGames.has(game.id) && (
                        <Check className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handleContinue}
              disabled={selectedGames.size === 0}
              className="seatwell-primary px-8 py-3 text-lg"
            >
              Continue to Confirmation
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
