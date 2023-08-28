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

const getLastSunday = () => {
  const now = new Date(new Date().toLocaleDateString('en-US', { timeZone: 'Europe/London' })); // Get current date and time
  return (now.getTime() - ((now.getUTCDay() + 1) * 86400000)) - (now.getTimezoneOffset() * 60000);
}

const table = document.getElementsByClassName('table')[0];

function sortTable(column) {
  var rows, switching, i, x, y, shouldSwitch;
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) < Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

fetch('https://api.ngmc.co/v1/guilds/cosmic?withOnline=false&expand=true&withStats=true').then(r => r.json().then(res => {
  if (res) {
    let playerList = [...res.officers.map(e => e.name), ...res.members.map(e => e.name), res.leader.name];
    let playerXUID = {
      [res.leader.xuid]: res.leader
    };
    for (i in res.officers) playerXUID[res.officers[i].xuid] = res.officers[i];
    for (i in res.members) playerXUID[res.members[i].xuid] = res.members[i];

    fetch('https://api.ngmc.co/v1/players/stats/bulk', {
      headers: {
        'Content-Type': "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        periodStart: ~~(getLastSunday() / 1000),
        hour: 0,
        periodEnd: ~~((getLastSunday() + 3600000) / 1000),
        names: playerList
      })
    }).then(s => s.json().then(s => {
      document.getElementById('loading').remove();
      table.style.display = 'table';
      document.getElementById('remember').style.display = 'block';

      let counter = 0;

      for (i in s) {
        let row = document.createElement('tr');
        let timestamp = Object.keys(s[i])[0];
        let fields = {
          player: {
            name: playerXUID[i].name,
            avatar: playerXUID[i].avatar
          },
          'wins.total': playerXUID[i].wins - s[i][timestamp].wins.total,
          'wins.bw': playerXUID[i].winsData.BW - s[i][timestamp].wins.bw,
          'wins.sw': playerXUID[i].winsData.SW - s[i][timestamp].wins.sw,
          'wins.tb': playerXUID[i].winsData.TB - s[i][timestamp].wins.tb,
          'wins.cq': playerXUID[i].winsData.CQ - s[i][timestamp].wins.cq,
        }
        for (f in fields) {
          let child = document.createElement('td');

          if (f == 'player') {
            let p = document.createElement('p');
            let img = document.createElement('img')
            img.src = fields[f].avatar;
            img.className = 'childrowhead';
            p.innerHTML = fields[f].name;
            p.className = 'childrowsname';
            child.append(img, p);
          } else child.innerHTML = fields[f];

          row.appendChild(child);
        }

        row.className = 'childrows';
        table.appendChild(row);

        counter++;

        if (counter == Object.keys(s).length) {
          sortTable(1);
          console.log('oanshul is bald')
        }
      }
    }))
  }
}))