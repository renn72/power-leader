CREATE TABLE `pb_role` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text(256),
	`user_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`user_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `predicted_weight` text;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `squat_opener` text;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `squar_rack_height` text;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `bench_opener` text;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `bench_rack_height` text;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `deadlift_opener` text;