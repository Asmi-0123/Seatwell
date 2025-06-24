import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { theme } from "@/config/content";

export function BackgroundConfig() {
  const [backgroundType, setBackgroundType] = useState(theme.background.type);
  const [gradientValue, setGradientValue] = useState(theme.background.gradient);
  const [imageValue, setImageValue] = useState(theme.background.image);
  const [solidValue, setSolidValue] = useState(theme.background.solid);

  const handleSave = () => {
    // In a real app, this would save to a config file or database
    console.log("Background config saved:", {
      type: backgroundType,
      gradient: gradientValue,
      image: imageValue,
      solid: solidValue
    });
    
    // For demo purposes, we'll just show an alert
    alert("Background configuration saved! In a real app, this would update the theme config file.");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Background Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="background-type">Background Type</Label>
          <Select value={backgroundType} onValueChange={setBackgroundType}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gradient">Gradient</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="solid">Solid Color</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {backgroundType === "gradient" && (
          <div>
            <Label htmlFor="gradient">Gradient CSS</Label>
            <Textarea
              id="gradient"
              value={gradientValue}
              onChange={(e) => setGradientValue(e.target.value)}
              placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              className="mt-1 font-mono text-sm"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              Use CSS gradient syntax. Preview: 
              <span 
                className="inline-block w-20 h-6 ml-2 rounded border"
                style={{ background: gradientValue }}
              ></span>
            </p>
          </div>
        )}

        {backgroundType === "image" && (
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={imageValue}
              onChange={(e) => setImageValue(e.target.value)}
              placeholder="https://example.com/background.jpg"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use high-resolution images (1920x1080+) for best results
            </p>
            {imageValue && (
              <div className="mt-2">
                <img 
                  src={imageValue} 
                  alt="Background preview" 
                  className="w-full h-32 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {backgroundType === "solid" && (
          <div>
            <Label htmlFor="solid">Solid Color</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                id="solid"
                value={solidValue}
                onChange={(e) => setSolidValue(e.target.value)}
                placeholder="#f8fafc"
                className="flex-1"
              />
              <input
                type="color"
                value={solidValue}
                onChange={(e) => setSolidValue(e.target.value)}
                className="w-12 h-10 border rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full seatwell-primary">
          Save Background Configuration
        </Button>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
          <strong>Note:</strong> In the actual implementation, background changes would be saved to the 
          config file at <code>client/src/config/content.ts</code> and would instantly update across 
          the entire website.
        </div>
      </CardContent>
    </Card>
  );
}