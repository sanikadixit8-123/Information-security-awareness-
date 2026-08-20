// --- 1. Moving Background Particles ---
const canvas = document.getElementById('cyber-bg');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.radius = 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }
}

for (let i = 0; i < 40; i++) particles.push(new Particle());

function animateBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dist = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 100})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateBackground);
}
animateBackground();

// --- 2. Quiz Logic & 10 Pages of Scenarios ---
let userName = "";
let userEmail = "";
let currentIndex = 0;
let userAnswers = [];

const scenarios = [
  {
    category: "PAGE 1 OF 10: FAKE PRIZE SCAM",
    title: "The 'You Won a Free Gift' Scam",
    description: "Scammers create fake prize announcements to make you excited so you click before thinking.",
    subject: "🎁 Claim Your Free High-Speed Kitchen Blender!",
    senderName: "Kitchen Rewards Club",
    senderEmail: "rewards@claim-free-kitchenware-today.com",
    avatar: "🎁",
    hoverUrl: "http://claim-free-kitchenware-today.com/claim?user=id",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Congratulations ${name}!</p>
      <div class="scam-banner">
        <h4>🎉 YOU HAVE WON A FREE KITCHEN BLENDER! 🎉</h4>
        <p>Claim within 24 hours or your prize will be given to someone else!</p>
      </div>
      <p>Your email address (<strong>${email}</strong>) was chosen in our monthly giveaway.</p>
      <p>Click below to pay $1.99 shipping and receive your blender tomorrow:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://claim-free-kitchenware-today.com/claim?user=id')">Claim Your Blender Now</a></p>
    `,
    explanation: "This is a fake prize scam. Nobody gives away expensive blenders for free to random email addresses.",
    indicator: "Check the sender's email address (`@claim-free-kitchenware-today.com`). It is a fake website designed to steal your credit card details."
  },
  {
    category: "PAGE 2 OF 10: FULL STORAGE WARNING",
    title: "The 'Storage Full' Panic Scam",
    description: "Scammers pretend your cloud storage is full to make you panic about losing your personal photos and files.",
    subject: "⚠️ Warning: Your Cloud Storage is 99% Full!",
    senderName: "Cloud Storage Alert",
    senderEmail: "no-reply@cloud-storage-upgrade-help.com",
    avatar: "☁️",
    hoverUrl: "http://cloud-storage-upgrade-help.com/buy-space",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Hi ${name},</p>
      <p>Your storage account for <strong>${email}</strong> has reached 99% capacity. You will stop receiving emails and backup files in 12 hours.</p>
      <p>Get 1 TB of extra storage today for only $0.99 to prevent permanent data deletion.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://cloud-storage-upgrade-help.com/buy-space')">Upgrade Storage Now</a></p>
    `,
    explanation: "This is a storage scam attempt. Real storage providers do not threaten to delete your data immediately.",
    indicator: "Look closely at the web link: `cloud-storage-upgrade-help.com`. Official storage services come from official company domains, not random web addresses."
  },
  {
    category: "PAGE 3 OF 10: PHISHING SCAM",
    title: "The Fake Password Reset",
    description: "Phishing happens when scammers copy official company designs to trick you into entering your password.",
    subject: "Security Notice: Unusual Sign-In Detected",
    senderName: "Security Team",
    senderEmail: "no-reply@accounts-security-verify.com",
    avatar: "🔒",
    hoverUrl: "http://accounts-security-verify.com/login",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Dear ${name},</p>
      <p>We noticed an unrecognized sign-in attempt to your account (<strong>${email}</strong>) from another country.</p>
      <p>If this was not you, please click below to secure your password immediately:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://accounts-security-verify.com/login')">Secure Account Now</a></p>
    `,
    explanation: "This is a Phishing scam designed to steal your login credentials.",
    indicator: "The sender address is `accounts-security-verify.com`. Official security alerts always come from the main company website domain."
  },
  {
    category: "PAGE 4 OF 10: MALWARE ATTACHMENT",
    title: "The Fake Invoice Attack",
    description: "Malware is harmful computer code hidden inside attached files that can infect your computer when opened.",
    subject: "Receipt for Your Recent Order #48291",
    senderName: "Online Store Billing",
    senderEmail: "billing@receipt-processing-center.org",
    avatar: "📄",
    hoverUrl: "http://receipt-processing-center.org/invoice",
    hasAttachment: true,
    fileName: "Order_Receipt.pdf.exe",
    fileSize: "1.5 MB",
    fileIcon: "⚙️",
    isAttack: true,
    body: (name) => `
      <p>Hello ${name},</p>
      <p>Thank you for your purchase of $499.00! Your payment was successful.</p>
      <p>Please open the attached PDF receipt file below to view your full transaction breakdown.</p>
    `,
    explanation: "This is a Malware attack attempt disguised as a shopping receipt.",
    indicator: "Look at the attached file name: `Order_Receipt.pdf.exe`. Files ending in `.exe` are dangerous programs, not document files."
  },
  {
    category: "PAGE 5 OF 10: LEGITIMATE NOTIFICATION",
    title: "A Real Safe Email",
    description: "Not all emails are scams! Learn how to identify safe, authentic messages.",
    subject: "Document Shared With You",
    senderName: "Google Docs",
    senderEmail: "comments-noreply@docs.google.com",
    avatar: "📄",
    hoverUrl: "https://docs.google.com/document/d/12345/edit",
    hasAttachment: false,
    isAttack: false,
    body: (name) => `
      <p>Hi ${name},</p>
      <p>A colleague shared a document titled <strong>"Project Outline 2026"</strong> with you.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('https://docs.google.com/document/d/12345/edit')">Open in Google Docs</a></p>
    `,
    explanation: "This is a completely safe and legitimate email.",
    indicator: "Both the sender email (`@docs.google.com`) and the destination link lead directly to official `docs.google.com` websites."
  },
  {
    category: "PAGE 6 OF 10: RANSOMWARE THREAT",
    title: "The Emergency Virus Scam",
    description: "Ransomware locks your personal files and demands money to give them back.",
    subject: "CRITICAL: Computer Virus Detected on Your System",
    senderName: "Antivirus Emergency Team",
    senderEmail: "help@antivirus-fix-now.net",
    avatar: "⚠️",
    hoverUrl: "http://antivirus-fix-now.net/fix.exe",
    hasAttachment: true,
    fileName: "Clean_Virus_Now.exe",
    fileSize: "8.2 MB",
    fileIcon: "🔒",
    isAttack: true,
    body: (name, email) => `
      <p>Warning ${name}!</p>
      <p>Our system detected 3 severe viruses linked to <strong>${email}</strong>. Your personal files will be encrypted within 1 hour.</p>
      <p>Run the attached emergency cleanup tool immediately to protect your computer.</p>
    `,
    explanation: "This is a Ransomware trap designed to trick you into running dangerous code.",
    indicator: "Antivirus companies cannot scan your personal computer through an email and will never send executable `.exe` attachments."
  },
  {
    category: "PAGE 7 OF 10: FAKE PACKAGE DELIVERY",
    title: "The 'Missed Delivery' Scam",
    description: "Scammers pretend to be courier services asking for money to redeliver a parcel.",
    subject: "Delivery Failed: Address Confirmation Needed",
    senderName: "Express Parcel Service",
    senderEmail: "tracking@postal-redelivery-update.com",
    avatar: "📦",
    hoverUrl: "http://postal-redelivery-update.com/track",
    hasAttachment: false,
    isAttack: true,
    body: (name) => `
      <p>Hello ${name},</p>
      <p>We tried to deliver your parcel today, but nobody was home. A small redelivery fee of $1.50 is required.</p>
      <p>Please update your home address and pay the fee using the link below:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://postal-redelivery-update.com/track')">Update Delivery Details</a></p>
    `,
    explanation: "This is a parcel delivery scam aimed at stealing your credit card details.",
    indicator: "Notice the web link (`postal-redelivery-update.com`). Real postal services do not use random external website names."
  },
  {
    category: "PAGE 8 OF 10: MAN-IN-THE-MIDDLE / FAKE WI-FI",
    title: "The Fake Public Wi-Fi Portal",
    description: "Attackers set up fake Wi-Fi login pages in public places to steal your password as you type it.",
    subject: "Coffee Shop Guest Wi-Fi Re-Connect",
    senderName: "Public Wi-Fi Admin",
    senderEmail: "portal@free-wifi-login-page.com",
    avatar: "📶",
    hoverUrl: "http://192.168.1.1/login-form",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Hi ${name},</p>
      <p>Your public Wi-Fi connection for <strong>${email}</strong> has timed out. Enter your social media or email password to stay connected.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://192.168.1.1/login-form')">Reconnect to Wi-Fi</a></p>
    `,
    explanation: "This is a fake Wi-Fi portal attack designed to capture passwords over unsecured networks.",
    indicator: "The web address uses insecure `http://` instead of secure `https://`, meaning your data is transmitted without safety protection."
  },
  {
    category: "PAGE 9 OF 10: REAL SUBSCRIPTION RECEIPT",
    title: "Another Safe Email Example",
    description: "Legitimate receipts provide clear details without asking for your password.",
    subject: "Your Monthly Subscription Receipt",
    senderName: "Streaming Music Service",
    senderEmail: "receipts@streaming-service.com",
    avatar: "🎵",
    hoverUrl: "https://streaming-service.com/account/receipts",
    hasAttachment: false,
    isAttack: false,
    body: (name) => `
      <p>Hi ${name},</p>
      <p>Your payment of $9.99 for this month's music subscription was successful.</p>
      <p>You can view your account history anytime on our official website.</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('https://streaming-service.com/account/receipts')">View Account History</a></p>
    `,
    explanation: "This is a safe notification email.",
    indicator: "The sender domain matches the official website and it does not use pressure tactics or ask for sensitive information."
  },
  {
    category: "PAGE 10 OF 10: URGENT BANK SUSPENSION",
    title: "The Fake Bank Alert",
    description: "Scammers impersonate banks to make you panic about your money.",
    subject: "URGENT: Your Bank Account Has Been Frozen!",
    senderName: "Bank Account Security",
    senderEmail: "alert@banking-security-update-center.com",
    avatar: "🏦",
    hoverUrl: "http://banking-security-update-center.com/verify",
    hasAttachment: false,
    isAttack: true,
    body: (name, email) => `
      <p>Dear Customer ${name},</p>
      <p>Due to suspicious activity linked to <strong>${email}</strong>, your bank card has been temporarily frozen.</p>
      <p>You must confirm your account details within 24 hours to restore full access to your money:</p>
      <p><a href="#" class="cta-link" onmouseover="updateHover('http://banking-security-update-center.com/verify')">Unfreeze My Account</a></p>
    `,
    explanation: "This is a fake banking phishing scam.",
    indicator: "Real banks never send urgent links in emails asking you to log in or unfreeze your account."
  }
];

function startQuiz(e) {
  e.preventDefault();
  userName = document.getElementById("username").value.trim();
  userEmail = document.getElementById("useremail").value.trim();

  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("training-screen").classList.remove("hidden");
  loadScenario();
}

function loadScenario() {
  const s = scenarios[currentIndex];
  
  document.getElementById("attack-category-tag").innerText = s.category;
  document.getElementById("tracker-text").innerText = `Page ${currentIndex + 1} of 10`;
  document.getElementById("progress-fill").style.width = `${((currentIndex + 1) / scenarios.length) * 100}%`;
  
  document.getElementById("attack-title").innerText = s.title;
  document.getElementById("attack-description").innerText = s.description;

  document.getElementById("email-subject").innerText = s.subject;
  document.getElementById("email-sender-name").innerText = s.senderName;
  document.getElementById("email-sender-address").innerText = `<${s.senderEmail}>`;
  document.getElementById("email-recipient-display").innerText = userEmail;
  document.getElementById("email-avatar").innerText = s.avatar;
  
  document.getElementById("email-body-content").innerHTML = s.body(userName, userEmail);
  document.getElementById("hover-url").innerText = s.hoverUrl;

  const attWrapper = document.getElementById("attachment-wrapper");
  if (s.hasAttachment) {
    attWrapper.classList.remove("hidden");
    document.getElementById("file-name").innerText = s.fileName;
    document.getElementById("file-size").innerText = s.fileSize;
    document.getElementById("file-icon-type").innerText = s.fileIcon;
  } else {
    attWrapper.classList.add("hidden");
  }
}

function updateHover(url) {
  document.getElementById("hover-url").innerText = url;
}

function submitAnswer(userThoughtAttack) {
  const s = scenarios[currentIndex];
  const isCorrect = userThoughtAttack === s.isAttack;

  userAnswers.push({
    title: s.title,
    isCorrect: isCorrect
  });

  const badge = document.getElementById("feedback-badge");
  badge.innerText = isCorrect ? "CORRECT DECISION" : "INCORRECT CHOICE";
  badge.className = `result-badge ${isCorrect ? "correct" : "incorrect"}`;

  document.getElementById("feedback-heading").innerText = isCorrect 
    ? "Great Job!" 
    : "Be Careful!";
  document.getElementById("feedback-text").innerText = s.explanation;
  document.getElementById("feedback-indicator").innerText = s.indicator;

  document.getElementById("feedback-modal").classList.remove("hidden");
}

function nextScenario() {
  document.getElementById("feedback-modal").classList.add("hidden");
  currentIndex++;

  if (currentIndex < scenarios.length) {
    loadScenario();
  } else {
    showDashboard();
  }
}

function showDashboard() {
  document.getElementById("training-screen").classList.add("hidden");
  document.getElementById("dashboard-screen").classList.remove("hidden");

  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const pct = Math.round((correctCount / scenarios.length) * 100);

  document.getElementById("dashboard-user-greeting").innerText = `Safety results for ${userName} (${userEmail})`;
  document.getElementById("final-score-val").innerText = `${correctCount}/${scenarios.length}`;
  document.getElementById("final-pct-val").innerText = `${pct}%`;

  let grade = "C";
  if (pct >= 80) grade = "A";
  else if (pct >= 60) grade = "B";
  document.getElementById("final-grade-val").innerText = grade;

  const listEl = document.getElementById("breakdown-list");
  listEl.innerHTML = userAnswers.map((item, index) => `
    <div class="breakdown-item">
      <span>Page ${index + 1}: ${item.title}</span>
      <span class="item-status ${item.isCorrect ? 'pass' : 'fail'}">
        ${item.isCorrect ? '✓ Correct' : '✗ Missed'}
      </span>
    </div>
  `).join("");
      }
    
