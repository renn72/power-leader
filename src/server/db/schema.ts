import { sql } from 'drizzle-orm'
import {
  int,
  sqliteTableCreator,
  text,
  integer,
  index,
} from 'drizzle-orm/sqlite-core'
import { relations } from 'drizzle-orm'

import { createInsertSchema } from 'drizzle-zod'

export const createTable = sqliteTableCreator((name) => `pb_${name}`)

export const users = createTable('user', {
  id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  clerkId: text('clerk_id'),
  name: text('name', { length: 256 }),
  birthDate: integer('birth_date', { mode: 'timestamp' }),
  gender: text('gender'),
  address: text('address'),
  notes: text('notes'),
  instagram: text('instagram'),
  openlifter: text('openlifter'),
  phone: text('phone'),
  email: text('email'),
  isFake: int('is_fake', { mode: 'boolean' }),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text('updatedAt'),
})

export const usersRelations = relations(users, ({ many }) => ({
  entry: many(compEntry),
  competition: many(competitions),
}))

export const compEntry = createTable(
  'comp_entry',
  {
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
    squatTwo: int('squat_two'),
    benchTwo: int('bench_two'),
    deadliftTwo: int('deadlift_two'),
    squatThree: int('squat_three'),
    benchThree: int('bench_three'),
    deadliftThree: int('deadlift_three'),
    squatFour: int('squat_four'),
    benchFour: int('bench_four'),
    deadliftFour: int('deadlift_four'),
    squatOrderOne: int('squat_order_one'),
    squatOrderTwo: int('squat_order_two'),
    squatOrderThree: int('squat_order_three'),
    squatOrderFour: int('squat_order_four'),
    isSquatFour: int('is_squat_four', { mode: 'boolean' }),
    benchOrderOne: int('bench_order_one'),
    benchOrderTwo: int('bench_order_two'),
    benchOrderThree: int('bench_order_three'),
    benchOrderFour: int('bench_order_four'),
    isBenchFour: int('is_bench_four', { mode: 'boolean' }),
    deadliftOrderOne: int('deadlift_order_one'),
    deadliftOrderTwo: int('deadlift_order_two'),
    deadliftOrderThree: int('deadlift_order_three'),
    deadliftOrderFour: int('deadlift_order_four'),
    isDeadliftFour: int('is_deadlift_four', { mode: 'boolean' }),
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
  },
  (t) => {
    return {
      userIdIdx: index('entry_user_id_idx').on(t.userId),
      compIdIdx: index('entry_comp_id_idx').on(t.compId),
    }
  },
)

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
  events: many(compEntryToEvents),
}))

export const lift = createTable(
  'lift',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compEntryId: int('comp_entry_id', { mode: 'number' }).references(
      () => compEntry.id,
      { onDelete: 'cascade' },
    ),
    lift: text('lift'),
    liftNumber: int('lift_number'),
    weight: text('weight'),
    state: text('state'),
    isGoodOne: int('is_good_one', { mode: 'boolean' }),
    isGoodTwo: int('is_good_two', { mode: 'boolean' }),
    isGoodThree: int('is_good_three', { mode: 'boolean' }),
    order: int('order'),
    bracket: int('bracket'),
    day: int('day'),
    platform: int('platform'),
    rackHeight: text('rack_height'),
    gender: text('gender'),
    userWeight: text('user_weight'),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text('updatedAt'),
  },
  (t) => {
    return {
      compEntryIdIdx: index('lift_comp_entry_id_idx').on(t.compEntryId),
    }
  },
)

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

export const compEntryToEvents = createTable(
  'comp_entry_to_events',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compEntryId: int('comp_entry_id', { mode: 'number' }).references(
      () => compEntry.id,
      { onDelete: 'cascade' },
    ),
    eventId: int('event_id', { mode: 'number' }).references(() => events.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => {
    return {
      compEntryIdIdx: index('comp_entry_to_events_comp_entry_id_idx').on(
        t.compEntryId,
      ),
      eventIdIdx: index('comp_entry_to_events_event_id_idx').on(t.eventId),
    }
  },
)

export const compEntryToEventsRelations = relations(
  compEntryToEvents,
  ({ one }) => ({
    compEntry: one(compEntry, {
      fields: [compEntryToEvents.compEntryId],
      references: [compEntry.id],
    }),
    event: one(events, {
      fields: [compEntryToEvents.eventId],
      references: [events.id],
    }),
  }),
)

export const divisions = createTable(
  'age_divisions',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    minAge: integer('min_age'),
    maxAge: integer('max_age'),
    compName: text('comp_name'),
    info: text('info').notNull(),
    compId: int('comp_id', { mode: 'number' }).references(
      () => competitions.id,
      {
        onDelete: 'cascade',
      },
    ),
    createdAt: text('created_at')
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    updatedAt: text('updatedAt'),
  },
  (t) => {
    return {
      compIdIdx: index('divisions_comp_id_idx').on(t.compId),
    }
  },
)
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

export const events = createTable(
  'events',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    isSquat: int('is_squat', { mode: 'boolean' }).default(false),
    isBench: int('is_bench', { mode: 'boolean' }).default(false),
    isDeadlift: int('is_deadlift', { mode: 'boolean' }).default(false),
    isTeamBattle: int('is_team_battle', { mode: 'boolean' }).default(false),
    isPress: int('is_press', { mode: 'boolean' }).default(false),
    isOtherOne: int('is_other_one', { mode: 'boolean' }).default(false),
    isOtherTwo: int('is_other_two', { mode: 'boolean' }).default(false),
    isOtherThree: int('is_other_three', { mode: 'boolean' }).default(false),
    isOtherFour: int('is_other_four', { mode: 'boolean' }).default(false),
    isOtherFive: int('is_other_five', { mode: 'boolean' }).default(false),
    isOtherSix: int('is_other_six', { mode: 'boolean' }).default(false),
    compId: int('comp_id', { mode: 'number' }).references(
      () => competitions.id,
      {
        onDelete: 'cascade',
      },
    ),
  },
  (t) => {
    return {
      compIdIdx: index('events_comp_id_idx').on(t.compId),
    }
  },
)

export const eventRelations = relations(events, ({ many, one }) => ({
  entries: many(compEntryToEvents),
  competitions: one(competitions, {
    fields: [events.compId],
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
  platforms: int('platforms'),
  rules: text('rules'),
  wc_male: text('wc_male'),
  wc_female: text('wc_female'),
  wc_mix: text('wc_mix'),
  equipment: text('equipment'),
  formular: text('formular'),
  currentState: text('current_state'),
  competitorLimit: int('competitor_limit'),
  venue: text('venue'),
  isFourthRound: int('is_fourth_round', { mode: 'boolean' }).default(false),
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
    events: many(events),
    compDayInfo: one(compDayInfo, {
      fields: [competitions.id],
      references: [compDayInfo.compId],
    }),
  }),
)

export const judges = createTable(
  'judges',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compId: int('comp_id', { mode: 'number' }).references(
      () => competitions.id,
      {
        onDelete: 'cascade',
      },
    ),
    judgeId: int('judge_id', { mode: 'number' }).references(() => users.id, {
      onDelete: 'cascade',
    }),
  },
  (t) => {
    return {
      compIdIdx: index('judges_comp_id_idx').on(t.compId),
      judgeIdIdx: index('judges_judge_id_idx').on(t.judgeId),
    }
  },
)

export const judgesRelations = relations(judges, ({ one }) => ({
  competition: one(competitions, {
    fields: [judges.compId],
    references: [competitions.id],
  }),
}))

export const bracketJudges = createTable(
  'bracket_judge',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compId: int('comp_id', { mode: 'number' }).references(
      () => competitions.id,
      {
        onDelete: 'cascade',
      },
    ),
    judgeId: int('judge_id', { mode: 'number' }).references(() => users.id, {
      onDelete: 'cascade',
    }),
    bracket: int('bracket', { mode: 'number' }),
    lift: text('lift'),
  },
  (t) => {
    return {
      compIdIdx: index('bracket_judge_comp_id_idx').on(t.compId),
      judgeIdIdx: index('bracket_judge_judge_id_idx').on(t.judgeId),
    }
  },
)

export const bracketJudgesRelations = relations(bracketJudges, ({ one }) => ({
  competition: one(competitions, {
    fields: [bracketJudges.compId],
    references: [competitions.id],
  }),
}))

export const compDayInfo = createTable(
  'comp_day_info',
  {
    id: int('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    compId: int('comp_id', { mode: 'number' }).references(
      () => competitions.id,
      {
        onDelete: 'cascade',
      },
    ),
    day: int('day').notNull(),
    lift: text('lift', { length: 256 }).notNull(),
    round: int('round').notNull().default(1),
    bracket: int('bracket').notNull(),
    index: int('index').notNull(),
    nextIndex: int('next_index'),
    updatedAt: text('updatedAt'),
  },
  (t) => {
    return {
      compIdIdx: index('comp_day_info_comp_id_idx').on(t.compId),
    }
  },
)

export const compDayInfoRelations = relations(compDayInfo, ({ one }) => ({
  competitions: one(competitions, {
    fields: [compDayInfo.compId],
    references: [competitions.id],
  }),
}))
