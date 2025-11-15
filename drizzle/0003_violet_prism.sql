CREATE TABLE `forumReplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`isInstructorReply` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forumReplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forumThreads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseLevel` varchar(50),
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`isPinned` int NOT NULL DEFAULT 0,
	`isLocked` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`replyCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forumThreads_id` PRIMARY KEY(`id`)
);
