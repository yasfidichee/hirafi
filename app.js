// ==================== البيانات الافتراضية ====================
const defaultCraftsmen = [
  { name: 'محمد العلمي', profession: 'كهربائي', city: 'الدار البيضاء', bio: 'كهربائي محترف خبرة 10 سنين', phone: '0612345678', rating: 4.5, rating_count: 20, ratings: [5,4,5,4,5,4,5,4,5,4], photo: '' },
  { name: 'يوسف بناني', profession: 'صباغ', city: 'الرباط', bio: 'صباغ ماهر وأسعار مناسبة', phone: '0623456789', rating: 4.0, rating_count: 15, ratings: [4,4,4,5,3,4], photo: '' }
];

// ==================== المتغيرات ====================
let craftsmen = [];
let currentAuthUser = null; // المستخدم ديال Supabase
let currentProfile = null;  // البروفايل ديالو من قاعدة البيانات
let currentDetailId = null;
let selectedCity = 'الكل';
let minRating = 0;
let currentRatingSelection = 0;
let uploadedPhoto = '';

// ==================== 1. التهيئة ومراقبة الدخول ====================
async function init() {
  // مراقبة حالة تسجيل الدخول
  _supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      currentAuthUser = session.user;
      
      // جيب البروفايل من جدول profiles
      const { data, error } = await _supabase
        .from('profiles')
        .select('*')
        .eq('id', currentAuthUser.id)
        .single();

      if (data) {
        currentProfile = data; // لقينا الحساب
        routeUser();
      } else {
        // مازال ما كملش البروفايل ديالو (جديد)
        document.getElementById('welcomeName').textContent = currentAuthUser.email;
        showScreen('roleScreen');
      }
    } else {
      currentAuthUser = null;
      currentProfile = null;
      showScreen('authScreen');
    }
  });

  await seedIfEmpty();
  await loadCraftsmen();
}

// ==================== 2. Auth (تسجيل الدخول) ====================
function toggleAuthForm(e) {
  e.preventDefault();
  const loginF = document.getElementById('loginForm');
  const regF = document.getElementById('registerForm');
  const toggleTxt = document.getElementById('toggleAuthText');
  const toggleBtn = document.getElementById('toggleAuthBtn');

  if (loginF.style.display === 'none') {
    loginF.style.display = 'block';
    regF.style.display = 'none';
    toggleTxt.textContent = 'ما عندكش حساب؟ ';
    toggleBtn.textContent = 'صاوب حساب جديد';
  } else {
    loginF.style.display = 'none';
    regF.style.display = 'block';
    toggleTxt.textContent = 'عندك حساب من قبل؟ ';
    toggleBtn.textContent = 'دخل لحسابك';
  }
}

async function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  document.getElementById('regBtn').disabled = true;
  document.getElementById('regBtn').textContent = 'جاري التسجيل...';

  const { data, error } = await _supabase.auth.signUp({ email, password });

  if (error) {
    showAuthError(error.message);
  } else {
    // بعد ما تسجل، كنزيدو ليه بروفايل (نوعو مازال مامعروفش)
    if (data.user) {
      await _supabase.from('profiles').insert({
        id: data.user.id,
        name: name,
        role: 'unknown' // مازال ماختارش
      });
      showToast('✅ تسجلت بنجاح!');
    }
  }
  
  document.getElementById('regBtn').disabled = false;
  document.getElementById('regBtn').textContent = 'إنشاء حساب';
}

async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  document.getElementById('loginBtn').disabled = true;
  document.getElementById('loginBtn').textContent = 'جاري الدخول...';

  const { error } = await _supabase.auth.signInWithPassword({ email, password });

  if (error) {
    showAuthError(error.message);
  }
  
  document.getElementById('loginBtn').disabled = false;
  document.getElementById('loginBtn').textContent = 'تسجيل الدخول';
}

function showAuthError(msg) {
  const errDiv = document.getElementById('authError');
  errDiv.textContent = msg;
  errDiv.style.display = 'block';
  setTimeout(() => errDiv.style.display = 'none', 4000);
}

async function logout() {
  await _supabase.auth.signOut();
  showToast('خارج من الحساب');
}

// ==================== 3. التنقل ====================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function routeUser() {
  if (!currentProfile) return;
  
  if (currentProfile.role === 'consumer') {
    showScreen('listScreen');
    renderCityChips();
    renderCraftsmen();
  } else if (currentProfile.role === 'craftsman') {
    renderMyProfile();
    showScreen('myProfileScreen');
  } else {
    showScreen('roleScreen');
  }
}

function goToConsumer() { showScreen('consumerScreen'); }
function goToCraftsman() { showScreen('craftsmanScreen'); }

// ==================== 4. تسجيل الأدوار ====================
async function submitConsumer(e) {
  e.preventDefault();
  const name = document.getElementById('consumerName').value;
  const age = parseInt(document.getElementById('consumerAge').value);

  if (!name || !age || age < 16) { showToast('⚠️ دخل معلومات صحيحة'); return; }

  // تحديث البروفايل فـ Supabase
  await _supabase.from('profiles').update({
    name: name,
    role: 'consumer',
    age: age
  }).eq('id', currentAuthUser.id);

  currentProfile = { ...currentProfile, name, role: 'consumer', age };
  renderCityChips();
  renderCraftsmen();
  showScreen('listScreen');
}

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
    // 1. زيد الحريفي فـ craftsmen
    const { data, error } = await _supabase.from('craftsmen').insert({
      name, profession, city, bio, phone,
      photo: '', rating: 0, rating_count: 0, ratings: [],
      user_id: currentAuthUser.id // ربط الحريفي بالحساب
    }).select().single();

    if (error) throw error;
    const newId = data.id;

    // 2. رفع الصورة
    let photoUrl = '';
    if (photoInput.files.length > 0) {
      photoUrl = await uploadPhoto(photoInput.files[0], newId);
      if (photoUrl) {
        await _supabase.from('craftsmen').update({ photo: photoUrl }).eq('id', newId);
      }
    }

    // 3. تحديث البروفايل
    await _supabase.from('profiles').update({
      name: name,
      role: 'craftsman',
      craftsman_id: newId
    }).eq('id', currentAuthUser.id);

    currentProfile = { ...currentProfile, name, role: 'craftsman', craftsman_id: newId };
    
    await loadCraftsmen();
    renderMyProfile();
    showScreen('myProfileScreen');
    showToast('✅ تسجلت بنجاح!');
  } catch (err) {
    console.error(err);
    showToast('❌ مشكل: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// ==================== 5. عرض البروفايل ====================
function renderMyProfile() {
  const c = craftsmen.find(x => x.id === currentProfile.craftsman_id);
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

// ==================== 6. القائمة والتقييمات ====================
async function seedIfEmpty() {
  const { data } = await _supabase.from('craftsmen').select('id').limit(1);
  if (data && data.length === 0) {
    await _supabase.from('craftsmen').insert(defaultCraftsmen);
  }
}

async function loadCraftsmen() {
  const { data } = await _supabase.from('craftsmen').select('*');
  craftsmen = data || [];
}

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
  
  // واش هاد الحريفي هو اللي مسجل دابا؟
  const isMine = currentProfile && currentProfile.craftsman_id === c.id;

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

    await loadCraftsmen();
    renderDetailContent();
    showToast('✅ شكراً على التقييم!');
  } catch (e) { 
    console.error(e); 
    showToast('❌ مشكل ف التقييم'); 
  }
}

// ==================== رفع الصور ====================
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
    
    const { data, error } = await _supabase.storage.from('craftsmen').upload(fileName, file);
    if (error) throw error;
    
    const { data: urlData } = _supabase.storage.from('craftsmen').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (e) { 
    console.error('❌ خطأ ف رفع الصورة:', e); 
    return ''; 
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
