interface SchemaDefinition {
  [tableName: string]: {
    fields: { [fieldName: string]: string };
    indexes?: { [indexName: string]: string[] };
  };
}


export const cleanUpSchema = (schemaCode: string) => {
  const errors = [];
  if (typeof schemaCode !== "string") {
    errors.push({ message: "You are supposed to send back a string" });
  }

  // check if string has keywords: defineTable, defineSchema
  if (["defineTable", "defineSchema"].includes(schemaCode) !== false) {
    errors.push({ message: "Your code doesn't contain keywords like defineTable or defineSchema" });
  }

  if (errors.length > 0) {
    return errors;
  }

  // remove import
  const pattern: RegExp = /^import .*?;$/;
  const lines: string[] = schemaCode.split("\n");
  const filteredLines: string[] = lines
    .filter((line) => !pattern.test(line.trim()))
    .map((line) => line.trim())
    .filter((line) => line != "");

  return parseConvexSchema(filteredLines.join(""));
};


function parseConvexSchema(schemaString: string): SchemaDefinition {
  // get values inside the "defineSchema({ })"
  let valueAfter = "";
  // if export default exists, remove it:
  if (schemaString.includes("export default") || schemaString.startsWith("export default")) {
    valueAfter = schemaString.replace("export default", "").trimStart();
  }

  const tableRegex =
    /(\w+):\s*defineTable\s*\(\s*\{([\s\S]*?)\}\s*\)(?:\s*\.index\s*\(\s*"(\w+)"\s*,\s*\[([^\]]+)\]\s*\))?/g;

  const schema: SchemaDefinition = {};
  let tableMatch;

  while ((tableMatch = tableRegex.exec(valueAfter)) !== null) {
    const tableName = tableMatch[1];
      const tableBody = tableMatch[2];
    const indexName = tableMatch[3] !== undefined ? tableMatch[3] : undefined;
      const indexFieldsStr = tableMatch[4] !== undefined ? tableMatch[4] : undefined;
      const indexFields = indexFieldsStr
        ? indexFieldsStr.split(",").map((field) => field.trim().replace(/['"]/g, ""))
        : undefined;

      const fieldRegex = /(\w+):\s*v\.(\w+)\(([^)]*)\)/g;
      const fields: { [key: string]: string } = {};
      let fieldMatch;

    while ((fieldMatch = fieldRegex.exec(tableBody)) !== null) {
        const fieldName = fieldMatch[1];
      let fieldType = fieldMatch[2];
        const fieldParam = fieldMatch[3];
        if (fieldType === 'id' && fieldParam) {
          fieldType = `id[${fieldParam.replace(/['"]/g, '')}]`;
      }
        fields[fieldName] = fieldType;
    }

    schema[tableName] = {
      fields: fields,
    };

    if (indexName && indexFields) {
      schema[tableName].indexes = {
        [indexName]: indexFields,
      };
    }
  }
  return schema;
}