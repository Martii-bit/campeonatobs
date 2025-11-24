// auth.js - simple username-only login stored in localStorage under pcbs_wish_v1.user
document.addEventListener('DOMContentLoaded', ()=>{
  // create small floating login if no username
  const raw = localStorage.getItem('pcbs_wish_v1');
  const state = raw ? JSON.parse(raw) : null;
  const username = state?.user?.username;
  if(!username){
    const container = document.createElement('div');
    container.style.position='fixed';
    container.style.right='12px';
    container.style.bottom='12px';
    container.style.zIndex='9999';
    container.innerHTML = `<div style="background:rgba(2,6,23,0.9);padding:12px;border-radius:10px;color:white;box-shadow:0 6px 20px rgba(0,0,0,0.6)">
      <div style="font-weight:800;margin-bottom:6px">Login (username)</div>
      <input id="login-username" placeholder="username" style="padding:8px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:white"/><br/>
      <div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end">
        <button id="btn-login" style="background:linear-gradient(90deg,#00d4ff,#3b82f6);border:0;padding:8px 12px;border-radius:8px;font-weight:800;color:#02203b">Entrar</button>
        <button id="btn-close" style="background:transparent;border:1px solid rgba(255,255,255,0.06);padding:8px 12px;border-radius:8px;color:white">Fechar</button>
      </div>
    </div>`;
    document.body.appendChild(container);
    document.getElementById('btn-login').onclick = ()=>{
      const u = document.getElementById('login-username').value.trim();
      if(!u) return alert('Escreve o username');
      const s = state || { ...{
        coins:300,gems:40,betCost:20,matches:[],bets:[],rewards:[],leaderboard:[],user:{username:null}
      }};
      s.user = s.user || {};
      s.user.username = u;
      localStorage.setItem('pcbs_wish_v1', JSON.stringify(s));
      alert('Bem-vindo, ' + u + '! Recarrega a página para atualizar o perfil.');
    };
    document.getElementById('btn-close').onclick = ()=> container.style.display='none';
  } else {
    // nothing - user exists
  }
});
