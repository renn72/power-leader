ALTER TABLE `pb_comp_day_info` ADD `round` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `is_fourth_round` integer DEFAULT false;