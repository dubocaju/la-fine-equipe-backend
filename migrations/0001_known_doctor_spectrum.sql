CREATE TABLE `medicalAct` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` integer DEFAULT CURRENT_TIMESTAMP,
	`place` text,
	`intervention` text NOT NULL,
	`comment` text,
	`priceIntervention` real NOT NULL,
	`priceSupported` real NOT NULL,
	`isConfirmed` integer DEFAULT FALSE,
	`isPaid` integer DEFAULT FALSE
);
