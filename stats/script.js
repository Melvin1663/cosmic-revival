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

const nextSunday = (today) => {
  let date = today ? today : new Date()
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
}

const lastSunday = (today) => {
  let ns = nextSunday();
  return new Date(ns.getFullYear(), ns.getMonth(), ns.getDate() - 7);
}

function getLastSunday() {
  const now = new Date(new Date().toLocaleDateString('en-US', { timeZone: 'Europe/London' })); // Get current date and time
  const dayOfWeek = now.getUTCDay(); // Get day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

  // Calculate the number of milliseconds in a day
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  
  // Calculate the number of milliseconds to subtract to get to the last Sunday
  const millisecondsToLastSunday = (dayOfWeek + 1) * millisecondsInADay;
  
  // Calculate the timestamp of the first moment of the last occurring Sunday
  const lastSundayTimestamp = now.getTime() - millisecondsToLastSunday;
  
  return lastSundayTimestamp;
}

fetch('https://api.ngmc.co/v1/guilds/cosmic?withOnline=false').then(r => r.json().then(r => {
  if (r) {
    let playerList = [...r.officers, ...r.members, r.leader];
    nextSunday().getTime();
    fetch('https://api.ngmc.co/v1/players/stats/bulk', {
      headers: {
        'Content-Type': "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        periodStart: ~~(getLastSunday() / 1000),
        periodEnd: ~~((getLastSunday() + 3600000) / 1000),
        names: playerList
      })
    }).then(s => s.json().then(s => {
      console.log(s)
    }))
  }
}))