// app.js - core logic (pcbs_wish_v1)
const KEY = 'pcbs_wish_v1';
const defaults = {
  coins: 300,
  gems: 40,
  betCost: 20,
  user: { username: null },
  matches: [
    {id:1, teams:['Bull','Shelly'], starts: Date.now()+3600000, odds:[1.6,2.0]},
    {id:2, teams:['Colt','Jessie'], starts: Date.now()+7200000, odds:[1.9,1.9]},
    {id:3, teams:['Nita','Bo'], starts: Date.now()+10800000, odds:[2.2,1.5]}
  ],
  bets: [],
  rewards: [
    {id:1, name:'Skin Épica', cost:{gems:50}, stock:5},
    {id:2, name:'Caixa', cost:{coins:80}, stock:20}
  ],
  leaderboard: [
    {name:'PlayerOne', points:420},
    {name:'PlayerTwo', points:310}
  ]
};

function loadState(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return JSON.parse(JSON.stringify(defaults));
    return Object.assign(JSON.parse(JSON.stringify(defaults)), JSON.parse(raw));
  }catch(e){ console.error(e); return JSON.parse(JSON.stringify(defaults)); }
}
let state = loadState();
function saveState(){ localStorage.setItem(KEY, JSON.stringify(state)); }

function fmt(ts){ return new Date(ts).toLocaleString(); }
function randInt(n){ return Math.floor(Math.random()*n); }

function renderStats(){
  document.getElementById('coins')?.textContent = state.coins;
  document.getElementById('gems')?.textContent = state.gems;
}

function renderMatches(){
  const el = document.getElementById('matches');
  if(!el) return;
  el.innerHTML = '';
  state.matches.forEach(m=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="match-top">
        <div class="team-pill">${m.teams[0]} <span class="odds">(${m.odds[0]})</span></div>
        <div><small>${fmt(m.starts)}</small></div>
        <div class="team-pill">${m.teams[1]} <span class="odds">(${m.odds[1]})</span></div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px">
        <button class="btn" onclick="addBet(${m.id},0)">Apostar ${state.betCost} points - ${m.teams[0]}</button>
        <button class="btn" onclick="addBet(${m.id},1)">Apostar ${state.betCost} points - ${m.teams[1]}</button>
      </div>
    `;
    el.appendChild(card);
  });
}

function renderRewards(){
  const el = document.getElementById('rewards-grid');
  if(!el) return;
  el.innerHTML = '';
  state.rewards.forEach(r=>{
    const card = document.createElement('div'); card.className='card';
    const price = Object.entries(r.cost).map(([k,v])=>v+' '+k).join(' / ');
    card.innerHTML = `<h4>${r.name}</h4><p>${price}</p><p>Stock: ${r.stock}</p><div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn" onclick="buy(${r.id})">Comprar</button></div>`;
    el.appendChild(card);
  });
}

function renderBets(){
  const el = document.getElementById('bet-list');
  if(!el) return;
  el.innerHTML = '';
  state.bets.forEach(b=>{
    const li = document.createElement('li');
    li.textContent = `${fmt(b.ts)} — ${b.match.teams[b.choice]} (aposta ${b.amount} points)`;
    el.appendChild(li);
  });
}

function renderLeaderboard(){
  const el = document.getElementById('leaderboard-list');
  if(!el) return;
  el.innerHTML = '';
  state.leaderboard.forEach(p=>{
    const li = document.createElement('li'); li.textContent = `${p.name} — ${p.points} pts`;
    el.appendChild(li);
  });
}

function renderTeams(){
  const el = document.getElementById('teams-grid');
  if(!el) return;
  el.innerHTML = '';
  state.matches.forEach(m=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `<h4>${m.teams[0]} vs ${m.teams[1]}</h4><p>${fmt(m.starts)}</p>`;
    el.appendChild(card);
  });
}

function addBet(matchId, choice){
  if(!state.user?.username){ alert('Faz login primeiro em Profile'); return; }
  const m = state.matches.find(x=>x.id===matchId);
  if(!m) return alert('Jogo não encontrado');
  if(state.coins < state.betCost) return alert('Points insuficientes');
  state.coins -= state.betCost;
  state.bets.push({match:{id:m.id, teams:m.teams}, choice, amount: state.betCost, ts: Date.now(), user: state.user.username});
  saveState(); renderStats(); renderBets();
  alert('Aposta adicionada');
}

function processBets(){
  if(state.bets.length===0) return alert('Sem apostas');
  state.bets.forEach(b=>{
    const outcome = randInt(2);
    if(outcome === b.choice){
      const gain = 8 + randInt(12);
      state.gems += gain;
      // credit leaderboard
      const p = state.leaderboard.find(x=>x.name===b.user);
      if(p) p.points += gain;
      else state.leaderboard.push({name:b.user, points:gain});
    }
  });
  state.bets = [];
  saveState(); renderStats(); renderBets(); renderLeaderboard();
  alert('Apostas processadas (simulado)');
}

function clearBets(){ state.bets = []; saveState(); renderBets(); }

function buy(rewId){
  if(!state.user?.username){ alert('Faz login primeiro em Profile'); return; }
  const r = state.rewards.find(x=>x.id===rewId);
  if(!r) return;
  if(r.cost.coins && state.coins < r.cost.coins) return alert('Points insuficientes');
  if(r.cost.gems && state.gems < r.cost.gems) return alert('Gemas insuficientes');
  if(r.cost.coins) state.coins -= r.cost.coins;
  if(r.cost.gems) state.gems -= r.cost.gems;
  if(r.stock>0) r.stock -= 1;
  saveState(); renderStats(); renderRewards();
  alert('Compra efetuada');
}

// profile renderer
function renderProfile(){
  document.getElementById('profile-username')?.textContent = state.user?.username ?? '—';
  document.getElementById('profile-coins')?.textContent = state.coins;
  document.getElementById('profile-gems')?.textContent = state.gems;
  document.getElementById('profile-bets')?.textContent = state.bets.filter(b=>b.user===state.user?.username).length;
}

// INIT
document.addEventListener('DOMContentLoaded', ()=>{
  renderStats(); renderMatches(); renderRewards(); renderBets(); renderLeaderboard(); renderTeams(); renderProfile();
  document.getElementById('confirm-bets')?.addEventListener('click', processBets);
  document.getElementById('clear-bets')?.addEventListener('click', clearBets);
});
