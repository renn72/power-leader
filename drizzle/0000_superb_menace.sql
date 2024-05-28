CREATE TABLE `pb-comp_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`comp_id` integer,
	`birth_date` integer,
	`equipment` text,
	`gender` text,
	`weight` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`user_id`) REFERENCES `pb-user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comp_id`) REFERENCES `pb-competition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb-competition_to_division` (
	`competition_id` integer NOT NULL,
	`division_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`competition_id`) REFERENCES `pb-competition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`division_id`) REFERENCES `pb-division`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb-competition_to_entry` (
	`competition_id` integer NOT NULL,
	`entry_id` integer NOT NULL,
	`created_at` integer,
	`updatedAt` integer,
	FOREIGN KEY (`competition_id`) REFERENCES `pb-competition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`entry_id`) REFERENCES `pb-comp_entry`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb-competition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_id` integer NOT NULL,
	`name` text,
	`federation` text,
	`country` text,
	`state` text,
	`city` text,
	`date` integer,
	`days_of_competition` integer,
	`rules` text,
	`events` text,
	`notes` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`creator_id`) REFERENCES `pb-user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb-division` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`age` text,
	`gender` text,
	`weight` text,
	`equipment` text,
	`info` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `pb-post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`msg` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `pb-user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clerk_id` text,
	`name` text(256),
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE INDEX `name_idx` ON `pb-post` (`name`);