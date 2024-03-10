import { userSeed } from './user.seed';
import { wordSeed } from './word.seed';
export const tagSeed = [
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b1',
    title: 'tag',
    desc: 'description',
    color: '#002B36',
    userId: userSeed[0].id,
    words: [wordSeed[0]],
  },
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b2',
    title: 'another tag',
    desc: 'another description',
    color: '#002B36',
    userId: userSeed[0].id,
    words: [wordSeed[0]],
  },
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b3',
    title: 'yet another tag',
    desc: 'yet another description',
    color: '#002B36',
    userId: userSeed[0].id,
    words: [wordSeed[0]],
  },
];
