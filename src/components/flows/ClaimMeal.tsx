import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { Check, X, Upload } from 'lucide-react';

const SAMPLE_CSV = `name,email
John Doe,john@example.com
Jane Smith,jane@example.com
Alice Wong,alice@example.com
Bob Kumar,bob@example.com`;

const FOODS = ['Rice', 'Noodles', 'Sandwich', 'Salad', 'Pasta'];
const DRINKS = ['Water', 'Coffee', 'Juice', 'Tea', 'Soda'];

const generateToken = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

interface CSVRow {
  name: string;
  email: string;
}

export function ClaimMeal() {
  const { addToken, markTokenUsed } = useApp();
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvText, setCsvText] = useState('');
  const [name, setName] = useState('');
  const [verified, setVerified] = useState<boolean | null>(null);
  const [matchedRow, setMatchedRow] = useState<CSVRow | null>(null);
  const [food, setFood] = useState('');
  const [drink, setDrink] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');
    
    if (nameIdx === -1 || emailIdx === -1) return [];
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      return { name: values[nameIdx] || '', email: values[emailIdx] || '' };
    }).filter(row => row.name && row.email);
  };

  const handleLoadCSV = (text: string) => {
    const data = parseCSV(text);
    setCsvData(data);
    setCsvText(text);
    if (data.length > 0) {
      toast.success(`Loaded ${data.length} rows`);
    } else {
      toast.error('Invalid CSV format');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        handleLoadCSV(ev.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleVerify = () => {
    const found = csvData.find(row => 
      row.name.toLowerCase() === name.toLowerCase()
    );
    setVerified(!!found);
    setMatchedRow(found || null);
    if (found) {
      toast.success('Name verified!');
    } else {
      toast.error('Name not found in database');
    }
  };

  const handleGenerateToken = () => {
    if (!matchedRow || !food || !drink) return;
    
    const token = generateToken();
    const id = crypto.randomUUID();
    
    addToken({
      id,
      token,
      name: matchedRow.name,
      email: matchedRow.email,
      food,
      drink,
      createdAt: new Date().toISOString(),
      used: false,
    });
    
    setGeneratedToken(token);
    setTokenId(id);
    toast.success('Token generated!', { description: token });
  };

  const handleSendToDashboard = () => {
    if (tokenId) {
      markTokenUsed(tokenId);
      toast.success('Token sent to dashboard and marked as used');
      document.querySelector('#dashboard')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setName('');
    setVerified(null);
    setMatchedRow(null);
    setFood('');
    setDrink('');
    setGeneratedToken(null);
    setTokenId(null);
  };

  return (
    <div className="space-y-6" aria-live="polite">
      {/* CSV Upload */}
      <div className="space-y-3">
        <Label>Customer Database (CSV)</Label>
        <div className="flex gap-2">
          <label className="flex-1">
            <div className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {csvData.length > 0 ? `${csvData.length} rows loaded` : 'Upload CSV file'}
              </span>
            </div>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>
          <Button variant="outline" onClick={() => handleLoadCSV(SAMPLE_CSV)}>
            Load Sample
          </Button>
        </div>
        <Textarea
          placeholder="Or paste CSV here (name,email headers required)"
          value={csvText}
          onChange={(e) => handleLoadCSV(e.target.value)}
          className="h-24 font-mono text-xs"
        />
      </div>

      {/* Name Verification */}
      <div className="space-y-3">
        <Label htmlFor="verify-name">Verify Your Name</Label>
        <div className="flex gap-2">
          <Input
            id="verify-name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setVerified(null);
              setMatchedRow(null);
            }}
            disabled={csvData.length === 0}
          />
          <Button onClick={handleVerify} disabled={!name || csvData.length === 0}>
            Verify
          </Button>
        </div>
        <AnimatePresence>
          {verified !== null && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 text-sm ${verified ? 'text-green-600' : 'text-destructive'}`}
            >
              {verified ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {verified ? `Found: ${matchedRow?.name} (${matchedRow?.email})` : 'Name not found'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Food & Drink Selection */}
      {verified && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label>Food</Label>
            <Select value={food} onValueChange={setFood}>
              <SelectTrigger>
                <SelectValue placeholder="Choose food" />
              </SelectTrigger>
              <SelectContent>
                {FOODS.map(f => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Drink</Label>
            <Select value={drink} onValueChange={setDrink}>
              <SelectTrigger>
                <SelectValue placeholder="Choose drink" />
              </SelectTrigger>
              <SelectContent>
                {DRINKS.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}

      {/* Generate Token */}
      {verified && food && drink && !generatedToken && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Button onClick={handleGenerateToken} className="w-full">
            Generate Token
          </Button>
        </motion.div>
      )}

      {/* Token Display */}
      {generatedToken && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-center space-y-4"
        >
          <p className="text-sm text-muted-foreground">Your Token</p>
          <p className="text-3xl font-mono font-bold text-primary tracking-widest">{generatedToken}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleSendToDashboard}>
              Send to Dashboard
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Create Another
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
