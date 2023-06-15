export function toCamelCase(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
}

export function rowToCamelCase(row: any): any {
  const newRow: any = {};
  for (const key in row) {
    const camelKey = toCamelCase(key);
    newRow[camelKey] = row[key];
  }
  return newRow;
}
