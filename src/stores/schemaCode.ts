import { SchemaDefinitionNew } from "@convex/utils";
import { WritableAtom } from "jotai";
import { atom } from "jotai";


export function atomWithString(
  initialValue?: string,
): WritableAtom<string, [string?], void> {
  const anAtom = atom(initialValue, (get, set, nextValue?: string) => {
    const update = nextValue ?? get(anAtom)
    set(anAtom, update)
  })

  return anAtom as WritableAtom<string, [string?], void>
}


export const schema = atomWithString(`import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    user: v.id("users"),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});`)

export const validatedSchemaObject = atom<SchemaDefinitionNew>({} as SchemaDefinitionNew)