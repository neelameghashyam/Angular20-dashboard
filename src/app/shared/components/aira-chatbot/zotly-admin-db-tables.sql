-- Customers table
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(255),
    date_added DATETIME NOT NULL,
    integrations TEXT,
    active_plan_name ENUM('Free', 'Premium') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Websites table
CREATE TABLE websites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    protocol ENUM('HTTP', 'HTTPS') NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    company_id BIGINT NOT NULL,
    business_category VARCHAR(255),
    date_added DATETIME NOT NULL,
    is_active TINYINT(1) NOT NULL,
    is_verified TINYINT(1) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('ADMIN', 'AGENT', 'MANAGER', 'SUPPORT') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    department VARCHAR(255),
    company_id BIGINT,
    simultaneous_chat_limit INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME
);

-- Invoices table
CREATE TABLE invoices (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    invoice_no VARCHAR(255) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
    deleted_at DATETIME
);

-- Payments table
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    status ENUM('Completed', 'Cancelled', 'Refunded') NOT NULL,
    cancellation_time DATETIME,
    cancellation_reason TEXT
);

-- Price Plans table
CREATE TABLE price_plans (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    plan_name VARCHAR(255) NOT NULL,
    plan_description TEXT,
    status VARCHAR(20) DEFAULT 'inactive',
    default_plan TINYINT(1) NOT NULL,
    free_plan TINYINT(1) NOT NULL,
    type VARCHAR(20) DEFAULT 'public',
    date_added DATETIME NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_annually DECIMAL(10,2) NOT NULL,
    unlimited_chat TINYINT(1) NOT NULL,
    number_of_chats INT NOT NULL,
    extra_chat_amount DECIMAL(10,2) NOT NULL,
    unlimited_chat_history_storage TINYINT(1) NOT NULL,
    chat_history_duration_days INT NOT NULL,
    cost_per_extra_day_of_storage DECIMAL(10,2) NOT NULL,
    unlimited_users TINYINT(1) NOT NULL,
    number_of_users INT NOT NULL,
    extra_user_cost DECIMAL(10,2) NOT NULL,
    number_of_websites INT NOT NULL,
    extra_website_cost DECIMAL(10,2) NOT NULL,
    chat_takeover TINYINT(1) NOT NULL,
    chat_tagging TINYINT(1) NOT NULL,
    chat_transcript TINYINT(1) NOT NULL,
    chatbot_openai_included TINYINT(1) NOT NULL,
    managed_account TINYINT(1) NOT NULL,
    custom_plan TINYINT(1) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

-- Create users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('ADMIN', 'AGENT', 'MANAGER', 'SUPPORT') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255),
    department VARCHAR(255),
    company_id BIGINT,
    simultaneous_chat_limit INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    deleted_at DATETIME
) ENGINE=InnoDB;

-- Announcements table
CREATE TABLE announcements (
    announcement_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    page_type ENUM('Login', 'Dashboard') NOT NULL,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    CONSTRAINT unique_page_type UNIQUE (page_type),
    CONSTRAINT fk_announcements_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- DefaultAvatar table
CREATE TABLE default_avatar (
    avatar_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    avatar_image_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    CONSTRAINT fk_default_avatar_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- AvatarTemplates table
CREATE TABLE avatar_templates (
    template_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    element_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
) ENGINE=InnoDB;

-- Greetings table
CREATE TABLE greetings (
    greeting_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    title VARCHAR(255) NOT NULL,
    greeting TEXT NOT NULL,
    type ENUM('All_Visitors', 'Returning_Visitors', 'First_Time_Visitors') NOT NULL,
    visible TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    CONSTRAINT fk_greetings_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Translations table
CREATE TABLE translations (
    translation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    greeting_id BIGINT NOT NULL,
    language VARCHAR(255) NOT NULL,
    greeting_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_translations_greeting_id FOREIGN KEY (greeting_id) REFERENCES greetings(greeting_id) ON DELETE CASCADE
) ENGINE=InnoDB;
ALTER TABLE translations
    MODIFY COLUMN greeting_id BIGINT NOT NULL,
    MODIFY COLUMN updated_at DATETIME NOT NULL,
    ADD CONSTRAINT fk_translations_greeting_id FOREIGN KEY (greeting_id) REFERENCES greetings(greeting_id) ON DELETE CASCADE;
    
-- EyeCatchers table
CREATE TABLE eye_catchers (
    eye_catcher_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    background_color VARCHAR(7) NOT NULL,
    text_color VARCHAR(7) NOT NULL,
    image_url VARCHAR(255),
    created_by VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    CONSTRAINT fk_eye_catchers_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Indexes for performance optimization
CREATE INDEX idx_announcements_page_type ON announcements (page_type);
CREATE INDEX idx_announcements_title ON announcements (title);
CREATE INDEX idx_default_avatar_user_id ON defaultAvatar (user_id);
CREATE INDEX idx_default_avatar_name ON defaultAvatar (name);
CREATE INDEX idx_avatar_templates_gender ON avatarTemplates (gender);
CREATE INDEX idx_avatar_templates_element_name ON avatarTemplates (element_name);
CREATE INDEX idx_greetings_title ON greetings (title);
CREATE INDEX idx_greetings_type ON greetings (type);
CREATE INDEX idx_greetings_visible ON greetings (visible);
CREATE INDEX idx_greetings_user_id ON greetings (user_id);
CREATE INDEX idx_translations_greeting_id ON translations (greeting_id);
CREATE INDEX idx_translations_language ON translations (language);
CREATE INDEX idx_eye_catchers_title ON eyeCatchers (title);
CREATE INDEX idx_eye_catchers_created_by ON eyeCatchers (created_by);
CREATE INDEX idx_eye_catchers_company ON eyeCatchers (company);
CREATE INDEX idx_eye_catchers_user_id ON eyeCatchers (user_id);

-- Table: inactivity_timeouts
CREATE TABLE IF NOT EXISTS inactivity_timeouts (
    timeout_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    agent_not_responding_enabled BOOLEAN NOT NULL,
    agent_not_responding_minutes INT NOT NULL,
    agent_not_responding_seconds INT NOT NULL,
    archive_chat_enabled BOOLEAN NOT NULL,
    archive_chat_minutes INT NOT NULL,
    archive_chat_seconds INT NOT NULL,
    visitor_inactivity_minutes INT NOT NULL,
    visitor_inactivity_seconds INT NOT NULL,
    timeout_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_inactivity_timeouts_timeout_message (timeout_message(255))
) ENGINE=InnoDB;

-- Table: queued_messages
CREATE TABLE IF NOT EXISTS queued_messages (
    queued_message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    message TEXT NOT NULL,
    background_color VARCHAR(7) NOT NULL,
    text_color VARCHAR(7) NOT NULL,
    image_url VARCHAR(255),
    created_by VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_queued_messages_message (message(255)),
    INDEX idx_queued_messages_created_by (created_by),
    INDEX idx_queued_messages_company (company)
) ENGINE=InnoDB;


-- Table: tags
CREATE TABLE IF NOT EXISTS tags (
    tag_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    tag VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (tag),
    INDEX idx_tags_tag (tag),
    INDEX idx_tags_created_by (created_by),
    INDEX idx_tags_company (company)
) ENGINE=InnoDB;

-- Table: global_webhooks
CREATE TABLE IF NOT EXISTS global_webhooks (
    global_webhook_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    event VARCHAR(100) NOT NULL,
    data_type_enabled BOOLEAN NOT NULL,
    destination VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    target_url VARCHAR(255),
    created_by VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_global_webhooks_event (event),
    INDEX idx_global_webhooks_email (email),
    INDEX idx_global_webhooks_target_url (target_url),
    INDEX idx_global_webhooks_created_by (created_by),
    INDEX idx_global_webhooks_company (company)
) ENGINE=InnoDB;

-- Table: integrations
CREATE TABLE IF NOT EXISTS integrations (
    integration_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    service VARCHAR(50) NOT NULL,
    website VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    is_configured BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (service, website),
    INDEX idx_integrations_service (service),
    INDEX idx_integrations_website (website)
) ENGINE=InnoDB;

-- Table: templates
CREATE TABLE templates (
    template_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    business_category VARCHAR(100) NOT NULL,
    business_subcategory VARCHAR(100) NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Indexes for templates search fields
CREATE INDEX idx_templates_business_category ON templates(business_category);
CREATE INDEX idx_templates_business_subcategory ON templates(business_subcategory);
CREATE INDEX idx_templates_created_by ON templates(created_by);

-- Table: global_notifications
CREATE TABLE global_notifications (
    notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    use_same_email BOOLEAN NOT NULL,
    notifications_email VARCHAR(255),
    notify_lead BOOLEAN NOT NULL,
    notify_service_chat BOOLEAN NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Index for global_notifications search field
CREATE INDEX idx_global_notifications_notifications_email ON global_notifications(notifications_email);

-- Table: mail_templates
CREATE TABLE mail_templates (
    mail_template_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    name VARCHAR(100) NOT NULL,
    use_case VARCHAR(100) NOT NULL,
    subject TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    created_by VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    modified_by VARCHAR(100) NOT NULL,
    modified_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Indexes for mail_templates search fields
CREATE INDEX idx_mail_templates_name ON mail_templates(name);
CREATE INDEX idx_mail_templates_use_case ON mail_templates(use_case);
CREATE INDEX idx_mail_templates_created_by ON mail_templates(created_by);
CREATE INDEX idx_mail_templates_modified_by ON mail_templates(modified_by);

-- Table: ip_addresses
CREATE TABLE ip_addresses (
    ip_address_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    ip_address VARCHAR(45) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT unique_ip_address UNIQUE (ip_address)
) ENGINE=InnoDB;

-- Index for ip_addresses search field
CREATE INDEX idx_ip_addresses_ip_address ON ip_addresses(ip_address);

-- Table: role_permissions
CREATE TABLE role_permissions (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    user_role VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT unique_user_role UNIQUE (user_role)
) ENGINE=InnoDB;

-- Index for role_permissions search field
CREATE INDEX idx_role_permissions_user_role ON role_permissions(user_role);


-- Creating table for Webhooks
CREATE TABLE webhooks (
    webhook_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event ENUM('CHAT_STARTS', 'SUPPORT_CHAT_STARTS', 'CHAT_CONVERTED_TO_LEAD', 'CHAT_ACTIVATES_VERIFY_WEBSITE') NOT NULL,
    target_url VARCHAR(255) NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Creating table for Webhook data types (ElementCollection)
CREATE TABLE webhook_data_types (
    webhook_id BIGINT NOT NULL,
    data_type VARCHAR(255) NOT NULL,
    FOREIGN KEY (webhook_id) REFERENCES webhooks(webhook_id)
);

-- Creating table for Smart Responses
CREATE TABLE smart_responses (
    smart_response_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    response TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Creating table for Smart Response shortcuts (ElementCollection)
CREATE TABLE smart_response_shortcuts (
    smart_response_id BIGINT NOT NULL,
    shortcut VARCHAR(255) NOT NULL,
    FOREIGN KEY (smart_response_id) REFERENCES smart_responses(smart_response_id)
);

-- Creating table for Smart Response websites (ElementCollection)
CREATE TABLE smart_response_websites (
    smart_response_id BIGINT NOT NULL,
    website VARCHAR(255) NOT NULL,
    FOREIGN KEY (smart_response_id) REFERENCES smart_responses(smart_response_id)
);

-- Creating table for Knowledge Base
CREATE TABLE knowledge_base (
    knowledge_base_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_title TEXT NOT NULL,
    answer_information TEXT NOT NULL,
    keywords TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Creating table for Knowledge Base websites (ElementCollection)
CREATE TABLE knowledge_base_websites (
    knowledge_base_id BIGINT NOT NULL,
    website VARCHAR(255) NOT NULL,
    FOREIGN KEY (knowledge_base_id) REFERENCES knowledge_base(knowledge_base_id)
);