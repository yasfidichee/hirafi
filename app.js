// ==================== البيانات الافتراضية ====================
const defaultCraftsmen = [
  { name: 'محمد العلمي', profession: 'كهربائي', city: 'الدار البيضاء', bio: 'كهربائي محترف خبرة 10 سنين', phone: '0612345678', rating: 4.5, rating_count: 20, ratings: [5,4,5,4,5,4,5,4,5,4], photo: '' },
  { name: 'يوسف بناني', profession: 'صباغ', city: 'الرباط', bio: 'صباغ ماهر وأسعار مناسبة', phone: '0623456789', rating: 4.0, rating_count: 15, ratings: [4,4,4,5,3,4], photo: '' },
  { name: 'عبد الله الإدريسي', profession: 'نجار', city: 'مراكش', bio: 'نجار تقليدي وأثاث عصري', phone: '0634567890', rating: 5.0, rating_count: 8, ratings: [5,5,5,5], photo: '' }
];

// ==================== المتغيرات ====================
const USER_KEY = 'harifi_current_user';
let craftsmen = [];
let currentUser = null;
let currentDetailId = null;
let selectedCity = 'الكل';
let minRating = 0;
let currentRatingSelection = 0;
let uploadedPhoto = '';
let myLocation = null;
let chatSubscription = null;
let currentChatPartner = null;

// ==================== التهيئة ====================
async function init() {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) currentUser = JSON.parse(userStr);

  await seedIfEmpty();
  await loadCraftsmen();

  setTimeout(() => {
    if (currentUser && currentUser.type) {
      routeUser();
    } else {
      showScreen('loginScreen');
    }
  }, 1500);
}

function routeUser() {
  if (currentUser.type === 'consumer') {
    showScreen('listScreen');
    renderCityChips();
    renderCraftsmen();
  } else {
    renderMyProfile();
    showScreen('myProfileScreen');
  }
}

// ==================== جلب البيانات ====================
async function seedIfEmpty() {
  try {
    const { data, error } = await _supabase.from('craftsmen').select('id').limit(1);
    if (data && data.length > 0) return; // فيهم داتا

    console.log('📦 كنزيدو الحرفيين الافتراضيين...');
    await _supabase.from('craftsmen').insert(defaultCraftsmen);
  } catch (e) { console.error(e); }
}

async function loadCraftsmen() {
  try {
    const { data, error } = await _supabase.from('craftsmen').select('*');
    if (error) throw error;
    craftsmen = data || [];
  } catch (e) { console.error('❌ خطأ ف التحميل:', e); }
}

// ==================== تسجيل الدخول ====================
async function signInWithGoogle() {
  // فـ Supabase، تسجيل الدخول بـ Google كيحتاج إعدادات إضافية فـ Dashboard
  // باش نسهلوها، غادي نخليو "متابعة كزائر" للنسخة الأولى
  showToast('⚠️ استعمل زر "متابعة كزائر" دابا');
}

function continueAsGuest() {
  currentUser = { type: null, name: 'زائر', uid: 'guest_' + Date.now() };
  document.getElementById('welcomeName').textContent = '';
  showScreen('roleScreen');
}

function logout() {
  localStorage.removeItem(USER_KEY);
  currentUser = null;
  showScreen('loginScreen');
}

// ==================== التنقل ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}
function goToConsumer() { showScreen('consumerScreen'); }
function goToCraftsman() { showScreen('craftsmanScreen'); }

// ==================== تسجيل مستهلك ====================
function submitConsumer(e) {
  e.preventDefault();
  const name = document.getElementById('consumerName').value.trim();
  const age = parseInt(document.getElementById('consumerAge').value);
  if (!name || !age || age < 16) { showToast('⚠️ دخل معلومات صحيحة'); return; }

  currentUser = { ...currentUser, type: 'consumer', name, age };
  localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
  renderCityChips();
  renderCraftsmen();
  showScreen('listScreen');
}

// ==================== الموقع ====================
function getMyLocation() {
  const status = document.getElementById('locationStatus');
  status.textContent = '⏳ كنحددو الموقع...';
  if (!navigator.geolocation) { status.textContent = '❌ المتصفح ما كيدعمش الموقع'; return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      myLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      status.textContent = `✅ تحدد الموقع (${myLocation.lat.toFixed(3)}, ${myLocation.lng.toFixed(3)})`;
    },
    err => { status.textContent = '❌ ما قدرناش نجيبو الموقع'; },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// ==================== الصور ====================
function previewPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('⚠️ الصورة كبيرة (ماكس 2MB)'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    uploadedPhoto = ev.target.result;
    const img = document.getElementById('avatarPreview');
    img.src = uploadedPhoto;
    img.style.display = 'block';
    document.getElementById('avatarPlaceholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

async function uploadPhoto(file, id) {
  if (!file) return '';
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    
    // رفع الصورة لـ Supabase Storage
    const { data, error } = await _supabase.storage
      .from('craftsmen')
      .upload(fileName, file);

    if (error) throw error;
    
    // جلب الرابط العام
    const { data: urlData } = _supabase.storage.from('craftsmen').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (e) { 
    console.error('❌ خطأ ف رفع الصورة:', e); 
    return ''; 
  }
}

// ==================== تسجيل حريفي ====================
async function submitCraftsman(e) {
  e.preventDefault();
  const name = document.getElementById('craftName').value.trim();
  const profession = document.getElementById('craftProfession').value.trim();
  const city = document.getElementById('craftCity').value.trim();
  const bio = document.getElementById('craftBio').value.trim();
  const phone = document.getElementById('craftPhone').value.trim();
  const photoInput = document.getElementById('photoInput');

  if (!name || !profession || !city || !bio || !phone) {
    showToast('⚠️ عمر جميع الحقول'); return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  showToast('⏳ كنحفظو...');

  try {
    // 1. زيد الحريفي
    const { data, error } = await _supabase.from('craftsmen').insert({
      name, profession, city, bio, phone,
      photo: '', rating: 0, rating_count: 0, ratings: []
    }).select().single();

    if (error) throw error;
    const newId = data.id;

    // 2. رفع الصورة إذا كانت
    let photoUrl = '';
    if (photoInput.files.length > 0) {
      showToast('⏳ كنرفعو الصورة...');
      photoUrl = await uploadPhoto(photoInput.files[0], newId);
      if (photoUrl) {
        await _supabase.from('craftsmen').update({ photo: photoUrl }).eq('id', newId);
      }
    }

    // 3. حفظ المستخدم
    currentUser = { type: 'craftsman', id: newId, name, profession, city, bio, phone, photo: photoUrl };
    localStorage.setItem(USER_KEY, JSON.stringify(currentUser));

    await loadCraftsmen();
    renderMyProfile();
    showScreen('myProfileScreen');
    showToast('✅ تسجلت بنجاح!');
  } catch (err) {
    console.error(err);
    showToast('❌ مشكل، عاود جرب');
  } finally {
    btn.disabled = false;
  }
}

// ==================== عرض البروفايل ====================
function renderMyProfile() {
  const c = craftsmen.find(x => x.id === currentUser.id);
  if (!c) return;
  const avatarStyle = c.photo ? `style="background-image:url('${c.photo}')"` : '';
  const avatarContent = c.photo ? '' : c.name.charAt(0);

  document.getElementById('myProfileContent').innerHTML = `
    <div class="profile-header">
      <div class="avatar-letter" ${avatarStyle}>${avatarContent}</div>
      <h2>${c.name}</h2>
      <span class="chip-prof">${c.profession}</span>
      <div class="location">📍 ${c.city}</div>
    </div>
    <div class="card"><h3>نبذة</h3><p>${c.bio}</p></div>
    <div class="card"><h3>📞 الهاتف</h3><p dir="ltr" style="text-align:right">${c.phone}</p></div>
    <div class="card"><h3>⭐ التقييم</h3>
      <p>${c.rating > 0 ? `${c.rating.toFixed(1)} / 5 (${c.rating_count} تقييم)` : 'مازال ما عندك حتى تقييم'}</p>
    </div>
  `;
}

// ==================== القائمة ====================
function renderCityChips() {
  const cities = ['الكل', ...new Set(craftsmen.map(c => c.city))];
  document.getElementById('cityChips').innerHTML = cities.map(city =>
    `<button class="chip ${city === selectedCity ? 'active' : ''}" onclick="selectCity('${city}')">${city}</button>`
  ).join('');
}
function selectCity(city) { selectedCity = city; renderCityChips(); renderCraftsmen(); }
function updateRatingFilter(val) {
  minRating = parseFloat(val);
  document.getElementById('ratingValue').textContent = minRating.toFixed(1);
  renderCraftsmen();
}

function renderCraftsmen() {
  const search = document.getElementById('searchInput').value.trim();
  let filtered = craftsmen.filter(c => {
    const mCity = selectedCity === 'الكل' || c.city === selectedCity;
    const mRat = (c.rating || 0) >= minRating;
    const mSearch = !search || c.name.includes(search) || c.city.includes(search) || c.profession.includes(search);
    return mCity && mRat && mSearch;
  });
  filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const listEl = document.getElementById('craftsmenList');
  if (filtered.length === 0) { listEl.innerHTML = '<div class="empty">🔍 ما لقيناش شي حريفي</div>'; return; }

  listEl.innerHTML = filtered.map(c => {
    const avatarStyle = c.photo ? `style="background-image:url('${c.photo}')"` : '';
    const avatarContent = c.photo ? '' : c.name.charAt(0);
    return `
      <div class="craftsman-card" onclick="openDetail('${c.id}')">
        <div class="avatar-letter" ${avatarStyle}>${avatarContent}</div>
        <div class="craftsman-info">
          <h3>${c.name}</h3>
          <p>${c.profession} • ${c.city}</p>
          <div class="rating-line">⭐ ${(c.rating || 0).toFixed(1)} <span style="color:#999">(${c.rating_count || 0})</span></div>
        </div>
        <span style="color:#999;font-size:20px">‹</span>
      </div>`;
  }).join('');
}

// ==================== التفاصيل والتقييم ====================
function openDetail(id) {
  currentDetailId = id;
  currentRatingSelection = 0;
  renderDetailContent();
  showScreen('detailScreen');
}

function renderDetailContent() {
  const c = craftsmen.find(x => x.id === currentDetailId);
  if (!c) return;
  const avatarStyle = c.photo ? `style="background-image:url('${c.photo}')"` : '';
  const avatarContent = c.photo ? '' : c.name.charAt(0);
  const isMine = currentUser && currentUser.type === 'craftsman' && currentUser.id === c.id;

  document.getElementById('detailContent').innerHTML = `
    <div class="profile-header">
      <div class="avatar-letter" ${avatarStyle}>${avatarContent}</div>
      <h2>${c.name}</h2>
      <span class="chip-prof">${c.profession}</span>
      <div class="location">📍 ${c.city}</div>
    </div>
    <div class="card"><h3>نبذة</h3><p>${c.bio}</p></div>
    <a href="tel:${c.phone}" class="contact-btn">📞 اتصل ب ${c.phone}</a>
    <div class="card">
      <h3>⭐ التقييم</h3>
      <p style="text-align:center;font-size:16px;font-weight:700">
        ${c.rating > 0 ? `${c.rating.toFixed(1)} من 5` : 'مازال ما تقيّمش'}
        ${c.rating_count > 0 ? `<span style="color:#999;font-weight:400">(${c.rating_count} تقييم)</span>` : ''}
      </p>
      ${!isMine ? `
        <p style="text-align:center;margin-top:16px;font-size:14px">قيّم هاد الحريفي:</p>
        <div class="rate-stars" id="rateStars">
          ${[1,2,3,4,5].map(i => `<span class="star" onclick="selectRating(${i})">☆</span>`).join('')}
        </div>
        <button class="btn teal-btn" onclick="submitRating()">أرسل التقييم</button>
      ` : '<p style="text-align:center;color:#999;font-size:13px">ما تقدرش تقيّم راسك 😄</p>'}
    </div>
  `;
  if (currentRatingSelection > 0) selectRating(currentRatingSelection);
}

function selectRating(val) {
  currentRatingSelection = val;
  document.querySelectorAll('#rateStars .star').forEach((s, i) => {
    s.textContent = i < val ? '★' : '☆';
    s.style.color = i < val ? '#ffb300' : '#ccc';
  });
}

async function submitRating() {
  if (currentRatingSelection === 0) { showToast('⚠️ اختار النجوم'); return; }
  try {
    const c = craftsmen.find(x => x.id === currentDetailId);
    let ratings = c.ratings || [];
    ratings.push(currentRatingSelection);
    const newCount = ratings.length;
    const newRating = ratings.reduce((a, b) => a + b, 0) / newCount;

    await _supabase.from('craftsmen').update({
      ratings: ratings,
      rating_count: newCount,
      rating: newRating
    }).eq('id', currentDetailId);

    await loadCraftsmen(); // تحديث الداتا
    renderDetailContent();
    showToast('✅ شكراً على التقييم!');
  } catch (e) { 
    console.error(e); 
    showToast('❌ مشكل ف التقييم'); 
  }
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
