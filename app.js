// ==================== البيانات الافتراضية ====================
const defaultCraftsmen = [
  { name: 'محمد العلمي', profession: 'كهربائي', city: 'الدار البيضاء', bio: 'كهربائي محترف خبرة 10 سنين', phone: '0612345678', rating: 4.5, rating_count: 20, ratings: [5,4,5,4,5,4,5,4,5,4], photo: '' },
  { name: 'يوسف بناني', profession: 'صباغ', city: 'الرباط', bio: 'صباغ ماهر وأسعار مناسبة', phone: '0623456789', rating: 4.0, rating_count: 15, ratings: [4,4,4,5,3,4], photo: '' },
  { name: 'عبد الله الإدريسي', profession: 'نجار', city: 'مراكش', bio: 'نجار تقليدي وأثاث عصري', phone: '0634567890', rating: 5.0, rating_count: 8, ratings: [5,5,5,5], photo: '' }
];

// ==================== المتغيرات ====================
let craftsmen = [];
let currentAuthUser = null;
let currentProfile = null;
let currentDetailId = null;
let selectedCity = 'الكل';
let minRating = 0;
let currentRatingSelection = 0;
let uploadedPhoto = '';

// الشات
let currentChatPartnerId = null;
let chatSubscription = null;
let chatRoomId = null;

// ==================== 1. التهيئة ====================
async function init() {
  _supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      currentAuthUser = session.user;
      
      const { data } = await _supabase.from('profiles').select('*').eq('id', currentAuthUser.id).single();
      if (data) {
        currentProfile = data;
        routeUser();
      } else {
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

// ==================== 2. Auth ====================
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
    if (data.user) {
      await _supabase.from('profiles').insert({ id: data.user.id, name: name, role: 'unknown' });
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

  if (error) showAuthError(error.message);
  
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

  await _supabase.from('profiles').update({ name, role: 'consumer', age }).eq('id', currentAuthUser.id);

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

  if (!name || !profession || !city || !bio || !phone) { showToast('⚠️ عمر جميع الحقول'); return; }

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  showToast('⏳ كنحفظو...');

  try {
    const { data, error } = await _supabase.from('craftsmen').insert({
      name, profession, city, bio, phone, photo: '', rating: 0, rating_count: 0, ratings: [],
      user_id: currentAuthUser.id
    }).select().single();

    if (error) throw error;
    const newId = data.id;

    let photoUrl = '';
    if (photoInput.files.length > 0) {
      showToast('⏳ كنرفعو الصورة...');
      photoUrl = await uploadPhoto(photoInput.files[0], newId);
      if (photoUrl) await _supabase.from('craftsmen').update({ photo: photoUrl }).eq('id', newId);
    }

    await _supabase.from('profiles').update({ name, role: 'craftsman', craftsman_id: newId }).eq('id', currentAuthUser.id);
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
  const { data } = await _supabase.from('craftsmen').select('id').limit
