CREATE TABLE `pb_event` (
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
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text
);
