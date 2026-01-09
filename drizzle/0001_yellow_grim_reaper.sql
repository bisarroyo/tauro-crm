PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_id` integer,
	`user_id` text,
	`from_me` integer NOT NULL,
	`body` text NOT NULL,
	`type` text DEFAULT 'text' NOT NULL,
	`wa_message_id` text,
	`status` text DEFAULT 'sent',
	`created_at` integer DEFAULT (unixepoch()),
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "contact_id", "user_id", "from_me", "body", "type", "wa_message_id", "status", "created_at") SELECT "id", "contact_id", "user_id", "from_me", "body", "type", "wa_message_id", "status", "created_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `contacts` ADD `last_message_at` integer;--> statement-breakpoint
ALTER TABLE `contacts` ADD `unread_count` integer DEFAULT 0;