// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from 'drizzle-orm'
import {
  index,
  int,
  sqliteTableCreator,
  text,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `pb-${name}`)

export const posts = createTable(
  'post',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name', { length: 256 }),
    msg: text('msg'),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int('updatedAt', { mode: 'timestamp' }),
  },
  (example) => ({
    nameIndex: index('name_idx').on(example.name),
  }),
)

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
  competitions: many(competitions),
}))

export const divisions = createTable('other_division', {
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

export const divisionsRelations = relations(divisions, ({ many }) => ({
  competitions: many(competitions),
}))

export const competitions = createTable('competition', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  creatorId: int('creator_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
  name: text('name'),
  federation: text('federation'),
  country: text('country'),
  state: text('state'),
  city: text('city'),
  date: int('date', { mode: 'timestamp' }),
  daysOfCompetition: int('days_of_competition'),
  rules: text('rules'),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int('updatedAt', { mode: 'timestamp' }),
})

export const competitionsRelations = relations(
  competitions,
  ({ one, many }) => ({
    creator: one(users),
    competitors: many(users),
    divisions: many(divisions),
  }),
)

export const competitionToDivision = createTable(
  'competition_to_division',
  {
    competitionId: int('competition_id', { mode: 'number' })
      .notNull()
      .references(() => competitions.id),
    divisionId: int('division_id', { mode: 'number' })
      .notNull()
      .references(() => divisions.id),
    createdAt: int('created_at', { mode: 'timestamp' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: int('updatedAt', { mode: 'timestamp' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.competitionId, t.divisionId] }),
  }),
)

export const competitionToDivisionRelations = relations(
  competitionToDivision,
  ({ one }) => ({
    competition: one(competitions),
    division: one(divisions),
  }),
)

export const competitionToCompetitor = createTable('competition_to_competitor', {
  competitionId: int('competition_id', { mode: 'number' })
    .notNull()
    .references(() => competitions.id),
  competitorId: int('competitor_id', { mode: 'number' })
    .notNull()
    .references(() => users.id),
  createdAt: int('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: int('updatedAt', { mode: 'timestamp' }),
})

export const competitionToCompetitorRelations = relations(
  competitionToCompetitor,
  ({ one }) => ({
    competition: one(competitions),
    competitor: one(users),
  }),
)
