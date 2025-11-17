ALTER TABLE `courseMaterials` MODIFY COLUMN `type` enum('video','pdf','worksheet','recording','teaching_note') NOT NULL;--> statement-breakpoint
ALTER TABLE `courseMaterials` ADD `moduleNumber` int NOT NULL;--> statement-breakpoint
ALTER TABLE `studentProgress` ADD `currentModule` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `studentProgress` ADD `completedModules` varchar(255);