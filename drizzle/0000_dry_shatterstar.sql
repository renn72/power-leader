CREATE TABLE `pb_bracket_judge` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_id` integer,
	`judge_id` integer,
	`bracket` integer,
	`lift` text,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`judge_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_comp_day_info` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_id` integer,
	`day` integer NOT NULL,
	`lift` text(256) NOT NULL,
	`round` integer DEFAULT 1 NOT NULL,
	`bracket` integer NOT NULL,
	`index` integer NOT NULL,
	`next_index` integer,
	`updatedAt` text,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_comp_entry` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`comp_id` integer,
	`birth_date` integer,
	`address` text,
	`phone` text,
	`instagram` text,
	`openlifter` text,
	`equipment` text,
	`gender` text,
	`predicted_weight` text,
	`weight` text,
	`wc` text,
	`events` text,
	`squat_opener` text,
	`squar_rack_height` text,
	`squat_pb` text,
	`bench_opener` text,
	`bench_rack_height` text,
	`bench_pb` text,
	`deadlift_opener` text,
	`deadlift_pb` text,
	`squat_two` integer,
	`bench_two` integer,
	`deadlift_two` integer,
	`squat_three` integer,
	`bench_three` integer,
	`deadlift_three` integer,
	`squat_four` integer,
	`bench_four` integer,
	`deadlift_four` integer,
	`squat_order_one` integer,
	`squat_order_two` integer,
	`squat_order_three` integer,
	`squat_order_four` integer,
	`is_squat_four` integer,
	`bench_order_one` integer,
	`bench_order_two` integer,
	`bench_order_three` integer,
	`bench_order_four` integer,
	`is_bench_four` integer,
	`deadlift_order_one` integer,
	`deadlift_order_two` integer,
	`deadlift_order_three` integer,
	`deadlift_order_four` integer,
	`is_deadlift_four` integer,
	`squat_bracket_id` integer,
	`bench_bracket_id` integer,
	`deadlift_bracket_id` integer,
	`squat_day_id` integer,
	`bench_day_id` integer,
	`deadlift_day_id` integer,
	`team` text,
	`team_lift` text,
	`is_locked` integer,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`user_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_comp_entry_to_divisions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_entry_id` integer,
	`division_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`comp_entry_id`) REFERENCES `pb_comp_entry`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`division_id`) REFERENCES `pb_age_divisions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_comp_entry_to_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_entry_id` integer,
	`event_id` integer,
	FOREIGN KEY (`comp_entry_id`) REFERENCES `pb_comp_entry`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`event_id`) REFERENCES `pb_events`(`id`) ON UPDATE no action ON DELETE cascade
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
	`wc_male` text,
	`wc_female` text,
	`wc_mix` text,
	`equipment` text,
	`formular` text,
	`current_state` text,
	`competitor_limit` integer,
	`venue` text,
	`is_fourth_round` integer DEFAULT false,
	`is_started` integer,
	`is_limited` integer,
	`is_paid` integer,
	`is_require_address` integer,
	`is_require_phone` integer,
	`uuid` text,
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
	`comp_name` text,
	`info` text NOT NULL,
	`comp_id` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`is_squat` integer DEFAULT false,
	`is_bench` integer DEFAULT false,
	`is_deadlift` integer DEFAULT false,
	`is_team_battle` integer DEFAULT false,
	`is_press` integer DEFAULT false,
	`is_other_one` integer DEFAULT false,
	`is_other_two` integer DEFAULT false,
	`is_other_three` integer DEFAULT false,
	`is_other_four` integer DEFAULT false,
	`is_other_five` integer DEFAULT false,
	`is_other_six` integer DEFAULT false,
	`comp_id` integer,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_judges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_id` integer,
	`judge_id` integer,
	FOREIGN KEY (`comp_id`) REFERENCES `pb_competition`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`judge_id`) REFERENCES `pb_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_lift` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`comp_entry_id` integer,
	`lift` text,
	`lift_number` integer,
	`weight` text,
	`state` text,
	`is_good_one` integer,
	`is_good_two` integer,
	`is_good_three` integer,
	`order` integer,
	`bracket` integer,
	`day` integer,
	`platform` integer,
	`rack_height` text,
	`gender` text,
	`user_weight` text,
	`team` text,
	`team_lift` text,
	`name` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	FOREIGN KEY (`comp_entry_id`) REFERENCES `pb_comp_entry`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pb_user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clerk_id` text,
	`name` text(256),
	`birth_date` integer,
	`gender` text,
	`address` text,
	`notes` text,
	`instagram` text,
	`openlifter` text,
	`phone` text,
	`email` text,
	`is_fake` integer,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text
);
--> statement-breakpoint
CREATE INDEX `bracket_judge_comp_id_idx` ON `pb_bracket_judge` (`comp_id`);--> statement-breakpoint
CREATE INDEX `bracket_judge_judge_id_idx` ON `pb_bracket_judge` (`judge_id`);--> statement-breakpoint
CREATE INDEX `comp_day_info_comp_id_idx` ON `pb_comp_day_info` (`comp_id`);--> statement-breakpoint
CREATE INDEX `entry_user_id_idx` ON `pb_comp_entry` (`user_id`);--> statement-breakpoint
CREATE INDEX `entry_comp_id_idx` ON `pb_comp_entry` (`comp_id`);--> statement-breakpoint
CREATE INDEX `comp_entry_to_events_comp_entry_id_idx` ON `pb_comp_entry_to_events` (`comp_entry_id`);--> statement-breakpoint
CREATE INDEX `comp_entry_to_events_event_id_idx` ON `pb_comp_entry_to_events` (`event_id`);--> statement-breakpoint
CREATE INDEX `divisions_comp_id_idx` ON `pb_age_divisions` (`comp_id`);--> statement-breakpoint
CREATE INDEX `events_comp_id_idx` ON `pb_events` (`comp_id`);--> statement-breakpoint
CREATE INDEX `judges_comp_id_idx` ON `pb_judges` (`comp_id`);--> statement-breakpoint
CREATE INDEX `judges_judge_id_idx` ON `pb_judges` (`judge_id`);--> statement-breakpoint
CREATE INDEX `lift_comp_entry_id_idx` ON `pb_lift` (`comp_entry_id`);