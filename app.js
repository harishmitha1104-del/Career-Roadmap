/**
 * app.js
 * Career Path Roadmap Website - Interaction, routing, logic and AI engines.
 * PERSISTENCE: Saved to LocalStorage for persistent user state.
 */

// Initialize LocalStorage Data Store
function initDatabase() {
  if (!localStorage.getItem('harishmitha_user_db')) {
    localStorage.setItem('harishmitha_user_db', JSON.stringify(window.AppDB));
  }
}

function getDatabase() {
  return JSON.parse(localStorage.getItem('harishmitha_user_db'));
}

function saveDatabase(db) {
  localStorage.setItem('harishmitha_user_db', JSON.stringify(db));
}

// Current App State
let db = null;
let activeTab = 'home-section';

document.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  db = getDatabase();
  
  initTheme();
  initNavigation();
  initHome();
  initGenerator();
  initRoadmap();
  initDashboard();
  initAIStudio();
  
  // Render initial views
  renderCareersGrid();
  populateGeneratorOptions();
  renderActiveRoadmap();
  renderDashboardData();
});

/* ==========================================================================
   1. Theme & Navigation Handling
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeMoon = document.getElementById('theme-moon');
  const themeSun = document.getElementById('theme-sun');
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
  });

  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      themeMoon.style.display = 'none';
      themeSun.style.display = 'block';
    } else {
      themeMoon.style.display = 'block';
      themeSun.style.display = 'none';
    }
  }
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.app-section');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetId = link.getAttribute('data-target');
      
      // Update links active class
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      // Toggle sections
      sections.forEach(s => {
        if (s.id === targetId) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
      
      activeTab = targetId;
      
      // Refresh state depending on tab
      if (targetId === 'roadmap-section') {
        renderActiveRoadmap();
      } else if (targetId === 'dashboard-section') {
        renderDashboardData();
      } else if (targetId === 'ai-section') {
        refreshAIOptions();
      }
    });
  });
}

function switchTab(tabId) {
  const targetLink = document.querySelector(`.nav-link[data-target="${tabId}"]`);
  if (targetLink) {
    targetLink.click();
  }
}

/* ==========================================================================
   2. Home View Logic
   ========================================================================== */
function initHome() {
  const searchInput = document.getElementById('career-search');
  searchInput.addEventListener('input', (e) => {
    renderCareersGrid(e.target.value);
  });
}

function renderCareersGrid(query = '') {
  const container = document.getElementById('careers-container');
  container.innerHTML = '';
  
  const filteredPaths = db.careerPaths.filter(path => {
    const q = query.toLowerCase();
    return path.title.toLowerCase().includes(q) || 
           path.description.toLowerCase().includes(q) ||
           path.tools.some(t => t.toLowerCase().includes(q));
  });
  
  if (filteredPaths.length === 0) {
    container.innerHTML = `<div style="grid-column: span 3; text-align: center; color: var(--text-muted); padding: 2rem;">No matching career paths found. Try "Data" or "Developer".</div>`;
    return;
  }
  
  filteredPaths.forEach(path => {
    const card = document.createElement('article');
    card.className = 'career-card';
    card.innerHTML = `
      <div class="career-header">
        <span class="career-badge">Career Track</span>
        <h3 class="career-title">${path.title}</h3>
        <p class="career-desc">${path.description}</p>
      </div>
      <div>
        <div class="career-meta">
          <div class="meta-item">
            <span class="meta-label">Starting Salary</span>
            <span class="meta-value">${path.salary.entry}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Growth Rate</span>
            <span class="meta-value">${path.growth}</span>
          </div>
        </div>
        <div class="career-footer">
          <button class="btn-secondary" onclick="generateFromHome('${path.id}')">Generate Roadmap</button>
          <button class="btn-primary" onclick="viewRoadmapDirectly('${path.id}')">View Details</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function generateFromHome(pathId) {
  const select = document.getElementById('form-target-career');
  select.value = pathId;
  switchTab('generator-section');
}

function viewRoadmapDirectly(pathId) {
  db.userProgress.activeRoadmapId = pathId;
  saveDatabase(db);
  switchTab('roadmap-section');
}

/* ==========================================================================
   3. Roadmap Generator Form Logic
   ========================================================================== */
function initGenerator() {
  const form = document.getElementById('roadmap-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const targetCareer = document.getElementById('form-target-career').value;
    const education = document.getElementById('form-education').value;
    const studyHours = document.getElementById('form-study-hours').value;
    const timeline = document.getElementById('form-timeline').value;
    
    // Read checked skills
    const checkedSkills = [];
    const skillCheckboxes = document.querySelectorAll('#form-skills-checkboxes input:checked');
    skillCheckboxes.forEach(cb => {
      checkedSkills.push(cb.value);
    });
    
    // Update database user data
    db.users[0].education = education;
    db.users[0].currentSkills = checkedSkills;
    db.userProgress.activeRoadmapId = targetCareer;
    
    // Merge skills user already knows into userProgress completed list
    checkedSkills.forEach(sId => {
      if (!db.userProgress.completedSkillIds.includes(sId)) {
        db.userProgress.completedSkillIds.push(sId);
      }
    });

    // Add milestone goal automatically
    const targetPath = db.careerPaths.find(p => p.id === targetCareer);
    db.userProgress.goals.push({
      id: "goal_" + Date.now(),
      text: `Complete ${targetPath.title} roadmap inside ${timeline} months`,
      status: "pending",
      targetDate: new Date(Date.now() + (timeline * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    });
    
    saveDatabase(db);
    
    // Simulate generation with a beautiful alert
    const btn = document.getElementById('btn-submit-generator');
    btn.innerText = 'Creating Learning Nodes...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerText = 'Generate My Career Roadmap';
      btn.disabled = false;
      switchTab('roadmap-section');
    }, 1200);
  });
}

function populateGeneratorOptions() {
  // Desired Career Target options
  const careerSelect = document.getElementById('form-target-career');
  careerSelect.innerHTML = '';
  db.careerPaths.forEach(path => {
    const opt = document.createElement('option');
    opt.value = path.id;
    opt.innerText = path.title;
    careerSelect.appendChild(opt);
  });
  
  // Set default education level
  document.getElementById('form-education').value = db.users[0].education;
  
  // Skills checkboxes (Union of all unique skill IDs from all careers)
  const skillsContainer = document.getElementById('form-skills-checkboxes');
  skillsContainer.innerHTML = '';
  
  const allSkills = [];
  db.careerPaths.forEach(path => {
    Object.keys(path.stages).forEach(stageKey => {
      path.stages[stageKey].skills.forEach(skill => {
        if (!allSkills.some(s => s.id === skill.id)) {
          allSkills.push(skill);
        }
      });
    });
  });
  
  allSkills.forEach(skill => {
    const isChecked = db.users[0].currentSkills.includes(skill.id) || db.userProgress.completedSkillIds.includes(skill.id);
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" value="${skill.id}" ${isChecked ? 'checked' : ''}>
      <span>${skill.name}</span>
    `;
    skillsContainer.appendChild(label);
  });
}

/* ==========================================================================
   4. Interactive Roadmap Tree Visualization Logic
   ========================================================================== */
function initRoadmap() {
  // Handled dynamically on elements interaction
}

function renderActiveRoadmap() {
  const pathId = db.userProgress.activeRoadmapId || 'data_science';
  const path = db.careerPaths.find(p => p.id === pathId);
  if (!path) return;
  
  // Render Meta
  document.getElementById('active-roadmap-title').innerText = path.title + " Roadmap";
  document.getElementById('active-roadmap-desc').innerText = path.description;
  document.getElementById('active-roadmap-badge').innerText = `Target Track: ${path.title}`;
  
  // Render Tree Nodes
  const treeContainer = document.getElementById('active-roadmap-tree');
  treeContainer.innerHTML = '';
  
  const stages = ['beginner', 'intermediate', 'advanced', 'jobReady'];
  stages.forEach(stageKey => {
    const stage = path.stages[stageKey];
    if (!stage) return;
    
    // Check if stage is completed
    const totalSkills = stage.skills.length;
    const completedSkills = stage.skills.filter(s => db.userProgress.completedSkillIds.includes(s.id)).length;
    const isStageCompleted = totalSkills > 0 && completedSkills === totalSkills;
    const stagePct = totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;
    
    const node = document.createElement('div');
    node.className = `tree-node ${isStageCompleted ? 'completed' : (stageKey === 'beginner' || completedSkills > 0 ? 'active' : '')}`;
    
    // Inside node content
    let skillsHTML = '';
    stage.skills.forEach(skill => {
      const isSkillDone = db.userProgress.completedSkillIds.includes(skill.id);
      skillsHTML += `
        <div class="skill-item">
          <label class="skill-item-checkbox ${isSkillDone ? 'checked' : ''}">
            <input type="checkbox" data-skill-id="${skill.id}" ${isSkillDone ? 'checked' : ''} onchange="toggleSkill(this)">
            <span>${skill.name}</span>
          </label>
          <span style="font-size: 0.75rem; color: var(--text-muted);">${isSkillDone ? 'Mastered' : 'Pending'}</span>
        </div>
      `;
    });
    
    let projectsHTML = '';
    stage.projects.forEach(proj => {
      projectsHTML += `
        <div class="project-card">
          <div class="project-name">📂 ${proj.name}</div>
          <div class="project-desc">${proj.desc}</div>
        </div>
      `;
    });
    
    node.innerHTML = `
      <div class="node-card" id="stage-card-${stageKey}">
        <div class="node-header" onclick="toggleStageAccordion('${stageKey}')">
          <div class="node-title-group">
            <h3 class="node-title">${stage.title}</h3>
            <span class="node-badge">${stagePct}% Done</span>
            <span class="node-badge" style="background-color: var(--glow-color); color: var(--accent-purple);">${stage.completionTime}</span>
          </div>
          <div class="node-arrow">▼</div>
        </div>
        <div class="node-content">
          <div class="section-title-sm">Skills to Master</div>
          <div class="skill-list">${skillsHTML}</div>
          
          <div class="section-title-sm">Milestone Projects to Build</div>
          <div class="project-list">${projectsHTML}</div>
          
          <div class="section-title-sm">Recommended Stage Certification</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">🥇 ${stage.certifications.join(', ')}</p>
        </div>
      </div>
    `;
    treeContainer.appendChild(node);
  });
  
  // Expand first node by default
  const firstNode = treeContainer.querySelector('.node-card');
  if (firstNode) {
    firstNode.classList.add('expanded');
  }
  
  // Render Sidebar resources
  // Tools checklist
  const toolsContainer = document.getElementById('roadmap-tools-list');
  toolsContainer.innerHTML = '';
  path.tools.forEach(tool => {
    // Check if user has this tool (derived if they have basic skills or simulate)
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `
      <input type="checkbox" checked disabled>
      <span>${tool}</span>
    `;
    toolsContainer.appendChild(label);
  });
  
  // Certifications
  const certsContainer = document.getElementById('roadmap-certs-list');
  certsContainer.innerHTML = '';
  path.certifications.forEach(certName => {
    const li = document.createElement('li');
    li.className = 'sidebar-list-item';
    li.innerHTML = `🏆 <strong>${certName}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">Highly valued by recruiters</span>`;
    certsContainer.appendChild(li);
  });
  
  // Courses
  const coursesContainer = document.getElementById('roadmap-courses-list');
  coursesContainer.innerHTML = '';
  path.courses.forEach(course => {
    const li = document.createElement('li');
    li.className = 'sidebar-list-item';
    li.innerHTML = `
      <span class="course-provider">${course.provider}</span>
      <a href="#" onclick="alert('Redirecting to partner learning platform course details.')" style="font-weight: 500; hover: underline;">📖 ${course.title}</a>
    `;
    coursesContainer.appendChild(li);
  });
  
  updateGlobalProgressBar(path);
}

function toggleStageAccordion(stageKey) {
  const card = document.getElementById(`stage-card-${stageKey}`);
  if (card) {
    card.classList.toggle('expanded');
  }
}

function toggleSkill(checkbox) {
  const skillId = checkbox.getAttribute('data-skill-id');
  const isChecked = checkbox.checked;
  
  if (isChecked) {
    if (!db.userProgress.completedSkillIds.includes(skillId)) {
      db.userProgress.completedSkillIds.push(skillId);
    }
  } else {
    db.userProgress.completedSkillIds = db.userProgress.completedSkillIds.filter(id => id !== skillId);
  }
  
  saveDatabase(db);
  
  // Update checkbox label formatting
  const label = checkbox.closest('.skill-item-checkbox');
  if (label) {
    if (isChecked) {
      label.classList.add('checked');
    } else {
      label.classList.remove('checked');
    }
  }
  
  // Refresh Roadmap View percentages and main progress bar
  const pathId = db.userProgress.activeRoadmapId || 'data_science';
  const path = db.careerPaths.find(p => p.id === pathId);
  updateGlobalProgressBar(path);
  
  // Re-render other visual elements to reflect updated percentages without full page rebuild
  const stages = ['beginner', 'intermediate', 'advanced', 'jobReady'];
  stages.forEach(key => {
    const stage = path.stages[key];
    if (stage) {
      const total = stage.skills.length;
      const done = stage.skills.filter(s => db.userProgress.completedSkillIds.includes(s.id)).length;
      const card = document.getElementById(`stage-card-${key}`);
      if (card) {
        const badge = card.querySelector('.node-badge');
        if (badge) {
          badge.innerText = `${total > 0 ? Math.round((done / total) * 100) : 0}% Done`;
        }
        
        // Update tree-node styling
        const node = card.closest('.tree-node');
        if (node) {
          if (done === total) {
            node.className = 'tree-node completed';
          } else if (done > 0) {
            node.className = 'tree-node active';
          } else {
            node.className = 'tree-node';
          }
        }
      }
    }
  });
}

function updateGlobalProgressBar(path) {
  // Calculate total skills in active path
  let totalSkillsCount = 0;
  let completedSkillsCount = 0;
  
  Object.keys(path.stages).forEach(stageKey => {
    path.stages[stageKey].skills.forEach(skill => {
      totalSkillsCount++;
      if (db.userProgress.completedSkillIds.includes(skill.id)) {
        completedSkillsCount++;
      }
    });
  });
  
  const percent = totalSkillsCount > 0 ? Math.round((completedSkillsCount / totalSkillsCount) * 100) : 0;
  
  // Update DOM elements
  document.getElementById('active-roadmap-pct').innerText = `${percent}%`;
  document.getElementById('active-roadmap-progress-bar').style.width = `${percent}%`;
  
  // Sync to dashboard
  document.getElementById('dash-completed-skills').innerText = db.userProgress.completedSkillIds.length;
}

/* ==========================================================================
   5. Dashboard View Logic
   ========================================================================== */
function initDashboard() {
  const addGoalBtn = document.getElementById('btn-add-goal');
  addGoalBtn.addEventListener('click', () => {
    const input = document.getElementById('new-goal-text');
    const text = input.value.trim();
    if (!text) return;
    
    const newGoal = {
      id: "goal_" + Date.now(),
      text: text,
      status: "pending",
      targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // default 2 weeks target
    };
    
    db.userProgress.goals.push(newGoal);
    saveDatabase(db);
    input.value = '';
    renderDashboardGoals();
    updateDashboardStats();
  });
}

function renderDashboardData() {
  updateDashboardStats();
  renderDashboardGoals();
  renderDashboardBadges();
}

function updateDashboardStats() {
  document.getElementById('dash-completed-skills').innerText = db.userProgress.completedSkillIds.length;
  document.getElementById('dash-achievements-count').innerText = db.userProgress.achievements.length;
  
  const pendingGoals = db.userProgress.goals.filter(g => g.status === 'pending').length;
  document.getElementById('dash-pending-goals').innerText = pendingGoals;
  
  document.getElementById('dash-saved-roadmaps').innerText = 1 + db.roadmaps.length;
}

function renderDashboardGoals() {
  const container = document.getElementById('dashboard-goals-container');
  container.innerHTML = '';
  
  db.userProgress.goals.forEach(goal => {
    const isCompleted = goal.status === 'completed';
    const item = document.createElement('div');
    item.className = `goal-item ${isCompleted ? 'completed' : ''}`;
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:0.75rem;">
        <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleGoalStatus('${goal.id}', this)" style="width:18px; height:18px; accent-color:var(--accent-purple); cursor:pointer;">
        <span>${goal.text}</span>
      </div>
      <div class="goal-actions">
        <span style="font-size:0.75rem; color:var(--text-muted); margin-right: 0.5rem;">Target: ${goal.targetDate}</span>
        <button onclick="deleteGoal('${goal.id}')" style="background:none; border:none; color:var(--danger); cursor:pointer; font-weight:600;">✕</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function toggleGoalStatus(goalId, checkbox) {
  const goal = db.userProgress.goals.find(g => g.id === goalId);
  if (goal) {
    goal.status = checkbox.checked ? 'completed' : 'pending';
    saveDatabase(db);
    renderDashboardGoals();
    updateDashboardStats();
  }
}

function deleteGoal(goalId) {
  db.userProgress.goals = db.userProgress.goals.filter(g => g.id !== goalId);
  saveDatabase(db);
  renderDashboardGoals();
  updateDashboardStats();
}

function renderDashboardBadges() {
  const container = document.getElementById('dashboard-badges-container');
  container.innerHTML = '';
  
  db.userProgress.achievements.forEach(ach => {
    const card = document.createElement('div');
    card.className = 'achievement-badge';
    card.innerHTML = `
      <span class="badge-icon">${ach.icon}</span>
      <span class="badge-title">${ach.name}</span>
      <p class="badge-desc">${ach.desc}</p>
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   6. AI Studio Logic
   ========================================================================== */
function initAIStudio() {
  const tabBtns = document.querySelectorAll('.ai-tab-btn');
  const panes = document.querySelectorAll('.ai-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const paneId = btn.getAttribute('data-pane');
      panes.forEach(p => {
        if (p.id === paneId) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    });
  });
  
  // Set up click handlers for simulated AI calculations
  document.getElementById('btn-run-career-rec').addEventListener('click', runCareerRecommendation);
  document.getElementById('btn-run-gap-analysis').addEventListener('click', runSkillGapAnalysis);
  document.getElementById('btn-run-suggestions').addEventListener('click', runLearningSuggestions);
  document.getElementById('btn-run-resume-opt').addEventListener('click', runResumeOptimization);
  document.getElementById('btn-run-interview-prep').addEventListener('click', runInterviewPrep);
}

function refreshAIOptions() {
  // Populate select career options in AI studio
  const gapSelect = document.getElementById('ai-gap-target');
  gapSelect.innerHTML = '';
  const prepSelect = document.getElementById('ai-interview-target');
  prepSelect.innerHTML = '';
  
  db.careerPaths.forEach(path => {
    const opt1 = document.createElement('option');
    opt1.value = path.id;
    opt1.innerText = path.title;
    gapSelect.appendChild(opt1);
    
    const opt2 = document.createElement('option');
    opt2.value = path.id;
    opt2.innerText = path.title;
    prepSelect.appendChild(opt2);
  });
  
  document.getElementById('ai-rec-profile-name').innerText = db.users[0].name;
}

function runCareerRecommendation() {
  const resultBox = document.getElementById('career-rec-results');
  resultBox.innerHTML = `
    <div style="text-align:center; padding: 1.5rem;">
      <span style="display:inline-block; animation: spin 1s infinite linear; font-size:1.5rem;">⚙️</span>
      <p style="margin-top:0.5rem; color:var(--text-muted);">AI recommendation models parsing profile parameters...</p>
    </div>
  `;
  
  setTimeout(() => {
    const user = db.users[0];
    const skillsListStr = user.currentSkills.join(', ');
    
    resultBox.innerHTML = `
      <h4 style="color:var(--accent-purple); margin-bottom: 0.75rem;">✔ Compatibility Analysis Complete</h4>
      <p style="font-size:0.9rem; margin-bottom: 1rem;">Profile Analyzed: <strong>${user.name}</strong> (${user.education})</p>
      <p style="font-size:0.9rem; margin-bottom: 1rem;">Analyzed Skills: <em>${skillsListStr}</em></p>
      
      <div style="display:flex; flex-direction:column; gap:1rem;">
        <div style="border-left: 3px solid var(--success); padding-left: 0.75rem;">
          <div style="font-weight:600; display:flex; justify-content:space-between;">
            <span>1. Data Scientist</span>
            <span style="color:var(--success);">98% Match (Highest Alignment)</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-secondary);">Direct alignment with Python foundations, SQL basic queries, and your completed Data Science internship training at NGB Tech Solutions.</p>
        </div>
        
        <div style="border-left: 3px solid var(--accent-blue); padding-left: 0.75rem;">
          <div style="font-weight:600; display:flex; justify-content:space-between;">
            <span>2. AI & Machine Learning Engineer</span>
            <span style="color:var(--accent-blue);">82% Match</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-secondary);">Python proficiency matches requirements. Suggest learning linear algebra, neural network architectures, and PyTorch frameworks next.</p>
        </div>
        
        <div style="border-left: 3px solid var(--text-muted); padding-left: 0.75rem; opacity: 0.7;">
          <div style="font-weight:600; display:flex; justify-content:space-between;">
            <span>3. Frontend Web Developer</span>
            <span style="color:var(--text-muted);">48% Match</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-secondary);">Requires mastering layout standards (CSS Flexbox/Grid) and component architectures (React/Vite ecosystem).</p>
        </div>
      </div>
    `;
  }, 1000);
}

function runSkillGapAnalysis() {
  const targetId = document.getElementById('ai-gap-target').value;
  const path = db.careerPaths.find(p => p.id === targetId);
  const resultBox = document.getElementById('gap-analysis-results');
  
  resultBox.innerHTML = `
    <div style="text-align:center; padding: 1.5rem;">
      <span style="display:inline-block; animation: spin 1s infinite linear; font-size:1.5rem;">⚙️</span>
      <p style="margin-top:0.5rem; color:var(--text-muted);">Comparing current mastered skills against target requirements...</p>
    </div>
  `;
  
  setTimeout(() => {
    // Gather all target skills
    const targetSkills = [];
    Object.keys(path.stages).forEach(stageKey => {
      path.stages[stageKey].skills.forEach(s => {
        targetSkills.push(s);
      });
    });
    
    const mastered = targetSkills.filter(s => db.userProgress.completedSkillIds.includes(s.id));
    const missing = targetSkills.filter(s => !db.userProgress.completedSkillIds.includes(s.id));
    
    const masteredCount = mastered.length;
    const totalCount = targetSkills.length;
    const gapPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
    
    let missingListHTML = '';
    if (missing.length > 0) {
      missing.slice(0, 4).forEach(s => {
        missingListHTML += `<li style="font-size:0.85rem; margin-bottom:0.4rem;">⚠️ Missing: <strong>${s.name}</strong></li>`;
      });
      if (missing.length > 4) {
        missingListHTML += `<li style="font-size:0.8rem; color:var(--text-muted); list-style:none;">... and ${missing.length - 4} other skills.</li>`;
      }
    } else {
      missingListHTML = `<li style="color:var(--success);">✨ You have mastered all core skills in this roadmap!</li>`;
    }
    
    resultBox.innerHTML = `
      <h4 style="color:var(--accent-purple); margin-bottom: 0.75rem;">✔ Skill Gap Report: ${path.title}</h4>
      
      <div class="gap-bar-container">
        <div class="gap-info">
          <span>Competency Match Index</span>
          <strong>${gapPct}%</strong>
        </div>
        <div class="gap-bar-track">
          <div class="gap-bar-fill" style="width: ${gapPct}%"></div>
        </div>
      </div>
      
      <p style="font-size:0.85rem; margin-bottom: 0.75rem;">Core skills matched: <strong>${masteredCount} / ${totalCount}</strong></p>
      
      <div style="background-color:var(--bg-secondary); border: 1px solid var(--border-color); border-radius:8px; padding: 1rem; margin-top: 1rem;">
        <span style="font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight:700; display:block; margin-bottom:0.5rem;">Immediate Action Plan</span>
        <ul style="padding-left:1.2rem;">
          ${missingListHTML}
        </ul>
      </div>
    `;
  }, 1000);
}

function runLearningSuggestions() {
  const hours = parseInt(document.getElementById('ai-suggest-hours').value) || 15;
  const resultBox = document.getElementById('suggestions-results');
  
  resultBox.innerHTML = `
    <div style="text-align:center; padding: 1.5rem;">
      <span style="display:inline-block; animation: spin 1s infinite linear; font-size:1.5rem;">⚙️</span>
      <p style="margin-top:0.5rem; color:var(--text-muted);">Structuring learning path based on available weekly time...</p>
    </div>
  `;
  
  setTimeout(() => {
    // Generate schedule recommendation
    let dailyHours = Math.round((hours / 5) * 10) / 10; // weekdays
    resultBox.innerHTML = `
      <h4 style="color:var(--accent-purple); margin-bottom: 0.75rem;">✔ Weekly Study Schedule Suggestion</h4>
      <p style="font-size:0.9rem; margin-bottom:1rem;">Target Study Time: <strong>${hours} hours/week</strong> (~${dailyHours} hrs/day for 5 weekdays).</p>
      
      <table style="width:100%; border-collapse:collapse; font-size:0.85rem; text-align:left; margin-bottom: 1rem;">
        <thead>
          <tr style="border-bottom: 1.5px solid var(--border-color); color:var(--text-muted);">
            <th style="padding:0.5rem 0;">Focus Area</th>
            <th style="padding:0.5rem 0;">Weekly Allocation</th>
            <th style="padding:0.5rem 0;">Actionable Method</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid var(--border-color);">
            <td style="padding:0.5rem 0; font-weight:600;">Core Theory / Videos</td>
            <td style="padding:0.5rem 0;">${Math.round(hours * 0.3)} hours</td>
            <td style="padding:0.5rem 0; color:var(--text-secondary);">Watch recommended Coursera lessons</td>
          </tr>
          <tr style="border-bottom:1px solid var(--border-color);">
            <td style="padding:0.5rem 0; font-weight:600;">Practical Lab Coding</td>
            <td style="padding:0.5rem 0;">${Math.round(hours * 0.5)} hours</td>
            <td style="padding:0.5rem 0; color:var(--text-secondary);">Build milestone projects, commit to Git</td>
          </tr>
          <tr>
            <td style="padding:0.5rem 0; font-weight:600;">Syllabus Review & Quizzes</td>
            <td style="padding:0.5rem 0;">${Math.round(hours * 0.2)} hours</td>
            <td style="padding:0.5rem 0; color:var(--text-secondary);">Solve flashcards and summarize notes</td>
          </tr>
        </tbody>
      </table>
      
      <div style="font-size:0.8rem; border-left:3px solid var(--accent-blue); padding-left:0.75rem; color:var(--text-secondary);">
        💡 <strong>Pro-Tip:</strong> Schedule study sessions in blocks of 90 minutes. Make sure to complete the intermediate level project challenges to earn roadmap certificates!
      </div>
    `;
  }, 1000);
}

function runResumeOptimization() {
  const text = document.getElementById('resume-paste-area').value.trim();
  const resultBox = document.getElementById('resume-opt-results');
  
  if (!text) {
    alert('Please paste some resume details to analyze.');
    return;
  }
  
  resultBox.innerHTML = `
    <div style="text-align:center; padding: 1.5rem;">
      <span style="display:inline-block; animation: spin 1s infinite linear; font-size:1.5rem;">⚙️</span>
      <p style="margin-top:0.5rem; color:var(--text-muted);">AI Resume Optimization scan executing...</p>
    </div>
  `;
  
  setTimeout(() => {
    // Generate tailored resume advice for Harishmitha
    resultBox.innerHTML = `
      <h4 style="color:var(--accent-purple); margin-bottom: 0.75rem;">✔ ATS Score Optimization Feedback</h4>
      <div style="display:flex; justify-content:space-between; margin-bottom: 1rem; background-color:var(--bg-secondary); padding: 0.5rem; border-radius:5px; border:1px solid var(--border-color);">
        <span>Estimated ATS Match Rating:</span>
        <strong style="color:var(--success);">85 / 100 (Strong)</strong>
      </div>
      
      <div style="font-size:0.85rem; display:flex; flex-direction:column; gap:0.75rem;">
        <div>
          <strong style="color:var(--success);">✅ Key Strengths Found:</strong>
          <p style="color:var(--text-secondary); margin-top:0.2rem;">Good highlighting of B.Sc Computer Technology education and Python/SQL capabilities.</p>
        </div>
        
        <div>
          <strong style="color:var(--warning);">⚠️ Critical Recommendations:</strong>
          <ul style="padding-left:1.2rem; margin-top:0.25rem; color:var(--text-secondary);">
            <li><strong>Add NGB Tech Solutions Internship Details:</strong> Clearly list responsibilities, e.g. "Completed Data Science with Python Internship (May 2026), manipulating large data arrays using Pandas & NumPy, and visualizing core business ratios."</li>
            <li><strong>Emphasize Projects:</strong> Create a dedicated "Academic Projects" section specifying the exploratory analysis models you constructed.</li>
            <li><strong>List PSG College Credentials:</strong> Ensure B.Sc Computer Technology registry details are styled clearly.</li>
          </ul>
        </div>
      </div>
    `;
  }, 1000);
}

function runInterviewPrep() {
  const targetId = document.getElementById('ai-interview-target').value;
  const path = db.careerPaths.find(p => p.id === targetId);
  const resultBox = document.getElementById('interview-prep-results');
  
  resultBox.innerHTML = `
    <div style="text-align:center; padding: 1.5rem;">
      <span style="display:inline-block; animation: spin 1s infinite linear; font-size:1.5rem;">⚙️</span>
      <p style="margin-top:0.5rem; color:var(--text-muted);">Generating role-specific technical questions...</p>
    </div>
  `;
  
  setTimeout(() => {
    let questionsHTML = '';
    
    if (targetId === 'data_science') {
      questionsHTML = `
        <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom: 0.75rem;">
          <strong style="color:var(--accent-blue);">Q1: How do you handle missing values in a dataframe before model training?</strong>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;"><em>Answer Guide:</em> Mention dropping records, simple imputations (mean/median), or advanced models like KNN Imputer. Note that Pandas' <code>.fillna()</code> is standard.</p>
        </div>
        <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom: 0.75rem;">
          <strong style="color:var(--accent-blue);">Q2: Explain the bias-variance tradeoff in machine learning classifiers.</strong>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;"><em>Answer Guide:</em> High bias represents underfitting, high variance represents overfitting. Regularization, cross-validation, and ensemble models balance the tradeoff.</p>
        </div>
        <div>
          <strong style="color:var(--accent-blue);">Q3: Behavioral - Tell me about a time you solved a data-related challenge.</strong>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;"><em>Answer Guide:</em> Highlight your PSG College academic labs or NGB Tech Solutions internship experiences. Use the STAR method (Situation, Task, Action, Result).</p>
        </div>
      `;
    } else if (targetId === 'ai_engineer') {
      questionsHTML = `
        <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom: 0.75rem;">
          <strong style="color:var(--accent-blue);">Q1: What is the vanishing gradient problem and how do we resolve it?</strong>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;"><em>Answer Guide:</em> Explain how deep network layers multiply small gradients during backpropagation. Resolved by ReLU activation, Residual links, and Batch Normalization.</p>
        </div>
        <div>
          <strong style="color:var(--accent-blue);">Q2: How does the Self-Attention mechanism function in Transformers?</strong>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;"><em>Answer Guide:</em> Explain Queries, Keys, and Values matrices mapping relationships between all words in a sentence simultaneously.</p>
        </div>
      `;
    } else {
      questionsHTML = `
        <div style="margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom: 0.75rem;">
          <strong style="color:var(--accent-blue);">Q1: Explain the Virtual DOM mechanism in React.</strong>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;"><em>Answer Guide:</em> React keeps a lightweight replica of the real DOM. On state changes, it diffs changes and updates only modified elements (reconciliation).</p>
        </div>
        <div>
          <strong style="color:var(--accent-blue);">Q2: Detail the difference between CSS Grid and Flexbox.</strong>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;"><em>Answer Guide:</em> Grid is 2-Dimensional (rows and columns), while Flexbox is 1-Dimensional (single row or column focus).</p>
        </div>
      `;
    }
    
    resultBox.innerHTML = `
      <h4 style="color:var(--accent-purple); margin-bottom: 1rem;">✔ Core Interview Preparation Guide: ${path.title}</h4>
      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        ${questionsHTML}
      </div>
    `;
  }, 1000);
}

// Add animation spin styling dynamically
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
