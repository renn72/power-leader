import { sql } from 'drizzle-orm'
import { int, sqliteTableCreator, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

import { createInsertSchema } from 'drizzle-zod'

export const createTable = sqliteTableCreator((name) => `pb_${name}`)

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
  gender: text('gender'),
  info: text('info').notNull(),
  compId: int('comp_id', { mode: 'number' }).references(() => competitions.id),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
})
export const insertWeightClassSchema = createInsertSchema(weightClasses)

export const weightClassesRelations = relations(weightClasses, ({ one }) => ({
  competitions: one(competitions, {
    fields: [weightClasses.compId],
    references: [competitions.id],
  }),
}))

export const divisions = createTable('age_divisions', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  minAge: integer('min_age'),
  maxAge: integer('max_age'),
  info: text('info').notNull(),
  compId: int('comp_id', { mode: 'number' }).references(() => competitions.id),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
})
export const insertDivisionSchema = createInsertSchema(divisions)

export const divisionsRelations = relations(divisions, ({ one }) => ({
  competitions: one(competitions, {
    fields: [divisions.compId],
    references: [competitions.id],
  }),
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
  platforms: text('platforms'),
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
    divisions: many(divisions),
    weightClasses: many(weightClasses),
  }),
)

