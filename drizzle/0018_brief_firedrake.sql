CREATE TABLE `pb_comp_day_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_id` integer,
	`day` integer NOT NULL,
	`lift` text(256) NOT NULL,
	`bracket` integer NOT NULL,
	`index` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `squat_bracket_id` integer;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `bench_bracket_id` integer;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `deadlift_bracket_id` integer;