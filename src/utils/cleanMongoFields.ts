// utils/cleanMongoFields.ts
export function removeMongoMetaFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeMongoMetaFields);
  } else if (obj && typeof obj === "object") {
    const cleaned: any = {};
    for (const key in obj) {
      if (["_id", "__v", "createdAt", "updatedAt"].includes(key)) continue;
      cleaned[key] = removeMongoMetaFields(obj[key]);
    }
    return cleaned;
  }
  return obj;
}
