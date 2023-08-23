const r = document.querySelector(':root');
const rs = getComputedStyle(r);
const body = document.querySelector("body");
const dots = [];

for (let i = 0; i < 100; i++) {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  dot.style.left = `${Math.random() * 100}vw`;
  dot.style.top = `${Math.random() * 100}vh`;
  body.appendChild(dot);
  dots.push(dot);
}

const navToggle = document.getElementById('nav-toggle');
const navList = document.getElementsByClassName('nav-list')[0];

navToggle.addEventListener('click', () => {
  let a = rs.getPropertyValue('--navdropped') || '0';
  if (+a) {
    navList.style.top = "-160px";
    r.style.setProperty('--navdropped', '0');
  } else {
    navList.style.top = "50px";
    r.style.setProperty('--navdropped', '1');
  }
});

document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  dots.forEach((dot) => {
    const xOffset = mouseX / 50;
    const yOffset = mouseY / 50;

    dot.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
  });
});

const stats = {
  motd: document.getElementById('guildmotd'),
  level: document.getElementById('guildlvl'),
  xp: document.getElementById('guildxp'),
  xpToNextLevel: document.getElementById('guildxptonlvl'),
  position: document.getElementById('guildpos'),
  tag: document.getElementById('guildtag'),
  '!leader': document.getElementById('guildleader'),
  '!officers': document.getElementById('guildofficers'),
  '!members': document.getElementById('guildmembers')
}

fetch('https://api.ngmc.co/v1/guilds/cosmic?expand=true&withOnline=false').then(r => r.json().then(r => {
  for (f in stats) {
    const i = stats[f];
    if (r[f] && i) {
      if (f == 'position') r[f] = `#${r[f].toLocaleString()}`;
      if (f == 'xpToNextLevel') r[f] = `${r[f].toLocaleString()} XP`;
      if (f == 'tag') i.style.color = r.tagColor;
      i.innerHTML = typeof r[f] == 'number' ? r[f].toLocaleString() : r[f];
    } else if (f.startsWith('!')) {
      const field = f.slice(1);
      const parent = document.getElementById(`guild${field}card`);
      if (r[field]) {
        if (field == 'leader') {
          i.innerHTML = r[field].name
          document.getElementById('guildleaderpfp').src = r[field].avatar;
        } else {
          i.innerHTML = '';
          r[field].forEach(p => {
            const headpfp = document.createElement('img');
            headpfp.src = p.avatar;
            headpfp.style.marginRight = '5px';
            headpfp.className = 'headpfp';

            const name = document.createElement('h3');
            name.innerHTML = p.name;
            name.className = 'cardvalue';
            name.style.verticalAlign = 'top';

            const br = document.createElement('br');

            parent.style.textAlign = 'left';

            i.append(headpfp, name, br);
          })
        }
      }
    } else if (i) i.innerHTML = 'N/A';
  }
}))