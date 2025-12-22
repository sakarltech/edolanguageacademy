CREATE TABLE `privateClassScheduling` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`schedulingStatus` enum('pending','coordinating','scheduled','completed') NOT NULL DEFAULT 'pending',
	`studentGoals` text,
	`preferredSchedule` text,
	`timezone` varchar(100),
	`frequency` enum('1x_per_week','2x_per_week','custom'),
	`coordinationNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `privateClassScheduling_id` PRIMARY KEY(`id`),
	CONSTRAINT `privateClassScheduling_enrollmentId_unique` UNIQUE(`enrollmentId`)
);
--> statement-breakpoint
CREATE TABLE `privateClassSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`sessionNumber` int NOT NULL,
	`scheduledDate` timestamp,
	`status` enum('scheduled','completed','cancelled','rescheduled') NOT NULL DEFAULT 'scheduled',
	`duration` int DEFAULT 60,
	`instructorNotes` text,
	`materialsUrl` text,
	`recordingUrl` text,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `privateClassSessions_id` PRIMARY KEY(`id`)
);
