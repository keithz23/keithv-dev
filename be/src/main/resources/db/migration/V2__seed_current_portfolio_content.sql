INSERT INTO portfolio_profiles (
    id, profile_key, name, role, email, location, availability_text, hero_kicker,
    hero_headline, hero_intro, current_role_label, current_role_name,
    current_company_period, core_stack_label, core_stack, about_section_index,
    about_title, about_lead, about_summary, about_body, experience_section_label,
    education_section_label, contact_section_index, contact_headline,
    contact_intro, contact_email_label, contact_location_label,
    contact_form_button_label, contact_privacy_note, footer_text,
    footer_built_with, logo_path, logo_alt
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'main',
    'Keith Vuong',
    'Full-stack developer',
    'vuong.tuankiet07979@gmail.com',
    'Ho Chi Minh City, Vietnam',
    'Available for selected opportunities',
    'Full-stack developer / 2026',
    'Product-minded engineering, from interface to infrastructure.',
    'I''m Keith Vuong. I build secure APIs, responsive interfaces, and cloud-ready systems for products that need to work clearly and reliably—not just look finished.',
    'Current role',
    'Full-stack Developer',
    'Sea Dragon Technology · Apr 2024—Now',
    'Core stack',
    'Next.js / NestJS / PostgreSQL / Redis / AWS',
    '01 / About',
    'I work across the seams.',
    'Between product and engineering. Between the interface users touch and the infrastructure they never need to think about.',
    'I turn business requirements into software that stays understandable as the product grows.',
    'My work covers responsive interfaces, production APIs, authentication, databases, caching, and cloud delivery. I value straightforward decisions, explicit trade-offs, and systems the next developer can reason about.',
    'Experience',
    'Education',
    '03 / Contact',
    'Bring the problem. We''ll find the useful next step.',
    'Share what you''re building, what feels stuck, or what success should look like. I''ll reply with a concrete next step.',
    'Email',
    'Location',
    'Send message',
    'Your message is sent to the portfolio API and stored for follow-up.',
    '© 2026 Keith Vuong · Ho Chi Minh City',
    'Built with Next.js',
    '/logo.png',
    'Keith Vuong logo'
);

INSERT INTO navigation_links (id, label, target_id, display_order) VALUES
    ('00000000-0000-0000-0000-000000000101', 'About', 'about', 1),
    ('00000000-0000-0000-0000-000000000102', 'Work', 'projects', 2),
    ('00000000-0000-0000-0000-000000000103', 'Contact', 'contact', 3);

INSERT INTO social_links (id, label, url, display_order) VALUES
    ('00000000-0000-0000-0000-000000000201', 'GitHub', 'https://github.com/keithz23', 1),
    ('00000000-0000-0000-0000-000000000202', 'LinkedIn', 'https://www.linkedin.com/in/keithivers/', 2);

INSERT INTO hero_principles (id, text, display_order) VALUES
    ('00000000-0000-0000-0000-000000000301', 'Secure by default', 1),
    ('00000000-0000-0000-0000-000000000302', 'Fast under load', 2),
    ('00000000-0000-0000-0000-000000000303', 'Clear to maintain', 3);

INSERT INTO capabilities (id, item_index, title, detail, display_order) VALUES
    ('00000000-0000-0000-0000-000000000401', '01', 'Interface engineering', 'Next.js, React, TypeScript, responsive systems, SSR, and API integration.', 1),
    ('00000000-0000-0000-0000-000000000402', '02', 'Backend architecture', 'NestJS, Node.js, REST, WebSocket, API versioning, JWT, OAuth, and RBAC.', 2),
    ('00000000-0000-0000-0000-000000000403', '03', 'Data & performance', 'PostgreSQL, MySQL, MongoDB, Redis, indexing, pagination, and query tuning.', 3),
    ('00000000-0000-0000-0000-000000000404', '04', 'Cloud delivery', 'AWS, Docker, CI/CD, GitHub Actions, production logs, and operational debugging.', 4);

INSERT INTO work_experiences (
    id, role, company, location, period, detail_link_label, detail_link_url, display_order
) VALUES (
    '00000000-0000-0000-0000-000000000501',
    'Full-stack Developer',
    'Sea Dragon Technology',
    'Ho Chi Minh City',
    'Apr 2024—Present',
    'Request more detail',
    'mailto:vuong.tuankiet07979@gmail.com',
    1
);

INSERT INTO work_experience_highlights (id, experience_id, text, display_order) VALUES
    ('00000000-0000-0000-0000-000000000511', '00000000-0000-0000-0000-000000000501', 'Build and maintain REST APIs for CRM systems with NestJS, TypeScript, MySQL, and MongoDB.', 1),
    ('00000000-0000-0000-0000-000000000512', '00000000-0000-0000-0000-000000000501', 'Design authentication and authorization flows with JWT, OAuth, RBAC, and API versioning.', 2),
    ('00000000-0000-0000-0000-000000000513', '00000000-0000-0000-0000-000000000501', 'Improve high-traffic modules using Redis caching, query tuning, pagination, and indexing.', 3),
    ('00000000-0000-0000-0000-000000000514', '00000000-0000-0000-0000-000000000501', 'Trace production issues through logs and metrics, identify root causes, and coordinate fixes.', 4),
    ('00000000-0000-0000-0000-000000000515', '00000000-0000-0000-0000-000000000501', 'Contribute to Docker-based deployments and CI/CD pipelines on AWS.', 5);

INSERT INTO educations (id, degree, institution, focus, display_order) VALUES
    ('00000000-0000-0000-0000-000000000601', 'Bachelor of Information Technology', 'Ho Chi Minh City University of Technology and Education', 'Software Engineering', 1);

INSERT INTO projects (
    id, number, title, label, description, github_url, visual_key, icon_key, is_featured, display_order
) VALUES
    ('00000000-0000-0000-0000-000000000701', '01', 'Bluesky Social', 'Full-stack social platform', 'A complete social experience with personalized feeds, profiles, posts, follows, real-time chat, notifications, and moderation tools.', 'https://github.com/keithz23/Bluesky-Social', 'bluesky', 'chat', TRUE, 1),
    ('00000000-0000-0000-0000-000000000702', '02', 'EcomGrove', 'E-commerce platform', 'A commerce product connecting a customer storefront, an administration portal, and a consistent typed data flow from interface to API.', 'https://github.com/keithz23/EcomGrove', 'commerce', 'shopping', TRUE, 2),
    ('00000000-0000-0000-0000-000000000703', '03', 'Dictiohub', 'Dictionary application', 'A focused dictionary application with a cached lookup API and an automated cloud delivery workflow.', NULL, NULL, 'book', FALSE, 3),
    ('00000000-0000-0000-0000-000000000704', '04', 'Jiramisu', 'Project management', 'A Jira-inspired workspace for planning sprints, managing backlogs, and moving work through role-aware task boards.', NULL, NULL, 'kanban', FALSE, 4),
    ('00000000-0000-0000-0000-000000000705', '05', 'InventorySys', 'Operations system', 'An inventory system for retail and wholesale teams to track stock movement and keep day-to-day operations visible.', NULL, NULL, 'warehouse', FALSE, 5);

INSERT INTO project_highlights (id, project_id, text, display_order) VALUES
    ('00000000-0000-0000-0000-000000000801', '00000000-0000-0000-0000-000000000701', 'Redis-backed fan-out feeds and rate limiting', 1),
    ('00000000-0000-0000-0000-000000000802', '00000000-0000-0000-0000-000000000701', 'Socket.IO chat and real-time notifications', 2),
    ('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000701', 'AWS Rekognition-powered image analysis and moderation workflow', 3),
    ('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000701', 'JWT, OTP, RBAC, and audit logging', 4),
    ('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000701', 'ECS Fargate, ALB, RDS, ElastiCache, and S3', 5),
    ('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000702', 'Stripe and SePay payment gateways with webhook-based confirmation and state machine-driven order status updates', 1),
    ('00000000-0000-0000-0000-000000000807', '00000000-0000-0000-0000-000000000702', 'JWT and RBAC authorization', 2),
    ('00000000-0000-0000-0000-000000000808', '00000000-0000-0000-0000-000000000702', 'Redis caching for backend workloads', 3),
    ('00000000-0000-0000-0000-000000000809', '00000000-0000-0000-0000-000000000702', 'Next.js SSR for product pages', 4),
    ('00000000-0000-0000-0000-000000000810', '00000000-0000-0000-0000-000000000703', 'Redis-cached lookup API', 1),
    ('00000000-0000-0000-0000-000000000811', '00000000-0000-0000-0000-000000000703', 'AWS EC2 and RDS deployment', 2),
    ('00000000-0000-0000-0000-000000000812', '00000000-0000-0000-0000-000000000703', 'CI/CD with GitHub Actions', 3),
    ('00000000-0000-0000-0000-000000000813', '00000000-0000-0000-0000-000000000704', 'Sprint and backlog management', 1),
    ('00000000-0000-0000-0000-000000000814', '00000000-0000-0000-0000-000000000704', 'Drag-and-drop task boards', 2),
    ('00000000-0000-0000-0000-000000000815', '00000000-0000-0000-0000-000000000704', 'Role-based access control', 3),
    ('00000000-0000-0000-0000-000000000816', '00000000-0000-0000-0000-000000000705', 'Inventory and stock tracking', 1),
    ('00000000-0000-0000-0000-000000000817', '00000000-0000-0000-0000-000000000705', 'Retail and wholesale workflows', 2),
    ('00000000-0000-0000-0000-000000000818', '00000000-0000-0000-0000-000000000705', 'Operational reporting', 3);

INSERT INTO project_technologies (id, project_id, name, display_order) VALUES
    ('00000000-0000-0000-0000-000000000901', '00000000-0000-0000-0000-000000000701', 'Next.js', 1),
    ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000701', 'NestJS', 2),
    ('00000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000701', 'Prisma', 3),
    ('00000000-0000-0000-0000-000000000904', '00000000-0000-0000-0000-000000000701', 'PostgreSQL', 4),
    ('00000000-0000-0000-0000-000000000905', '00000000-0000-0000-0000-000000000701', 'Redis', 5),
    ('00000000-0000-0000-0000-000000000906', '00000000-0000-0000-0000-000000000701', 'AWS Rekognition', 6),
    ('00000000-0000-0000-0000-000000000907', '00000000-0000-0000-0000-000000000702', 'Next.js', 1),
    ('00000000-0000-0000-0000-000000000908', '00000000-0000-0000-0000-000000000702', 'TypeScript', 2),
    ('00000000-0000-0000-0000-000000000909', '00000000-0000-0000-0000-000000000702', 'NestJS', 3),
    ('00000000-0000-0000-0000-000000000910', '00000000-0000-0000-0000-000000000702', 'Stripe', 4),
    ('00000000-0000-0000-0000-000000000911', '00000000-0000-0000-0000-000000000702', 'SePay', 5),
    ('00000000-0000-0000-0000-000000000912', '00000000-0000-0000-0000-000000000702', 'Redis', 6),
    ('00000000-0000-0000-0000-000000000913', '00000000-0000-0000-0000-000000000703', 'Node.js', 1),
    ('00000000-0000-0000-0000-000000000914', '00000000-0000-0000-0000-000000000703', 'Redis', 2),
    ('00000000-0000-0000-0000-000000000915', '00000000-0000-0000-0000-000000000703', 'AWS EC2', 3),
    ('00000000-0000-0000-0000-000000000916', '00000000-0000-0000-0000-000000000703', 'AWS RDS', 4),
    ('00000000-0000-0000-0000-000000000917', '00000000-0000-0000-0000-000000000704', 'Next.js', 1),
    ('00000000-0000-0000-0000-000000000918', '00000000-0000-0000-0000-000000000704', 'NestJS', 2),
    ('00000000-0000-0000-0000-000000000919', '00000000-0000-0000-0000-000000000704', 'PostgreSQL', 3),
    ('00000000-0000-0000-0000-000000000920', '00000000-0000-0000-0000-000000000704', 'Prisma', 4),
    ('00000000-0000-0000-0000-000000000921', '00000000-0000-0000-0000-000000000705', 'Java', 1),
    ('00000000-0000-0000-0000-000000000922', '00000000-0000-0000-0000-000000000705', 'Spring MVC', 2),
    ('00000000-0000-0000-0000-000000000923', '00000000-0000-0000-0000-000000000705', 'SQL Server', 3),
    ('00000000-0000-0000-0000-000000000924', '00000000-0000-0000-0000-000000000705', 'JavaScript', 4);
