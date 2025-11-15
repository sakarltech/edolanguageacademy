CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`learnerName` varchar(255) NOT NULL,
	`learnerAge` int NOT NULL,
	`parentName` varchar(255),
	`email` varchar(320) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`courseLevel` varchar(50) NOT NULL,
	`ageGroup` varchar(50) NOT NULL,
	`stripePaymentIntentId` varchar(255),
	`stripeCheckoutSessionId` varchar(255),
	`status` enum('pending','paid','active','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`paidAt` timestamp,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);