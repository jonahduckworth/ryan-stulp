export function csvCell(value: string | null) {
  const normalized = (value ?? "").replaceAll(/\r?\n/g, " ");
  const formulaSafe = /^[=+\-@\t\r]/.test(normalized)
    ? `'${normalized}`
    : normalized;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

export function rowsToCsv(rows: string[][]) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
