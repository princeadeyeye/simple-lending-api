import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('accounts', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('userId', 255).notNullable();
    table.string('accountEmail', 255).notNullable();
    table.string('accountName', 255).notNullable();
    table.decimal('accountBalance', 65).defaultTo(0.0).notNullable();
    table.date('createdAt').notNullable();
    table.date('updatedAt').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('accounts');
}
