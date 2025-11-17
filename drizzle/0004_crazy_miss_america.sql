ALTER TABLE `enrollments` ADD `whatsappNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `enrollments` ADD `timeSlot` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `enrollments` DROP COLUMN `learnerAge`;--> statement-breakpoint
ALTER TABLE `enrollments` DROP COLUMN `ageGroup`;