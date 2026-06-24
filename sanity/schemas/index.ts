import type { SchemaTypeDefinition } from "sanity";

import { sharedObjects } from "./objects/shared";
import { peopleObjects } from "./objects/people";
import { sectionObjects } from "./objects/sections";

import { learningDocuments } from "./documents/learning";
import { formDocuments } from "./documents/forms";
import { proofDocuments } from "./documents/proof";
import { editorialDocuments } from "./documents/editorial";

import { singletons } from "./singletons/settings";

/**
 * Schema registry. Objects first (referenced by documents), then documents,
 * then singletons. Mirrors the Studio desk in sanity/structure.ts.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  ...sharedObjects,
  ...peopleObjects,
  ...sectionObjects,
  ...learningDocuments,
  ...formDocuments,
  ...proofDocuments,
  ...editorialDocuments,
  ...singletons,
];
