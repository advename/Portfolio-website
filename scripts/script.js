/* ==========================================================================
   General
   ========================================================================== */
//*** Variables
const circles = document.querySelectorAll(".circles"); //background circles
let vh, vw, centerX, centerY, sectionCheckInterval, circleMaxW, circleTL;
let sectionActive = "hero"; //on page load, hero section is the first visible one
let previousSection = "hero";
let additioner = 0;
let allowCircleAnimation = true;
let isMobile = false; //used to define if on mobile devices or not
let mouseX = 400;
let mouseY = 0;

//*** Hero
const heroTitle = document.querySelector("#hero .title");
const heroImg = document.querySelector("#hero .title-image");

//*** Intro
const introWrapper = document.querySelector("#intro .wrapper");
const introHeadlineDOM = document.querySelector("#intro .headline h2");
const introWhiteBar = document.querySelector("#intro .white-bar-headline");
let introHeadline;
let introActivated = false;

//*** Technology
const techWrapper = document.querySelector("#tech .wrapper");
const techLineDOM = document.querySelector("#tech .animation .line");

const techTemplate = document.querySelector("#tech-template").content;
const techContainer = document.querySelector("#tech .slider .container");

let techStartX,
  techDistance,
  techCirclesTL,
  techSliderData,
  techContainerWidth,
  techEditorLines,
  techEditorCodeTL;
let techEditorLinesWidth = [];

// how far compared to screen size to travel
// mouseX, centerX, techMousemove, techSliderPos, techContainerWidth;

//*** Portfolio

//*** Contact

/* ==========================================================================
   Initilaize
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => setTimeout(init, 10));
function init() {
  //Check if mobile or tablet (tablet landscape is 1024px)
  isMobile = window.matchMedia("(max-width: 992px)").matches ? true : false;
  console.log("Is it mobile/tablet: " + isMobile);

  //Get window height and width -> viewport height and width
  vh = window.innerHeight;
  vw = window.innerWidth;

  //Get center of vh and vw
  centerX = vw / 2;
  centerY = vh / 2;

  //Add mousemovement eventlistener
  document.addEventListener("mousemove", mouseAnimations);
  document.addEventListener("mousemove", mouseAnimations);

  /**For the circles animation, main window is limited to 1200px
   * So if vw is above 1200px, set it to 1200px
   */
  circleMaxW = vw < 1200 ? vw : 1200;

  //Check each 500ms which section is currently displayed
  sectionCheckInterval = setInterval(() => {
    sectionCheck();
  }, 100);

  // Make GSAP Timeline
  circleTL = new TimelineMax();
  techCirclesTL = new TimelineMax({ repeat: -1, repeatDelay: 0 });

  //Set intro Headline position from top
  introHeadline = introHeadlineDOM.getBoundingClientRect();

  //Place circles in hero section
  heroCirclesCordinates();

  //Populate Tech data and display
  techSetSlideData();
  techDisplayData(); //call twice for smooth slider repeat
  techDisplayData(); //call twice for smooth slider repeat

  //Tech container width for slider repeat
  techContainerWidth = techContainer.scrollWidth;
  techContainer.style.left = -(techContainerWidth / 2) + "px"; //position slider in center
  console.log(techContainerWidth);

  //Tech Code Editor animation setup
  techEditorLines = document.querySelectorAll(
    "#tech .code-editor svg [id*='editor-lines']"
  );
  techCodeEditorSetup();
  techCodeEditorAnimation();
}

function test() {
  test2 = () => {
    console.log("hello");
  };
}

// Mouse movement handler
function mouseAnimations(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  heroMouseAnimation(e);
}

/* ==========================================================================
   Section check and circles repositioning
   ========================================================================== */

//Check based on scrolling which section is currently active and apply relative functions
function sectionCheck() {
  const buffer = 70; // In percentage, reposition earlier related of screen height
  const repositionSooner = (buffer / 100) * vh; //in px, do it earlier

  //Scrollposition from top
  const top =
    (window.pageYOffset || document.documentElement.scrollTop) -
    (document.documentElement.clientTop || 0);

  //Check current position
  if (top <= vh - repositionSooner) {
    //hero
    sectionActive = "hero";
    heroCirclesCordinates();
  } else if (top > vh - repositionSooner && top <= vh * 2 - repositionSooner) {
    //intro
    sectionActive = "intro";
    introCirclesCordinates();

    //Run these only once
    if (!introActivated) {
      console.log(introHeadline);
      introHeadlineWhiteBarPosition();
      introHeadlineWhiteBarAnimation();
      introActivated = !introActivated;
    }
  } else if (
    top > vh * 2 - repositionSooner &&
    top <= vh * 3 - repositionSooner
  ) {
    //tech
    sectionActive = "tech";
    techCirclesCoordinates();
  } else if (
    top > vh * 3 - repositionSooner &&
    top <= vh * 4 - repositionSooner
  ) {
    //portfolio
    sectionActive = "port";
  } else if (top > vh * 4 - repositionSooner) {
    //contact
    sectionActive = "contact";
  }

  //Allow circle animation or not -> run animation only once
  if (previousSection === sectionActive) {
    allowCircleAnimation = false;
  } else {
    allowCircleAnimation = true;
    previousSection = sectionActive;
  }
}

//Reposition Circles in px
function repositionCircles(cord) {
  //Set additioner based on active section (vh * additioner)
  additioner = {
    hero: 0,
    intro: 1,
    tech: 2,
    port: 3,
    contact: 4
  }[sectionActive];

  //Run animation only once for each section change
  if (allowCircleAnimation === true) {
    //Update each circle with their coordinates and fire gsap

    const duration = 1.3;
    techCirclesTL.pause(0); //pause tech-circles
    circleTL.clear(); //clear previous timeline

    //New timeline
    circleTL
      .to(
        circles[0],
        duration,
        {
          left: cord[0].x,
          top: cord[0].y,
          width: cord[0].size,
          height: cord[0].size
        },
        0
      )
      .to(
        circles[1],
        duration,
        {
          left: cord[1].x,
          top: cord[1].y,
          width: cord[1].size,
          height: cord[1].size
        },
        0
      )
      .to(
        circles[2],
        duration,
        {
          left: cord[2].x,
          top: cord[2].y,
          width: cord[2].size,
          height: cord[2].size
        },
        0
      )
      .to(
        circles[3],
        duration,
        {
          left: cord[3].x,
          top: cord[3].y,
          width: cord[3].size,
          height: cord[3].size,
          onComplete: function() {
            //If tech section, add another TimeLine for line-bar
            if (sectionActive === "tech") {
              techCirclesAnimation();
              techCirclesTL.play();
            }
          }
        },
        0
      );

    allowCircleAnimation = false;
    console.log("Run circle animation");
  }
}

//Calculate x for circles
function calcX(x) {
  x = x > 1200 ? 1200 : x;
  return (x / 100) * circleMaxW + "px";
}

//Calculate y for circles
function calcY(y) {
  let temp = (y / 100) * vh + vh * additioner;
  return temp + "px";
}

//Calculate size for circles
function size(s) {
  return s + "px";
}

/* ==========================================================================
   Hero
   ========================================================================== */

//Hero Title and Image animation on mouse moving
function heroMouseAnimation(e) {
  const buffer = 20; // how far compared to screen size to travel
  const delay = 0.1; // delay of smoothnes

  //Reposition title
  const titleX = mouseX / buffer;
  const titleY = (centerY - mouseY) / buffer;
  TweenMax.to(heroTitle, delay, { x: titleX, y: titleY });

  //Reposition hero image
  const imgX = (centerX - mouseX) / buffer;
  const imgY = mouseY / buffer;
  TweenMax.to(heroImg, delay, { x: imgX, y: imgY });
}

//Update circles position to hero
function heroCirclesCordinates() {
  // x and y are percentage og main element -> max 1200px width and height 100vh
  const cord = [
    {
      size: size(20),
      x: calcX(40),
      y: calcY(20)
    },
    {
      size: size(40),
      x: calcX(20),
      y: calcY(30)
    },
    {
      size: size(20),
      x: calcX(90),
      y: calcY(50)
    },
    {
      size: size(55),
      x: calcX(30),
      y: calcY(70)
    }
  ];
  repositionCircles(cord);
}

/* ==========================================================================
   Intro
   ========================================================================== */
//Update circles position to hero
function introCirclesCordinates() {
  // x and y are percentage og main element -> max 1200px width and height 100vh
  const cord = [
    {
      size: size(50),
      x: calcX(20),
      y: calcY(90)
    },
    {
      size: size(10),
      x: calcX(20),
      y: calcY(30)
    },
    {
      size: size(40),
      x: calcX(10),
      y: calcY(20)
    },
    {
      size: size(25),
      x: calcX(90),
      y: calcY(30)
    }
  ];

  repositionCircles(cord);
}

function introHeadlineWhiteBarPosition() {
  //Calculate position and height for the white bar and apply them
  const fontSize = parseFloat(
    window
      .getComputedStyle(introHeadlineDOM, null)
      .getPropertyValue("font-size")
  ); //Credits: https://stackoverflow.com/a/15195345
  const height = fontSize * 4;

  //Set position from top
  let posX = introHeadline.height - (height / 2 + introWrapper.offsetTop);
  introWhiteBar.style.top = posX + "px";

  //Set height
  introWhiteBar.style.height = height + "px";
}

function introHeadlineWhiteBarAnimation() {
  //Set width
  let moveTo = introWrapper.offsetLeft + introHeadline.width + 100;

  let tl = new TimelineMax();
  const duration = 1;

  tl.to(introWhiteBar, duration, { width: moveTo + "px" })
    .to(introHeadlineDOM, 0.1, { opacity: 1 })
    .to(introWhiteBar, duration, {
      width: "0vw"
    });
}

/* ==========================================================================
   Technologies
   ========================================================================== */

//Update circles position to tech
function techCirclesCoordinates() {
  const circleSize = "20px";

  //Get the position of the line and where to place the circles
  let techLine = techLineDOM.getBoundingClientRect();
  let posY = techLine.top + window.scrollY - 10 + "px";
  let startX = techLine.left + "px";
  techStartX = startX;
  let stopX = techLine.right + "px";
  let distance = techLine.right - techLine.left - 10;
  techDistance = distance > 720 ? "690px" : distance + "px"; //distance

  const cord = [
    {
      size: circleSize,
      x: startX,
      y: posY
    },
    {
      size: circleSize,
      x: startX,
      y: posY
    },
    {
      size: circleSize,
      x: startX,
      y: posY
    },
    {
      size: circleSize,
      x: startX,
      y: posY
    }
  ];
  repositionCircles(cord);
}

// Animate circles between Code Editor and Device
function techCirclesAnimation() {
  const duration = 1.3;

  techCirclesTL
    .fromTo(circles[0], duration, { x: 0 }, { x: techDistance })
    .fromTo(
      circles[1],
      duration,
      { x: 0, delay: duration },
      { x: techDistance, ease: Power0.easeNone }
    )
    .fromTo(
      circles[2],
      duration,
      { x: 0, delay: duration },
      { x: techDistance, ease: Power0.easeNone }
    )
    .fromTo(
      circles[3],
      duration,
      { x: 0, delay: duration },
      {
        x: techDistance,
        ease: Power0.easeNone,
        onComplete: function() {
          techCirclesActive = false;
        }
      }
    );
}

function techSetSlideData() {
  techSliderData = [
    {
      title: "NodeJS",
      img: "nodejs.svg"
    },
    {
      title: "After Effects",
      img: "after-effects.svg"
    },
    {
      title: "Chart.js",
      img: "chart.js.svg"
    },
    {
      title: "CSS",
      img: "css.svg"
    },
    {
      title: "Dynamic Data",
      img: "dynamic-data.svg"
    },
    {
      title: "GreenSock",
      img: "greensock.svg"
    },
    {
      title: "Hammer.JS",
      img: "hammerjs.svg"
    },
    {
      title: "HTML",
      img: "html.svg"
    },
    {
      title: "Illustrator",
      img: "illustrator.svg"
    },
    {
      title: "JPG",
      img: "jpg.svg"
    },
    {
      title: "JavaScript",
      img: "js.svg"
    },
    {
      title: "JSON",
      img: "json.svg"
    },
    {
      title: "MP4",
      img: "mp4.svg"
    },
    {
      title: "Photoshop",
      img: "photoshop.svg"
    },
    {
      title: "PNG",
      img: "png.svg"
    },
    {
      title: "Premiere Pro",
      img: "premiere-pro.svg"
    },
    {
      title: "React",
      img: "react.svg"
    },
    {
      title: "SASS",
      img: "sass.svg"
    },
    {
      title: "SEO",
      img: "seo.svg"
    },
    {
      title: "WordPress",
      img: "wordpress.svg"
    },
    {
      title: "Adobe XD",
      img: "xd.svg"
    }
  ];
}

function techDisplayData() {
  techSliderData.forEach(item => {
    let clone = techTemplate.cloneNode(true);
    clone
      .querySelector("img")
      .setAttribute("src", "assets/icons/technologies/" + item.img);
    clone.querySelector("p").textContent = item.title;

    techContainer.appendChild(clone);
  });
}

function techCodeEditorSetup() {
  techEditorCodeTL = new TimelineMax({ repeat: -1, repeatDelay: 1 });
  techEditorLines.forEach(line => {
    let temp = line.getAttribute("width") + "px";
    techEditorLinesWidth.push(temp);
  });
  techEditorLinesWidth;
}

function techCodeEditorAnimation() {
  const duration = 0.7;
  const easeProcess = SteppedEase.config(5);

  techEditorCodeTL
    .fromTo(
      techEditorLines[10],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[10],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[9],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[9],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[8],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[8],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[7],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[7],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[6],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[6],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[5],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[5],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[4],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[4],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[3],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[3],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[2],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[2],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[1],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[1],
        ease: easeProcess
      }
    )
    .fromTo(
      techEditorLines[0],
      duration,
      { width: 0 },
      {
        width: techEditorLinesWidth[0],
        ease: easeProcess
      }
    );
}
