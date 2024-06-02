CREATE TABLE `pb_comp_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`comp_id` integer,
	`birth_date` integer,
	`equipment` text,
	`gender` text,
	`weight` text,
	`division` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`user_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_competition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_id` integer NOT NULL,
	`name` text NOT NULL,
	`federation` text,
	`country` text,
	`state` text,
	`city` text,
	`date` integer,
	`days_of_competition` integer,
	`platforms` integer,
	`rules` text,
	`events` text,
	`wc_male` text,
	`wc_female` text,
	`wc_mix` text,
	`equipment` text,
	`formular` text,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`creator_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb_age_divisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`min_age` integer,
	`max_age` integer,
	`info` text NOT NULL,
	`comp_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clerk_id` text,
	`name` text(256),
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text
);
