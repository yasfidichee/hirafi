// ==================== البيانات الافتراضية ====================
const defaultCraftsmen = [
  { name: 'محمد العلمي', profession: 'كهربائي', city: 'الدار البيضاء', bio: 'كهربائي محترف خبرة 10 سنين', phone: '0612345678', rating: 4.5, ratingCount: 20, ratings: [5,4,5,4,5,4,5,4,5,4], photo: '', lat: 33.5731, lng: -7.5898 },
  { name: 'يوسف بناني', profession: 'صباغ', city: 'الرباط', bio: 'صباغ ماهر وأسعار مناسبة', phone: '0623456789', rating: 4.0, ratingCount: 15, ratings: [4,4,4,5,3,4], photo: '', lat: 34.0209, lng: -6.8416 },
  { name: 'عبد الله الإدريسي', profession: 'نجار', city: 'مراكش', bio: 'نجار تقليدي وأثاث عصري', phone: '0634567890', rating: 5.0, ratingCount: 8, ratings: [5,5,5,5], photo: '', lat: 31.6295, lng: -7.9811 },
  { name: 'خالد الفاسي', profession: 'سباك', city: 'فاس', bio: 'سباك محترف خدمة 24 ساعة', phone: '0645678901', rating: 3.5, ratingCount: 10, ratings: [3,4,3,4], photo: '', lat: 34.0331, lng: -5.0003 },
  { name: 'رشيد التازي', profession: 'بنّاء', city: 'الدار البيضاء', bio: 'بنّاء ومقاول', phone: '0656789012', rating: 4.7, ratingCount: 12, ratings: [5,4,5,5], photo: '', lat: 33.5892, lng: -7.6038 }
];

// ==================== المتغيرات ====================
const USER_KEY = 'harifi_current_user';
let craftsmen = [];
let currentUser = null;
let firebaseUser = null;
let currentDetailId = null;
let selectedCity = 'الكل';
let minRating = 0;
let currentRatingSelection = 0;
let uploadedPhoto = '';
let myLocation = null; // { lat, lng }
let chatRef = null;
let currentChatPartner = null;
let map = null;
let mapMarker = null;
let previousScreenForChat = 'listScreen';

// ==================== التهيئة ====================
async function init() {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) currentUser = JSON.parse(userStr);

  // استمع لحالة تسجيل الدخول
  auth.onAuthStateChanged(user => {
    firebaseUser = user;
    if (user && !currentUser) {
      // مستخدم Google جديد
      currentUser = { 
        type: null, 
        name: user.displayName || 'مستخدم',
        email: user.email,
        uid: user.uid 
      };
    }
  });

  await seedIfEmpty();
  await loadCraftsmen();
  listenToChanges();

  // وجه المستخدم
  setTimeout(() => {
    if (currentUser && currentUser.type) {
      routeUser();
    } else if (firebaseUser) {
      document.getElementById('welcomeName').textContent = firebaseUser.displayName || '';
      showScreen('roleScreen');
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

// ==================== تسجيل الدخول ====================
async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    firebaseUser = result.user;
    document.getElementById('welcomeName').textContent = firebaseUser.displayName || '';
    showToast('✅ مرحبا ' + firebaseUser.displayName);
    showScreen('roleScreen');
  } catch (e) {
    console.error(e);
    if (e.code === 'auth/popup-blocked') {
      showToast('⚠️ افتح الـ popup ف المتصفح');
    } else {
      showToast('❌ مشكل ف تسجيل الدخول');
    }
  }
}

function continueAsGuest() {
  currentUser = { type: null, name: 'زائر', uid: 'guest_' + Date.now() };
  document.getElementById('welcomeName').textContent = '';
  showScreen('roleScreen');
}

function logout() {
  localStorage.removeItem(USER_KEY);
  currentUser = null;
  if (firebaseUser) auth.signOut();
  firebaseUser = null;
  showScreen('loginScreen');
}

// ==================== Firestore ====================
async function seedIfEmpty() {
  try {
    const snap = await db.collection('craftsmen').limit(1).get();
    if (!snap.empty) return;
    const batch = db.batch();
    defaultCraftsmen.forEach(c => {
      batch.set(db.collection('craftsmen').doc(), c);
    });
    await batch.commit();
  } catch (e) { console.error(e); }
}

async function loadCraftsmen() {
  try {
    const snap = await db.collection('craftsmen').get();
    craftsmen = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) { console.error(e); }
}

function listenToChanges() {
  db.collection('craftsmen').onSnapshot(snap => {
    craftsmen = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (document.getElementById('listScreen').classList.contains('active')) {
      renderCityChips();
      renderCraftsmen();
    }
    if (document.getElementById('detailScreen').classList.contains('active') && currentDetailId) {
      renderDetailContent();
    }
  });
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
  
  currentUser = { 
    ...currentUser, 
    type: 'consumer', 
    name, age,
    uid: currentUser.uid || firebaseUser?.uid || 'guest_' + Date.now()
  };
  localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
  renderCityChips();
  renderCraftsmen();
  showScreen('listScreen');
}

// ==================== الموقع الجغرافي ====================
function getMyLocation() {
  const status = document.getElementById('locationStatus');
  status.textContent = '⏳ كنحددو الموقع...';
  
  if (!navigator.geolocation) {
    status.textContent = '❌ المتصفح ما كيدعمش الموقع';
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    pos => {
      myLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      status.textContent = `✅ تحدد الموقع (${myLocation.lat.toFixed(3)}, ${myLocation.lng.toFixed(3)})`;
    },
    err => {
      status.textContent = '❌ ما قدرناش نجيبو الموقع. تحقق من الصلاحيات';
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

// ==================== صورة ====================
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

// ✅ الدالة الجديدة لرفع الصور عبر Cloudinary
async function uploadPhoto(dataUrl, id) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return '';
  
  // المعلومات ديالك من Cloudinary
  const CLOUD_NAME = 'f8fgy9rs';
  const UPLOAD_PRESET = 'hirafi_uploads'; // سميتها اللي صاوبتي
  
  try {
    // تجهيز الصورة باش تتصيفط
    const formData = new FormData();
    formData.append('file', dataUrl);
    formData.append('upload_preset', UPLOAD_PRESET);

    // صيفط الصورة لـ Cloudinary
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.secure_url) {
      // رجعنا الرابط ديال الصورة
      return data.secure_url;
    } else {
      console.error('مشكل ف الرفع:', data);
      return '';
    }
  } catch (error) {
    console.error('❌ خطأ ف الاتصال مع Cloudinary:', error);
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

  if (!name || !profession || !city || !bio || !phone) {
    showToast('⚠️ عمر جميع الحقول'); return;
  }

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  showToast('⏳ كنحفظو...');

  try {
    const data = {
      name, profession, city, bio, phone,
      photo: '', rating: 0, ratingCount: 0, ratings: [],
      lat: myLocation?.lat || null,
      lng: myLocation?.lng || null,
      ownerUid: currentUser?.uid || null
    };
    const docRef = await db.collection('craftsmen').add(data);

    let photoUrl = '';
    if (uploadedPhoto) {
      showToast('⏳ كنرفعو الصورة...');
      photoUrl = await uploadPhoto(uploadedPhoto, docRef.id);
      if (photoUrl) await docRef.update({ photo: photoUrl });
    }

    currentUser = {
      type: 'craftsman',
      id: docRef.id,
      name, profession, city, bio, phone,
      photo: photoUrl,
      uid: currentUser?.uid
    };
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

// ==================== بروفايل الحريفي ====================
function renderMyProfile() {
  const c = craftsmen.find(x => x.id === currentUser.id);
  if (!c) { document.getElementById('myProfileContent').innerHTML = '<p class="empty">مشكل</p>'; return; }
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
      <p>${c.rating > 0 ? `${c.rating.toFixed(1)} / 5 (${c.ratingCount} تقييم)` : 'مازال ما عندك حتى تقييم'}</p>
    </div>
  `;
}

// ==================== قائمة ====================
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
  const
