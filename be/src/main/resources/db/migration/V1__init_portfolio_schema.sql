CREATE TABLE portfolio_profiles (
    id UUID PRIMARY KEY,
    profile_key VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(160) NOT NULL,
    email VARCHAR(254) NOT NULL,
    location VARCHAR(160) NOT NULL,
    availability_text VARCHAR(220) NOT NULL,
    hero_kicker VARCHAR(160) NOT NULL,
    hero_headline VARCHAR(300) NOT NULL,
    hero_intro TEXT NOT NULL,
    current_role_label VARCHAR(80) NOT NULL,
    current_role_name VARCHAR(160) NOT NULL,
    current_company_period VARCHAR(220) NOT NULL,
    core_stack_label VARCHAR(80) NOT NULL,
    core_stack VARCHAR(220) NOT NULL,
    about_section_index VARCHAR(80) NOT NULL,
    about_title VARCHAR(220) NOT NULL,
    about_lead TEXT NOT NULL,
    about_summary TEXT NOT NULL,
    about_body TEXT NOT NULL,
    experience_section_label VARCHAR(80) NOT NULL,
    education_section_label VARCHAR(80) NOT NULL,
    contact_section_index VARCHAR(80) NOT NULL,
    contact_headline VARCHAR(260) NOT NULL,
    contact_intro TEXT NOT NULL,
    contact_email_label VARCHAR(80) NOT NULL,
    contact_location_label VARCHAR(80) NOT NULL,
    contact_form_button_label VARCHAR(120) NOT NULL,
    contact_privacy_note TEXT NOT NULL,
    footer_text VARCHAR(180) NOT NULL,
    footer_built_with VARCHAR(120) NOT NULL,
    logo_path VARCHAR(260) NOT NULL,
    logo_alt VARCHAR(160) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE navigation_links (
    id UUID PRIMARY KEY,
    label VARCHAR(80) NOT NULL,
    target_id VARCHAR(80) NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_navigation_links_target UNIQUE (target_id),
    CONSTRAINT uq_navigation_links_order UNIQUE (display_order)
);

CREATE TABLE social_links (
    id UUID PRIMARY KEY,
    label VARCHAR(80) NOT NULL,
    url VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_social_links_label UNIQUE (label),
    CONSTRAINT uq_social_links_order UNIQUE (display_order)
);

CREATE TABLE hero_principles (
    id UUID PRIMARY KEY,
    text VARCHAR(160) NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_hero_principles_order UNIQUE (display_order)
);

CREATE TABLE capabilities (
    id UUID PRIMARY KEY,
    item_index VARCHAR(10) NOT NULL,
    title VARCHAR(160) NOT NULL,
    detail TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_capabilities_index UNIQUE (item_index),
    CONSTRAINT uq_capabilities_order UNIQUE (display_order)
);

CREATE TABLE work_experiences (
    id UUID PRIMARY KEY,
    role VARCHAR(160) NOT NULL,
    company VARCHAR(180) NOT NULL,
    location VARCHAR(160) NOT NULL,
    period VARCHAR(120) NOT NULL,
    detail_link_label VARCHAR(120) NOT NULL,
    detail_link_url VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_work_experiences_order UNIQUE (display_order)
);

CREATE TABLE work_experience_highlights (
    id UUID PRIMARY KEY,
    experience_id UUID NOT NULL,
    text TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_experience_highlights_experience
        FOREIGN KEY (experience_id)
        REFERENCES work_experiences (id)
        ON DELETE CASCADE,
    CONSTRAINT uq_experience_highlights_order UNIQUE (experience_id, display_order)
);

CREATE TABLE educations (
    id UUID PRIMARY KEY,
    degree VARCHAR(180) NOT NULL,
    institution VARCHAR(220) NOT NULL,
    focus VARCHAR(160) NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_educations_order UNIQUE (display_order)
);

CREATE TABLE projects (
    id UUID PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    title VARCHAR(160) NOT NULL,
    label VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    github_url VARCHAR(500),
    visual_key VARCHAR(80),
    icon_key VARCHAR(80) NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_projects_number UNIQUE (number),
    CONSTRAINT uq_projects_title UNIQUE (title),
    CONSTRAINT uq_projects_order UNIQUE (display_order)
);

CREATE INDEX idx_projects_featured_order
    ON projects (is_featured, display_order);

CREATE TABLE project_highlights (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    text TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_project_highlights_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE,
    CONSTRAINT uq_project_highlights_order UNIQUE (project_id, display_order)
);

CREATE TABLE project_technologies (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    name VARCHAR(120) NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_project_technologies_project
        FOREIGN KEY (project_id)
        REFERENCES projects (id)
        ON DELETE CASCADE,
    CONSTRAINT uq_project_technologies_order UNIQUE (project_id, display_order)
);

CREATE TABLE contact_messages (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_contact_messages_status CHECK (status IN ('NEW', 'READ', 'ARCHIVED'))
);
