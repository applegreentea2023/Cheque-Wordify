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

  if (result === "Zero") {
    result = "Zero Dollars";
  } else {
    result += " Dollars";
  }

  if (decimalPart) {
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

/**
 * Converts a number to Traditional Chinese financial numeral string (中文大寫).
 * e.g. 1234.56 → 壹仟貳佰參拾肆元伍角陸分
 */
export function numberToChineseWords(num: number): string {
  if (isNaN(num) || num < 0) return "";

  const digits = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
  const units = ["", "拾", "佰", "仟"];
  const scales = ["", "萬", "億", "兆"];

  const numStr = num.toFixed(2);
  const [intStr, decStr] = numStr.split(".");

  const jiaoDigit = parseInt(decStr[0]);
  const fenDigit = parseInt(decStr[1]);

  function convertBlock(block: string): string {
    let res = "";
    for (let i = 0; i < block.length; i++) {
      const d = parseInt(block[i]);
      const pos = block.length - 1 - i;
      if (d === 0) {
        res += digits[0];
      } else {
        res += digits[d] + units[pos];
      }
    }
    res = res.replace(/零+/g, "零").replace(/零$/, "");
    return res;
  }

  let intResult = "";

  if (intStr === "0") {
    intResult = "零";
  } else {
    const reversed = intStr.split("").reverse().join("");
    const groups: string[] = [];
    for (let i = 0; i < reversed.length; i += 4) {
      groups.push(reversed.slice(i, i + 4).split("").reverse().join(""));
    }

    for (let g = groups.length - 1; g >= 0; g--) {
      const blockVal = parseInt(groups[g]);
      if (blockVal === 0) {
        intResult += digits[0];
      } else {
        intResult += convertBlock(groups[g]) + scales[g];
      }
    }

    intResult = intResult.replace(/零+/g, "零").replace(/^零|零$/g, "");
  }

  intResult += "元";

  let decResult = "";
  if (jiaoDigit === 0 && fenDigit === 0) {
    decResult = "整";
  } else if (jiaoDigit === 0) {
    decResult = "零" + digits[fenDigit] + "分";
  } else {
    decResult = digits[jiaoDigit] + "角";
    if (fenDigit > 0) decResult += digits[fenDigit] + "分";
    else decResult += "整";
  }

  return intResult + decResult;
}
