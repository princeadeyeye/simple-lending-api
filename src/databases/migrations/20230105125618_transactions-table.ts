import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('transactionId', 255).notNullable();
    table.integer('amount', 255).notNullable();
    table.string('naration', 255).notNullable();
    table.string('status', 255).notNullable();
    table.integer('debitAccountPreviousBalance', 255).nullable();
    table.integer('creditAccountPreviousBalance', 255).nullable();
    table.integer('debitAccountNewBalance', 255).nullable();
    table.integer('creditAccountNewBalance', 255).nullable();
    table.string('debitWalletId', 255).nullable();
    table.string('creditWalletId', 255).nullable();
    table.date('createdAt').notNullable();
    table.date('updatedAt').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions');
}
