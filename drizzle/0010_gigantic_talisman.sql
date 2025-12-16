ALTER TABLE `campaignSends` ADD `openedAt` timestamp;--> statement-breakpoint
ALTER TABLE `campaignSends` ADD `clickedAt` timestamp;--> statement-breakpoint
ALTER TABLE `campaignSends` ADD `openCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `campaignSends` ADD `clickCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `emailCampaigns` ADD `openedCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `emailCampaigns` ADD `clickedCount` int DEFAULT 0;