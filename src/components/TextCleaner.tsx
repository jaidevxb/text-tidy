import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Copy, Check, Trash2 } from "lucide-react";

export function TextCleaner() {
  const [fullText, setFullText] = useState("");
  const [textToRemove, setTextToRemove] = useState("");
  const [cleanedText, setCleanedText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removedCount, setRemovedCount] = useState(0);
  const { toast } = useToast();

  const handleCleanText = () => {
    if (!fullText.trim()) {
      toast({
        title: "Missing content",
        description: "Please paste your full text to clean.",
        variant: "destructive",
      });
      return;
    }

    if (!textToRemove.trim()) {
      toast({
        title: "Missing pattern",
        description: "Please specify the text you want to remove.",
        variant: "destructive",
      });
      return;
    }

    const linesToRemove = textToRemove.trim();
    const lines = fullText.split("\n");
    let count = 0;

    const filteredLines = lines.filter((line) => {
      const trimmedLine = line.trim();
      const shouldRemove = trimmedLine === linesToRemove;
      if (shouldRemove) count++;
      return !shouldRemove;
    });

    const result = filteredLines.join("\n");
    setCleanedText(result);
    setRemovedCount(count);

    if (count === 0) {
      toast({
        title: "No matches found",
        description: "The specified text was not found in your content.",
      });
    } else {
      toast({
        title: "Text cleaned",
        description: `Removed ${count} occurrence${count !== 1 ? "s" : ""} successfully.`,
      });
    }
  };

  const handleCopy = async () => {
    if (cleanedText) {
      await navigator.clipboard.writeText(cleanedText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Cleaned text copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setFullText("");
    setTextToRemove("");
    setCleanedText(null);
    setRemovedCount(0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Text Cleaner
        </h1>
        <p className="text-muted-foreground text-sm">
          Remove repeated lines or paragraphs from your text instantly
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Full Text
          </label>
          <Textarea
            size="md"
            placeholder="Paste your full article or content here..."
            value={fullText}
            onChange={(e) => setFullText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Text to Remove
          </label>
          <Textarea
            size="sm"
            placeholder="Paste the exact line or paragraph to remove..."
            value={textToRemove}
            onChange={(e) => setTextToRemove(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="glow"
            size="lg"
            onClick={handleCleanText}
            className="flex-1"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Clean Text
          </Button>
          <Button
            variant="subtle"
            size="lg"
            onClick={handleClear}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Output Section */}
      {cleanedText !== null && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Cleaned Result
              </label>
              {removedCount > 0 && (
                <p className="text-xs text-primary">
                  {removedCount} line{removedCount !== 1 ? "s" : ""} removed
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <Textarea
            size="lg"
            value={cleanedText}
            readOnly
            className="bg-card border-primary/20"
          />
        </div>
      )}
    </div>
  );
}
