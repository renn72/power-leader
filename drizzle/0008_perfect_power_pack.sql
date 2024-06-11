CREATE TABLE `pb_comp_entry_to_divisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_entry_id` integer,
	`division_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`comp_entry_id`) REFERENCES `pb_comp_entry`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`division_id`) REFERENCES `pb_age_divisions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `is_require_address` integer;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `is_require_phone` integer;