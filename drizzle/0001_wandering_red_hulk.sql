CREATE TABLE `pb_weight_classes_f` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`weight` text NOT NULL,
	`info` text NOT NULL,
	`comp_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb_weight_classes_m` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`weight` text NOT NULL,
	`info` text NOT NULL,
	`comp_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pb_weight_classes_mix` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`weight` text NOT NULL,
	`info` text NOT NULL,
	`comp_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `pb_weight_classes`;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `platforms` text;