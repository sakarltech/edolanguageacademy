CREATE TABLE `assessmentSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`userId` int NOT NULL,
	`courseLevel` varchar(50) NOT NULL,
	`moduleNumber` int NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`fileSize` int NOT NULL,
	`status` enum('submitted','reviewed','graded') NOT NULL DEFAULT 'submitted',
	`score` int,
	`feedback` text,
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessmentSubmissions_id` PRIMARY KEY(`id`)
);
