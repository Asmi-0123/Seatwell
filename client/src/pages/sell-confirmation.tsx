import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info } from "lucide-react";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { type Game } from "@shared/schema";
import { content } from "@/config/content";

export default function SellConfirmation() {
  const [, setLocation] = useLocation();
  const [selectedGameIds, setSelectedGameIds] = useState<number[]>([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    iban: "",
    accountHolder: "",
    bic: "",
  });

  const { data: games = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  useEffect(() => {
    // Get selected games from localStorage
    const stored = localStorage.getItem('selectedGames');
    if (stored) {
      setSelectedGameIds(JSON.parse(stored));
    } else {
      // Redirect back if no games selected
      setLocation("/sell/games");
    }
  }, [setLocation]);

  const selectedGames = games.filter(game => selectedGameIds.includes(game.id));

  const getGamePayout = (gameId: number) => {
    // Mock payout calculation - 75% of average ticket price
    const payouts: Record<number, number> = {
      1: 6400, // CHF 64
      2: 6900, // CHF 69  
      3: 5900, // CHF 59
      4: 5900, // CHF 59
      5: 5800, // CHF 58
    };
    return payouts[gameId] || 6000;
  };

  const totalPayout = selectedGames.reduce((sum, game) => sum + getGamePayout(game.id), 0);

  const handleConfirm = () => {
    // In a real app, this would create the ticket listings
    setSuccessModalOpen(true);
    localStorage.removeItem('selectedGames');
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    setLocation("/");
  };

  const handleInputChange = (field: string, value: string) => {
    setBankInfo(prev => ({ ...prev, [field]: value }));
  };

  if (selectedGames.length === 0) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Confirm Your Ticket Release
        </h1>
        <p className="text-gray-600">
          Review your selections and provide payment information for your payout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Selected Games Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Selected Games</h2>
          <div className="space-y-4">
            {selectedGames.map((game) => (
              <div key={game.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">
                    {game.homeTeam} vs {game.awayTeam}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(game.date)} • {game.venue}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {formatPrice(getGamePayout(game.id))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Expected Payout:</span>
              <span className="text-xl font-bold text-green-600">
                {formatPrice(totalPayout)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              *{content.sellTicket.expectedPayoutText}
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
          
          {/* Bank Information Explanation */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">{content.sellTicket.bankInfoExplanation.title}</h3>
            <p className="text-blue-800 text-sm">{content.sellTicket.bankInfoExplanation.text}</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={bankInfo.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                placeholder="UBS Switzerland AG"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={bankInfo.iban}
                onChange={(e) => handleInputChange("iban", e.target.value)}
                placeholder="CH93 0076 2011 6238 5295 7"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="account-holder">Account Holder Name</Label>
              <Input
                id="account-holder"
                value={bankInfo.accountHolder}
                onChange={(e) => handleInputChange("accountHolder", e.target.value)}
                placeholder="Max Mustermann"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="bic">BIC/SWIFT (Optional)</Label>
              <Input
                id="bic"
                value={bankInfo.bic}
                onChange={(e) => handleInputChange("bic", e.target.value)}
                placeholder="UBSWCHZH80A"
                className="mt-1"
              />
            </div>
          </div>
          
          {/* Data Security Statement */}
          <div className="mt-6 p-3 bg-green-50 rounded-lg">
            <p className="text-green-800 text-sm font-medium">
              🔒 {content.sellTicket.dataSecurityStatement}
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Actions */}
      <div className="mt-8 text-center">
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> By confirming, your tickets will be listed on the Seatwell platform. 
            You'll retain ownership until they're purchased. We'll notify you immediately when a sale occurs 
            and transfer payment within 3-5 business days after the game.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/sell/games")}
            className="px-6 py-3"
          >
            Back to Selection
          </Button>
          <Button 
            onClick={handleConfirm}
            className="seatwell-primary px-8 py-3"
          >
            Confirm Release
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="max-w-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600 h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tickets Successfully Listed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your tickets are now available for purchase on the Seatwell platform. 
              You'll receive notifications as soon as they're sold.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold mb-2">What happens next:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="text-blue-600 mr-2 h-4 w-4" />
                  <span>Instant notifications when tickets are purchased</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-blue-600 mr-2 h-4 w-4" />
                  <span>Payout within 3-5 days after each game</span>
                </div>
                <div className="flex items-center">
                  <Check className="text-blue-600 mr-2 h-4 w-4" />
                  <span>Email confirmations for all transactions</span>
                </div>
              </div>
            </div>
            
            <Button onClick={handleSuccessClose} className="seatwell-primary">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
