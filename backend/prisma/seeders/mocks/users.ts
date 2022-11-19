import { User } from '@prisma/client';

export const users: User[] = [
  {
    id: 1,
    accountId: 1,
    username: 'userOne',
    // UserOne1
    password: '$2b$10$J1m92CEXjEIIVMxXOunpcuWs4QiZIeoNyVHD4RYwK84wBYIGn9/pq'
  },
  {
    id: 2,
    accountId: 2,
    username: 'userTwo',
    // UserTwo2
    password: '$2b$10$qB6emE9mbNkPe9S3T83f5.cW2mShAqLRPlOOWS8T3WpmsTVspi8jm'
  }
];
