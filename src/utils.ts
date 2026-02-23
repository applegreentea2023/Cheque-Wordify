/**
 * Converts a number to its word representation (English).
 */
export function numberToWords(num: number): string {
  if (num === 0) return "Zero";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const scales = ["", "Thousand", "Million", "Billion", "Trillion"];

  function convertChunk(n: number): string {
    let chunk = "";

    if (n >= 100) {
      chunk += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      chunk += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      chunk += ones[n] + " ";
    }

    return chunk.trim();
  }

  // Handle decimals (cents/paise)
  const parts = num.toString().split(".");
  let integerPart = parseInt(parts[0]);
  let decimalPart = parts[1] ? parts[1].slice(0, 2) : "";

  let result = "";
  let scaleIndex = 0;

  if (integerPart === 0) {
    result = "Zero";
  } else {
    while (integerPart > 0) {
      const chunk = integerPart % 1000;
      if (chunk > 0) {
        const chunkWords = convertChunk(chunk);
        result = chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + " " + result;
      }
      integerPart = Math.floor(integerPart / 1000);
      scaleIndex++;
    }
  }

  result = result.trim();

  result = result.trim();

  if (result === "Zero") {
    result = "Zero Dollars";
  } else {
    result += " Dollars";
  }

  if (decimalPart) {
    // If it's a single digit like .5, treat as 50
    if (decimalPart.length === 1) decimalPart += "0";
    const cents = parseInt(decimalPart);
    if (cents > 0) {
      if (result === "Zero Dollars") {
        result = convertChunk(cents) + " Cents";
      } else {
        result += " and " + convertChunk(cents) + " Cents";
      }
    }
  }

  return result.trim() + " Only";
}
