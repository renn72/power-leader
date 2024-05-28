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
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
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
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
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

export const weightClasses = createTable('weight_classes', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  weight: text('weight').notNull(),
  info: text('info').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
})
export const insertWeightClassSchema = createInsertSchema(weightClasses)

export const weightClassesRelations = relations(weightClasses, ({ many }) => ({
  competitions: many(competitionsToWeightClass),
}))

export const ageDivisions = createTable('age_divisions', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: text('age').notNull(),
  gender: text('gender').notNull(),
  info: text('info').notNull(),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
})
export const insertDivisionSchema = createInsertSchema(ageDivisions)

export const divisionsRelations = relations(ageDivisions, ({ many }) => ({
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
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
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
    weightClasses: many(competitionsToWeightClass),
  }),
)

export const competitionToDivision = createTable('competition_to_division', {
  competitionId: int('competition_id', { mode: 'number' })
    .notNull()
    .references(() => competitions.id),
  divisionId: int('division_id', { mode: 'number' })
    .notNull()
    .references(() => ageDivisions.id),
})

export const competitionToDivisionRelations = relations(
  competitionToDivision,
  ({ one }) => ({
    competition: one(competitions, {
      fields: [competitionToDivision.competitionId],
      references: [competitions.id],
    }),
    division: one(ageDivisions, {
      fields: [competitionToDivision.divisionId],
      references: [ageDivisions.id],
    }),
  }),
)

export const competitionsToWeightClass = createTable('competitions_to_weight_class', {
  competitionId: int('competition_id', { mode: 'number' })
    .notNull()
    .references(() => competitions.id),
  weightClassId: int('weight_class_id', { mode: 'number' })
    .notNull()
    .references(() => weightClasses.id),
})

export const competitionsToWeightClassRelations = relations(
  competitionsToWeightClass,
  ({ one }) => ({
    competition: one(competitions, {
      fields: [competitionsToWeightClass.competitionId],
      references: [competitions.id],
    }),
    weightClass: one(weightClasses, {
      fields: [competitionsToWeightClass.weightClassId],
      references: [weightClasses.id],
    }),
  }),
)
