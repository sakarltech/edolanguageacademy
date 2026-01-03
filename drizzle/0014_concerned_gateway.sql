CREATE TABLE `otpVerifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`countryCode` varchar(10) NOT NULL,
	`phoneNumber` varchar(50) NOT NULL,
	`otpCode` varchar(10) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`verified` int NOT NULL DEFAULT 0,
	`verifiedAt` timestamp,
	`attempts` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `otpVerifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `enrollments` ADD `countryCode` varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` ADD `phoneVerified` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` ADD `phoneVerifiedAt` timestamp;