CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`securityNumber` text,
	`firstName` text,
	`lastName` text,
	`password` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_securityNumber_unique` ON `user` (`securityNumber`);