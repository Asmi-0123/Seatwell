import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { theme } from "@/config/content";

export function BackgroundConfig() {
  // Global background state
  const [globalBackgroundType, setGlobalBackgroundType] = useState(theme.background.global.type);
  const [globalGradientValue, setGlobalGradientValue] = useState(theme.background.global.gradient);
  const [globalImageValue, setGlobalImageValue] = useState(theme.background.global.image);
  const [globalSolidValue, setGlobalSolidValue] = useState(theme.background.global.solid);
  
  // Homepage background state
  const [homepageBackgroundType, setHomepageBackgroundType] = useState(theme.background.homepage.type);
  const [homepageGradientValue, setHomepageGradientValue] = useState(theme.background.homepage.gradient);
  const [homepageImageValue, setHomepageImageValue] = useState(theme.background.homepage.image);
  const [homepageSolidValue, setHomepageSolidValue] = useState(theme.background.homepage.solid);

  const handleSave = () => {
    // In a real app, this would save to a config file or database
    console.log("Background config saved:", {
      global: {
        type: globalBackgroundType,
        gradient: globalGradientValue,
        image: globalImageValue,
        solid: globalSolidValue
      },
      homepage: {
        type: homepageBackgroundType,
        gradient: homepageGradientValue,
        image: homepageImageValue,
        solid: homepageSolidValue
      }
    });
    
    // For demo purposes, we'll just show an alert
    alert("Background configuration saved! In a real app, this would update the theme config file and refresh the website.");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Background Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="global">Global Background</TabsTrigger>
            <TabsTrigger value="homepage">Homepage Background</TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="space-y-6">
            <div>
              <Label htmlFor="global-background-type">Global Background Type</Label>
              <Select value={globalBackgroundType} onValueChange={setGlobalBackgroundType}>
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

            {globalBackgroundType === "gradient" && (
              <div>
                <Label htmlFor="global-gradient">Gradient CSS</Label>
                <Textarea
                  id="global-gradient"
                  value={globalGradientValue}
                  onChange={(e) => setGlobalGradientValue(e.target.value)}
                  placeholder="linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
                  className="mt-1 font-mono text-sm"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Preview: 
                  <span 
                    className="inline-block w-20 h-6 ml-2 rounded border"
                    style={{ background: globalGradientValue }}
                  ></span>
                </p>
              </div>
            )}

            {globalBackgroundType === "image" && (
              <div>
                <Label htmlFor="global-image">Image URL</Label>
                <Input
                  id="global-image"
                  value={globalImageValue}
                  onChange={(e) => setGlobalImageValue(e.target.value)}
                  placeholder="https://example.com/background.jpg"
                  className="mt-1"
                />
                {globalImageValue && (
                  <div className="mt-2">
                    <img 
                      src={globalImageValue} 
                      alt="Global background preview" 
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {globalBackgroundType === "solid" && (
              <div>
                <Label htmlFor="global-solid">Solid Color</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="global-solid"
                    value={globalSolidValue}
                    onChange={(e) => setGlobalSolidValue(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={globalSolidValue}
                    onChange={(e) => setGlobalSolidValue(e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <div>
              <Label htmlFor="homepage-background-type">Homepage Background Type</Label>
              <Select value={homepageBackgroundType} onValueChange={setHomepageBackgroundType}>
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

            {homepageBackgroundType === "gradient" && (
              <div>
                <Label htmlFor="homepage-gradient">Gradient CSS</Label>
                <Textarea
                  id="homepage-gradient"
                  value={homepageGradientValue}
                  onChange={(e) => setHomepageGradientValue(e.target.value)}
                  placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  className="mt-1 font-mono text-sm"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Preview: 
                  <span 
                    className="inline-block w-20 h-6 ml-2 rounded border"
                    style={{ background: homepageGradientValue }}
                  ></span>
                </p>
              </div>
            )}

            {homepageBackgroundType === "image" && (
              <div>
                <Label htmlFor="homepage-image">Image URL</Label>
                <Input
                  id="homepage-image"
                  value={homepageImageValue}
                  onChange={(e) => setHomepageImageValue(e.target.value)}
                  placeholder="https://example.com/homepage-background.jpg"
                  className="mt-1"
                />
                {homepageImageValue && (
                  <div className="mt-2">
                    <img 
                      src={homepageImageValue} 
                      alt="Homepage background preview" 
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {homepageBackgroundType === "solid" && (
              <div>
                <Label htmlFor="homepage-solid">Solid Color</Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="homepage-solid"
                    value={homepageSolidValue}
                    onChange={(e) => setHomepageSolidValue(e.target.value)}
                    placeholder="#1e293b"
                    className="flex-1"
                  />
                  <input
                    type="color"
                    value={homepageSolidValue}
                    onChange={(e) => setHomepageSolidValue(e.target.value)}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} className="w-full mt-6 seatwell-primary">
          Save All Background Configurations
        </Button>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded mt-4">
          <strong>Note:</strong> In the actual implementation, background changes would be saved to the 
          config file at <code>client/src/config/content.ts</code> and would instantly update across 
          the entire website. Global background applies to all pages except homepage which has its own setting.
        </div>
      </CardContent>
    </Card>
  );
}