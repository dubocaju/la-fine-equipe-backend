CREATE TABLE `user` (
	`id` integer PRIMARY KEY NOT NULL,
	`socialID` text,
	`firstName` text,
	`lastName` text,
	`password` text,
	`gender` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_socialID_unique` ON `user` (`socialID`);