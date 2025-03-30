import { pgTable, serial, varchar, text, timestamp, integer, doublePrecision, index } from 'drizzle-orm/pg-core';

export const bars = pgTable('bars', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull(),
  neighborhood: varchar('neighborhood', { length: 100 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => {
  return {
    neighborhoodIdx: index('bars_neighborhood_idx').on(table.neighborhood)
  };
});

export const waitTimes = pgTable('wait_times', {
  id: serial('id').primaryKey(),
  barId: integer('bar_id').notNull().references(() => bars.id, { onDelete: 'cascade' }),
  waitMinutes: integer('wait_minutes').notNull(),
  reporterIp: varchar('reporter_ip', { length: 45 }),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => {
  return {
    barIdIdx: index('wait_times_bar_id_idx').on(table.barId),
    createdAtIdx: index('wait_times_created_at_idx').on(table.createdAt)
  };
});