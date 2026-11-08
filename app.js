// ==================== الترجمات ====================
const translations = {
  ar: {
    appName: "حريفي", tagline: "أفضل الحرفيين بين يديك",
    welcomeLogin: "مرحبا بيك، دخل للموقع", email: "البريد الإلكتروني", password: "كلمة السر",
    passwordLabel: "كلمة السر (6 حروف على الأقل)", loginBtn: "تسجيل الدخول", registerBtn: "إنشاء حساب", or: "أو",
    noAccount: "ما عندكش حساب؟ ", createAccount: "صاوب حساب جديد",
    fullName: "الاسم الكامل", namePlaceholder: "مثال: أحمد بن علي", age: "العمر",
    welcome: "مرحبا بيك", roleQuestion: "واش نتا حريفي ولا كتقلب على شي حريفي؟",
    consumer: "أنا مستهلك", consumerSub: "كنقلب على حريفي",
    craftsman: "أنا حريفي", craftsmanSub: "بغيت نقدم خدماتي",
    consumerInfo: "معلومات المستهلك", tellUsAboutYou: "عرفنا عليك شوية", continue: "متابعة",
    craftsmanInfo: "معلومات الحريفي", addPhoto: "اضغط باش تزيد صورة",
    craftNamePlaceholder: "مثال: محمد العلمي", profession: "المهنة", professionPlaceholder: "كهربائي، صباغ، نجار...",
    city: "المدينة", cityPlaceholder: "مثال: الدار البيضاء", bio: "نبذة عليك (bio)", bioPlaceholder: "عرف راسك بالحرفة ديالك...",
    phone: "رقم الهاتف", createProfile: "إنشاء الحساب", craftsmenList: "الحرفيين",
    searchPlaceholder: "🔍 قلب على مدينة، اسم، مهنة...", minRating: "⭐ التقييم الأدنى:",
    logout: "خروج", back: "→ رجوع", craftsmanProfile: "بروفايل الحريفي", myProfile: "البروفايل ديالي",
    inbox: "صندوق الرسائل", typeMessage: "كتب رسالة...", contact: "📞 اتصل", message: "💬 راسل",
    rating: "⭐ التقييم", rateCraftsman: "قيّم هاد الحريفي:", sendRating: "أرسل التقييم",
    noRating: "مازال ما تقيّمش", you: "أنت: ", consumerName: "مستهلك"
  },
  fr: {
    appName: "Harifi", tagline: "Meilleurs artisans à portée de main",
    welcomeLogin: "Bienvenue, connectez-vous", email: "Email", password: "Mot de passe",
    passwordLabel: "Mot de passe (min 6)", loginBtn: "Se connecter", registerBtn: "Créer un compte", or: "OU",
    noAccount: "Pas de compte? ", createAccount: "Créer un compte",
    fullName: "Nom complet", namePlaceholder: "Ex: Ahmed Ali", age: "Âge",
    welcome: "Bienvenue", roleQuestion: "Êtes-vous un artisan ou cherchez-vous un artisan?",
    consumer: "Je suis client", consumerSub: "Je cherche un artisan",
    craftsman: "Je suis artisan", craftsmanSub: "Je propose mes services",
    consumerInfo: "Infos Client", tellUsAboutYou: "Parlez-nous de vous", continue: "Continuer",
    craftsmanInfo: "Infos Artisan", addPhoto: "Cliquez pour ajouter une photo",
    craftNamePlaceholder: "Ex: Mohamed Alami", profession: "Métier", professionPlaceholder: "Électricien, Peintre...",
    city: "Ville", cityPlaceholder: "Ex: Casablanca", bio: "Bio", bioPlaceholder: "Présentez votre métier...",
    phone: "Téléphone", createProfile: "Créer le profil", craftsmenList: "Artisans",
    searchPlaceholder: "🔍 Chercher ville, nom, métier...", minRating: "⭐ Note min:",
    logout: "Déconnexion", back: "→ Retour", craftsmanProfile: "Profil Artisan", myProfile: "Mon Profil",
    inbox: "Boîte de réception", typeMessage: "Écrire un message...", contact: "📞 Appeler", message: "💬 Message",
    rating: "⭐ Note", rateCraftsman: "Notez cet artisan:", sendRating: "Envoyer la note",
    noRating: "Pas encore noté", you: "Vous: ", consumerName: "Client"
  },
  en: {
    appName: "Harifi", tagline: "Best artisans at your fingertips",
    welcomeLogin: "Welcome, please login", email: "Email", password: "Password",
    passwordLabel: "Password (min 6)", loginBtn: "Login", registerBtn: "Create Account", or: "OR",
    noAccount: "No account? ", createAccount: "Create one",
    fullName: "Full Name", namePlaceholder: "Ex: Ahmed Ali", age: "Age",
    welcome: "Welcome", roleQuestion: "Are you an artisan or looking for one?",
    consumer: "I'm a client", consumerSub: "Looking for an artisan",
    craftsman: "I'm an artisan", craftsmanSub: "I offer services",
    consumerInfo: "Client Info", tellUsAboutYou: "Tell us about you", continue: "Continue",
    craftsmanInfo: "Artisan Info", addPhoto: "Click to add a photo",
    craftNamePlaceholder: "Ex: Mohamed Alami", profession: "Profession", professionPlaceholder: "Electrician, Painter...",
    city: "City", cityPlaceholder: "Ex: Casablanca", bio: "Bio", bioPlaceholder: "Describe your work...",
    phone: "Phone", createProfile: "Create Account", craftsmenList: "Artisans",
    searchPlaceholder: "🔍 Search city, name, job...", minRating: "⭐ Min rating:",
    logout: "Logout", back: "→ Back", craftsmanProfile: "Artisan Profile", myProfile: "My Profile",
    inbox: "Inbox", typeMessage: "Type a message...", contact: "📞 Call", message: "💬 Message",
    rating: "⭐ Rating", rateCraftsman: "Rate this artisan:", sendRating: "Submit Rating",
    noRating: "Not rated yet", you: "You: ", consumerName: "Client"
  }
};

let currentLang = localStorage.getItem('appLang') || 'ar';

// ==================== المتغيرات ====================
const defaultCraftsmen = [
  { name: 'محمد العلمي', profession: 'كهربائي', city: 'الدار البيضاء', bio: 'كهربائي محترف خبرة 10 سنين', phone: '0612345678', rating: 4.5, rating_count: 20, ratings: [5,4,5,4,5,4,5,4,5,4], photo: '' },
  { name: 'يوسف بناني', profession: 'صباغ', city: 'الرباط', bio: 'صباغ ماهر وأسعار مناسبة', phone: '0623456789', rating: 4.0, rating_count: 15, ratings: [4,4,4,5,3,4], photo: '' }
];

let craftsmen = [];
let currentAuthUser = null;
let currentProfile = null;
let currentDetailId = null;
let selectedCity = 'الكل';
let minRating = 0;
let currentRatingSelection = 0;
let uploadedPhoto = '';
let currentChatPartnerId = null;
let chatSubscription = null;
let chatRoomId = null;
let chatSource = 'profile';

// ==================== 1. التهيئة ====================
async function init() {
  _supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      currentAuthUser = session.user;
      const { data } = await _supabase.from('profiles').select('*').eq('id', currentAuthUser.id).maybeSingle();
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
  updateLanguageUI();
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
    toggleTxt.setAttribute('data-i18n', 'noAccount');
    toggleBtn.setAttribute('data-i18n', 'createAccount');
  } else {
    loginF.style.display = 'none';
    regF.style.display = 'block';
    toggleTxt.textContent = 'عندك حساب من قبل؟ '; 
    toggleBtn.textContent = 'دخل لحسابك'; 
  }
  updateLanguageUI();
}

async function registerUser(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  document.getElementById('regBtn').disabled = true;
  const { data, error } = await _supabase.auth.signUp({ email, password });

  if (error) {
    showAuthError(error.message);
  } else if (data.user) {
    await _supabase.from('profiles').insert({ id: data.user.id, name: name, role: 'unknown' });
    showToast('✅ Success');
  }
  document.getElementById('regBtn').disabled = false;
}

async function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  document.getElementById('loginBtn').disabled = true;
  const { error } = await _supabase.auth.signInWithPassword({ email, password });
  if (error) showAuthError(error.message);
  document.getElementById('loginBtn').disabled = false;
}

function showAuthError(msg) {
  const errDiv = document.getElementById('authError');
  errDiv.textContent = msg;
  errDiv.style.display = 'block';
  setTimeout(() => errDiv.style.display = 'none', 4000);
}

async function logout() {
  if (chatSubscription) { _supabase.removeChannel(chatSubscription); chatSubscription = null; }
  currentProfile = null; currentAuthUser = null;
  showScreen('authScreen');
  localStorage.clear(); sessionStorage.clear();
  try { _supabase.auth.signOut().catch(e => console.log(e)); } catch(e) {}
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
    showScreen('listScreen'); renderCityChips(); renderCraftsmen();
  } else if (currentProfile.role === 'craftsman') {
    renderMyProfile(); showScreen('myProfileScreen');
  } else { showScreen('roleScreen'); }
}

function goToConsumer() { showScreen('consumerScreen'); }
function goToCraftsman() { showScreen('craftsmanScreen'); }

// ==================== 4. تسجيل الأدوار ====================
async function submitConsumer(e) {
  e.preventDefault();
  const name = document.getElementById('consumerName').value;
  const age = parseInt(document.getElementById('consumerAge').value);
  if (!name || !age || age < 16) return;

  await _supabase.from('profiles').update({ name, role: 'consumer', age }).eq('id', currentAuthUser.id);
  currentProfile = { ...currentProfile, name, role: 'consumer', age };
  renderCityChips(); renderCraftsmen(); showScreen('listScreen');
}

async function submitCraftsman(e) {
  e.preventDefault();
  const name = document.getElementById('craftName').value.trim();
  const profession = document.getElementById('craftProfession').value.trim();
  const city = document.getElementById('craftCity').value.trim();
  const bio = document.getElementById('craftBio').value.trim();
  const phone = document.getElementById('craftPhone').value.trim();
  const photoInput = document.getElementById('photoInput');

  if (!name || !profession || !city || !bio || !phone) return;

  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    const { data, error } = await _supabase.from('craftsmen').insert({
      name, profession, city, bio, phone, photo: '', rating: 0, rating_count: 0, ratings: [], user_id: currentAuthUser.id
    }).select().single();

    if (error) throw error;
    const newId = data.id;

    let photoUrl = '';
    if (photoInput.files.length > 0) {
      photoUrl = await uploadPhoto(photoInput.files[0], newId);
      if (photoUrl) await _supabase.from('craftsmen').update({ photo: photoUrl }).eq('id', newId);
    }

    await _supabase.from('profiles').update({ name, role: 'craftsman', craftsman_id: newId }).eq('id', currentAuthUser.id);
    currentProfile = { ...currentProfile, name, role: 'craftsman', craftsman_id: newId };
    
    await loadCraftsmen(); renderMyProfile(); showScreen('myProfileScreen');
  } catch (err) { console.error(err); } finally { btn.disabled = false; }
}

// ==================== 5. عرض البروفايل ====================
function renderMyProfile() {
  const t = translations[currentLang];
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
    <div class="card"><h3>${t.bio}</h3><p>${c.bio}</p></div>
    <div class="card"><h3>${t.phone}</h3><p dir="ltr" style="text-align:right">${c.phone}</p></div>
    <div class="card"><h3>${t.rating}</h3>
      <p>${c.rating > 0 ? `${c.rating.toFixed(1)} / 5 (${c.rating_count})` : t.noRating}</p>
    </div>
  `;
}

// ==================== 6. القائمة والتقييمات ====================
async function seedIfEmpty() {
  const { data } = await _supabase.from('craftsmen').select('id').limit(1);
  if (data && data.length === 0) await _supabase.from('craftsmen').insert(defaultCraftsmen);
}

async function loadCraftsmen() {
  const { data } = await _supabase.from('craftsmen').select('*');
  craftsmen = data || [];
}

function renderCityChips() {
  const t = translations[currentLang];
  // كنعوضو "الكل" بالترجمة ديالها
  const allCitiesText = currentLang === 'ar' ? 'الكل' : (currentLang === 'fr' ? 'Tout' : 'All');
  
  // كنجيبو المدن من الداتا، وكنعوضو "الكل" بالترجمة
  let cities = [...new Set(craftsmen.map(c => c.city))];
  
  document.getElementById('cityChips').innerHTML = `
    <button class="chip ${selectedCity === 'الكل' ? 'active' : ''}" onclick="selectCity('الكل')">${allCitiesText}</button>
    ${cities.map(city =>
      `<button class="chip ${city === selectedCity ? 'active' : ''}" onclick="selectCity('${city}')">${city}</button>`
    ).join('')}
  `;
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
  if (filtered.length === 0) { listEl.innerHTML = '<div class="empty">🔍 0</div>'; return; }

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
  currentDetailId = id; currentRatingSelection = 0;
  renderDetailContent(); showScreen('detailScreen');
}

function renderDetailContent() {
  const t = translations[currentLang];
  const c = craftsmen.find(x => x.id === currentDetailId);
  if (!c) return;
  const avatarStyle = c.photo ? `style="background-image:url('${c.photo}')"` : '';
  const avatarContent = c.photo ? '' : c.name.charAt(0);
  const isMine = currentProfile && currentProfile.craftsman_id === c.id;

  document.getElementById('detailContent').innerHTML = `
    <div class="profile-header">
      <div class="avatar-letter" ${avatarStyle}>${avatarContent}</div>
      <h2>${c.name}</h2>
      <span class="chip-prof">${c.profession}</span>
      <div class="location">📍 ${c.city}</div>
    </div>
    <div class="card"><h3>${t.bio}</h3><p>${c.bio}</p></div>
    
    <div class="btn-row">
      <a href="tel:${c.phone}" class="contact-btn">${t.contact}</a>
      ${!isMine ? `<button class="chat-open-btn" onclick="openChat('${c.user_id}', '${c.name}')">${t.message}</button>` : ''}
    </div>

    <div class="card">
      <h3>${t.rating}</h3>
      <p style="text-align:center;font-size:16px;font-weight:700">
        ${c.rating > 0 ? `${c.rating.toFixed(1)} / 5` : t.noRating}
        ${c.rating_count > 0 ? `<span style="color:#999;font-weight:400">(${c.rating_count})</span>` : ''}
      </p>
      ${!isMine ? `
        <p style="text-align:center;margin-top:16px;font-size:14px">${t.rateCraftsman}</p>
        <div class="rate-stars" id="rateStars">
          ${[1,2,3,4,5].map(i => `<span class="star" onclick="selectRating(${i})">☆</span>`).join('')}
        </div>
        <button class="btn teal-btn" onclick="submitRating()">${t.sendRating}</button>
      ` : ''}
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
  if (currentRatingSelection === 0) return;
  try {
    const c = craftsmen.find(x => x.id === currentDetailId);
    let ratings = c.ratings || [];
    ratings.push(currentRatingSelection);
    const newCount = ratings.length;
    const newRating = ratings.reduce((a, b) => a + b, 0) / newCount;

    await _supabase.from('craftsmen').update({ ratings, rating_count: newCount, rating: newRating }).eq('id', currentDetailId);
    await loadCraftsmen(); renderDetailContent();
  } catch (e) { console.error(e); }
}

// ==================== 7. رفع الصور ====================
function previewPhoto(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    uploadedPhoto = ev.target.result;
    const img = document.getElementById('avatarPreview');
    img.src = uploadedPhoto; img.style.display = 'block';
    document.getElementById('avatarPlaceholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

async function uploadPhoto(file, id) {
  if (!file) return '';
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;
    const { error } = await _supabase.storage.from('craftsmen').upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = _supabase.storage.from('craftsmen').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (e) { return ''; }
}

// ==================== 8. الشات ====================
function openChat(partnerId, partnerName) {
  if (!partnerId) return;
  currentChatPartnerId = partnerId; chatSource = 'profile';
  document.getElementById('chatTitle').textContent = partnerName;
  const myId = currentAuthUser.id;
  chatRoomId = [myId, partnerId].sort().join('_');
  showScreen('chatScreen');
  document.getElementById('chatMessages').innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳...</p>';
  listenToMessages();
}

async function listenToMessages() {
  if (chatSubscription) { _supabase.removeChannel(chatSubscription); chatSubscription = null; }
  await new Promise(resolve => setTimeout(resolve, 200));
  const { data } = await _supabase.from('messages').select('*').eq('room_id', chatRoomId).order('created_at', { ascending: true });
  renderMessages(data || []);

  chatSubscription = _supabase.channel('any-chat-room')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.room_id === chatRoomId) appendMessage(payload.new);
    }).subscribe();
}

function renderMessages(msgs) {
  const container = document.getElementById('chatMessages');
  container.innerHTML = ''; 
  if (msgs.length === 0) { container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">...</p>'; return; }
  msgs.forEach(m => appendMessage(m));
}

function appendMessage(msg) {
  const container = document.getElementById('chatMessages');
  if (container.innerHTML.includes('...')) container.innerHTML = '';
  const msgElements = container.querySelectorAll('.msg');
  for (let el of msgElements) { if (el.innerHTML.includes(msg.text)) return; }
  const isMine = msg.sender_uid === currentAuthUser.id;
  const time = new Date(msg.created_at).toLocaleTimeString(currentLang === 'ar' ? 'ar-MA' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `msg ${isMine ? 'mine' : 'theirs'}`;
  div.innerHTML = `${msg.text}<div class="msg-time">${time}</div>`;
  container.appendChild(div); container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = ''; 
  const tempMessage = { text: text, sender_uid: currentAuthUser.id, created_at: new Date().toISOString() };
  appendMessage(tempMessage); 
  const { error } = await _supabase.from('messages').insert({
    room_id: chatRoomId, sender_uid: currentAuthUser.id, sender_name: currentProfile.name, text: text
  });
}

function backFromChat() {
  if (chatSubscription) { _supabase.removeChannel(chatSubscription); chatSubscription = null; }
  if (chatSource === 'inbox') { openInbox(); } 
  else {
    if (currentProfile.role === 'craftsman') { renderMyProfile(); showScreen('myProfileScreen'); } 
    else { showScreen('detailScreen'); }
  }
}

// ==================== 9. صندوق الرسائل ====================
async function openInbox() {
  const t = translations[currentLang];
  showScreen('inboxScreen');
  const container = document.getElementById('inboxList');
  container.innerHTML = '<p style="text-align:center;color:#999;">⏳...</p>';

  try {
    const myId = currentAuthUser.id;
    const { data, error } = await _supabase.from('messages').select('*').or(`room_id.like.%${myId}%`).order('created_at', { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) { container.innerHTML = '<p style="text-align:center;color:#999;">📭</p>'; return; }

    const chats = {};
    data.forEach(msg => { if (!chats[msg.room_id]) chats[msg.room_id] = msg; });

    let html = '';
    for (const roomId in chats) {
      const lastMsg = chats[roomId];
      const isMine = lastMsg.sender_uid === myId;
      const ids = roomId.split('_');
      const partnerId = ids.find(id => id !== myId);
      
      let partnerName = 'User';
      if (currentProfile.role === 'craftsman') {
         partnerName = !isMine ? lastMsg.sender_name : t.consumerName;
      } else {
         const craftsman = craftsmen.find(c => c.user_id === partnerId);
         partnerName = craftsman ? craftsman.name : 'Artisan';
      }
      const partnerLetter = partnerName.charAt(0);

      html += `
        <div class="inbox-item" onclick="openChatFromInbox('${roomId}', '${partnerId}', '${partnerName}')">
          <div class="inbox-avatar">${partnerLetter}</div>
          <div class="inbox-info">
            <h4>${partnerName}</h4>
            <p>${isMine ? t.you : ''}${lastMsg.text}</p>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  } catch (e) { container.innerHTML = '<p style="text-align:center;color:red;">Error</p>'; }
}

function openChatFromInbox(roomId, partnerId, partnerName) {
  currentChatPartnerId = partnerId; chatRoomId = roomId; chatSource = 'inbox';
  document.getElementById('chatTitle').textContent = partnerName;
  showScreen('chatScreen');
  document.getElementById('chatMessages').innerHTML = '<p style="text-align:center;color:#999;padding:20px;">⏳...</p>';
  listenToMessages();
}

function backFromInbox() {
  if (currentProfile.role === 'craftsman') { renderMyProfile(); showScreen('myProfileScreen'); } else { showScreen('listScreen'); }
}

// ==================== 10. نظام اللغات ====================
function toggleLanguage() {
  if (currentLang === 'ar') currentLang = 'fr';
  else if (currentLang === 'fr') currentLang = 'en';
  else currentLang = 'ar';
  localStorage.setItem('appLang', currentLang);
  updateLanguageUI();
}

function updateLanguageUI() {
  const t = translations[currentLang];
  
  // اتجاه الصفحة
  document.getElementById('htmlRoot').dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('htmlRoot').lang = currentLang;

  // تحديث أزرار اللغة
  const nextLang = currentLang === 'ar' ? 'FR' : (currentLang === 'fr' ? 'EN' : 'AR');
  document.querySelectorAll('#langBtn, #langBtn2, #langBtn3, #langBtnAuth').forEach(btn => { if(btn) btn.textContent = `🌐 ${nextLang}`; });

  // تحديث النصوص (data-i18n)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  // تحديث الـ Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });

  // تحديث الـ Title
  document.title = t.appName + " - " + t.tagline;

  // إعادة رسم الصفحات النشطة
  if (document.getElementById('listScreen').classList.contains('active')) renderCraftsmen();
  if (document.getElementById('detailScreen').classList.contains('active')) renderDetailContent();
  if (document.getElementById('myProfileScreen').classList.contains('active')) renderMyProfile();
  if (document.getElementById('inboxScreen').classList.contains('active')) openInbox();
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
