ALTER TABLE `pb_comp_entry` ADD `squat_order_one` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `squat_order_two` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `squat_order_three` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `squat_order_four` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `bench_order_one` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `bench_order_two` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `bench_order_three` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `bench_order_four` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `deadlift_order_one` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `deadlift_order_two` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `deadlift_order_three` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` ADD `deadlift_order_four` integer;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` DROP COLUMN `squat_order_id`;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` DROP COLUMN `bench_order_id`;--> statement-breakpoint
ALTER TABLE `pb_comp_entry` DROP COLUMN `deadlift_order_id`;