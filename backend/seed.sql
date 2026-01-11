-- Insert Admin User
INSERT INTO users (name, email, password, role, "employeeId", "isActive", "createdAt", "updatedAt") 
VALUES ('Admin User', 'admin@company.com', '$2a$10$c/6tlfuQgYXu2QbG6LXng.vmfPr7b7b7tCL1rIEj7cqB/mK.ybm.i', 'admin', 'EMP001', true, NOW(), NOW());

-- Insert Employee John Smith
INSERT INTO users (name, email, password, role, "employeeId", "isActive", "createdAt", "updatedAt") 
VALUES ('John Smith', 'john.smith@company.com', '$2a$10$c/6tlfuQgYXu2QbG6LXng.vmfPr7b7b7tCL1rIEj7cqB/mK.ybm.i', 'employee', 'EMP002', true, NOW(), NOW());
