import { userSeed } from './user.seed';
import { wordSeed } from './word.seed';

export const linkSeed = [
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b0',
    title: 'link',
    desc: 'link desc',
    userId: userSeed[0].id,
    words: wordSeed,
  },
];
