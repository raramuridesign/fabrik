CREATE TABLE IF NOT EXISTS `#__fabrik_subs_invoices` (
  `id` int(6) NOT NULL auto_increment,
  `subscr_id` int(6) default NULL DEFAULT 0,
  `invoice_number` varchar(255) DEFAULT '',
  `created_date` TIMESTAMP,
  `transaction_date` datetime NULL DEFAULT NULL,
  `gateway_id` int(6) DEFAULT 0,
  `amount` varchar(40) DEFAULT 0,
  `currency` varchar(10) DEFAULT '',
  `paid` INT(1) DEFAULT 0,
  `pp_txn_id` varchar(255) DEFAULT '',
  `pp_payment_amount` varchar(20) DEFAULT '',
  `pp_payment_status` varchar(20) DEFAULT '',
  `pp_txn_type` varchar(20) DEFAULT '',
  `pp_fee` varchar(255) DEFAULT '',
  `pp_payer_email` varchar(255) DEFAULT '',
  PRIMARY KEY  (`id`),
  KEY `fb_prefilter_method_INDEX` (`gateway_id`),
  KEY `fb_filter_invoice_number_INDEX` (`invoice_number`(10)),
  KEY `fb_filter_subscr_id_INDEX` (`subscr_id`),
  KEY `fb_filter_pp_payer_email_INDEX` (`pp_payer_email`(10)),
  KEY `fb_filter_pp_txn_id_INDEX` (`pp_txn_id`(10))
);


CREATE TABLE IF NOT EXISTS `#__fabrik_subs_plans` (
  `id` int(11) NOT NULL auto_increment,
  `active` tinyint(1) DEFAULT 0,
  `visible` tinyint(1) DEFAULT 0,
  `ordering` int(11) NOT NULL default '999999',
  `plan_name` varchar(255) DEFAULT '',
  `desc` text DEFAULT '',
  `usergroup` int(3) DEFAULT 0,
  `free` text DEFAULT '',
  `strapline` varchar(255) DEFAULT '',
  PRIMARY KEY  (`id`),
  KEY `fb_prefilter_active_INDEX` (`active`),
  KEY `fb_prefilter_visible_INDEX` (`visible`)
);

CREATE TABLE IF NOT EXISTS `#__fabrik_subs_cron_emails` (
  `id` int(6) NOT NULL auto_increment,
  `subject` varchar(255) NOT NULL DEFAULT '',
  `body` text NOT NULL DEFAULT '',
  `event_type` varchar(20) NOT NULL DEFAULT '',
  `timeunit` varchar(2) NOT NULL DEFAULT '',
  `time_value` int(3) NOT NULL DEFAULT 0,
  PRIMARY KEY  (`id`),
  KEY `fb_filter_event_type_INDEX` (`event_type`(10))
);

CREATE TABLE IF NOT EXISTS `#__fabrik_subs_payment_gateways` (
  `id` int(6) NOT NULL auto_increment,
  `name` varchar(255) DEFAULT '',
  `active` text DEFAULT '',
  `description` text DEFAULT '',
  `subscription` text DEFAULT '',
  PRIMARY KEY  (`id`)
);


CREATE TABLE IF NOT EXISTS `#__fabrik_subs_plan_billing_cycle` (
  `id` int(11) NOT NULL auto_increment,
  `plan_id` int(6) NOT NULL DEFAULT 0,
  `duration` int(6) NOT NULL DEFAULT 0,
  `period_unit` char(1) NOT NULL DEFAULT '',
  `cost` int(6) NOT NULL DEFAULT 0,
  `currency` char(4) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `label` varchar(255) DEFAULT '',
  `plan_name` varchar(255) DEFAULT '',
  PRIMARY KEY  (`id`)
);

CREATE TABLE IF NOT EXISTS `#__fabrik_subs_subscriptions` (
  `id` int(11) NOT NULL auto_increment,
  `userid` int(11) DEFAULT 0,
  `primary` int(1) NOT NULL DEFAULT 0,
  `type` int(6) DEFAULT 0,
  `status` varchar(10) DEFAULT '',
  `signup_date` datetime NULL DEFAULT NULL,
  `lastpay_date` datetime NULL DEFAULT NULL,
  `cancel_date` datetime NULL DEFAULT NULL,
  `eot_date` datetime NULL DEFAULT NULL,
  `eot_cause` varchar(30) DEFAULT '',
  `plan` int(6) DEFAULT 0,
  `recurring` int(1) NOT NULL DEFAULT 0,
  `lifetime` int(1) NOT NULL DEFAULT 0,
  `expiration` datetime NULL DEFAULT NULL,
  PRIMARY KEY  (`id`),
  KEY `fb_filter_status_INDEX` (`status`),
  KEY `fb_order_userid_INDEX` (`userid`),
  KEY `fb_filter_plan_INDEX` (`plan`),
  KEY `fb_order_lastpay_date_INDEX` (`lastpay_date`),
  KEY `fb_filter_lastpay_date_INDEX` (`lastpay_date`),
  KEY `fb_filter_type_INDEX` (`type`),
  KEY `fb_order_signup_date_INDEX` (`signup_date`)
);

CREATE TABLE IF NOT EXISTS `#__fabrik_subs_users` (
  `id` int(6) NOT NULL auto_increment,
  `time_date` datetime NULL DEFAULT NULL,
  `userid` varchar(255) DEFAULT '',
  `name` varchar(255) DEFAULT '',
  `username` varchar(255) DEFAULT '',
  `email` varchar(255) DEFAULT '',
  `password` varchar(255) DEFAULT '',
  `plan_id` int(11) DEFAULT 0,
  `terms` text DEFAULT '',
  `termstext` text DEFAULT '',
  `gateway` int(6) DEFAULT 0,
  `pp_txn_id` varchar(255) DEFAULT '',
  `pp_payment_amount` varchar(255) DEFAULT '',
  `pp_payment_status` varchar(255) DEFAULT '',
  `billing_cycle` int(11) DEFAULT 0,
  `billing_duration` varchar(255) DEFAULT '',
  `billing_period` varchar(255) DEFAULT '',
  PRIMARY KEY  (`id`),
  KEY `fb_filter_userid_INDEX` (`userid`(10))
)
