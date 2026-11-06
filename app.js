// ==================== البيانات ====================
const STORAGE_KEY = 'harifi_craftsmen';
const USER_KEY = 'harifi_current_user';

// حرفيين افتراضيين
const defaultCraftsmen = [
  {
    id: '1', name: 'محمد العلمي', profession: 'كهربائي',
    city: 'الدار البيضاء', bio: 'كهربائي محترف خبرة 10 سنين',
    phone: '0612345678', rating: 4.5, ratingCount: 20,
    ratings: [5,4,5,4,5,4,5,4,5,4], photo: ''
  },
  {
    id: '2', name: 'يوسف بناني', profession: 'صباغ',
    city: 'الرباط', bio: 'صباغ ماهر وأسعار مناسبة',
    phone: '0623456789', rating: 4.0, ratingCount: 15,
    ratings: [4,4,4,5,3,4], photo: ''
  },
  {
    id: '3', name: 'عبد الله الإدريسي', profession: 'نجار',
    city: 'مراكش', bio: 'نجار تقليدي وأثاث عصري',
    phone: '0634567890', rating: 5.0, ratingCount: 8,
    ratings: [5,5,5,5], photo: ''
  },
  {
    id: '4', name: 'خالد الفاسي', profession: 'سباك',
    city: 'فاس', bio: 'سباك محترف خدمة 24 ساعة',
    phone: '0645678901', rating: 3.5, ratingCount: 10,
    ratings: [3,4,3,4], photo: ''
  },
  {
    id: '5', name: 'رشيد التازي', profession: 'بنّاء',
    city: 'الدار البيضاء', bio: 'بنّاء ومقاول',
    phone: '0656789012', rating: 4.7, ratingCount: 12,
    ratings: [5,4,5,5], photo: ''
  }
];

// ==================== التهيئة ====================
let craftsmen = [];
let currentUser = null;
let currentDetailId = null;
let selectedCity = 'الكل';
let minRating = 0;
let currentRatingSelection = 0;

function init() {
  const stored = localStorage.getItem(STORAGE_KEY);
  craftsmen = stored ? JSON.parse(stored) : [...defaultCraftsmen];

  // إذا كان المستخدم مسجل، دخل ديريكت
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    currentUser = JSON.parse(userStr);
    setTimeout(() => {
      if (currentUser.type === 'consumer') {
        showScreen('listScreen');
        renderCityChips();
        renderCraftsmen();
      } else {
        renderMyProfile();
        showScreen('myProfileScreen');
      }
    }, 1500);
  } else {
    setTimeout(() => showScreen('roleScreen'), 2000);
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(craftsmen));
}

// ==================== التنقل ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goToConsumer() {
  showScreen('consumerScreen');
}
function goToCraftsman() {
  showScreen('craftsmanScreen');
}

function logout() {
  localStorage.removeItem(USER_KEY);
  currentUser = null;
  showScreen('roleScreen');
}

// ==================== تسجيل المستهلك ====================
function submitConsumer(e) {
  e.preventDefault();
  const name = document.getElementById('consumerName').value.trim();
  const age = parseInt(document.getElementById('consumerAge').value);
  if (!name || !age || age < 16) {
    showToast('⚠️ دخل معلومات صحيحة');
    return;
  }
  currentUser = { type: 'consumer', name, age };
  localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
  renderCityChips();
  renderCraftsmen();
  showScreen('listScreen');
}

// ==================== تسجيل الحريفي ====================
let uploadedPhoto = '';

function previewPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    uploadedPhoto = ev.target.result;
    const img = document.getElementById('avatarPreview');
    img.src = uploadedPhoto;
    img.style.display = 'block';
    document.getElementById('avatarPlaceholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function submitCraftsman(e) {
  e.preventDefault();
  const name = document.getElementById('craftName').value.trim();
  const profession = document.getElementById('craftProfession').value.trim();
  const city = document.getElementById('craftCity').value.trim();
  const bio = document.getElementById('craftBio').value.trim();
  const phone = document.getElementById('craftPhone').value.trim();

  if (!name || !profession || !city || !bio || !phone) {
    showToast('⚠️ عمر جميع الحقول');
    return;
  }

  const newCraftsman = {
    id: Date.now().toString(),
    name, profession, city, bio, phone,
    photo: uploadedPhoto,
    rating: 0,
    ratingCount: 0,
    ratings: []
  };
  craftsmen.push(newCraftsman);
  save();

  currentUser = {
    type: 'craftsman',
    id: newCraftsman.id,
    name, profession, city, bio, phone,
    photo: uploadedPhoto
  };
  localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

  renderMyProfile();
  showScreen('myProfileScreen');
}

// ==================== عرض بروفايل الحريفي (ديالي) ====================
function renderMyProfile() {
  const c = craftsmen.find(x => x.id === currentUser.id);
  if (!c) {
    document.getElementById('myProfileContent').innerHTML = '<p class="empty">مشكل ف البروفايل</p>';
    return;
  }

  const avatarStyle = c.photo
    ? `style="background-image:url('${c.photo}')"`
    : '';
  const avatarContent = c.photo ? '' : c.name.charAt(0);

  document.getElementById('myProfileContent').innerHTML = `
    <div class="profile-header">
      <div class="avatar-letter" ${avatarStyle}>${avatarContent}</div>
      <h2>${c.name}</h2>
      <span class="chip-prof">${c.profession}</span>
      <div class="location">📍 ${c.city}</div>
    </div>
    <div class="card">
      <h3>نبذة عني</h3>
      <p>${c.bio}</p>
    </div>
    <div class="card">
      <h3>📞 رقم الهاتف</h3>
      <p dir="ltr" style="text-align:right">${c.phone}</p>
    </div>
    <div class="card">
      <h3>⭐ التقييم</h3>
      <p>${c.rating > 0 ? `${c.rating.toFixed(1)} من 5 (${c.ratingCount} تقييم)` : 'مازال ما عندك حتى تقييم'}</p>
    </div>
  `;
}

// ==================== قائمة الحرفيين ====================
function renderCityChips() {
  const cities = ['الكل', ...new Set(craftsmen.map(c => c.city))];
  const container = document.getElementById('cityChips');
  container.innerHTML = cities.map(city =>
    `<button class="chip ${city === selectedCity ? 'active' : ''}" 
      onclick="selectCity('${city}')">${city}</button>`
  ).join('');
}

function selectCity(city) {
  selectedCity = city;
  renderCityChips();
  renderCraftsmen();
}

function updateRatingFilter(val) {
  minRating = parseFloat(val);
  document.getElementById('ratingValue').textContent = minRating.toFixed(1);
  renderCraftsmen();
}

function renderCraftsmen() {
  const search = document.getElementById('searchInput').value.trim();
  let filtered = craftsmen.filter(c => {
    const matchCity = selectedCity === 'الكل' || c.city === selectedCity;
    const matchRating = c.rating >= minRating;
    const matchSearch = !search || 
      c.name.includes(search) || 
      c.city.includes(search) || 
      c.profession.includes(search);
    return matchCity && matchRating && matchSearch;
  });

  // ترتيب حسب التقييم
  filtered.sort((a, b) => b.rating - a.rating);

  const listEl = document.getElementById('craftsmenList');
  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="empty">🔍 ما لقيناش شي حريفي بهاد المواصفات</div>';
    return;
  }

  listEl.innerHTML = filtered.map(c => {
    const avatarStyle = c.photo
      ? `style="background-image:url('${c.photo}')"`
      : '';
    const avatarContent = c.photo ? '' : c.name.charAt(0);

    return `
      <div class="craftsman-card" onclick="openDetail('${c.id}')">
        <div class="avatar-letter" ${avatarStyle}>${avatarContent}</div>
        <div class="craftsman-info">
          <h3>${c.name}</h3>
          <p>${c.profession} • ${c.city}</p>
          <div class="rating-line">
            ⭐ ${c.rating.toFixed(1)} <span style="color:#999">(${c.ratingCount})</span>
          </div>
        </div>
        <span style="color:#999;font-size:20px">‹</span>
      </div>
    `;
  }).join('');
}

// ==================== تفاصيل الحريفي ====================
function openDetail(id) {
  currentDetailId = id;
  currentRatingSelection = 0;
  const c = craftsmen.find(x => x.id === id);
  if (!c) return;

  const avatarStyle = c.photo
    ? `style="background-image:url('${c.photo}')"`
    : '';
  const avatarContent = c.photo ? '' : c.name.charAt(0);
  const isMine = currentUser && currentUser.type === 'craftsman' && currentUser.id === id;

  document.getElementById('detailContent').innerHTML = `
    <div class="profile-header">
      <div class="avatar-letter" ${avatarStyle}>${avatarContent}</div>
      <h2>${c.name}</h2>
      <span class="chip-prof">${c.profession}</span>
      <div class="location">📍 ${c.city}</div>
    </div>

    <div class="card">
      <h3>نبذة</h3>
      <p>${c.bio}</p>
    </div>

    <a href="tel:${c.phone}" class="contact-btn">📞 اتصل ب ${c.phone}</a>

    <div class="card">
      <h3>⭐ التقييم</h3>
      <p style="text-align:center;font-size:16px;font-weight:700">
        ${c.rating > 0 ? `${c.rating.toFixed(1)} من 5` : 'مازال ما تقيّمش'} 
        ${c.ratingCount > 0 ? `<span style="color:#999;font-weight:400">(${c.ratingCount} تقييم)</span>` : ''}
      </p>
      
      ${!isMine ? `
        <p style="text-align:center;margin-top:16px;font-size:14px">قيّم هاد الحريفي:</p>
        <div class="rate-stars" id="rateStars">
          ${[1,2,3,4,5].map(i => 
            `<span class="star" onclick="selectRating(${i})" data-val="${i}">☆</span>`
          ).join('')}
        </div>
        <button class="btn teal-btn" onclick="submitRating()">أرسل التقييم</button>
      ` : '<p style="text-align:center;color:#999;font-size:13px">ما تقدرش تقيّم راسك 😄</p>'}
    </div>
  `;

  showScreen('detailScreen');
}

function selectRating(val) {
  currentRatingSelection = val;
  const stars = document.querySelectorAll('#rateStars .star');
  stars.forEach((s, i) => {
    s.textContent = i < val ? '★' : '☆';
    s.style.color = i < val ? '#ffb300' : '#ccc';
  });
}

function submitRating() {
  if (currentRatingSelection === 0) {
    showToast('⚠️ اختار عدد النجوم أولاً');
    return;
  }
  const c = craftsmen.find(x => x.id === currentDetailId);
  if (!c) return;

  c.ratings.push(currentRatingSelection);
  c.ratingCount = c.ratings.length;
  c.rating = c.ratings.reduce((a, b) => a + b, 0) / c.ratings.length;
  save();

  showToast('✅ شكراً على التقييم!');
  openDetail(currentDetailId);
}

// ==================== تنبيه ====================
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

// ==================== تشغيل ====================
init();
