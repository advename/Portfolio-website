/* ==========================================================================
   General
   ========================================================================== */
//*** Variables
const html = document.querySelector("html");
const body = document.querySelector("body");
const circles = document.querySelectorAll(".circles"); //background circles
let vh, vw, centerX, centerY, circleMaxW, circleTL;
let sectionActive = 0; //on page load, hero section is the first visible one
let allowCircleAnimation = true;
let isMobile = false; //used to define if on mobile devices or not
let mouseX = 0;
let mouseY = 0;
let scrollDir;
let smoothScrollToInUse = false;
let scrollTo = 0;
const sections = ["hero", "intro", "tech", "port", "contact"];

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
const techBox = document.querySelector("#tech .slider .box");

let techStartX,
  techDistance,
  techCirclesTL,
  techSliderData,
  techContainerWidth,
  techEditorLines,
  techEditorCodeTL,
  techSliderItem;
let techEditorLinesWidth = [];
let techSliderActivated = false;

//*** Portfolio
const port = document.querySelector("#port");
const portContainer = document.querySelector("#port .container");
const portWrapper = document.querySelector("#port .wrapper");
const portTemplate = document.querySelector("#port-template").content;
const portPageCountCurrent = document.querySelector(
  "#port .pagecount .current"
);
const portPageCountOutOf = document.querySelector("#port .pagecount .out-of");
const portScrollbar = document.querySelector("#port .scrollbar");

let portOffSetTop, portWorkMarginRight, portContainerLeft, portData, portWork;
let portAllowScroll = true;
let portAllowSlider = false;
let portSliderAnimationActive = false;
let portCurrentPage = 1;

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
  /*
  if (isMobile) {
    vw = window.screen.width;
    vh = window.screen.height;
  } else {
    vh = window.innerHeight;
    vw = window.innerWidth;
  }
*/
  //Get center of vh and vw
  centerX = vw / 2;
  centerY = vh / 2;

  //Add mousemovement eventlistener for Hero
  document.addEventListener("mousemove", mouseAnimations);
  document.addEventListener("mousemove", mouseAnimations);

  //Eventlistener for scroll events mobile and desktop
  window.addEventListener("wheel", scrollHandler);
  let mc = new Hammer(window); //HammerJS and enable all directions
  mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
  mc.on("pan", scrollHandler);

  /**For the circles animation, main window is limited to 1200px
   * So if vw is above 1200px, set it to 1200px
   */
  circleMaxW = vw < 1200 ? vw : 1200;

  console.log(vh);
  console.log(vw);

  //Get the latest active sessions on page reload
  if (sessionStorage.getItem("sectionActive")) {
    sectionActive = sessionStorage.getItem("sectionActive");
  }

  // Make GSAP Timeline
  circleTL = new TimelineMax();
  techCirclesTL = new TimelineMax({ repeat: -1, repeatDelay: 0 });

  //Set intro Headline position from top
  introHeadline = introHeadlineDOM.getBoundingClientRect();

  //Place circles in hero section

  //Populate Tech data and display
  techSetSlideData();
  techDisplayData(); //call twice for smooth slider repeat
  techDisplayData(); //call twice for smooth slider repeat

  //Tech container width for slider repeat
  techContainerWidth = techContainer.scrollWidth;

  //Get last item to calculate moveTo in slider animation
  techSliderItem = document.querySelector(
    "#tech .slider .container .item:last-of-type"
  );

  //Activate animation
  techSliderAnimation();

  //Tech Code Editor animation setup
  techEditorLines = document.querySelectorAll(
    "#tech .code-editor svg [id*='editor-lines']"
  );
  techCodeEditorSetup();
  techCodeEditorAnimation();

  //Port Data setup for template
  portDataSetup();

  //Display work from data and template
  portDisplayWork();

  //Finally apply secton
  smoothScrollTo();
}

// Mouse movement handler
function mouseAnimations(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  heroMouseAnimation(e);
}

function scrollHandler(e) {
  console.log("Scrolling");
  if (e.deltaY > 0) {
    //scrolling down
    scrollDir = "down";
  } else if (e.deltaY < 0) {
    //scrolling up
    scrollDir = "up";
  }

  smoothScrollTo(e);
}

function smoothScrollTo(e) {
  if (portAllowScroll) {
    if (!smoothScrollToInUse) {
      smoothScrollToInUse = true;
      sectionsHandler();
      TweenLite.to(window, 0.7, {
        scrollTo: scrollTo,
        onComplete: function() {
          smoothScrollToInUse = false;
          if (sectionActive === 3) {
            portAllowScroll = false;
          }
        }
      });
    }
  } else {
    portSliderMove(e);
  }
}

/* ==========================================================================
   Section check and circles repositioning
   ========================================================================== */

function sectionsHandler() {
  // Save data to sessionStorage

  if (scrollDir === "up") {
    if (sectionActive > 0) {
      --sectionActive;
    }
  } else if (scrollDir === "down") {
    if (sectionActive < sections.length - 1) {
      ++sectionActive;
    }
  }

  sessionStorage.setItem("sectionActive", sectionActive);

  console.log(sectionActive);

  let runF = {
    0: function() {
      //hero
      scrollTo = 0;
      heroCirclesCordinates();
    },
    1: function() {
      //intro
      scrollTo = sectionActive * vh;
      introCirclesCordinates();
      //Run these only once
      if (!introActivated) {
        console.log(introHeadline);
        introHeadlineWhiteBarPosition();
        introHeadlineWhiteBarAnimation();
        introActivated = !introActivated;
      }
    },
    2: function() {
      //tech
      scrollTo = sectionActive * vh;

      //tech
      techCirclesCoordinates();
      portContainer.style.left = "0px";
      portCurrentPage = 1;
    },
    3: function() {
      scrollTo = sectionActive * vh;
      portCirclesCoordinates();
      //port
    },
    4: function() {
      scrollTo = sectionActive * vh;
      contactCirclesCoordinates();
      //contact
      portContainer.style.left = portMoveDistance - portContainerWidth + "px";
      portCurrentPage = portData.length;
    }
  };

  runF[sectionActive]();
}

//Check based on scrolling which section is currently active and apply relative functions
function sectionCheck() {}

//Reposition Circles in px
function repositionCircles(cord) {
  //Set additioner based on active section (vh * additioner)

  //Run animation only once for each section change
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
          if (sectionActive === 2) {
            techCirclesAnimation();
            techCirclesTL.play();
          }
        }
      },
      0
    );

  console.log("Run circle animation");
}

//Calculate x for circles
function calcX(x) {
  x = x > 1200 ? 1200 : x;
  return (x / 100) * circleMaxW + "px";
}

//Calculate y for circles
function calcY(y) {
  let temp = (y / 100) * vh + vh * sectionActive;
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

// Add each Code Editor lines width to an array
function techCodeEditorSetup() {
  techEditorCodeTL = new TimelineMax({ repeat: -1, repeatDelay: 1 });
  techEditorLines.forEach(line => {
    let temp = line.getAttribute("width") + "px";
    techEditorLinesWidth.push(temp);
  });
  techEditorLinesWidth;
}

// Animate width of each line in the Code Editor from 0px to initial width
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

// Use this json file to populate the items in the slideshow
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

// Display the data from the previous JSON in the DOM
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

// Animate the slider by smooth infinite scrolling
function techSliderAnimation() {
  const duration = 30;
  //Move to half of whole width - minues last item to prevent a "jump"
  const moveTo =
    -techContainerWidth / 2 - techSliderItem.getBoundingClientRect().width;
  console.log(moveTo);
  if (!techSliderActivated) {
    //apply animation
    const tm = new TweenMax.fromTo(
      techContainer,
      duration,
      { left: 0, ease: Power0.easeNone },
      {
        left: moveTo + "px",
        ease: Power0.easeNone,
        repeat: -1,
        repeatDelay: 0
      }
    );
  } else {
    //only apply once
  }
}

/* ==========================================================================
   Portfolio
   ========================================================================== */

//Update circles position to portfolio
function portCirclesCoordinates() {
  // x and y are percentage og main element -> max 1200px width and height 100vh
  const cord = [
    {
      size: size(10),
      x: calcX(50),
      y: calcY(10)
    },
    {
      size: size(10),
      x: calcX(80),
      y: calcY(80)
    },
    {
      size: size(10),
      x: calcX(30),
      y: calcY(70)
    },
    {
      size: size(23),
      x: calcX(10),
      y: calcY(30)
    }
  ];
  repositionCircles(cord);
}

// initialize data to be used for portfolio
function portDataSetup() {
  portData = [
    {
      title: "Amélie Niel",
      underTitle: "French Artist",
      img: "amelie-niel.png",
      desc:
        "Redesign and implementation of a webshop for a girl who loves handcraft.",
      linkDesc: "Website",
      linkURL: "\\#"
    },
    {
      title: "Jessica Niel",
      underTitle: "French Artist",
      img: "amelie-niel.png",
      desc:
        "Redesign and implementation of a webshop for a girl who loves handcraft.",
      linkDesc: "Website",
      linkURL: "\\#"
    }
  ];
}

function portDisplayWork() {
  portData.forEach(work => {
    let clone = portTemplate.cloneNode(true);

    clone.querySelector(".title h2").textContent = work.title;
    clone.querySelector(".title p").textContent = work.underTitle;
    clone
      .querySelector(".image img")
      .setAttribute("src", "assets/img/portfolio/" + work.img);
    clone.querySelector(".description p").textContent = work.desc;

    if (!work.linkURL == "") {
      clone.querySelector(".call-to-action a").textContent = work.linkDesc;
      clone
        .querySelector(".call-to-action a")
        .setAttribute("href", work.linkURL);
    } else {
      clone.querySelector(".call-to-action a").style.display = "none";
    }

    portContainer.appendChild(clone);
  });

  portSliderSetup();
}

//Enable disable scrolling in order to keep portfolio position
function portToggleAllowScroll(status) {
  portAllowScroll = status;
}

//Enable disable slider in order to keep portfolio position
function portToggleAllowSlider(status) {
  portAllowSlider = status;
}

//Initialize variables for portSliderUse
function portSliderSetup() {
  portWork = document.querySelector("#port .wrapper .work:first-of-type");
  portContainer.style.left = "0px";

  portOffSetTop = port.offsetTop;
  portWorkMarginRight = parseFloat(
    window.getComputedStyle(portWork, null).getPropertyValue("margin-right")
  ); //get work element margin right

  portContainerWidth = portContainer.getBoundingClientRect().width;

  portMoveDistance = portContainerWidth / portData.length;

  portContainerLeft = portContainer.offsetLeft;

  portPageCountOutOf.textContent = portData.length + "";
}

//Handler to direct between right or left scroll
function portSliderMove(e) {
  if (scrollDir === "up") {
    //scrolling up -> go left

    portSliderSlideLeft(e);
  } else if (scrollDir === "down") {
    //scrolling down -> go right

    portSliderSlideRight();
  }
}

//Scrolled down, go right
function portSliderSlideRight() {
  portContainerLeft = portContainer.offsetLeft;
  const portLimitRight = portMoveDistance - portContainerWidth;
  const moveTo = portContainerLeft - portMoveDistance;
  console.log("Port info:" + portCurrentPage + " - " + portData.length);

  //Check if next page is allowed based on page and if an animation is occuring
  if (portCurrentPage < portData.length && !portSliderAnimationActive) {
    //Still not over the limit, move one more to left
    portSliderAnimationActive = true;

    TweenMax.to(portContainer, 1, {
      left: moveTo,
      onComplete: function() {
        portSliderAnimationActive = false;
      }
    });
    portCurrentPage++; // increase page number
    portUpdatePage();
    portUpdateScrollbar();
  } else if (portCurrentPage === portData.length) {
    //over the limit, dont move
    portToggleAllowScroll(true);
    portToggleAllowSlider(false);
  }
}

//Scrolled down, go left
function portSliderSlideLeft() {
  portContainerLeft = portContainer.offsetLeft;
  const portLimitLeft = 0;
  const moveTo = portContainerLeft + portMoveDistance;

  //Check if next page is allowed based on page and if an animation is occuring
  if (portCurrentPage > 1 && !portSliderAnimationActive) {
    //Still not over the limit, move to the right
    portSliderAnimationActive = true;

    TweenMax.to(portContainer, 1, {
      left: moveTo,
      onComplete: function() {
        portSliderAnimationActive = false;
      }
    });
    --portCurrentPage; //decrease current page number
    portUpdatePage();
    portUpdateScrollbar();
  } else if (portCurrentPage === 1) {
    //over the limit, dont move
    console.log("Over the limit");
    portToggleAllowScroll(true);
    portToggleAllowSlider(false);
  }
}

function portUpdatePage() {
  portPageCountCurrent.textContent = portCurrentPage + "";
}

function portUpdateScrollbar() {
  const barWidth = (portCurrentPage / portData.length) * 100 + "vw";
  console.log(barWidth);
  portScrollbar.style.width = barWidth;
}

/* ==========================================================================
   Contact
   ========================================================================== */

//Update circles position to portfolio
function contactCirclesCoordinates() {
  // x and y are percentage og main element -> max 1200px width and height 100vh
  const cord = [
    {
      size: size(10),
      x: calcX(20),
      y: calcY(40)
    },
    {
      size: size(40),
      x: calcX(10),
      y: calcY(70)
    },
    {
      size: size(10),
      x: calcX(30),
      y: calcY(10)
    },
    {
      size: size(23),
      x: calcX(90),
      y: calcY(30)
    }
  ];
  repositionCircles(cord);
}
