document.querySelectorAll('button').forEach((button) => {
  const div = document.createElement('div');
  const span = button.querySelector('span');
  
  let colorWhite = true;
  
  gsap.to(button, {
    '--alternative-gradient-opacity': .25,
    yoyo: true,
    repeat: -1,
    duration: 5,
    repeatDelay: 10
  });
  
  const animateSVG = () => {
    const svg = createSvg(colorWhite ? 'white' : 'black');
    colorWhite = !colorWhite;
    div.appendChild(svg);
    
    gsap.to(svg, {
      opacity: gsap.utils.random(.5, .65),
    });
    
    gsap.set(svg, {
      left: gsap.utils.random('25%', '100%'),
      top: gsap.utils.random('25%', '100%'),
    });

    gsap.to(svg, {
      x: '-200%',
      y: '-200%',
      duration: gsap.utils.random(14, 20),
      onComplete: () => {
        svg.remove();
      }
    });
  };

  window.setInterval(() => {
    animateSVG();
  }, 1000);

  button.appendChild(div);
  
  button.addEventListener('click', () => {
    gsap.to(button, {
      keyframes: [{
        scale: .97,
        duration: .1
      }, {
        scale: 1,
        duration: .6,
        ease: 'elastic(.6, 1)'
      }]
    });
    gsap.to(span, {
      '--button-glow-1-scale': '1.2',
      '--button-glow-1-blur': '12px',
      duration: .8,
      clearProps: true
    });
    gsap.to(span, {
      keyframes: [{
        '--button-glow-1-opacity': '.8',
        duration: .15
      }, {
        '--button-glow-1-opacity': '0',
        duration: .3,
        delay: .3
      }]
    });
    gsap.to(span, {
      '--button-glow-2-scale': '1.2',
      '--button-glow-2-blur': '10px',
      duration: .6,
      delay: .1,
      clearProps: true
    });
    gsap.to(span, {
      keyframes: [{
        '--button-glow-2-opacity': '.8',
        duration: .15,
        delay: .1
      }, {
        '--button-glow-2-opacity': '0',
        duration: .15,
        delay: .3
      }]
    });
  });
});

const createSvg = (fillColor) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", "0 0 147 60");
  svg.setAttribute("fill", "none");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("preserveAspectRatio", "none");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M146.5 2.00038C120 -1 104 6.00038 73.75 30.0004C43.5 54.0004 19.5 60.5004 1 58.0004");
  path.setAttribute("stroke", fillColor);
  path.setAttribute("stroke-width", "2");

  svg.appendChild(path);

  return svg;
};
