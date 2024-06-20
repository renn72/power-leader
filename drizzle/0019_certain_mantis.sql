CREATE TABLE `pb_bracket_judge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_id` integer,
	`judge_id` integer,
	`bracket` integer,
	`lift` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`judge_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_judges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_id` integer,
	`judge_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`judge_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_lift` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_entry_id` integer,
	`lift` text,
	`lift_number` integer,
	`is_good_one` integer,
	`is_good_two` integer,
	`is_good_three` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`comp_entry_id`) REFERENCES `pb_comp_entry`(`id`) ON UPDATE no action ON DELETE cascade
);
