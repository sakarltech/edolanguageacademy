CREATE TABLE `courseMaterials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseLevel` varchar(50) NOT NULL,
	`week` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('video','pdf','worksheet','recording') NOT NULL,
	`fileUrl` varchar(500),
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseMaterials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`userId` int NOT NULL,
	`currentWeek` int NOT NULL DEFAULT 1,
	`completedWeeks` varchar(255),
	`attendanceCount` int NOT NULL DEFAULT 0,
	`assessmentScore` int,
	`assessmentPassed` int DEFAULT 0,
	`certificateIssued` int DEFAULT 0,
	`certificateUrl` varchar(500),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentProgress_id` PRIMARY KEY(`id`)
);
