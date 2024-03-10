import { userSeed } from './user.seed';

export const sourceSeed = [
  {
    id: '33c908bf-f110-4c7a-81d7-caf0008c71b0',
    type: 'book',
    content: 'The Expanse',
    userId: userSeed[0].id,
  },
];
