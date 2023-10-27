CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`securityNumber` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_securityNumber_unique` ON `user` (`securityNumber`);