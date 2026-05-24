CREATE TABLE `course` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `course_name_unique` ON `course` (`name`);--> statement-breakpoint
ALTER TABLE `user` ADD `course_id` text REFERENCES course(id);