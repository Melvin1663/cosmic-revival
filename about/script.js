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