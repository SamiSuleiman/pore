import { sourceSeed } from './source.seed';
import { userSeed } from './user.seed';

export const wordSeed = [
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b0',
    content: 'word',
    language: 'English',
    userId: userSeed[0].id,
    sourceId: sourceSeed[0].id,
    tags: [],
    links: [],
    definitions: [],
    examples: [],
  },
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b1',
    content: 'word 2',
    language: 'German',
    userId: userSeed[0].id,
    sourceId: sourceSeed[0].id,
    tags: [],
    links: [],
    definitions: [],
    examples: [],
  },
];
