// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const themeToggle = document.querySelector('.theme-toggle');
const styleButtons = document.querySelectorAll('.style-btn');
const root = document.documentElement;

// Sample Data for Portfolio
const portfolioData = {
    name: "Bereket Tesfaye",
    role: "Senior Full-Stack Developer",
    tagline: "Building scalable web applications with modern technologies",
    about: "I'm a senior full-stack developer with 8+ years of experience specializing in JavaScript, React, Node.js, and cloud technologies. I've led development teams and delivered enterprise-grade solutions for Fortune 500 companies. Passionate about clean code, architecture design, and mentoring junior developers.",
    skills: {
        frontend: ["React", "Vue.js", "TypeScript", "Next.js", "Tailwind CSS", "Sass"],
        backend: ["Node.js", "Python/Django", "Java/Spring", "PostgreSQL", "MongoDB", "Redis"],
        devops: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Nginx"],
        tools: ["Git", "Webpack", "Jest", "Cypress", "Figma", "Jira"]
    },
    // Update the projects array in your portfolio script.js
projects: [
    {
        title: "Advanced Task Manager",
        description: "A full-featured Kanban board with drag & drop, local storage, filtering, and task management capabilities. Built with modern JavaScript and CSS Grid.",
        tech: ["JavaScript", "CSS Grid", "Local Storage", "Drag & Drop API"],
        image: "taskmanager.png",
        liveLink: "projects/task-manager/index.html",
        codeLink: "https://github.com/yourusername/task-manager"
    },
    {
        title: "Financial Expense Tracker",
        description: "Comprehensive financial dashboard with expense tracking, budgeting, charts, and data visualization. Features real-time calculations and data persistence.",
        tech: ["Chart.js", "JavaScript", "CSS Flexbox", "Local Storage"],
        image: "expenset.png",
        liveLink: "projects/expense-tracker/index.html",
        codeLink: "https://github.com/yourusername/expense-tracker"
    },
    {
        title: "Weather Dashboard Pro",
        description: "Real-time weather application with forecasting, charts, and multiple data visualization methods. Demonstrates API integration and complex UI components.",
        tech: ["Chart.js", "Weather API", "JavaScript", "Responsive Design"],
        image: "weather.png",
        liveLink: "projects/weather-dashboard/index.html",
        codeLink: "https://github.com/yourusername/weather-dashboard"
    }
],
    experience: [
        {
            title: "Lead Full-Stack Developer",
            company: "Tech Innovations Inc.",
            period: "2020 - Present",
            description: "Lead a team of 8 developers in building enterprise SaaS solutions. Improved system performance by 40% through code optimization and infrastructure improvements."
        },
        {
            title: "Senior Backend Developer",
            company: "Global Solutions Corp.",
            period: "2018 - 2020",
            description: "Developed scalable microservices architecture handling 10M+ requests daily. Implemented CI/CD pipelines reducing deployment time by 70%."
        },
        {
            title: "Full-Stack Developer",
            company: "Web Dynamics LLC",
            period: "2016 - 2018",
            description: "Built full-stack web applications using React and Node.js. Collaborated with cross-functional teams to deliver client projects."
        }
    ],
    education: [
        {
            degree: "Master of Science in Computer Science",
            institution: "Stanford University",
            period: "2014 - 2016",
            gpa: "3.8/4.0"
        },
        {
            degree: "Bachelor of Engineering in Software Engineering",
            institution: "MIT",
            period: "2010 - 2014",
            gpa: "3.9/4.0"
        }
    ],
    certifications: [
        {
            name: "AWS Certified Solutions Architect - Professional",
            issuer: "Amazon Web Services",
            date: "2022"
        },
        {
            name: "Google Professional Cloud Architect",
            issuer: "Google Cloud",
            date: "2021"
        },
        {
            name: "Certified Kubernetes Administrator",
            issuer: "Cloud Native Computing Foundation",
            date: "2020"
        }
    ],
    tools: [
        { name: "VS Code", icon: "fas fa-code" },
        { name: "Git & GitHub", icon: "fab fa-github" },
        { name: "Docker", icon: "fab fa-docker" },
        { name: "AWS", icon: "fab fa-aws" },
        { name: "Figma", icon: "fab fa-figma" },
        { name: "Postman", icon: "fas fa-cloud" }
    ],
    github: {
        username: "alexchen",
        repos: 42,
        contributions: 1287,
        followers: 156
    },
    testimonials: [
        {
            text: "Alex's architectural decisions improved our system's scalability by 200%. He's an exceptional senior developer who mentors junior team members effectively.",
            author: "Sarah Johnson",
            role: "CTO, Tech Innovations Inc.",
            image: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        {
            text: "Working with Alex was transformative for our development team. His expertise in cloud infrastructure saved us 40% in hosting costs.",
            author: "Michael Rodriguez",
            role: "Engineering Director, Global Solutions",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        }
    ],
    contact: {
        email: "alex@example.com",
        linkedin: "linkedin.com/in/alexchen",
        github: "github.com/alexchen",
        phone: "+1 (555) 123-4567"
    }
};

// Initialize Portfolio
function initPortfolio() {
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderExperience();
    renderEducation();
    renderCertifications();
    renderTools();
    renderGitHub();
    renderTestimonials();
    renderContact();
    renderFooter();
    
    // Set default theme
    applyStyle('minimal');
}

// Render Hero Section
function renderHero() {
    const heroSection = document.querySelector('#home');
    heroSection.innerHTML = `
        <div class="container">
            <div class="hero-container">
                <div class="hero-content">
                    <h1>${portfolioData.name}</h1>
                    <h2>${portfolioData.role}</h2>
                    <p>${portfolioData.tagline}</p>
                    <div class="hero-buttons">
                        <a href="#projects" class="btn">View My Work</a>
                        <a href="#contact" class="btn btn-secondary">Get In Touch</a>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="image.jpg" alt="${portfolioData.name}" class="profile-img">
                </div>
            </div>
        </div>
    `;
}

// Render About Section
function renderAbout() {
    const aboutSection = document.querySelector('#about');
    aboutSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <p class="section-subtitle">A brief introduction about my professional journey and expertise</p>
            <div class="about-content">
                <div class="about-text">
                    <p>${portfolioData.about}</p>
                    <p>I specialize in designing and implementing scalable architecture, optimizing performance, and leading development teams to deliver high-quality software solutions. My approach combines technical excellence with strong communication and collaboration skills.</p>
                    <p>When I'm not coding, I contribute to open-source projects, write technical blog posts, and speak at developer conferences about modern web technologies and best practices.</p>
                </div>
                <div class="about-stats">
                    <div class="stat">
                        <h3>8+</h3>
                        <p>Years Experience</p>
                    </div>
                    <div class="stat">
                        <h3>50+</h3>
                        <p>Projects Completed</p>
                    </div>
                    <div class="stat">
                        <h3>12+</h3>
                        <p>Technologies Mastered</p>
                    </div>
                    <div class="stat">
                        <h3>5</h3>
                        <p>Industry Certifications</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Render Skills Section
function renderSkills() {
    const skillsSection = document.querySelector('#skills');
    let skillsHTML = `
        <div class="container">
            <h2 class="section-title">Skills & Expertise</h2>
            <p class="section-subtitle">Technical skills accumulated over years of professional experience</p>
            <div class="skills-container">
    `;
    
    for (const category in portfolioData.skills) {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        skillsHTML += `
            <div class="skill-category">
                <h3>${categoryName}</h3>
                <div class="skill-items">
                    ${portfolioData.skills[category].map(skill => `<span class="skill-item">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    skillsHTML += `</div></div>`;
    skillsSection.innerHTML = skillsHTML;
}

// Render Projects Section
function renderProjects() {
    const projectsSection = document.querySelector('#projects');
    let projectsHTML = `
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <p class="section-subtitle">A selection of my most significant and challenging projects</p>
            <div class="projects-grid">
    `;
    
    portfolioData.projects.forEach(project => {
        projectsHTML += `
            <div class="project-card">
                <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tech">
                        ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        <a href="${project.liveLink}" class="btn" target="_blank">Live Demo</a>
                        <a href="${project.codeLink}" class="btn btn-secondary" target="_blank">View Code</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    projectsHTML += `</div></div>`;
    projectsSection.innerHTML = projectsHTML;
}

// Render Experience Section
function renderExperience() {
    const experienceSection = document.querySelector('#experience');
    let experienceHTML = `
        <div class="container">
            <h2 class="section-title">Professional Experience</h2>
            <p class="section-subtitle">My career journey and key accomplishments</p>
            <div class="timeline">
    `;
    
    portfolioData.experience.forEach(exp => {
        experienceHTML += `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-date">${exp.period}</div>
                    <h3>${exp.title}</h3>
                    <h4>${exp.company}</h4>
                    <p>${exp.description}</p>
                </div>
            </div>
        `;
    });
    
    experienceHTML += `</div></div>`;
    experienceSection.innerHTML = experienceHTML;
}

// Render Education Section
function renderEducation() {
    const educationSection = document.querySelector('#education');
    let educationHTML = `
        <div class="container">
            <h2 class="section-title">Education</h2>
            <p class="section-subtitle">My academic background and qualifications</p>
            <div class="education-container">
    `;
    
    portfolioData.education.forEach(edu => {
        educationHTML += `
            <div class="education-card">
                <h3>${edu.degree}</h3>
                <h4>${edu.institution}</h4>
                <div class="education-period">${edu.period}</div>
                <div class="education-gpa">GPA: ${edu.gpa}</div>
            </div>
        `;
    });
    
    educationHTML += `</div></div>`;
    educationSection.innerHTML = educationHTML;
}

// Render Certifications Section
function renderCertifications() {
    const certificationsSection = document.querySelector('#certifications');
    let certsHTML = `
        <div class="container">
            <h2 class="section-title">Certifications & Achievements</h2>
            <p class="section-subtitle">Professional certifications and recognitions</p>
            <div class="certs-container">
    `;
    
    portfolioData.certifications.forEach(cert => {
        certsHTML += `
            <div class="cert-card">
                <h3>${cert.name}</h3>
                <h4>${cert.issuer}</h4>
                <div class="cert-date">Issued: ${cert.date}</div>
            </div>
        `;
    });
    
    certsHTML += `
            <div class="cert-card">
                <h3>Tech Excellence Award</h3>
                <h4>Tech Innovations Inc.</h4>
                <div class="cert-date">Awarded: 2021</div>
                <p>Recognized for outstanding contributions to system architecture and team leadership.</p>
            </div>
        </div>
    </div>
    `;
    
    certificationsSection.innerHTML = certsHTML;
}

// Render Tools Section
function renderTools() {
    const toolsSection = document.querySelector('#tools');
    let toolsHTML = `
        <div class="container">
            <h2 class="section-title">Tools & Technologies</h2>
            <p class="section-subtitle">Development tools and platforms I work with daily</p>
            <div class="tools-container">
    `;
    
    portfolioData.tools.forEach(tool => {
        toolsHTML += `
            <div class="tool-item">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <div class="tool-name">${tool.name}</div>
            </div>
        `;
    });
    
    toolsHTML += `</div></div>`;
    toolsSection.innerHTML = toolsHTML;
}

// Render GitHub Section
function renderGitHub() {
    const githubSection = document.querySelector('#github');
    githubSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">GitHub & Open Source</h2>
            <p class="section-subtitle">My contributions to the developer community</p>
            <div class="github-stats">
                <div class="stat-card">
                    <div class="stat-number">${portfolioData.github.repos}</div>
                    <div class="stat-label">Public Repositories</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${portfolioData.github.contributions}</div>
                    <div class="stat-label">Yearly Contributions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${portfolioData.github.followers}</div>
                    <div class="stat-label">GitHub Followers</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">15</div>
                    <div class="stat-label">Open Source Projects</div>
                </div>
            </div>
            <div class="github-profile">
                <a href="https://github.com/${portfolioData.github.username}" class="btn" target="_blank">
                    <i class="fab fa-github"></i> View My GitHub Profile
                </a>
            </div>
        </div>
    `;
}

// Render Testimonials Section
function renderTestimonials() {
    const testimonialsSection = document.querySelector('#testimonials');
    let testimonialsHTML = `
        <div class="container">
            <h2 class="section-title">Testimonials</h2>
            <p class="section-subtitle">What colleagues and clients say about my work</p>
            <div class="testimonials-container">
    `;
    
    portfolioData.testimonials.forEach(testimonial => {
        testimonialsHTML += `
            <div class="testimonial-card">
                <div class="testimonial-text">"${testimonial.text}"</div>
                <div class="testimonial-author">
                    <img src="${testimonial.image}" alt="${testimonial.author}" class="author-img">
                    <div class="author-info">
                        <div class="author-name">${testimonial.author}</div>
                        <div class="author-role">${testimonial.role}</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    testimonialsHTML += `</div></div>`;
    testimonialsSection.innerHTML = testimonialsHTML;
}

// Render Contact Section
function renderContact() {
    const contactSection = document.querySelector('#contact');
    contactSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <p class="section-subtitle">Feel free to reach out for collaborations or just a friendly hello</p>
            <div class="contact-container">
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Email</h3>
                            <p>${portfolioData.contact.email}</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Phone</h3>
                            <p>${portfolioData.contact.phone}</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fab fa-linkedin"></i>
                        </div>
                        <div class="contact-details">
                            <h3>LinkedIn</h3>
                            <p>${portfolioData.contact.linkedin}</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fab fa-github"></i>
                        </div>
                        <div class="contact-details">
                            <h3>GitHub</h3>
                            <p>${portfolioData.contact.github}</p>
                        </div>
                    </div>
                </div>
                <form class="contact-form" id="contactForm">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input type="text" id="subject" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div>
        </div>
    `;
    
    // Add form submission handler
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        this.reset();
    });
}

// Render Footer
function renderFooter() {
    const footer = document.querySelector('.footer');
    const currentYear = new Date().getFullYear();
    
    footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <a href="#home" class="nav-logo">BT</a>
                <div class="social-links">
                    <a href="${portfolioData.contact.github}" class="social-link" target="_blank">
                        <i class="fab fa-github"></i>
                    </a>
                    <a href="${portfolioData.contact.linkedin}" class="social-link" target="_blank">
                        <i class="fab fa-linkedin"></i>
                    </a>
                    <a href="https://twitter.com" class="social-link" target="_blank">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="https://dev.to" class="social-link" target="_blank">
                        <i class="fab fa-dev"></i>
                    </a>
                </div>
                <div class="copyright">
                    &copy; ${currentYear} ${portfolioData.name}. All rights reserved.
                </div>
            </div>
        </div>
    `;
}

// Apply Style Theme
function applyStyle(styleName) {
    // Remove existing style classes
    document.body.classList.remove('minimal-style', 'creative-style', 'corporate-style', 'dark-mode');
    
    // Reset to default CSS variables
    root.style.setProperty('--primary-color', '#2563eb');
    root.style.setProperty('--secondary-color', '#7c3aed');
    root.style.setProperty('--text-color', '#1f2937');
    root.style.setProperty('--text-light', '#6b7280');
    root.style.setProperty('--bg-color', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f9fafb');
    root.style.setProperty('--card-bg', '#ffffff');
    root.style.setProperty('--border-color', '#e5e7eb');
    root.style.setProperty('--shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)');
    
    // Apply selected style
    if (styleName === 'minimal') {
        // Already set as default
        document.body.classList.add('minimal-style');
    } else if (styleName === 'creative') {
        root.style.setProperty('--primary-color', '#8b5cf6');
        root.style.setProperty('--secondary-color', '#ec4899');
        root.style.setProperty('--bg-color', '#faf5ff');
        root.style.setProperty('--bg-secondary', '#f3e8ff');
        root.style.setProperty('--card-bg', '#ffffff');
        document.body.classList.add('creative-style');
    } else if (styleName === 'corporate') {
        root.style.setProperty('--primary-color', '#059669');
        root.style.setProperty('--secondary-color', '#0e7490');
        root.style.setProperty('--text-color', '#111827');
        root.style.setProperty('--bg-color', '#f9fafb');
        root.style.setProperty('--bg-secondary', '#f3f4f6');
        root.style.setProperty('--card-bg', '#ffffff');
        root.style.setProperty('--shadow', '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)');
        document.body.classList.add('corporate-style');
    }
    
    // Save preference
    localStorage.setItem('portfolioStyle', styleName);
    
    // Update active button
    styleButtons.forEach(btn => {
        if (btn.dataset.style === styleName) {
            btn.style.backgroundColor = 'var(--primary-color)';
            btn.style.color = 'white';
        } else {
            btn.style.backgroundColor = 'var(--bg-secondary)';
            btn.style.color = 'var(--text-color)';
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio
    initPortfolio();
    
    // Mobile menu toggle
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Dark/light mode toggle
    themeToggle?.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
    
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
    
    // Style switcher buttons
    styleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const style = this.dataset.style;
            applyStyle(style);
        });
    });
    
    // Check for saved style preference
    const savedStyle = localStorage.getItem('portfolioStyle') || 'minimal';
    applyStyle(savedStyle);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = 'var(--shadow)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
});