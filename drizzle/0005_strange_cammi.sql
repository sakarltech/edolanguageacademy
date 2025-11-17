CREATE TABLE `whatsappGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseLevel` varchar(50) NOT NULL,
	`timeSlot` varchar(20) NOT NULL,
	`groupLink` varchar(500) NOT NULL,
	`groupName` varchar(255) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `whatsappGroups_id` PRIMARY KEY(`id`)
);
