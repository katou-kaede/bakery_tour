let storeCount = 0;
let currentStoreIndex = 0;
let slots = [];
let currentMission = "";

const missions = [
  "丸いパンを買う",
  "惣菜系のパンを買う",
  "甘いパンを買う",
  "ハード系（かため）のパンを買う",
  "サクサク系のパンを買う",
  "名前に「ン」がつくパンを買う",
  "名前に「ー（伸ばし棒）」がつくパンを買う",
  "名前に漢字が入っているパンを買う",
  "名前にひらがなが入っているパンを買う",
  "名前に濁点がつくパンを買う",
  "名前に半濁点がつくパンを買う",
  "揚げてあるパンを買う",
  "チョコレートが入ったパンを買う",
  "フルーツが入ったパンを買う",
  "肉が入ったパンを買う",
  "チーズが入ったパンを買う",
  "クリームが入ったパンを買う",
  "野菜が入ったパンを買う",
  "何かが挟んであるパンを買う",
  "何かがのっているパンを買う",
  "季節・期間限定のパンを買う",
  "写真映えするパンを買ってSNSに投稿する",
  "パンとツーショット写真を撮る",
  "200円台のパンを買う",
  "300円台のパンを買う",
  "400円台のパンを買う",
  "破産覚悟で500円以上のいいパンを買う",
  "健康を気にせずカロリー高めのパンを買う",
  "同行者とかぶらないようにパンを買う",
  "同行者の中で一番誕生日が近い人と同じパンを買う",
  "明日の朝食に食べるパンを買って帰る",
];

function startGame() {
  storeCount = parseInt(document.getElementById('storeCountInput').value);
  if (!storeCount || storeCount < 1) {
    alert("店舗数を正しく入力してください（1以上）");
    return;
  }

  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('gameScreen').style.display = 'block';

  // スロットを作成
  const container = document.getElementById('slotsContainer');
  container.innerHTML = '';
  slots = [];

  for (let i = 0; i < storeCount; i++) {
    slots.push({
      storeName: "",
      boughtItems: [],
      photos: [],
      mission: "",
      completed: false
    });

    const slotDiv = document.createElement('div');
    slotDiv.className = `slot ${i === 0 ? 'active' : ''}`;
    slotDiv.id = `slot${i}`;
    slotDiv.innerHTML = `
      <div class="slot-header">
        <span class="slot-number">店舗 ${i + 1}</span>
        <div class="form-group">
          <input type="text" class="store-name-input" placeholder="例: 〇〇ベーカリー"
                  onchange="updateStoreName(${i}, this.value)">
        </div>
      </div>
      <div class="mission-display ${i === 0 ? 'empty' : ''}" id="mission${i}">
        ${i === 0 ? 'ミッションを引いてください' : '前の店舗を完了すると表示されます'}
      </div>
      <label class="bought-item-label">買ったパンの名前</label>
      <div class="input-btn-wrapper">
          <input
          type="text"
          class="bought-item-input"
          placeholder="例：クロワッサン"
          onkeydown="if(event.key === 'Enter') { event.preventDefault(); addBoughtItem(${i}, this); }"
          inputmode="text"
          enterkeyhint="done"
          >
          <button type="button" class="add-btn" onclick="addBoughtItem(${i}, this.previousElementSibling)">
          追加
          </button>
      </div>
      <div class="bought-items" id="boughtItems${i}"></div>
      <div class="form-group">
        <label>写真をアップロード</label>
        <input type="file" class="photo-input" accept="image/*"
                onchange="addPhotos(event, ${i})">
        <div class="photo-preview-container" id="photos${i}"></div>
      </div>
      <button class="complete-btn" onclick="completeStore(${i})" id="completeBtn${i}">
        完了
      </button>
    `;
    container.appendChild(slotDiv);
  }
  document.querySelector('#gameScreen .game-restart-btn').classList.remove('hidden');
}

function showMission() {
  if (currentStoreIndex >= storeCount) {
    alert("すべての店舗が完了しています！");
    return;
  }
  drawMission();
  document.getElementById('missionText').textContent = currentMission;
  document.getElementById('missionPopup').classList.add('show');
}

function drawMission() {
  const index = Math.floor(Math.random() * missions.length);
  currentMission = missions[index];
}

function useMission() {
  if (currentStoreIndex >= storeCount) return;

  slots[currentStoreIndex].mission = currentMission;
  const missionDisplay = document.getElementById(`mission${currentStoreIndex}`);
  missionDisplay.textContent = `🎯 ${currentMission}`;
  missionDisplay.classList.remove('empty');

  document.getElementById('missionPopup').classList.remove('show');
}

function rerollMission() {
  drawMission();
  document.getElementById('missionText').textContent = currentMission;
}

function updateStoreName(index, value) {
  slots[index].storeName = value;
}

function addBoughtItem(index, input) {
  const value = input.value.trim();
  if (!value) return;

  slots[index].boughtItems.push(value);
  input.value = '';
  updateBoughtItemsDisplay(index);
}

function updateBoughtItemsDisplay(index) {
  const container = document.getElementById(`boughtItems${index}`);
  container.innerHTML = slots[index].boughtItems.map((item, i) => `
    <span class="bought-item">
      ${item}
      <button class="remove-btn" onclick="removeBoughtItem(${index}, ${i})">×</button>
    </span>
  `).join('');
}

function removeBoughtItem(slotIndex, itemIndex) {
  slots[slotIndex].boughtItems.splice(itemIndex, 1);
  updateBoughtItemsDisplay(slotIndex);
}

// 写真複数枚受付
// function addPhotos(event, index) {
//   const files = Array.from(event.target.files);
//   files.forEach(file => {
//     const reader = new FileReader();
//     reader.onload = function(e) {
//       slots[index].photos.push({
//         data: e.target.result,
//         name: file.name
//       });
//       updatePhotosDisplay(index);
//     };
//     reader.readAsDataURL(file);
//   });
// }

function addPhotos(event, index) {
  const file = event.target.files[0];   // ← 1枚だけ取得

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    // 既存の写真は1枚にしたいなら上書き
    slots[index].photos = [{
      data: e.target.result,
      name: file.name
    }];

    updatePhotosDisplay(index);
  };
  reader.readAsDataURL(file);
}

function updatePhotosDisplay(index) {
  const container = document.getElementById(`photos${index}`);
  container.innerHTML = slots[index].photos.map((photo, i) => `
    <div class="photo-preview">
      <img src="${photo.data}" alt="${photo.name}">
      <button class="remove-photo" onclick="removePhoto(${index}, ${i})">×</button>
    </div>
  `).join('');
}

function removePhoto(slotIndex, photoIndex) {
  slots[slotIndex].photos.splice(photoIndex, 1);
  updatePhotosDisplay(slotIndex);
}


// 完了処理
function completeStore(index) {
  if (index !== currentStoreIndex) {
    alert(`店舗 ${index + 1} を完了する前に、店舗 ${currentStoreIndex + 1} を完了してください。`);
    return;
  }

  if (!slots[index].mission) {
    alert("先にミッションを引いてください！");
    return;
  }

  // 店舗名が未入力の場合はデフォルト値を設定
  if (!slots[index].storeName) {
    slots[index].storeName = `店舗 ${index + 1}`;
  }

  slots[index].completed = true;

  // UI更新
  const slotDiv = document.getElementById(`slot${index}`);
  // const missionDisplay = document.getElementById(`mission${index}`);
  slotDiv.classList.remove('active');
  slotDiv.classList.add('completed');
  // missionDisplay.classList.add('completed');
  // document.getElementById(`completeBtn${index}`).classList.add('hidden');
  // document.getElementById(`completedStamp${index}`).classList.remove('hidden');

    // ▼ 写真1枚のみ対応
  const firstPhoto = slots[index].photos?.[0];
  const photoHTML = firstPhoto
    ? `<div class="photo-preview"><img src="${firstPhoto.data}"></div>`
    : `<div class="photo-preview"><img src="images/bread.png"></div>`;

  // ▼ 買ったパンの個別 div 表示
  let boughtItemsHTML = '';
  const boughtItems = slots[index].boughtItems || [];
  if (boughtItems.length > 0) {
    boughtItemsHTML = boughtItems.map(item => `<div class="bought-item">${item}</div>`).join('');
  } else {
    boughtItemsHTML = '<div class="bought-item">未入力</div>';
  }

  // ===== ▼ 完了UIを一気に innerHTML で書き換え ▼ =====
  slotDiv.innerHTML = `
    <div class="completed-wrapper">
      <div class="slot-number completed">${slots[index].storeName}</div>
      <div class="mission-display completed">🎯 ${slots[index].mission}</div>
      <div class="completed-photo">
        <div class="photo-preview-container">
          ${photoHTML}
        </div>
        <div class="bought-items" id="boughtItems${index}">
          ${boughtItemsHTML}
        </div>
      </div>
      <div class="completed-stamp" id="completedStamp">
        ✅ 完了
      </div>
    </div>

  `;


  // 次のスロットをアクティブに
  currentStoreIndex++;

  if (currentStoreIndex >= storeCount) {
    // すべて完了
    setTimeout(() => {
      document.getElementById('completeScreen').classList.add('show');
    }, 500);
  } else {
    // 次のスロットをアクティブに
    document.getElementById(`slot${currentStoreIndex}`).classList.add('active');
    const nextMissionDisplay = document.getElementById(`mission${currentStoreIndex}`);
    nextMissionDisplay.textContent = 'ミッションを引いてください';
    nextMissionDisplay.classList.add('empty');
  }
}

// ボードに戻る
function closeCompleteScreen() {
  document.getElementById('completeScreen').classList.remove('show');
}

// もう一度始める
function restartGame() {
  const confirmRestart = confirm("これまで入力した内容はリセットされます。\nよろしいですか？");
  if (confirmRestart) {
    location.reload();
  }
}

// ポップアップ外側クリックで閉じる
document.getElementById('missionPopup').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.remove('show');
  }
});