import XLSX from "xlsx";

const cleanNumber = (val) => {
  if (!val) return 0;
  return Number(String(val).replace(/,/g, "").trim()) || 0;
};

const findKey = (row, keys) => {
  const rowKeys = Object.keys(row);

  for (let key of rowKeys) {
    const normalized = key.toLowerCase().replace(/\s+/g, "");

    if (keys.some(k => normalized.includes(k))) {
      return row[key];
    }
  }

  return undefined;
};

export const parseExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const data = XLSX.utils.sheet_to_json(sheet);

  return data.map((row) => ({
    date: findKey(row, ["date"]),
    commodity: findKey(row, ["commodity", "crop"]),
    market: findKey(row, ["market", "mandi", "location"]),
    arrival: cleanNumber(findKey(row, ["arrival"])),
    price: cleanNumber(findKey(row, ["price", "rate", "modal"])),
  }))
  .filter(r => r.price);
};