DROP TABLE `pb_weight_classes_f`;--> statement-breakpoint
DROP TABLE `pb_weight_classes_m`;--> statement-breakpoint
DROP TABLE `pb_weight_classes_mix`;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `wc_male` text;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `wc_female` text;--> statement-breakpoint
ALTER TABLE `pb_competition` ADD `wc_mix` text;