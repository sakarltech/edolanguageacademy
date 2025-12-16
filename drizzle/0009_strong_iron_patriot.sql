CREATE TABLE `campaignSends` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`contactId` int NOT NULL,
	`status` enum('pending','sent','failed','bounced') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `campaignSends_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailCampaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`audienceType` enum('all','by_tag','by_source') NOT NULL DEFAULT 'all',
	`audienceFilter` varchar(255),
	`subject` varchar(255),
	`preheader` varchar(255),
	`bodyHtml` text,
	`bodyText` text,
	`ctaText` varchar(100),
	`ctaLink` varchar(500),
	`status` enum('draft','scheduled','sending','completed','cancelled') NOT NULL DEFAULT 'draft',
	`scheduledAt` timestamp,
	`sentAt` timestamp,
	`targetedCount` int DEFAULT 0,
	`sentCount` int DEFAULT 0,
	`failedCount` int DEFAULT 0,
	`unsubscribedCount` int DEFAULT 0,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emailCampaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketingContacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`tags` varchar(500),
	`source` varchar(100),
	`subscribed` int NOT NULL DEFAULT 1,
	`unsubscribeToken` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketingContacts_id` PRIMARY KEY(`id`),
	CONSTRAINT `marketingContacts_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `suppressionList` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`reason` enum('unsubscribed','hard_bounce','complaint','manual') NOT NULL,
	`campaignId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `suppressionList_id` PRIMARY KEY(`id`),
	CONSTRAINT `suppressionList_email_unique` UNIQUE(`email`)
);
