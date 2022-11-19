import { db } from '../../src/db';
import { acounts } from './mocks/accounts';
import { transactions } from './mocks/transactions';
import { users } from './mocks/users';

async function main () {
  await db.account.createMany({ data: acounts });
  await db.user.createMany({ data: users });
  await db.transaction.createMany({ data: transactions });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
