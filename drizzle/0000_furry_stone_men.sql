CREATE TABLE `pb-age_divisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` text NOT NULL,
	`gender` text NOT NULL,
	`info` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `pb-comp_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`comp_id` integer,
	`birth_date` integer,
	`equipment` text,
	`gender` text,
	`weight` text,
	`division` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer,
	FOREIGN KEY (`user_id`) REFERENCES `pb-user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`comp_id`) REFERENCES `pb-competition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb-competition_to_division` (
	`competition_id` integer NOT NULL,
	`division_id` integer NOT NULL,
	FOREIGN KEY (`competition_id`) REFERENCES `pb-competition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`division_id`) REFERENCES `pb-age_divisions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb-competition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_id` integer NOT NULL,
	`name` text NOT NULL,
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
CREATE TABLE `pb-competitions_to_weight_class` (
	`competition_id` integer NOT NULL,
	`weight_class_id` integer NOT NULL,
	FOREIGN KEY (`competition_id`) REFERENCES `pb-competition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`weight_class_id`) REFERENCES `pb-weight_classes`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `pb-weight_classes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`weight` text NOT NULL,
	`info` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer
);
