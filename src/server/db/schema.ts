// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm'
import { int, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

import { createInsertSchema } from 'drizzle-zod'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `pb-${name}`)

export const users = createTable('user', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  clerkId: text('clerk_id'),
  name: text('name', { length: 256 }),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int('updatedAt', { mode: 'timestamp' }),
})

export const usersRelations = relations(users, ({ many }) => ({
  entry: many(compEntry),
  competition: many(competitions),
}))

export const compEntry = createTable('comp_entry', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: int('user_id', { mode: 'number' }).references(() => users.id),
  compId: int('comp_id', { mode: 'number' }).references(() => competitions.id),
  birthDate: int('birth_date', { mode: 'timestamp' }),
  equipment: text('equipment'),
  gender: text('gender'),
  weight: text('weight'),
  division: text('division'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int('updatedAt', { mode: 'timestamp' }),
})

export const compEntryRelations = relations(compEntry, ({ one }) => ({
  user: one(users, {
    fields: [compEntry.userId],
    references: [users.id],
  }),
  competition: one(competitions, {
    fields: [compEntry.compId],
    references: [competitions.id],
  }),
}))

export const divisions = createTable('division', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name'),
  age: text('age'),
  gender: text('gender'),
  weight: text('weight'),
  equipment: text('equipment'),
  info: text('info'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int('updatedAt', { mode: 'timestamp' }),
})
export const insertDivisionSchema = createInsertSchema(divisions)

export const divisionsRelations = relations(divisions, ({ many }) => ({
  competitions: many(competitionToDivision),
}))

export const competitions = createTable('competition', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  creatorId: int('creator_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
  name: text('name').notNull(),
  federation: text('federation'),
  country: text('country'),
  state: text('state'),
  city: text('city'),
  date: int('date', { mode: 'timestamp' }),
  daysOfCompetition: int('days_of_competition'),
  rules: text('rules'),
  events: text('events'),
  notes: text('notes'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int('updatedAt', { mode: 'timestamp' }),
})
export const insertCompetitionSchema = createInsertSchema(competitions)

export const competitionsRelations = relations(
  competitions,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [competitions.creatorId],
      references: [users.id],
    }),
    entries: many(compEntry),
    divisions: many(competitionToDivision),
  }),
)

export const competitionToDivision = createTable('competition_to_division', {
  competitionId: int('competition_id', { mode: 'number' })
    .notNull()
    .references(() => competitions.id),
  divisionId: int('division_id', { mode: 'number' })
    .notNull()
    .references(() => divisions.id),
})

export const competitionToDivisionRelations = relations(
  competitionToDivision,
  ({ one }) => ({
    competition: one(competitions, {
      fields: [competitionToDivision.competitionId],
      references: [competitions.id],
    }),
    division: one(divisions, {
      fields: [competitionToDivision.divisionId],
      references: [divisions.id],
    }),
  }),
)
