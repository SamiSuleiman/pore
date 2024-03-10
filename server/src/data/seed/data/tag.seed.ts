import { userSeed } from './user.seed';
import { wordSeed } from './word.seed';
export const tagSeed = [
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b0',
    title: 'tag',
    desc: 'description',
    color: '#002B36',
    userId: userSeed[0].id,
    words: [wordSeed[0]],
  },
  {
    id: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
    title: 'another tag',
    desc: 'another description',
    color: '#002B36',
    userId: userSeed[0].id,
    words: [wordSeed[0]],
  },
  {
    id: 'q1w2e3r4-t5y6u7i8-o9p0a1s2d3f4g5',
    title: 'yet another tag',
    desc: 'yet another description',
    color: '#002B36',
    userId: userSeed[0].id,
    words: [wordSeed[0]],
  },
];
