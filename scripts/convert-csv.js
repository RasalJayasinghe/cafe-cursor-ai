#!/usr/bin/env node

/**
 * Convert Luma CSV export to static JSON
 *
 * Usage:
 *   node scripts/convert-csv.js path/to/luma-export.csv
 *
 * Output:
 *   data/static/attendees.json
 */

const fs = require("fs");
const path = require("path");

// Parse CSV line (handles quoted fields with commas)
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Generate unique token
function generateToken() {
  const prefix = "CC";
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${number}`;
}

// Main conversion function
function convertCSV(inputPath) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(inputPath, "utf-8");
    const lines = csvContent.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      console.error("❌ CSV file is empty");
      process.exit(1);
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase());
    console.log("📋 CSV Headers:", headers);

    // Find column indices
    const emailIdx = headers.findIndex((h) => h.includes("email"));
    const nameIdx = headers.findIndex((h) => h.includes("name"));

    if (emailIdx === -1) {
      console.error('❌ CSV must have an "email" column');
      process.exit(1);
    }

    // Parse data rows
    const attendees = [];
    const usedTokens = new Set();
    const usedEmails = new Set();

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);

      if (values.length < headers.length) {
        console.warn(`⚠️  Skipping incomplete row ${i + 1}`);
        continue;
      }

      const email = values[emailIdx]?.trim().toLowerCase();
      const name = nameIdx >= 0 ? values[nameIdx]?.trim() : email.split("@")[0];

      if (!email || !email.includes("@")) {
        console.warn(`⚠️  Skipping invalid email on row ${i + 1}: ${email}`);
        continue;
      }

      if (usedEmails.has(email)) {
        console.warn(`⚠️  Duplicate email on row ${i + 1}: ${email}`);
        continue;
      }

      // Generate unique token
      let token;
      do {
        token = generateToken();
      } while (usedTokens.has(token));

      attendees.push({ email, token, name });
      usedEmails.add(email);
      usedTokens.add(token);
    }

    if (attendees.length === 0) {
      console.error("❌ No valid attendees found in CSV");
      process.exit(1);
    }

    // Write JSON file
    const outputPath = path.join(__dirname, "../data/static/attendees.json");
    const outputDir = path.dirname(outputPath);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(attendees, null, 2), "utf-8");

    console.log("✅ Conversion successful!");
    console.log(`📊 Total attendees: ${attendees.length}`);
    console.log(`📁 Output: ${outputPath}`);
    console.log("\n📋 Sample entries:");
    attendees.slice(0, 3).forEach((a) => {
      console.log(`   ${a.email} → ${a.token} (${a.name})`);
    });
  } catch (error) {
    console.error("❌ Error converting CSV:", error.message);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
📝 Luma CSV to JSON Converter

Usage:
  npm run convert-csv path/to/luma-export.csv

Example:
  npm run convert-csv ~/Downloads/cafe-cursor-attendees.csv

Expected CSV format:
  - Must have "email" column
  - Optional "name" column
  - Can have any other columns (will be ignored)

Output:
  - data/static/attendees.json
  - Each attendee gets a unique CC-XXXX token
  `);
  process.exit(0);
}

const inputPath = path.resolve(args[0]);

if (!fs.existsSync(inputPath)) {
  console.error(`❌ File not found: ${inputPath}`);
  process.exit(1);
}

convertCSV(inputPath);
