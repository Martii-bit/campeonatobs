// admin.js - admin panel for pcbs_wish_v1
const KEY = 'pcbs_wish_v1';
function load(){ const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; }
document.addEventListener('DOMContentLoaded', ()=>{
  const raw = localStorage.getItem(KEY);
  const s = raw ? JSON.parse(raw) : null;
  document.getElementById('cfg-coins').value = s?.coins ?? 300;
  document.getElementById('cfg-gems').value = s?.gems ?? 40;
  document.getElementById('cfg-betcost').value = s?.betCost ?? 20;

  document.getElementById('save-config')?.addEventListener('click', ()=>{
    const state = s || {};
    state.coins = Number(document.getElementById('cfg-coins').value) || 0;
    state.gems = Number(document.getElementById('cfg-gems').value) || 0;
    state.betCost = Number(document.getElementById('cfg-betcost').value) || 10;
    state.matches = state.matches || [];
    state.rewards = state.rewards || [];
    state.bets = state.bets || [];
    state.leaderboard = state.leaderboard || [];
    state.user = state.user || { username: null };
    localStorage.setItem(KEY, JSON.stringify(state));
    alert('Config salva');
  });

  document.getElementById('reset-data')?.addEventListener('click', ()=>{
    if(!confirm('Resetar todos os dados e voltar a defaults?')) return;
    localStorage.removeItem(KEY);
    alert('Dados resetados — recarregue as páginas para aplicar');
  });

  document.getElementById('add-match')?.addEventListener('click', ()=>{
    const teamA = document.getElementById('m-team-a').value || 'Team A';
    const teamB = document.getElementById('m-team-b').value || 'Team B';
    const starts = Number(document.getElementById('m-starts').value) || (Date.now()+3600000);
    const oddA = Number(document.getElementById('m-odd-a').value) || 1.8;
    const oddB = Number(document.getElementById('m-odd-b').value) || 1.9;
    const raw = localStorage.getItem(KEY);
    const state = raw ? JSON.parse(raw) : null;
    if(!state){ alert('Salve a config primeiro para criar estado.'); return; }
    const id = Date.now();
    state.matches.push({id, teams:[teamA,teamB], starts, odds:[oddA,oddB]});
    localStorage.setItem(KEY, JSON.stringify(state));
    alert('Partida adicionada — recarregue a página de Predictions para ver');
  });

  document.getElementById('add-reward')?.addEventListener('click', ()=>{
    const name = document.getElementById('r-name').value || 'Nova Recompensa';
    const gems = Number(document.getElementById('r-gems').value) || 0;
    const coins = Number(document.getElementById('r-coins').value) || 0;
    const stock = Number(document.getElementById('r-stock').value) || 1;
    const raw = localStorage.getItem(KEY);
    const state = raw ? JSON.parse(raw) : null;
    if(!state){ alert('Salve a config primeiro para criar estado.'); return; }
    const id = Date.now();
    const cost = {};
    if(gems>0) cost.gems = gems;
    if(coins>0) cost.coins = coins;
    state.rewards.push({id, name, cost, stock});
    localStorage.setItem(KEY, JSON.stringify(state));
    alert('Recompensa adicionada — recarregue a página de Rewards para ver');
  });
});
