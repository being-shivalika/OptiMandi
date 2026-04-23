import XLSX from "xlsx";

const cleanNumber = (val) => {
  if (!val) return 0;
  return Number(String(val).replace(/,/g, "").trim()) || 0;
};

export const parseExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet);

  const results = data.map((row) => ({
    date: row.date || row.Date || "",
    commodity: row.commodity || row.Commodity || "",
    arrival: cleanNumber(
      row.arrival ||
      row.Arrival ||
      row.arrival_qty_kg
    ),
    price: cleanNumber(
      row.price ||
      row.Price ||
      row.modal_price_rs_kg
    ),
  }));

  console.log("📊 Excel Parsed:", results.length);

  return results;
};