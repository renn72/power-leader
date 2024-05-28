CREATE TABLE `pb-competition_to_division` (
	`competition_id` integer NOT NULL,
	`division_id` integer NOT NULL,
	FOREIGN KEY (`competition_id`) REFERENCES `pb-competition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`division_id`) REFERENCES `pb-division`(`id`) ON UPDATE no action ON DELETE no action
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
