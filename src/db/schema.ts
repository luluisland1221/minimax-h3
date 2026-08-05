import { boolean, integer, jsonb, pgTable, text, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	role: text('role'),
	banned: boolean('banned'),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	customerId: text('customer_id'),
}, (table) => ({
	userIdIdx: index("user_id_idx").on(table.id),
	userCustomerIdIdx: index("user_customer_id_idx").on(table.customerId),
	userRoleIdx: index("user_role_idx").on(table.role),
}));

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	impersonatedBy: text('impersonated_by')
}, (table) => ({
	sessionTokenIdx: index("session_token_idx").on(table.token),
	sessionUserIdIdx: index("session_user_id_idx").on(table.userId),
}));

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
}, (table) => ({
	accountUserIdIdx: index("account_user_id_idx").on(table.userId),
	accountAccountIdIdx: index("account_account_id_idx").on(table.accountId),
	accountProviderIdIdx: index("account_provider_id_idx").on(table.providerId),
}));

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});

export const payment = pgTable("payment", {
	id: text("id").primaryKey(),
	priceId: text('price_id').notNull(),
	type: text('type').notNull(),
	interval: text('interval'),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	customerId: text('customer_id').notNull(),
	subscriptionId: text('subscription_id'),
	sessionId: text('session_id'),
	status: text('status').notNull(),
	periodStart: timestamp('period_start'),
	periodEnd: timestamp('period_end'),
	cancelAtPeriodEnd: boolean('cancel_at_period_end'),
	trialStart: timestamp('trial_start'),
	trialEnd: timestamp('trial_end'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
	paymentTypeIdx: index("payment_type_idx").on(table.type),
	paymentPriceIdIdx: index("payment_price_id_idx").on(table.priceId),
	paymentUserIdIdx: index("payment_user_id_idx").on(table.userId),
	paymentCustomerIdIdx: index("payment_customer_id_idx").on(table.customerId),
	paymentStatusIdx: index("payment_status_idx").on(table.status),
	paymentSubscriptionIdIdx: index("payment_subscription_id_idx").on(table.subscriptionId),
	paymentSessionIdIdx: index("payment_session_id_idx").on(table.sessionId),
}));

export const userCredit = pgTable("user_credit", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	currentCredits: integer("current_credits").notNull().default(0),
	lastRefreshAt: timestamp("last_refresh_at"), // deprecated
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	userCreditUserIdIdx: index("user_credit_user_id_idx").on(table.userId),
}));

export const creditTransaction = pgTable("credit_transaction", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	type: text("type").notNull(),
	description: text("description"),
	amount: integer("amount").notNull(),
	remainingAmount: integer("remaining_amount"),
	paymentId: text("payment_id"),
	expirationDate: timestamp("expiration_date"),
	expirationDateProcessedAt: timestamp("expiration_date_processed_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	creditTransactionUserIdIdx: index("credit_transaction_user_id_idx").on(table.userId),
	creditTransactionTypeIdx: index("credit_transaction_type_idx").on(table.type),
}));

export const inboundMail = pgTable("inbound_mail", {
	id: text("id").primaryKey(),
	messageId: text("message_id").notNull().unique(),
	fromEmail: text("from_email").notNull(),
	toEmail: text("to_email").notNull(),
	subject: text("subject").notNull(),
	body: text("body").notNull(),
	spamVerdict: text("spam_verdict"),
	virusVerdict: text("virus_verdict"),
	status: text("status").notNull().default("unread"),
	replyBody: text("reply_body"),
	receivedAt: timestamp("received_at").notNull().defaultNow(),
	repliedAt: timestamp("replied_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
	inboundMailReceivedAtIdx: index("inbound_mail_received_at_idx").on(table.receivedAt),
	inboundMailStatusIdx: index("inbound_mail_status_idx").on(table.status),
}));

export const outboundMail = pgTable("outbound_mail", {
	id: text("id").primaryKey(),
	plunkEmailId: text("plunk_email_id"),
	toEmail: text("to_email").notNull(),
	fromEmail: text("from_email").notNull(),
	subject: text("subject").notNull(),
	body: text("body").notNull(),
	status: text("status").notNull().default("sent"),
	sentByUserId: text("sent_by_user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	sentAt: timestamp("sent_at").notNull().defaultNow(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
	outboundMailSentAtIdx: index("outbound_mail_sent_at_idx").on(table.sentAt),
	outboundMailRecipientIdx: index("outbound_mail_recipient_idx").on(table.toEmail),
}));

export const videoGeneration = pgTable("video_generation", {
	id: text("id").primaryKey(),
	taskId: text("task_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
	provider: text("provider").notNull().default("minimax"),
	model: text("model").notNull().default("MiniMax-H3"),
	mode: text("mode").notNull(),
	prompt: text("prompt").notNull(),
	resolution: text("resolution").notNull(),
	duration: integer("duration").notNull(),
	ratio: text("ratio").notNull(),
	aigcWatermark: boolean("aigc_watermark").notNull().default(false),
	inputAssets: jsonb("input_assets").$type<{
		firstFrameUrl?: string;
		lastFrameUrl?: string;
		referenceImageUrls: string[];
		referenceVideoUrls: string[];
		referenceAudioUrls: string[];
	}>().notNull(),
	status: text("status").notNull().default("queued"),
	providerOutputUrl: text("provider_output_url"),
	storageKey: text("storage_key"),
	storageUrl: text("storage_url"),
	errorCode: text("error_code"),
	errorMessage: text("error_message"),
	usage: jsonb("usage").$type<Record<string, unknown>>(),
	creditsReserved: integer("credits_reserved").notNull().default(0),
	creditsCharged: integer("credits_charged"),
	creditsSettledAt: timestamp("credits_settled_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	completedAt: timestamp("completed_at"),
}, (table) => ({
	videoGenerationTaskIdIdx: uniqueIndex("video_generation_task_id_idx").on(table.taskId),
	videoGenerationUserIdIdx: index("video_generation_user_id_idx").on(table.userId),
	videoGenerationStatusIdx: index("video_generation_status_idx").on(table.status),
	videoGenerationCreatedAtIdx: index("video_generation_created_at_idx").on(table.createdAt),
}));
