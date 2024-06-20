import { sql } from 'drizzle-orm'
import { int, sqliteTableCreator, text, integer } from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

import { createInsertSchema } from 'drizzle-zod'

export const createTable = sqliteTableCreator((name) => `pb_${name}`)

export const users = createTable('user', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    clerkId: text('clerk_id'),
    name: text('name', { length: 256 }),
    birthDate: integer('birth_date', { mode: 'timestamp' }),
    address: text('address'),
    notes: text('notes'),
    instagram: text('instagram'),
    openlifter: text('openlifter'),
    phone: text('phone'),
    isFake: int('is_fake', { mode: 'boolean' }),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})

export const usersRelations = relations(users, ({ many }) => ({
    entry: many(compEntry),
    competition: many(competitions),
    role: many(roles),
}))

export const roles = createTable('role', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name', { length: 256 }),
    user: int('user_id', { mode: 'number' }).references(() => users.id, {
        onDelete: 'cascade',
    }),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})

export const rolesRelations = relations(roles, ({ one }) => ({
    user: one(users, {
        fields: [roles.user],
        references: [users.id],
    }),
}))

export const compEntry = createTable('comp_entry', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    userId: int('user_id', { mode: 'number' }).references(() => users.id, {
        onDelete: 'cascade',
    }),
    compId: int('comp_id', { mode: 'number' }).references(
        () => competitions.id,
        { onDelete: 'cascade' },
    ),
    birthDate: int('birth_date', { mode: 'timestamp' }),
    address: text('address'),
    phone: text('phone'),
    instagram: text('instagram'),
    openlifter: text('openlifter'),
    equipment: text('equipment'),
    gender: text('gender'),
    predictedWeight: text('predicted_weight'),
    weight: text('weight'),
    wc: text('wc'),
    events: text('events'),
    squatOpener: text('squat_opener'),
    squarRackHeight: text('squar_rack_height'),
    squatPB: text('squat_pb'),
    benchOpener: text('bench_opener'),
    benchRackHeight: text('bench_rack_height'),
    benchPB: text('bench_pb'),
    deadliftOpener: text('deadlift_opener'),
    deadliftPB: text('deadlift_pb'),
    squatOrder: int('squat_order_id'),
    benchOrder: int('bench_order_id'),
    deadliftOrder: int('deadlift_order_id'),
    squatBracket: int('squat_bracket_id'),
    benchBracket: int('bench_bracket_id'),
    deadliftBracket: int('deadlift_bracket_id'),
    squatDay: int('squat_day_id'),
    benchDay: int('bench_day_id'),
    deadliftDay: int('deadlift_day_id'),
    isLocked: int('is_locked', { mode: 'boolean' }),
    notes: text('notes'),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})

export const compEntryRelations = relations(compEntry, ({ one, many }) => ({
    user: one(users, {
        fields: [compEntry.userId],
        references: [users.id],
    }),
    competition: one(competitions, {
        fields: [compEntry.compId],
        references: [competitions.id],
    }),
    compEntryToDivisions: many(compEntryToDivisions),
    lift: many(lift),
}))

export const lift = createTable('lift', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compEntryId: int('comp_entry_id', { mode: 'number' }).references(
        () => compEntry.id,
        { onDelete: 'cascade' },
    ),
    lift: text('lift'),
    liftNumber: int('lift_number',),
    weight: text('weight'),
    state: text('state'),
    isGoodOne: int('is_good_one', { mode: 'boolean' }),
    isGoodTwo: int('is_good_two', { mode: 'boolean' }),
    isGoodThree: int('is_good_three', { mode: 'boolean' }),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})

export const liftRelations = relations(lift, ({ one }) => ({
    compEntry: one(compEntry, {
        fields: [lift.compEntryId],
        references: [compEntry.id],
    }),
}))

export const compEntryToDivisions = createTable('comp_entry_to_divisions', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compEntryId: int('comp_entry_id', { mode: 'number' }).references(
        () => compEntry.id,
        { onDelete: 'cascade' },
    ),
    divisionId: int('division_id', { mode: 'number' }).references(
        () => divisions.id,
        { onDelete: 'cascade' },
    ),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
})

export const divisions = createTable('age_divisions', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    minAge: integer('min_age'),
    maxAge: integer('max_age'),
    compName: text('comp_name'),
    info: text('info').notNull(),
    compId: int('comp_id', { mode: 'number' }).references(
        () => competitions.id,
        { onDelete: 'cascade' },
    ),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})
export const insertDivisionSchema = createInsertSchema(divisions)

export const divisionsRelations = relations(divisions, ({ one, many }) => ({
    competitions: one(competitions, {
        fields: [divisions.compId],
        references: [competitions.id],
    }),
    compEntryToDivisions: many(compEntryToDivisions),
}))

export const compEntryToDivisionsRelations = relations(
    compEntryToDivisions,
    ({ one }) => ({
        compEntry: one(compEntry, {
            fields: [compEntryToDivisions.compEntryId],
            references: [compEntry.id],
        }),
        division: one(divisions, {
            fields: [compEntryToDivisions.divisionId],
            references: [divisions.id],
        }),
    }),
)

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
    platforms: int('platforms'),
    squatBracket: int('squat_bracket_id'),
    benchBracket: int('bench_bracket_id'),
    deadliftBracket: int('deadlift_bracket_id'),
    rules: text('rules'),
    events: text('events'),
    wc_male: text('wc_male'),
    wc_female: text('wc_female'),
    wc_mix: text('wc_mix'),
    equipment: text('equipment'),
    formular: text('formular'),
    currentState: text('current_state'),
    competitorLimit: int('competitor_limit'),
    venue: text('venue'),
    isStarted: integer('is_started', { mode: 'boolean' }),
    isLimited: integer('is_limited', { mode: 'boolean' }),
    isPaid: integer('is_paid', { mode: 'boolean' }),
    isRequireAddress: integer('is_require_address', { mode: 'boolean' }),
    isRequirePhone: integer('is_require_phone', { mode: 'boolean' }),
    uuid: text('uuid'),
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
        judges: many(judges),
        bracketJudges: many(bracketJudges),
        compDayInfo: one(compDayInfo, {
            fields: [competitions.id],
            references: [compDayInfo.compId],
        }),
    }),
)

export const judges = createTable('judges', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compId: int('comp_id', { mode: 'number' }).references(() => competitions.id, {
        onDelete: 'cascade',
    }),
    judgeId: int('judge_id', { mode: 'number' }).references(() => users.id, {
        onDelete: 'cascade',
    }),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})

export const judgesRelations = relations(judges, ({ one }) => ({
    competition: one(competitions, {
        fields: [judges.compId],
        references: [competitions.id],
    }),
}))

export const bracketJudges = createTable('bracket_judge', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compId: int('comp_id', { mode: 'number' }).references(() => competitions.id, {
        onDelete: 'cascade',
    }),
    judgeId: int('judge_id', { mode: 'number' }).references(() => users.id, {
        onDelete: 'cascade',
    }),
    bracket: int('bracket', { mode: 'number' }),
    lift: text('lift'),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})

export const bracketJudgesRelations = relations(bracketJudges, ({ one }) => ({
    competition: one(competitions, {
        fields: [bracketJudges.compId],
        references: [competitions.id],
    }),
}))

export const compDayInfo = createTable('comp_day_info', {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compId: int('comp_id', { mode: 'number' }).references(() => competitions.id, {
        onDelete: 'cascade',
    }),
    day: int('day').notNull(),
    lift: text('lift', { length: 256 }).notNull(),
    bracket: int('bracket').notNull(),
    index: int('index').notNull(),
    createdAt: text('created_at')
        .default(sql`(CURRENT_TIMESTAMP)`)
        .notNull(),
    updatedAt: text('updatedAt'),
})

export const compDayInfoRelations = relations(compDayInfo, ({ one }) => ({
    competitions: one(competitions, {
        fields: [compDayInfo.compId],
        references: [competitions.id],
    }),
}))
