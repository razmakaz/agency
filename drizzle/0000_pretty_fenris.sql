CREATE TABLE "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"address_line_1" text,
	"address_line_2" text,
	"address_line_3" text,
	"locality" text,
	"region" text,
	"postal_code" text,
	"country_code" text,
	"country_name" text,
	"address_type" text NOT NULL,
	"latitude" text,
	"longitude" text
);
--> statement-breakpoint
CREATE TABLE "approvals" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"entity_type" text DEFAULT 'Shift' NOT NULL,
	"entity_id" text,
	"approved_by" text,
	"approved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"worker_contact_id" text NOT NULL,
	"billing_contact_id" text,
	"worksite_id" text NOT NULL,
	"organization_id" text,
	"assignment_type" text NOT NULL,
	"job_title" text NOT NULL,
	"job_description" text NOT NULL,
	"job_start_date" date NOT NULL,
	"job_end_date" date
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apikeys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" text NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp,
	"enabled" boolean DEFAULT true,
	"rate_limit_enabled" boolean DEFAULT true,
	"rate_limit_time_window" integer DEFAULT 86400000,
	"rate_limit_max" integer DEFAULT 10,
	"request_count" integer,
	"remaining" integer,
	"last_request" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"is_anonymous" boolean,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"account_name" text NOT NULL,
	"account_number" text NOT NULL,
	"routing_number" text NOT NULL,
	"account_type" text NOT NULL,
	"bank_name" text DEFAULT '',
	"swift" text DEFAULT '',
	"iban" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "comm_item_statuses" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"comm_item_id" text,
	"status" text NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "comm_items" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"comm_template_id" text,
	"provider_id" text,
	"provider" text DEFAULT 'Resend' NOT NULL,
	"from" text NOT NULL,
	"to" text NOT NULL,
	"cc" text[] DEFAULT '{}',
	"bcc" text[] DEFAULT '{}',
	"reply_to" text[] DEFAULT '{}',
	"subject" text NOT NULL,
	"html" text,
	"text" text
);
--> statement-breakpoint
CREATE TABLE "comm_template_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"comm_template_id" text NOT NULL,
	"language" text NOT NULL,
	"effective_from" timestamp NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comm_template" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"name" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comp_code" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"country" char(2) DEFAULT 'US' NOT NULL,
	"region" char(3) NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"effective_from" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"first_name" text,
	"middle_name" text,
	"last_name" text,
	"legal_name" text,
	"preferred_name" text,
	"display_name" text GENERATED ALWAYS AS (
                CASE 
                    WHEN contact_type IN ('Partner', 'Vendor', 'Client') THEN 
                    COALESCE(NULLIF(trim(preferred_name), ''), trim(legal_name))
                    ELSE 
                    COALESCE(NULLIF(trim(preferred_name), ''), trim(first_name))
                END
                ) STORED NOT NULL,
	"preferred_language" text DEFAULT 'en' NOT NULL,
	"contact_type" text DEFAULT 'Other' NOT NULL,
	"phones" text[],
	"emails" text[],
	"addresses" text[],
	"notes" text[],
	CONSTRAINT "contact_type_check" CHECK (
                (
                    contact_type IN ('Staff', 'Associate', 'Contact', 'Other') 
                AND first_name IS NOT NULL AND last_name IS NOT NULL AND legal_name IS NULL
                )
                OR (
                    contact_type IN ('Partner', 'Vendor', 'Client') 
                    AND legal_name IS NOT NULL AND first_name IS NULL AND last_name IS NULL
                    )
            )
);
--> statement-breakpoint
CREATE TABLE "distributions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"assignment_id" text,
	"amount" numeric,
	"date" timestamp,
	"notes" text[]
);
--> statement-breakpoint
CREATE TABLE "external_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"schema_name" text NOT NULL,
	"object_id" text NOT NULL,
	"key_name" text NOT NULL,
	"key_value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_balances" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"journal_id" text NOT NULL,
	"balance" integer NOT NULL,
	CONSTRAINT "journal_balances_journal_id_unique" UNIQUE("journal_id")
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"journal_id" text NOT NULL,
	"entry_type" text NOT NULL,
	"amount" integer NOT NULL,
	"description" text NOT NULL,
	"entity_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_reference" text NOT NULL,
	CONSTRAINT "idx_idempotency_key" UNIQUE("journal_id","entry_type","entity_type","entity_id","entity_reference")
);
--> statement-breakpoint
CREATE TABLE "journals" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"journal_type" text NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"description" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "notebook_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"schema_name" text NOT NULL,
	"object_id" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization_config" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"organization_id" text NOT NULL,
	"effective_date" timestamp NOT NULL,
	"distribution_hold" boolean DEFAULT false,
	"chargeback_enabled" boolean DEFAULT true,
	"chargeback_grace" integer DEFAULT 0,
	"late_fee_rate" integer DEFAULT 0,
	"late_fee_grace" integer DEFAULT 0,
	"use_logo" boolean DEFAULT true,
	"logo_file" text
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"display_name" text,
	"legal_name" text,
	"ein" text,
	"addresses" text[],
	"parent_id" text,
	"ancestry" text DEFAULT '/' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pay_bill_components" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"assignment_id" text NOT NULL,
	"pay_rate" numeric NOT NULL,
	"bill_rate" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pay_bill_adjustments" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"assignment_id" text NOT NULL,
	"description" text NOT NULL,
	"pay_units" numeric DEFAULT '0' NOT NULL,
	"pay_amount" numeric DEFAULT '0' NOT NULL,
	"bill_units" numeric DEFAULT '0' NOT NULL,
	"bill_amount" numeric DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payroll" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"user_id" text,
	"organization_id" text,
	"role" text NOT NULL,
	"resource" text NOT NULL,
	"context" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phone_numbers" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"number" text,
	"phone_type" text DEFAULT 'MOBILE',
	"is_primary" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "privacy_policies" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"content" text NOT NULL,
	"version" text NOT NULL,
	"effective_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"assignment_id" text,
	"start_time" timestamp,
	"break_start" timestamp,
	"break_end" timestamp,
	"end_time" timestamp,
	"revised_from" text,
	"revised_to" text
);
--> statement-breakpoint
CREATE TABLE "terms_of_services" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"content" text NOT NULL,
	"version" text NOT NULL,
	"effective_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploaded_documents" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"entity_type" text DEFAULT 'assignments' NOT NULL,
	"entity_id" text NOT NULL,
	"filename" text NOT NULL,
	"content_type" text NOT NULL,
	"content_length" integer NOT NULL,
	"content_hash" text NOT NULL,
	"s3_bucket" text NOT NULL,
	"s3_key" text NOT NULL,
	CONSTRAINT "uploaded_documents_s3_key_unique" UNIQUE("s3_key")
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "white_label_configs" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text DEFAULT 'system' NOT NULL,
	"updated_by" text,
	"is_deleted" boolean DEFAULT false,
	"organization_id" text,
	"header_font" text,
	"body_font" text,
	"primary_color" text,
	"on_primary_color" text,
	"secondary_color" text,
	"on_secondary_color" text,
	"surface_color" text,
	"on_surface_color" text,
	"logo_url" text,
	"logo_dark_url" text,
	"logo_light_url" text,
	"favicon_url" text,
	"brand_name" text,
	"brand_tagline" text,
	"custom_domain" text,
	"subdomain" text,
	"website_url" text,
	"default_mode" text DEFAULT 'light'
);
--> statement-breakpoint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_approved_by_contacts_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_worker_contact_id_contacts_id_fk" FOREIGN KEY ("worker_contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_billing_contact_id_contacts_id_fk" FOREIGN KEY ("billing_contact_id") REFERENCES "public"."contacts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_worksite_id_addresses_id_fk" FOREIGN KEY ("worksite_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apikeys" ADD CONSTRAINT "apikeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_item_statuses" ADD CONSTRAINT "comm_item_statuses_comm_item_id_comm_items_id_fk" FOREIGN KEY ("comm_item_id") REFERENCES "public"."comm_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_items" ADD CONSTRAINT "comm_items_comm_template_id_comm_template_id_fk" FOREIGN KEY ("comm_template_id") REFERENCES "public"."comm_template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comm_template_entries" ADD CONSTRAINT "comm_template_entries_comm_template_id_comm_template_id_fk" FOREIGN KEY ("comm_template_id") REFERENCES "public"."comm_template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_balances" ADD CONSTRAINT "journal_balances_journal_id_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_journal_id_journals_id_fk" FOREIGN KEY ("journal_id") REFERENCES "public"."journals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_config" ADD CONSTRAINT "organization_config_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_config" ADD CONSTRAINT "organization_config_logo_file_uploaded_documents_id_fk" FOREIGN KEY ("logo_file") REFERENCES "public"."uploaded_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_parent_id_organizations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_bill_components" ADD CONSTRAINT "pay_bill_components_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pay_bill_adjustments" ADD CONSTRAINT "pay_bill_adjustments_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_revised_from_shifts_id_fk" FOREIGN KEY ("revised_from") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_revised_to_shifts_id_fk" FOREIGN KEY ("revised_to") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "white_label_configs" ADD CONSTRAINT "white_label_configs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_comp_codes_country_region_code" ON "comp_code" USING btree ("country","region","code");--> statement-breakpoint
CREATE INDEX "idx_name" ON "contacts" USING btree ("display_name");--> statement-breakpoint
CREATE INDEX "idx_type" ON "contacts" USING btree ("contact_type");--> statement-breakpoint
CREATE INDEX "idx_emails" ON "contacts" USING btree ("emails");--> statement-breakpoint
CREATE INDEX "idx_phones" ON "contacts" USING btree ("phones");--> statement-breakpoint
CREATE INDEX "idx_notebook_entries_object_id" ON "notebook_entries" USING btree ("object_id","schema_name");--> statement-breakpoint
CREATE INDEX "idx_organizations_parent_id" ON "organizations" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_organizations_ancestry" ON "organizations" USING btree ("ancestry");--> statement-breakpoint
CREATE INDEX "idx_permissions_role" ON "permissions" USING btree ("role","resource","context");--> statement-breakpoint
CREATE INDEX "idx_uploaded_documents_entity" ON "uploaded_documents" USING btree ("entity_type","entity_id");