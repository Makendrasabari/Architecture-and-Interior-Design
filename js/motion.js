/**
 * STACKLY Architecture & Interior Design Studio
 * Dynamic Motion Engine (GSAP 3 + ScrollTrigger)
 * Strict 6-Step Animation Sequence & Zero Layout Shift
 */

(function () {
  'use strict';

  // Helper: Detect prefers-reduced-motion
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Helper: Number Formatter & Parser
  function parseNumberFormat(rawStr) {
    const clean = rawStr.trim();
    // Pattern matches: [prefix][optional negative][number with decimals][suffix]
    // e.g. "$89.2M", "04", "94%", "-420 t", "L/680", "$4.85M"
    const match = clean.match(/^([^\d\-]*)(-?\d+(?:\.\d+)?)(.*)$/);
    if (!match) return null;

    const prefix = match[1] || '';
    const numStr = match[2] || '0';
    const suffix = match[3] || '';

    const targetVal = parseFloat(numStr);
    const hasDecimal = numStr.includes('.');
    const decimalPlaces = hasDecimal ? numStr.split('.')[1].length : 0;
    const hasLeadingZero = numStr.length >= 2 && numStr.startsWith('0') && !hasDecimal;
    const padLength = hasLeadingZero ? numStr.length : 0;

    return {
      prefix,
      targetVal,
      decimalPlaces,
      padLength,
      suffix,
      originalText: clean
    };
  }

  function formatNumberValue(val, meta) {
    let formattedNum = val.toFixed(meta.decimalPlaces);
    if (meta.padLength > 0) {
      formattedNum = formattedNum.padStart(meta.padLength, '0');
    }
    return meta.prefix + formattedNum + meta.suffix;
  }

  // Split text element into wrapped words/letters for stagger reveal
  function splitTextForReveal(element) {
    if (element.dataset.motionSplit === 'true') return;
    if (
      element.closest('.page-hero, .hero-section') ||
      element.classList.contains('page-hero-title') ||
      element.classList.contains('hero-title') ||
      element.querySelector('.hero-title-accent, .hero-title-main, span')
    ) {
      return;
    }
    element.dataset.motionSplit = 'true';

    const text = element.innerText;
    if (!text.trim()) return;

    const words = text.split(' ');
    element.innerHTML = '';

    words.forEach((word, wIdx) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'motion-word-wrap';
      const wordSpan = document.createElement('span');
      wordSpan.className = 'motion-word';
      wordSpan.textContent = word;
      wordWrap.appendChild(wordSpan);
      element.appendChild(wordWrap);

      if (wIdx < words.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }

  // Inject Vertical Rose/Red Accent Line into cards if not already present
  function prepareCardAccentLines(container) {
    const cards = (container || document).querySelectorAll(
      '.metric-card, .chart-card, .project-card, .report-dossier-card, .moodboard-card'
    );
    cards.forEach((card) => {
      // Ensure relative positioning
      const style = window.getComputedStyle(card);
      if (style.position === 'static') {
        card.style.position = 'relative';
      }
      if (!card.querySelector('.card-accent-line')) {
        const line = document.createElement('div');
        line.className = 'card-accent-line';
        card.prepend(line);
      }
    });
  }

  // 3-Card Grid Motion Engine
  // Sequence requested:
  // 1. Center card comes from bottom
  // 2. Left card comes from left & Right card comes from right
  // 3. Bold black words in titles come from right one by one into position
  // 4. Small sentence paragraph comes from bottom into position
  function animateThreeCardGrids(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    const grids = (scope || document).querySelectorAll(
      '.blog-grid, .projects-grid, .services-grid, .three-card-grid, [data-anim="3card-grid"]'
    );
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      if (
        grid.classList.contains('process-timeline') ||
        grid.closest('.process-section') ||
        grid.classList.contains('leadership-grid') ||
        grid.closest('.leadership-section') ||
        grid.classList.contains('services-grid') ||
        grid.closest('.services-section') ||
        grid.classList.contains('projects-grid') ||
        grid.closest('.projects-section')
      ) return;
      // Collect direct card elements
      const cards = Array.from(grid.children).filter(
        (el) => el.nodeType === 1 && !el.classList.contains('card-accent-line')
      );
      if (cards.length === 0) return;

      // Process cards in groups of 3
      for (let i = 0; i < cards.length; i += 3) {
        const rowCards = cards.slice(i, i + 3);
        if (rowCards.length < 3) {
          // Fallback for remainder cards (1 or 2 cards)
          rowCards.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 40 },
              { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
            );
          });
          continue;
        }

        const leftCard = rowCards[0];
        const centerCard = rowCards[1];
        const rightCard = rowCards[2];

        // Initial setup for cards
        gsap.set(centerCard, { opacity: 0, y: 70, x: 0 });
        gsap.set(leftCard, { opacity: 0, x: -90, y: 0 });
        gsap.set(rightCard, { opacity: 0, x: 90, y: 0 });

        // Initial setup for inner title text and description paragraph
        rowCards.forEach((card) => {
          const title = card.querySelector('h2, h3, h4, .blog-card-title, .card-title, .project-title');
          if (title) {
            splitTextForReveal(title);
            const words = title.querySelectorAll('.motion-word');
            if (words.length > 0) {
              gsap.set(words, { opacity: 0, x: 40 });
            } else {
              gsap.set(title, { opacity: 0, x: 40 });
            }
          }

          const desc = card.querySelector('p, .blog-card-excerpt, .card-desc, .project-desc');
          if (desc) {
            gsap.set(desc, { opacity: 0, y: 30 });
          }
        });

        // Use parent timeline if provided, else create isolated timeline
        const tl = parentTl || gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Center card comes from bottom first
        tl.to(
          centerCard,
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          parentTl ? 0.2 : 0
        );

        // 2. Left card comes from left & Right card comes from right
        tl.to(
          leftCard,
          { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
          parentTl ? 0.35 : 0.15
        );
        tl.to(
          rightCard,
          { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
          parentTl ? 0.35 : 0.15
        );

        // 3 & 4. Bold title words from right (one by one) & Small sentence paragraph from bottom
        rowCards.forEach((card, cardIdx) => {
          const title = card.querySelector('h2, h3, h4, .blog-card-title, .card-title, .project-title');
          const startTime = (parentTl ? 0.55 : 0.35) + cardIdx * 0.08;

          if (title) {
            const words = title.querySelectorAll('.motion-word');
            if (words.length > 0) {
              tl.to(
                words,
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.45,
                  stagger: 0.05,
                  ease: 'power2.out'
                },
                startTime
              );
            } else {
              tl.to(
                title,
                { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' },
                startTime
              );
            }
          }

          const desc = card.querySelector('p, .blog-card-excerpt, .card-desc, .project-desc');
          if (desc) {
            tl.to(
              desc,
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
              startTime + 0.15
            );
          }
        });
      }
    });
  }

  // Left-Content & Right-Image Split Section Motion Engine
  // Sequence requested:
  // 1. Heading text & content enter from the right with smooth slide-in + fade-in & progressive stagger (no bounce).
  // 2. Right-side image animates from bottom to top with a smooth upward slide + reveal + fade effect (clipped inside container).
  // 3. Heading animation starts first, followed shortly by image animation.
  function animateSplitImageSections(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    const sections = (scope || document).querySelectorAll(
      '.philosophy-grid, .split-image-section, [data-anim="split-image-section"]'
    );
    if (sections.length === 0) return;

    sections.forEach((sec) => {
      // Find left content container and right image container
      const children = Array.from(sec.children).filter((el) => el.nodeType === 1);
      if (children.length < 2) return;

      const leftContent = children[0];
      const rightImageWrapper = children[1];

      // Ensure right image wrapper is clipped inside container
      rightImageWrapper.style.overflow = 'hidden';

      // Collect text elements inside left content
      const textElements = Array.from(
        leftContent.querySelectorAll('.eyebrow, h1, h2, h3, h4, p, div, a, button, .philosophy-statement')
      ).filter((el) => el.offsetParent !== null || el.tagName.startsWith('H') || el.classList.contains('eyebrow'));

      const animTextList = textElements.length > 0 ? textElements : Array.from(leftContent.children);

      // Remove conflicting motion-word splits if any existed
      animTextList.forEach((el) => {
        if (el.dataset.motionSplit === 'true') {
          el.dataset.motionSplit = 'false';
          const origText = Array.from(el.querySelectorAll('.motion-word')).map(w => w.textContent).join(' ');
          if (origText) el.textContent = origText;
        }
      });

      // Initial States:
      // Left text elements enter from right side (x: 60px) toward final position
      gsap.set(animTextList, { opacity: 0, x: 60 });
      // Right image animates from bottom to top (y: 90px)
      gsap.set(rightImageWrapper, { opacity: 0, y: 90 });

      const imgEl = rightImageWrapper.querySelector('img');
      if (imgEl) {
        gsap.set(imgEl, { scale: 1.06, y: 30 });
      }

      const tl = parentTl || gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Heading text & content slide-in from right with smooth stagger
      tl.to(
        animTextList,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out'
        },
        parentTl ? 0.1 : 0
      );

      // 2. Right-side image animates from bottom to top shortly after heading animation starts
      tl.to(
        rightImageWrapper,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out'
        },
        parentTl ? 0.3 : 0.2
      );

      if (imgEl) {
        tl.to(
          imgEl,
          {
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out'
          },
          parentTl ? 0.3 : 0.2
        );
      }
    });
  }

  // Dedicated About Preview Section Motion Engine (index.html)
  // Sequence requested:
  // 1. Big image comes from left side diagonally (x: -80, y: -60 -> 0, 0)
  // 2. Downside small image comes from right side diagonally (x: 80, y: 60 -> 0, 0)
  // 3. Big letter black words (h2) come from right (x: 70 -> 0)
  // 4. Small letter words (eyebrow, p, stats, button) come from left (x: -60 -> 0)
  function animateAboutPreviewSection(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    const sections = (scope || document).querySelectorAll(
      '.about-preview-grid, .about-preview-section'
    );
    if (sections.length === 0) return;

    sections.forEach((sec) => {
      const mainImg = sec.querySelector('.about-image-main');
      const badge = sec.querySelector('.about-badge-studio');
      const floatingImg = sec.querySelector('.about-image-floating');
      const heading = sec.querySelector('.about-preview-text h2');
      const eyebrow = sec.querySelector('.about-preview-text .eyebrow');
      const paragraphs = Array.from(sec.querySelectorAll('.about-preview-text > p'));
      const statsGrid = sec.querySelector('.stats-grid');
      const ctaBtn = sec.querySelector('.about-preview-text .btn, .about-preview-text a.btn');

      if (!mainImg && !heading) return;

      // Ensure elements don't have text splitting or conflicting inline styles
      if (heading && heading.dataset.motionSplit === 'true') {
        heading.dataset.motionSplit = 'false';
        const origText = Array.from(heading.querySelectorAll('.motion-word')).map((w) => w.textContent).join(' ');
        if (origText) heading.textContent = origText;
      }

      // Initial States:
      // 1. Big image + badge: left side diagonally
      if (mainImg) {
        gsap.set(mainImg, { opacity: 0, x: -80, y: -60 });
      }
      if (badge) {
        gsap.set(badge, { opacity: 0, x: -60, y: -40 });
      }

      // 2. Downside small image: right side diagonally
      if (floatingImg) {
        gsap.set(floatingImg, { opacity: 0, x: 80, y: 60 });
      }

      // 3. Big letter black words: right
      if (heading) {
        gsap.set(heading, { opacity: 0, x: 70 });
      }

      // 4. Small letter words: left
      const smallTextElements = [eyebrow, ...paragraphs, statsGrid, ctaBtn].filter(Boolean);
      gsap.set(smallTextElements, { opacity: 0, x: -60 });

      // Build timeline
      const tl = parentTl || gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Step 1: Big image comes from left diagonally into position
      if (mainImg) {
        tl.to(
          mainImg,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: 'power3.out'
          },
          parentTl ? 0.05 : 0
        );
      }
      if (badge) {
        tl.to(
          badge,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.75,
            ease: 'power3.out'
          },
          parentTl ? 0.15 : 0.1
        );
      }

      // Step 2: Downside small image comes from right diagonally into position
      if (floatingImg) {
        tl.to(
          floatingImg,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: 'power3.out'
          },
          parentTl ? 0.25 : 0.2
        );
      }

      // Step 3: Big letter black words come from right into position
      if (heading) {
        tl.to(
          heading,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out'
          },
          parentTl ? 0.45 : 0.35
        );
      }

      // Step 4: Small letter words come from left into position
      if (smallTextElements.length > 0) {
        tl.to(
          smallTextElements,
          {
            opacity: 1,
            x: 0,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power3.out'
          },
          parentTl ? 0.6 : 0.5
        );
      }
    });
  }

  // Dedicated 6-Step Methodology Process Cards Motion Engine (index.html)
  // Sequence requested:
  // Card 1 -> Card 2 -> Card 3 -> Card 4 -> Card 5 -> Card 6 in sequential order
  function animateProcessSection(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let timelines = [];
    if (scope && scope.classList && scope.classList.contains('process-timeline')) {
      timelines = [scope];
    } else {
      timelines = Array.from((scope || document).querySelectorAll('.process-timeline'));
    }
    if (timelines.length === 0) return;

    timelines.forEach((timeline) => {
      const cards = Array.from(timeline.querySelectorAll('.process-step'));
      if (cards.length === 0) return;

      // Initial state: cards start displaced below with opacity 0
      gsap.set(cards, { opacity: 0, y: 55, scale: 0.95 });

      const tl = parentTl || gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Cards enter sequentially: 1 -> 2 -> 3 -> 4 -> 5 -> 6
      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.18, // Clean sequential stagger from card 1 to card 6
          ease: 'power3.out',
          clearProps: 'transform', // Clears inline transform so CSS hover translateY(-6px) operates freely
          onComplete: () => {
            cards.forEach((card) => {
              card.style.transform = '';
              card.style.opacity = '1';
            });
          }
        },
        parentTl ? 0.2 : 0
      );
    });
  }

  // Dedicated 4-Card Architectural Pillars Motion Engine (about.html)
  // Sequence requested:
  // 1. Center two cards (02 & 03) enter first (from bottom)
  // 2. Left card (01) enters from left side
  // 3. Right card (04) enters from right side
  function animatePillarsSection(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (scope && scope.classList && scope.classList.contains('pillars-grid')) {
      grids = [scope];
    } else {
      grids = Array.from((scope || document).querySelectorAll('.pillars-grid'));
    }
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll('.pillar-card'));
      if (cards.length < 4) return;

      const leftCard = cards[0];
      const centerCards = [cards[1], cards[2]];
      const rightCard = cards[3];

      // Initial state: center cards start displaced below, left card from left, right card from right
      gsap.set(centerCards, { opacity: 0, y: 70, scale: 0.95 });
      gsap.set(leftCard, { opacity: 0, x: -100, y: 0, scale: 1 });
      gsap.set(rightCard, { opacity: 0, x: 100, y: 0, scale: 1 });

      const tl = parentTl || gsap.timeline({ defaults: { ease: 'power3.out' } });
      const baseTime = parentTl ? 0.2 : 0;

      // 1. Center two cards enter first (from bottom)
      tl.to(
        centerCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform',
          onComplete: () => {
            centerCards.forEach((c) => {
              c.style.transform = '';
              c.style.opacity = '1';
            });
          }
        },
        baseTime
      );

      // 2. Left card comes from left
      tl.to(
        leftCard,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform',
          onComplete: () => {
            leftCard.style.transform = '';
            leftCard.style.opacity = '1';
          }
        },
        baseTime + 0.25
      );

      // 3. Right card comes from right
      tl.to(
        rightCard,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'transform',
          onComplete: () => {
            rightCard.style.transform = '';
            rightCard.style.opacity = '1';
          }
        },
        baseTime + 0.35
      );
    });
  }

  // Dedicated Three-Card Shuffle / Rearrangement Motion Engine
  // Applied across 3-card showcase sections:
  // - Services: Specialized Scope Across Typologies (.typologies-grid)
  // - About: International Atelier Network ([data-anim="3card-shuffle"])
  // - Blog: Architectural Documentaries & Films Series ([data-anim="3card-shuffle"])
  // - Blog: Atelier Monograph Series ([data-anim="3card-shuffle"])
  // - Contact: Direct Consultation Engagement Options ([data-anim="3card-shuffle"])
  // Sequence requested:
  // Initial displayed order: Card 1 -> Card 2 -> Card 3
  // Shuffle sequence:
  // 1. Card 1 temporarily moves to the position of Card 3
  // 2. Card 2 temporarily moves to the position of Card 1
  // 3. Card 3 temporarily moves to the position of Card 2
  // 4. Brief natural pause in the shuffled state
  // 5. Smoothly returns to original positions (Card 1 -> Card 2 -> Card 3)
  function animateThreeCardShuffle(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (
      scope &&
      scope.classList &&
      (scope.classList.contains('typologies-grid') ||
        scope.classList.contains('shuffle-grid') ||
        scope.classList.contains('three-card-shuffle-grid') ||
        (scope.dataset && scope.dataset.anim === '3card-shuffle'))
    ) {
      grids = [scope];
    } else {
      grids = Array.from(
        (scope || document).querySelectorAll(
          '.typologies-grid, .typologies-section .typologies-grid, [data-anim="3card-shuffle"], .three-card-shuffle-grid'
        )
      );
    }
    grids = grids.filter(
      (g) =>
        !g.closest('.consultation-options-section') &&
        !g.classList.contains('consultation-options-grid') &&
        (g.dataset ? g.dataset.anim !== 'consultation-diagonal-cards' : true)
    );
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.children).filter(
        (el) => el.nodeType === 1 && !el.classList.contains('card-accent-line')
      );
      if (cards.length < 3) return;

      const card1 = cards[0];
      const card2 = cards[1];
      const card3 = cards[2];

      function runShuffleSequence(tlInstance) {
        if (grid.dataset.shufflePlayed === 'true') return;
        grid.dataset.shufflePlayed = 'true';

        // Dynamically measure live bounding rects AT TRIGGER TIME to calculate pixel-exact relative offsets
        const r1 = card1.getBoundingClientRect();
        const r2 = card2.getBoundingClientRect();
        const r3 = card3.getBoundingClientRect();

        // Card 1 temporarily moves to Card 3's position
        const dX1 = r3.left - r1.left;
        const dY1 = r3.top - r1.top;

        // Card 2 temporarily moves to Card 1's position
        const dX2 = r1.left - r2.left;
        const dY2 = r1.top - r2.top;

        // Card 3 temporarily moves to Card 2's position
        const dX3 = r2.left - r3.left;
        const dY3 = r2.top - r3.top;

        // Ensure initial visibility and baseline state
        gsap.set([card1, card2, card3], {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: 'center center'
        });

        const tl = tlInstance || gsap.timeline({ defaults: { ease: 'power3.inOut' } });
        const startTime = tlInstance ? 0.2 : 0;

        // 1. Shuffle Phase: Cards visually move to temporary rearranged positions (Card 2 -> Card 3 -> Card 1)
        // Card 1 lifts slightly in 3D layering (zIndex: 10, scale: 1.025) and moves to Card 3
        tl.to(
          card1,
          {
            x: dX1,
            y: dY1,
            scale: 1.025,
            zIndex: 10,
            duration: 0.8,
            ease: 'power3.inOut'
          },
          startTime
        );

        // Card 2 slips underneath (zIndex: 2, scale: 0.98) and moves to Card 1
        tl.to(
          card2,
          {
            x: dX2,
            y: dY2,
            scale: 0.98,
            zIndex: 2,
            duration: 0.8,
            ease: 'power3.inOut'
          },
          startTime + 0.04
        );

        // Card 3 glides across center (zIndex: 5, scale: 1.0) and moves to Card 2
        tl.to(
          card3,
          {
            x: dX3,
            y: dY3,
            scale: 1.0,
            zIndex: 5,
            duration: 0.8,
            ease: 'power3.inOut'
          },
          startTime + 0.08
        );

        // 2. Brief natural pause in the shuffled state
        const pauseDuration = 0.25;
        const returnTime = startTime + 0.88 + pauseDuration;

        // 3. Return Phase: Smoothly rearrange all three cards back to original positions (Card 1 -> Card 2 -> Card 3)
        tl.to(
          card1,
          {
            x: 0,
            y: 0,
            scale: 1,
            zIndex: 1,
            duration: 0.75,
            ease: 'power3.inOut'
          },
          returnTime
        );

        tl.to(
          card2,
          {
            x: 0,
            y: 0,
            scale: 1,
            zIndex: 1,
            duration: 0.75,
            ease: 'power3.inOut'
          },
          returnTime + 0.04
        );

        tl.to(
          card3,
          {
            x: 0,
            y: 0,
            scale: 1,
            zIndex: 1,
            duration: 0.75,
            ease: 'power3.inOut',
            clearProps: 'transform,zIndex',
            onComplete: () => {
              // Guarantee cards remain cleanly in original positions with zero layout shift
              [card1, card2, card3].forEach((c) => {
                c.style.transform = '';
                c.style.zIndex = '';
              });
            }
          },
          returnTime + 0.08
        );

        return tl;
      }

      if (parentTl) {
        runShuffleSequence(parentTl);
      } else if (typeof ScrollTrigger !== 'undefined') {
        const triggerSec = grid.closest('section') || grid.parentElement || grid;
        ScrollTrigger.create({
          trigger: triggerSec,
          start: 'top 82%',
          once: true,
          onEnter: () => runShuffleSequence(),
          onEnterBack: () => runShuffleSequence()
        });
      } else {
        runShuffleSequence();
      }
    });
  }

  // Alias for backward compatibility
  const animateTypologiesShuffle = animateThreeCardShuffle;

  // Dedicated Service Detail Block Motion Engine (services.html - All 6 Service Sections)
  // Sequence requested:
  // 1. Number + Category -> LEFT
  // 2. Main Heading -> RIGHT
  // 3. Description -> BOTTOM
  // 4. Scope Heading -> LEFT
  // 5. Deliverable List Items -> Alternating ZIG-ZAG (Item 1 Left, Item 2 Right, Item 3 Left...)
  // 6. CTA Button -> LEFT
  // Image -> Center to Diagonal / Cross Spread Reveal
  function animateSingleServiceBlock(block, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined' || !block) return;

    // Prevent double execution on the same block
    if (block.dataset.serviceAnimated === 'true') return;
    block.dataset.serviceAnimated = 'true';

    const children = Array.from(block.children).filter((el) => el.nodeType === 1);
    if (children.length < 2) return;

    let textCol = null;
    let imageCol = null;

    children.forEach((col) => {
      if (col.querySelector('img') && !col.querySelector('h2, h3')) {
        imageCol = col;
      } else if (col.querySelector('h2, h3')) {
        textCol = col;
      }
    });

    if (!textCol || !imageCol) {
      textCol = children[0].querySelector('h2, h3') ? children[0] : children[1];
      imageCol = children[0].querySelector('img') ? children[0] : children[1];
    }

    const img = imageCol ? imageCol.querySelector('img') : null;

    // Direct element targets inside textCol
    // 1. Number + Separator + Category Badge
    const numCatWrapper = textCol ? textCol.children[0] : null;
    // 2. Main Heading
    const heading = textCol ? textCol.querySelector('h2, h3') : null;
    // 3. Description Paragraph
    const desc = textCol ? textCol.querySelector('p') : null;
    // 4. Scope Heading
    const scopeHeading = textCol ? textCol.querySelector('h4') : null;
    // 5. Deliverables Checklist Items
    const listItems = textCol ? Array.from(textCol.querySelectorAll('ul li')) : [];
    // 6. CTA Button
    const ctaBtn = textCol ? textCol.querySelector('.btn, a.btn') : null;

    // Initial setup
    if (numCatWrapper) gsap.set(numCatWrapper, { opacity: 0, x: -50 });
    if (heading) gsap.set(heading, { opacity: 0, x: 60 });
    if (desc) gsap.set(desc, { opacity: 0, y: 35 });
    if (scopeHeading) gsap.set(scopeHeading, { opacity: 0, x: -40 });
    if (listItems.length > 0) {
      listItems.forEach((item, idx) => {
        const isLeft = idx % 2 === 0;
        gsap.set(item, { opacity: 0, x: isLeft ? -45 : 45 });
      });
    }
    if (ctaBtn) gsap.set(ctaBtn, { opacity: 0, x: -45 });

    if (img && imageCol) {
      imageCol.style.overflow = 'hidden';
      gsap.set(img, {
        opacity: 0,
        scale: 1.1,
        clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)',
        transformOrigin: 'center center'
      });
    }

    const tl = parentTl || gsap.timeline({ defaults: { ease: 'power3.out' } });
    const base = parentTl ? 0.1 : 0;

    // 1. STEP 1 — NUMBER + CATEGORY -> LEFT
    if (numCatWrapper) {
      tl.to(
        numCatWrapper,
        { opacity: 1, x: 0, duration: 0.65, ease: 'power3.out' },
        base
      );
    }

    // 2. STEP 2 — MAIN HEADING -> RIGHT
    if (heading) {
      tl.to(
        heading,
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' },
        base + 0.12
      );
    }

    // 3. STEP 3 — DESCRIPTION -> BOTTOM
    if (desc) {
      tl.to(
        desc,
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' },
        base + 0.24
      );
    }

    // 4. STEP 4 — KEY SCOPE & DELIVERABLES -> LEFT
    if (scopeHeading) {
      tl.to(
        scopeHeading,
        { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' },
        base + 0.36
      );
    }

    // 5. STEP 5 — DELIVERABLE ITEMS -> Alternating ZIG-ZAG
    if (listItems.length > 0) {
      listItems.forEach((item, idx) => {
        tl.to(
          item,
          { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' },
          base + 0.44 + idx * 0.08
        );
      });
    }

    // 6. STEP 6 — CTA BUTTON -> LEFT
    if (ctaBtn) {
      const ctaStart = base + 0.44 + listItems.length * 0.08 + 0.06;
      tl.to(
        ctaBtn,
        { opacity: 1, x: 0, duration: 0.65, ease: 'power3.out' },
        ctaStart
      );
    }

    // IMAGE — CENTER -> DIAGONAL / CROSS SPREAD
    if (img) {
      tl.to(
        img,
        {
          opacity: 1,
          scale: 1,
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.1,
          ease: 'power3.inOut'
        },
        base + 0.18
      );
    }

    // Guarantee pristine final state with zero permanent transform or clipPath
    tl.call(() => {
      if (numCatWrapper) { numCatWrapper.style.transform = ''; numCatWrapper.style.opacity = '1'; }
      if (heading) { heading.style.transform = ''; heading.style.opacity = '1'; }
      if (desc) { desc.style.transform = ''; desc.style.opacity = '1'; }
      if (scopeHeading) { scopeHeading.style.transform = ''; scopeHeading.style.opacity = '1'; }
      listItems.forEach((li) => { li.style.transform = ''; li.style.opacity = '1'; });
      if (ctaBtn) { ctaBtn.style.transform = ''; ctaBtn.style.opacity = '1'; }
      if (img) {
        img.style.clipPath = '';
        img.style.transform = '';
        img.style.opacity = '1';
      }
    });

    return tl;
  }

  // Dedicated Atelier Leadership Continuous Horizontal Running Marquee (about.html)
  function animateLeadershipSection(scope, parentTl) {
    // Handled via pure hardware-accelerated continuous running marquee
    return;
  }

  // Dedicated Comprehensive Spatial Disciplines 6-Card Diagonal Cross / X-Shaped Motion Engine (index.html)
  // Sequence requested:
  // Phase 1: Card 01 (top-left ↘) + Card 06 (bottom-right ↖) enter simultaneously from opposing diagonals
  // Phase 2: Card 03 (top-right ↙) + Card 04 (bottom-left ↗) enter simultaneously from opposing diagonals
  // Phase 3: Card 02 (top-center ↘) + Card 05 (bottom-center ↖) enter simultaneously from opposing diagonals
  // Inside each card:
  //   1. Card Number -> fade + upward reveal
  //   2. Main Title -> enters from LEFT (opacity 0, x: -35 -> 0)
  //   3. Description -> enters from RIGHT (opacity 0, x: 35 -> 0)
  //   4. Bullet 1 -> enters from LEFT (one-by-one stagger)
  //   5. Bullet 2 -> enters from RIGHT
  //   6. Bullet 3 -> enters from LEFT
  //   7. Explore Scope Button -> subtle upward/left reveal
  function animateSpatialDisciplinesSection(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (scope && scope.classList && (scope.classList.contains('services-grid') || scope.classList.contains('services-section'))) {
      grids = scope.classList.contains('services-grid') ? [scope] : Array.from(scope.querySelectorAll('.services-grid'));
    } else {
      grids = Array.from((scope || document).querySelectorAll('.services-grid'));
    }
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll('.service-card'));
      if (cards.length < 6) return;

      const card1 = cards[0]; // 01 Architecture (Top Left)
      const card2 = cards[1]; // 02 Interior Design (Top Center)
      const card3 = cards[2]; // 03 Space Planning (Top Right)
      const card4 = cards[3]; // 04 3D Visualization (Bottom Left)
      const card5 = cards[4]; // 05 Landscape Design (Bottom Center)
      const card6 = cards[5]; // 06 Project Management (Bottom Right)

      // Set initial diagonal offsets for cards (X + Y transform-based entrance)
      // Card 01: comes from upper-left (↘)
      gsap.set(card1, { opacity: 0, x: -80, y: -70, willChange: 'transform, opacity' });
      // Card 06: comes from lower-right (↖)
      gsap.set(card6, { opacity: 0, x: 80, y: 70, willChange: 'transform, opacity' });
      // Card 03: comes from upper-right (↙)
      gsap.set(card3, { opacity: 0, x: 80, y: -70, willChange: 'transform, opacity' });
      // Card 04: comes from lower-left (↗)
      gsap.set(card4, { opacity: 0, x: -80, y: 70, willChange: 'transform, opacity' });
      // Card 02: comes from upper-left/top diagonal offset (↘)
      gsap.set(card2, { opacity: 0, x: -60, y: -70, willChange: 'transform, opacity' });
      // Card 05: comes from lower-right/bottom diagonal offset (↖)
      gsap.set(card5, { opacity: 0, x: 60, y: 70, willChange: 'transform, opacity' });

      // Set initial states for internal content of each card
      cards.forEach((card) => {
        const num = card.querySelector('.service-number');
        const title = card.querySelector('.service-title');
        const desc = card.querySelector('.service-desc');
        const bullets = Array.from(card.querySelectorAll('.service-features-list li'));
        const btn = card.querySelector('.btn');

        if (num) gsap.set(num, { opacity: 0, y: 12 });
        if (title) gsap.set(title, { opacity: 0, x: -35 }); // Must enter from LEFT
        if (desc) gsap.set(desc, { opacity: 0, x: 35 });   // Must enter from RIGHT
        if (bullets.length > 0) {
          bullets.forEach((b, idx) => {
            const isLeft = idx % 2 === 0; // Bullet 1 Left, Bullet 2 Right, Bullet 3 Left
            gsap.set(b, { opacity: 0, x: isLeft ? -22 : 22 });
          });
        }
        if (btn) gsap.set(btn, { opacity: 0, y: 14, x: -10 });
      });

      const tl = parentTl || gsap.timeline({ defaults: { ease: 'power3.out' } });
      const baseTime = parentTl ? 0.25 : 0;

      // Helper function to animate internal content of a card
      function animateCardContent(card, contentStartTime) {
        const num = card.querySelector('.service-number');
        const title = card.querySelector('.service-title');
        const desc = card.querySelector('.service-desc');
        const bullets = Array.from(card.querySelectorAll('.service-features-list li'));
        const btn = card.querySelector('.btn');

        // 1. Number: subtle fade + upward reveal
        if (num) {
          tl.to(num, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, contentStartTime);
        }
        // 2. Main Title: enters from LEFT
        if (title) {
          tl.to(title, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, contentStartTime + 0.07);
        }
        // 3. Description: enters from RIGHT (directional contrast)
        if (desc) {
          tl.to(desc, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, contentStartTime + 0.14);
        }
        // 4. Bullets: animated ONE BY ONE with small stagger
        if (bullets.length > 0) {
          bullets.forEach((bullet, bIdx) => {
            tl.to(bullet, { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }, contentStartTime + 0.21 + bIdx * 0.07);
          });
        }
        // 5. Button: appears after the 3 bullets with subtle upward/left reveal
        if (btn) {
          const btnTime = contentStartTime + 0.21 + bullets.length * 0.07 + 0.04;
          tl.to(btn, { opacity: 1, y: 0, x: 0, duration: 0.45, ease: 'power3.out' }, btnTime);
        }
      }

      // PHASE 1: Card 01 + Card 06 (DIAGONAL CROSS ENTRANCE)
      const t1 = baseTime;
      tl.to([card1, card6], { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'power3.out' }, t1);
      animateCardContent(card1, t1 + 0.3);
      animateCardContent(card6, t1 + 0.3);

      // PHASE 2: Card 03 + Card 04 (DIAGONAL CROSS ENTRANCE)
      const t2 = t1 + 0.22;
      tl.to([card3, card4], { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'power3.out' }, t2);
      animateCardContent(card3, t2 + 0.3);
      animateCardContent(card4, t2 + 0.3);

      // PHASE 3: Card 02 + Card 05 (DIAGONAL CROSS ENTRANCE)
      const t3 = t2 + 0.22;
      tl.to([card2, card5], { opacity: 1, x: 0, y: 0, duration: 0.75, ease: 'power3.out' }, t3);
      animateCardContent(card2, t3 + 0.3);
      animateCardContent(card5, t3 + 0.3);

      // Clean up inline styles on completion to ensure pristine native layout & hover states
      tl.call(() => {
        cards.forEach((card) => {
          card.style.transform = '';
          card.style.opacity = '1';
          card.style.willChange = '';
          const num = card.querySelector('.service-number');
          if (num) { num.style.transform = ''; num.style.opacity = '1'; }
          const title = card.querySelector('.service-title');
          if (title) { title.style.transform = ''; title.style.opacity = '1'; }
          const desc = card.querySelector('.service-desc');
          if (desc) { desc.style.transform = ''; desc.style.opacity = '1'; }
          const bullets = card.querySelectorAll('.service-features-list li');
          bullets.forEach((b) => { b.style.transform = ''; b.style.opacity = '1'; });
          const btn = card.querySelector('.btn');
          if (btn) { btn.style.transform = ''; btn.style.opacity = '1'; }
        });
      });
    });
  }

  // Dedicated Featured Architectural Projects 6-Card Criss-Cross / X-Pattern Motion Engine (index.html)
  // Sequence requested:
  // Row 1: Card 1 (Villa Aurelia ↘) + Card 2 (Salem Residence ↙)
  // Row 2: Card 3 (Urban House ↘) + Card 4 (Horizon Office ↙)
  // Row 3: Card 5 (Terra Retreat ↘) + Card 6 (Modern Courtyard ↙)
  // Each row/pair triggers when scrolled into the viewport with exact diagonal criss-cross motion.
  function animateProjectsCrissCross(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (scope && scope.classList && (scope.classList.contains('projects-grid') || scope.classList.contains('projects-section'))) {
      grids = scope.classList.contains('projects-grid') ? [scope] : Array.from(scope.querySelectorAll('.projects-grid'));
    } else {
      grids = Array.from((scope || document).querySelectorAll('.projects-grid'));
    }
    // Filter out dashboard specific grids
    grids = grids.filter((g) => !g.closest('#arch-module-container') && !g.closest('.dashboard-main') && g.id !== 'arch-projects-grid');
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll('.project-card'));
      if (cards.length < 6) return;

      const card1 = cards[0]; // 01 Villa Aurelia (Row 1 Left)
      const card2 = cards[1]; // 02 Salem Residence (Row 1 Right)
      const card3 = cards[2]; // 03 Urban House (Row 2 Left)
      const card4 = cards[3]; // 04 Horizon Office (Row 2 Right)
      const card5 = cards[4]; // 05 Terra Retreat (Row 3 Left)
      const card6 = cards[5]; // 06 Modern Courtyard (Row 3 Right)

      // Set initial displacements (pure vertical on mobile to avoid overflow, diagonal criss-cross on desktop)
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      const xOffset = isMobile ? 0 : 70;
      const yOffset = isMobile ? 35 : -50;

      gsap.set(card1, { opacity: 0, x: -xOffset, y: yOffset, scale: 0.98, willChange: 'transform, opacity' });
      gsap.set(card2, { opacity: 0, x: xOffset, y: yOffset, scale: 0.98, willChange: 'transform, opacity' });
      gsap.set(card3, { opacity: 0, x: -xOffset, y: yOffset, scale: 0.98, willChange: 'transform, opacity' });
      gsap.set(card4, { opacity: 0, x: xOffset, y: yOffset, scale: 0.98, willChange: 'transform, opacity' });
      gsap.set(card5, { opacity: 0, x: -xOffset, y: yOffset, scale: 0.98, willChange: 'transform, opacity' });
      gsap.set(card6, { opacity: 0, x: xOffset, y: yOffset, scale: 0.98, willChange: 'transform, opacity' });

      // Animate a single card smoothly into its exact position
      function animateSingleCard(card, delay) {
        if (!card || card.dataset.projectAnimated === 'true') return;
        card.dataset.projectAnimated = 'true';

        gsap.to(card, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: delay || 0,
          ease: 'power3.out',
          clearProps: 'transform,willChange',
          onComplete: () => {
            card.style.transform = '';
            card.style.opacity = '1';
            card.style.willChange = '';
          }
        });
      }

      // Animate a pair of cards in criss-cross
      function animateCardPair(leftCard, rightCard) {
        animateSingleCard(leftCard, 0);
        animateSingleCard(rightCard, 0.16);
      }

      // If ScrollTrigger is available, bind ScrollTrigger per row/pair so all 6 cards animate as user scrolls to them
      if (typeof ScrollTrigger !== 'undefined') {
        const pairs = [
          [card1, card2],
          [card3, card4],
          [card5, card6]
        ];

        pairs.forEach((pair) => {
          // Trigger on the first card of each pair when it reaches 85% of viewport
          ScrollTrigger.create({
            trigger: pair[0],
            start: 'top 85%',
            once: true,
            onEnter: () => animateCardPair(pair[0], pair[1]),
            onEnterBack: () => animateCardPair(pair[0], pair[1])
          });
          // Also trigger on the second card if stacked vertically (e.g. on mobile/tablet)
          ScrollTrigger.create({
            trigger: pair[1],
            start: 'top 85%',
            once: true,
            onEnter: () => animateSingleCard(pair[1], 0),
            onEnterBack: () => animateSingleCard(pair[1], 0)
          });
        });
      } else {
        // Fallback if ScrollTrigger is not present
        const orderedCards = [card1, card3, card2, card4, card5, card6];
        orderedCards.forEach((card, idx) => {
          animateSingleCard(card, idx * 0.16);
        });
      }
    });
  }

  // Dedicated 8-Stage Execution Protocol Motion Engine (services.html)
  // Sequence requested:
  // Phase 1: Center cards enter from DOWN (bottom -> top)
  //   - Row 1 Center: Stage 02 (Volumetric 3D CGI) & Stage 03 (Structural & Envelope)
  //   - Row 2 Center: Stage 06 (Site Oversight) & Stage 07 (White-Glove Commissioning)
  // Phase 2: Top outer cards enter from TOP (top -> bottom)
  //   - Stage 01 (Site Analysis) & Stage 04 (Joinery & Material)
  // Phase 3: Bottom outer cards enter from DOWN (bottom -> top)
  //   - Stage 05 (Prefabrication) & Stage 08 (Post-Occupancy)
  function animateStagesExecutionProtocol(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (scope && scope.classList && (scope.classList.contains('stages-grid') || scope.classList.contains('stages-section'))) {
      grids = scope.classList.contains('stages-grid') ? [scope] : Array.from(scope.querySelectorAll('.stages-grid'));
    } else {
      grids = Array.from((scope || document).querySelectorAll('.stages-grid'));
    }
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.querySelectorAll('.stage-flip-card'));
      if (cards.length < 8) return;

      const section = grid.closest('.stages-section') || grid;
      const eyebrow = section ? section.querySelector('.eyebrow') : null;
      const heading = section ? section.querySelector('h2') : null;
      const desc = section ? section.querySelector('p') : null;

      // Group cards according to the requested spatial sequence:
      // Center cards: Stage 02, Stage 03 (Row 1) and Stage 06, Stage 07 (Row 2)
      const centerCards = [cards[1], cards[2], cards[5], cards[6]];
      // Top outer cards: Stage 01 (Row 1 Left) and Stage 04 (Row 1 Right)
      const topOuterCards = [cards[0], cards[3]];
      // Bottom outer cards: Stage 05 (Row 2 Left) and Stage 08 (Row 2 Right)
      const bottomOuterCards = [cards[4], cards[7]];

      // Set initial states:
      // Center cards start below (y: 75px, opacity: 0)
      gsap.set(centerCards, { opacity: 0, y: 75, willChange: 'transform, opacity' });
      // Top outer cards start above (y: -75px, opacity: 0)
      gsap.set(topOuterCards, { opacity: 0, y: -75, willChange: 'transform, opacity' });
      // Bottom outer cards start below (y: 75px, opacity: 0)
      gsap.set(bottomOuterCards, { opacity: 0, y: 75, willChange: 'transform, opacity' });

      // Header initial states
      if (eyebrow && !grid.dataset.stagesAnimPlayed) gsap.set(eyebrow, { opacity: 0, x: -30 });
      if (heading && !grid.dataset.stagesAnimPlayed) gsap.set(heading, { opacity: 0, y: 20 });
      if (desc && !grid.dataset.stagesAnimPlayed) gsap.set(desc, { opacity: 0, y: 20 });

      function playStagesSequence(externalTl) {
        if (grid.dataset.stagesAnimPlayed === 'true') return;
        grid.dataset.stagesAnimPlayed = 'true';

        const tl = externalTl || gsap.timeline({ defaults: { ease: 'power3.out' } });
        const baseTime = externalTl ? 0.25 : 0;

        // Header reveals
        if (eyebrow) tl.to(eyebrow, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, baseTime);
        if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, baseTime + 0.08);
        if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, baseTime + 0.16);

        // Phase 1: Center cards enter from DOWN
        tl.to(
          centerCards,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: 'power3.out'
          },
          baseTime + 0.25
        );

        // Phase 2: Top outer cards enter from TOP
        tl.to(
          topOuterCards,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out'
          },
          baseTime + 0.55
        );

        // Phase 3: Bottom outer cards enter from DOWN
        tl.to(
          bottomOuterCards,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power3.out'
          },
          baseTime + 0.78
        );

        // Pristine cleanup: clear inline transform and willChange so native 3D hover flip functions freely
        tl.call(() => {
          cards.forEach((card) => {
            card.style.transform = '';
            card.style.opacity = '1';
            card.style.willChange = '';
          });
          if (eyebrow) eyebrow.style.transform = '';
          if (heading) heading.style.transform = '';
          if (desc) desc.style.transform = '';
        });

        return tl;
      }

      if (parentTl) {
        playStagesSequence(parentTl);
      } else if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 82%',
          once: true,
          onEnter: () => playStagesSequence(),
          onEnterBack: () => playStagesSequence()
        });
      } else {
        playStagesSequence();
      }
    });
  }

  // Dedicated 4-Card Awards & Recognition Criss-Cross / X-Pattern Motion Engine (about.html)
  // Sequence requested:
  // Pair 1: Card 1 (Top-Left ↘) + Card 4 (Bottom-Right ↖) enter diagonally from opposing corners
  // Pair 2: Card 2 (Top-Right ↙) + Card 3 (Bottom-Left ↗) enter diagonally from opposing corners
  function animateAwardsCrissCross(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (
      scope &&
      scope.classList &&
      (scope.classList.contains('awards-grid') || (scope.dataset && scope.dataset.anim === 'awards-criss-cross'))
    ) {
      grids = [scope];
    } else {
      grids = Array.from((scope || document).querySelectorAll('.awards-grid, [data-anim="awards-criss-cross"]'));
    }
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.children).filter(
        (el) => el.nodeType === 1 && !el.classList.contains('card-accent-line')
      );
      if (cards.length < 4) return;

      const card1 = cards[0]; // Pritzker (Top-Left)
      const card2 = cards[1]; // AIA (Top-Right)
      const card3 = cards[2]; // WAF (Bottom-Left)
      const card4 = cards[3]; // ArchDaily (Bottom-Right)

      const section = grid.closest('section') || grid.parentElement || grid;
      const eyebrow = section ? section.querySelector('.eyebrow') : null;
      const heading = section ? section.querySelector('h2') : null;

      // Initial diagonal states:
      // Card 1 comes from Top-Left (↖)
      gsap.set(card1, { opacity: 0, x: -80, y: -60, willChange: 'transform, opacity' });
      // Card 4 comes from Down-Right (↘)
      gsap.set(card4, { opacity: 0, x: 80, y: 60, willChange: 'transform, opacity' });
      // Card 2 comes from Top-Right (↗)
      gsap.set(card2, { opacity: 0, x: 80, y: -60, willChange: 'transform, opacity' });
      // Card 3 comes from Down-Left (↙)
      gsap.set(card3, { opacity: 0, x: -80, y: 60, willChange: 'transform, opacity' });

      // Header initial states
      if (eyebrow && !grid.dataset.awardsAnimPlayed) gsap.set(eyebrow, { opacity: 0, x: -30 });
      if (heading && !grid.dataset.awardsAnimPlayed) gsap.set(heading, { opacity: 0, y: 20 });

      function playAwardsSequence(externalTl) {
        if (grid.dataset.awardsAnimPlayed === 'true') return;
        grid.dataset.awardsAnimPlayed = 'true';

        const tl = externalTl || gsap.timeline({ defaults: { ease: 'power3.out' } });
        const baseTime = externalTl ? 0.25 : 0;

        // Header reveals
        if (eyebrow) tl.to(eyebrow, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, baseTime);
        if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, baseTime + 0.08);

        // Diagonal Pair 1: Card 1 (Top-Left) + Card 4 (Bottom-Right) enter simultaneously
        tl.to(
          [card1, card4],
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.75,
            ease: 'power3.out'
          },
          baseTime + 0.2
        );

        // Diagonal Pair 2: Card 2 (Top-Right) + Card 3 (Bottom-Left) enter simultaneously
        tl.to(
          [card2, card3],
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.75,
            ease: 'power3.out'
          },
          baseTime + 0.44
        );

        // Cleanup inline styles on complete
        tl.call(() => {
          [card1, card2, card3, card4].forEach((c) => {
            c.style.transform = '';
            c.style.opacity = '1';
            c.style.willChange = '';
          });
          if (eyebrow) eyebrow.style.transform = '';
          if (heading) heading.style.transform = '';
        });

        return tl;
      }

      if (parentTl) {
        playAwardsSequence(parentTl);
      } else if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 82%',
          once: true,
          onEnter: () => playAwardsSequence(),
          onEnterBack: () => playAwardsSequence()
        });
      } else {
        playAwardsSequence();
      }
    });
  }

  // Dedicated Contact Split Section Motion Engine (contact.html)
  // Sequence requested:
  // 1. Left side (3 cards in .contact-info-panel):
  //    "PRIMARY STUDIO", "DIRECT COMMUNICATION", and "ATELIER HOURS"
  //    enter one by one (staggered) and arrange into position.
  // 2. Right side (1 full card in .contact-form-card):
  //    "Submit Commission Brief" inquiry card enters from downside (bottom upward) into position.
  // 3. Remove/replace any existing animation on this section.
  function animateContactSplitSection(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (
      scope &&
      scope.classList &&
      (scope.classList.contains('contact-layout-grid') || (scope.dataset && scope.dataset.anim === 'contact-split'))
    ) {
      grids = [scope];
    } else {
      grids = Array.from((scope || document).querySelectorAll('.contact-layout-grid, [data-anim="contact-split"]'));
    }
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const leftCards = Array.from(grid.querySelectorAll('.contact-detail-card'));
      const rightCard = grid.querySelector('.contact-form-card');

      if (leftCards.length === 0 && !rightCard) return;

      // Set initial states:
      // Left 3 cards start displaced from left (opacity: 0, x: -60, y: 15) to slide in one by one
      if (leftCards.length > 0) {
        gsap.set(leftCards, { opacity: 0, x: -60, y: 15, willChange: 'transform, opacity' });
      }

      // Right form card starts displaced from downside (opacity: 0, y: 80)
      if (rightCard) {
        gsap.set(rightCard, { opacity: 0, y: 80, willChange: 'transform, opacity' });
      }

      function playContactSplitSequence(externalTl) {
        if (grid.dataset.contactAnimPlayed === 'true') return;
        grid.dataset.contactAnimPlayed = 'true';

        const tl = externalTl || gsap.timeline({ defaults: { ease: 'power3.out' } });
        const baseTime = externalTl ? 0.2 : 0;

        // Phase 1: Left cards enter one by one into their arranged positions
        if (leftCards.length > 0) {
          tl.to(
            leftCards,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.75,
              stagger: 0.18,
              ease: 'power3.out'
            },
            baseTime
          );
        }

        // Phase 2: Right inquiry form card enters from downside into its arranged position
        if (rightCard) {
          tl.to(
            rightCard,
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out'
            },
            baseTime + 0.25
          );
        }

        // Pristine cleanup: clear inline transform and willChange so native form inputs, clicks, and hover states work freely
        tl.call(() => {
          leftCards.forEach((c) => {
            c.style.transform = '';
            c.style.opacity = '1';
            c.style.willChange = '';
          });
          if (rightCard) {
            rightCard.style.transform = '';
            rightCard.style.opacity = '1';
            rightCard.style.willChange = '';
          }
        });

        return tl;
      }

      if (parentTl) {
        playContactSplitSequence(parentTl);
      } else if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 82%',
          once: true,
          onEnter: () => playContactSplitSequence(),
          onEnterBack: () => playContactSplitSequence()
        });
      } else {
        playContactSplitSequence();
      }
    });
  }

  // Dedicated Consultation Options 3-Card Center-Down / Left-Right Diagonal Motion Engine (contact.html)
  // Sequence requested:
  // 1. Center card (Option 02) enters first from downside (y: 90, x: 0, opacity: 0 -> y: 0, opacity: 1)
  // 2. Left card (Option 01) enters next from left side diagonally (x: -90, y: 70, opacity: 0 -> x: 0, y: 0, opacity: 1)
  // 3. Right card (Option 03) enters next from right side diagonally (x: 90, y: 70, opacity: 0 -> x: 0, y: 0, opacity: 1)
  function animateConsultationOptionsSection(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let grids = [];
    if (
      scope &&
      scope.classList &&
      (scope.classList.contains('consultation-options-grid') ||
        scope.classList.contains('consultation-options-section') ||
        (scope.dataset && scope.dataset.anim === 'consultation-diagonal-cards'))
    ) {
      grids = scope.classList.contains('consultation-options-grid')
        ? [scope]
        : Array.from(scope.querySelectorAll('.consultation-options-grid, [data-anim="consultation-diagonal-cards"]'));
    } else {
      grids = Array.from(
        (scope || document).querySelectorAll(
          '.consultation-options-grid, [data-anim="consultation-diagonal-cards"], .consultation-options-section [data-anim="consultation-diagonal-cards"]'
        )
      );
    }
    if (grids.length === 0) return;

    grids.forEach((grid) => {
      const cards = Array.from(grid.children).filter((el) => el.nodeType === 1);
      if (cards.length < 3) return;

      const cardLeft = cards[0];
      const cardCenter = cards[1];
      const cardRight = cards[2];

      // Initial displacement:
      // Center card enters from downside
      gsap.set(cardCenter, {
        opacity: 0,
        x: 0,
        y: 90,
        willChange: 'transform, opacity'
      });

      // Left card enters from left side diagonally
      gsap.set(cardLeft, {
        opacity: 0,
        x: -90,
        y: 70,
        willChange: 'transform, opacity'
      });

      // Right card enters from right side diagonally
      gsap.set(cardRight, {
        opacity: 0,
        x: 90,
        y: 70,
        willChange: 'transform, opacity'
      });

      function playConsultationSequence(tlInstance) {
        if (grid.dataset.consultationAnimPlayed === 'true') return;
        grid.dataset.consultationAnimPlayed = 'true';

        const tl = tlInstance || gsap.timeline({ defaults: { ease: 'power3.out' } });
        const baseTime = tlInstance ? 0.2 : 0;

        // Step 1: Center card enters first from downside
        tl.to(
          cardCenter,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          },
          baseTime
        );

        // Step 2: Left card enters from left side diagonally
        tl.to(
          cardLeft,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          },
          baseTime + 0.22
        );

        // Step 3: Right card enters from right side diagonally
        tl.to(
          cardRight,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
          },
          baseTime + 0.38
        );

        // Pristine cleanup: clear inline transform and willChange so native hover effects and layout stay intact
        tl.call(() => {
          [cardCenter, cardLeft, cardRight].forEach((c) => {
            c.style.transform = '';
            c.style.opacity = '1';
            c.style.willChange = '';
          });
        });

        return tl;
      }

      if (parentTl) {
        playConsultationSequence(parentTl);
      } else if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: grid,
          start: 'top 85%',
          once: true,
          onEnter: () => playConsultationSequence(),
          onEnterBack: () => playConsultationSequence()
        });
      } else {
        playConsultationSequence();
      }
    });
  }

  // Dedicated FAQ Accordion Alternating Left/Right Motion Engine (contact.html)
  // Sequence requested:
  // Item 1 -> enters from LEFT (x: -90, opacity: 0 -> x: 0, opacity: 1)
  // Item 2 -> enters from RIGHT (x: 90, opacity: 0 -> x: 0, opacity: 1)
  // Item 3 -> enters from LEFT (x: -90, opacity: 0 -> x: 0, opacity: 1)
  // Item 4 -> enters from RIGHT (x: 90, opacity: 0 -> x: 0, opacity: 1)
  // Item 5 -> enters from LEFT (x: -90, opacity: 0 -> x: 0, opacity: 1)
  function animateFaqAccordionSection(scope, parentTl) {
    if (prefersReducedMotion() || typeof gsap === 'undefined') return;

    let lists = [];
    if (
      scope &&
      scope.classList &&
      (scope.classList.contains('faq-accordion-list') ||
        scope.classList.contains('faq-section') ||
        (scope.dataset && scope.dataset.anim === 'faq-alternating'))
    ) {
      lists = scope.classList.contains('faq-accordion-list')
        ? [scope]
        : Array.from(scope.querySelectorAll('.faq-accordion-list, [data-anim="faq-alternating"]'));
    } else {
      lists = Array.from(
        (scope || document).querySelectorAll(
          '.faq-accordion-list, [data-anim="faq-alternating"], .faq-section .faq-accordion-list'
        )
      );
    }
    if (lists.length === 0) return;

    lists.forEach((list) => {
      const items = Array.from(list.querySelectorAll('.faq-accordion-item'));
      if (items.length === 0) return;

      // Set initial alternating horizontal states:
      // Even index (0, 2, 4) from LEFT (-90px)
      // Odd index (1, 3) from RIGHT (90px)
      items.forEach((item, idx) => {
        const isFromLeft = idx % 2 === 0;
        gsap.set(item, {
          opacity: 0,
          x: isFromLeft ? -90 : 90,
          y: 0,
          willChange: 'transform, opacity'
        });
      });

      function playFaqSequence(tlInstance) {
        if (list.dataset.faqAnimPlayed === 'true') return;
        list.dataset.faqAnimPlayed = 'true';

        const tl = tlInstance || gsap.timeline({ defaults: { ease: 'power3.out' } });
        const baseTime = tlInstance ? 0.2 : 0;

        items.forEach((item, idx) => {
          tl.to(
            item,
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.75,
              ease: 'power3.out'
            },
            baseTime + idx * 0.16 // Smooth one-by-one progressive entrance
          );
        });

        // Pristine cleanup: clear transforms so native details expansion works flawlessly
        tl.call(() => {
          items.forEach((item) => {
            item.style.transform = '';
            item.style.opacity = '1';
            item.style.willChange = '';
          });
        });

        return tl;
      }

      if (parentTl) {
        playFaqSequence(parentTl);
      } else if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: list,
          start: 'top 85%',
          once: true,
          onEnter: () => playFaqSequence(),
          onEnterBack: () => playFaqSequence()
        });
      } else {
        playFaqSequence();
      }
    });
  }

  /**
   * Main Sequence Animator for a given section/container
   * Sequence:
   * 1. Red text → left entrance
   * 2. Main text → left entrance (with letter/word reveal)
   * 3. Red accents → right entrance
   * 4. Cards → shuffle into position / 3-Card Grid special sequence
   * 5. Rose accent line → rotates/reveals and stops vertical
   * 6. Numbers → count up smoothly and stop at final values
   */
  function animateSequence(scope) {
    if (prefersReducedMotion()) {
      // Immediate final states for accessibility
      const metricValues = scope.querySelectorAll('.metric-value, .stat-number, [data-counter]');
      metricValues.forEach((el) => {
        if (el.dataset.origVal) el.innerText = el.dataset.origVal;
      });
      return;
    }

    if (typeof gsap === 'undefined') {
      console.warn('GSAP is not loaded. Motion sequence skipped.');
      return;
    }

    // If scope is a service-detail-block, animate directly
    if (scope && scope.classList && scope.classList.contains('service-detail-block')) {
      return animateSingleServiceBlock(scope);
    }

    prepareCardAccentLines(scope);

    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // 1. Red Text Elements (Eyebrows, red prefixes, badge-red) -> Left entrance
    const redTextElements = Array.from(
      scope.querySelectorAll('.eyebrow, .badge-red, .red-accent-left')
    ).filter(
      (el) =>
        !el.closest(
          '.philosophy-grid, .split-image-section, [data-anim="split-image-section"], .about-preview-grid, .about-preview-section, .pillars-grid, .typologies-grid, .typologies-section, .service-detail-block, .leadership-grid, .services-grid, .service-card, .projects-grid, .project-card, .contact-layout-grid, [data-anim="contact-split"], .contact-form-section'
        )
    );
    if (redTextElements.length > 0) {
      tl.fromTo(
        redTextElements,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.08 },
        0
      );
    }

    // 2. Main Dark / Primary Text Elements -> Left entrance with word reveal
    // (Exclude headings inside dedicated cards so they follow their dedicated sequences)
    const mainHeadings = Array.from(
      scope.querySelectorAll('h1, h2, h3, .dashboard-heading-active, .main-text-left')
    ).filter(
      (h) =>
        !h.closest(
          '.page-hero, .hero-section, .blog-grid, .projects-grid, .project-card, .projects-section, .services-grid, .service-card, .services-section, .philosophy-grid, .three-card-grid, [data-anim="3card-grid"], [data-anim="stagger-grid"], .split-image-section, [data-anim="split-image-section"], .about-preview-grid, .about-preview-section, .pillars-grid, .typologies-grid, .typologies-section, .service-detail-block, .leadership-grid, .leadership-card, .contact-layout-grid, [data-anim="contact-split"], .contact-form-section'
        )
    );
    const wordSpans = [];
    mainHeadings.forEach((heading) => {
      splitTextForReveal(heading);
      const spans = heading.querySelectorAll('.motion-word');
      if (spans.length > 0) {
        wordSpans.push(...Array.from(spans));
      }
    });

    if (wordSpans.length > 0) {
      tl.fromTo(
        wordSpans,
        { opacity: 0, x: -25, y: 10 },
        { opacity: 1, x: 0, y: 0, duration: 0.7, stagger: 0.04, ease: 'power2.out' },
        0.15
      );
    } else if (mainHeadings.length > 0) {
      tl.fromTo(
        mainHeadings,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.1 },
        0.15
      );
    }

    // 3. Remaining Red Accent Tags / Badges / Right Elements -> Right entrance
    const redRightElements = Array.from(
      scope.querySelectorAll(
        '.badge-outline, .badge-dark, .report-thumbnail-tag, .red-accent-right, .dashboard-notif-wrapper'
      )
    ).filter(
      (el) =>
        !el.closest(
          '.philosophy-grid, .split-image-section, [data-anim="split-image-section"], .about-preview-grid, .about-preview-section, .pillars-grid, .typologies-grid, .typologies-section, .service-detail-block, .leadership-grid, .leadership-card, .services-grid, .service-card, .projects-grid, .project-card, .contact-layout-grid, [data-anim="contact-split"], .contact-form-section'
        )
    );
    if (redRightElements.length > 0) {
      tl.fromTo(
        redRightElements,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.08 },
        0.3
      );
    }

    // 4A. Special 3-Card Grid Entrance Animation
    animateThreeCardGrids(scope, tl);

    // 4B. Special Left-Content & Right-Image Split Section Entrance Animation
    animateSplitImageSections(scope, tl);

    // 4C. Special About Preview Section (Dual-Image Composition + Text) Entrance Animation
    animateAboutPreviewSection(scope, tl);

    // 4D. Special 6-Step Methodology Process Timeline Cards Entrance Animation
    animateProcessSection(scope, tl);

    // 4E. Special 4-Card Architectural Pillars Entrance Animation
    animatePillarsSection(scope, tl);

    // 4F. Special 3-Card Shuffle & Rearrange Animation (Services, About, Blog, Contact)
    animateThreeCardShuffle(scope, tl);

    // 4G. Special Atelier Leadership Horizontal Running Animation (about.html)
    animateLeadershipSection(scope, tl);

    // 4H. Special Comprehensive Spatial Disciplines 6-Card Diagonal Cross / X-Shaped Animation (index.html)
    animateSpatialDisciplinesSection(scope, tl);

    // 4I. Special Featured Architectural Projects 6-Card Criss-Cross Animation (index.html)
    animateProjectsCrissCross(scope, tl);

    // 4J. Special 8-Stage Execution Protocol Entrance Animation (services.html)
    animateStagesExecutionProtocol(scope, tl);

    // 4K. Special 4-Card Awards & Recognition Criss-Cross Animation (about.html)
    animateAwardsCrissCross(scope, tl);

    // 4L. Special Contact Form & Info Cards Split Animation (contact.html)
    animateContactSplitSection(scope, tl);

    // 4M. Special Consultation Options 3-Card Center-Down / Left-Right Diagonal Animation (contact.html)
    animateConsultationOptionsSection(scope, tl);

    // 4N. Special FAQ Accordion Alternating Left/Right Animation (contact.html)
    animateFaqAccordionSection(scope, tl);

    // 4O. General Cards Shuffle Entrance Animation (for non-dedicated cards)
    const cards = Array.from(
      scope.querySelectorAll('.metric-card, .chart-card, .report-dossier-card, .moodboard-card')
    ).filter(
      (c) =>
        !c.closest(
          '.blog-grid, .projects-grid, .project-card, .projects-section, .services-grid, .service-card, .services-section, .philosophy-grid, .three-card-grid, [data-anim="3card-grid"], [data-anim="stagger-grid"], [data-anim="3card-shuffle"], .three-card-shuffle-grid, .pillars-grid, .pillars-section, .typologies-grid, .typologies-section, .service-detail-block, .leadership-grid, .leadership-section, .stages-grid, .stages-section, .stage-flip-card, .awards-grid, [data-anim="awards-criss-cross"], .contact-layout-grid, [data-anim="contact-split"], .contact-form-section, .consultation-options-grid, [data-anim="consultation-diagonal-cards"], .consultation-option-card, .faq-accordion-list, .faq-accordion-item, .faq-section, [data-anim="faq-alternating"]'
        )
    );
    if (cards.length > 0) {
      // Displace cards initially (subtle offset, rotation, scale)
      cards.forEach((card, i) => {
        const xOffset = i % 2 === 0 ? -18 : 18;
        const rotateOffset = i % 2 === 0 ? -1.8 : 1.8;
        gsap.set(card, {
          opacity: 0,
          y: 35,
          x: xOffset,
          rotation: rotateOffset,
          scale: 0.96
        });
      });

      tl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power3.out'
        },
        0.45
      );
    }

    // 5. Rose/Red Accent Line Rotate & Reveal Animation
    const accentLines = scope.querySelectorAll('.card-accent-line');
    if (accentLines.length > 0) {
      accentLines.forEach((line) => {
        gsap.set(line, {
          transformPerspective: 600,
          rotationY: -90,
          scaleY: 0.2,
          opacity: 0
        });
      });

      tl.to(
        accentLines,
        {
          rotationY: 0,
          scaleY: 1,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'back.out(1.4)',
          onComplete: () => {
            // Guarantee line remains completely stable in final vertical position
            accentLines.forEach((line) => {
              line.style.transform = 'none';
              line.style.opacity = '1';
            });
          }
        },
        0.65
      );
    }

    // 6. Dashboard Number Counter Animation
    const metricValues = scope.querySelectorAll('.metric-value, .stat-number, [data-counter]');
    metricValues.forEach((el) => {
      const rawText = el.dataset.origVal || el.innerText;
      el.dataset.origVal = rawText;

      const meta = parseNumberFormat(rawText);
      if (!meta) return;

      const obj = { val: 0 };
      el.innerText = formatNumberValue(0, meta);

      tl.to(
        obj,
        {
          val: meta.targetVal,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.innerText = formatNumberValue(obj.val, meta);
          },
          onComplete: () => {
            el.innerText = meta.originalText; // Ensure exact final string precision
          }
        },
        0.75
      );
    });

    // 7. Table Card / Commissions Ledger Entrance (Enters from down and fits into position)
    const tableCards = scope.querySelectorAll('.dashboard-table-card');
    if (tableCards.length > 0) {
      gsap.set(tableCards, {
        opacity: 0,
        y: 60,
        scale: 0.98
      });

      tl.to(
        tableCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          onComplete: () => {
            tableCards.forEach((tc) => {
              tc.style.transform = 'none';
              tc.style.opacity = '1';
            });
          }
        },
        0.5
      );

      // Stagger table rows from down into fitted position
      const tableRows = scope.querySelectorAll('.dashboard-table tbody tr');
      if (tableRows.length > 0) {
        gsap.set(tableRows, { opacity: 0, y: 18 });
        tl.to(
          tableRows,
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
            onComplete: () => {
              tableRows.forEach((tr) => {
                tr.style.transform = 'none';
                tr.style.opacity = '1';
              });
            }
          },
          0.65
        );
      }
    }

    return tl;
  }

  /**
   * Hero Section Title Entrance Animation Engine:
   * 1. Bold white text (.hero-title-main) slides in from the LEFT side (x: -90px -> 0, opacity: 0 -> 1).
   * 2. Bold red text (.hero-title-accent) slides in from the RIGHT side (x: 90px -> 0, opacity: 0 -> 1).
   * Applies across all pages (homepage hero & inner page heroes).
   */
  function animateHeroSectionTitles(scope) {
    if (prefersReducedMotion()) return;
    const root = scope || document;
    const heroTitles = root.querySelectorAll('.hero-title, .page-hero-title, .page-hero h1');
    if (heroTitles.length === 0) return;

    heroTitles.forEach((heroTitle) => {
      const mainText = heroTitle.querySelector('.hero-title-main');
      const accentText = heroTitle.querySelector('.hero-title-accent');

      if (typeof gsap !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        const xVal = isMobile ? 25 : 90;
        const tl = gsap.timeline();

        // 1. White text slides in from LEFT
        if (mainText) {
          gsap.set(mainText, { x: -xVal, opacity: 0 });
          tl.to(
            mainText,
            {
              x: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power3.out',
              onComplete: () => {
                mainText.style.transform = 'none';
                mainText.style.opacity = '1';
              }
            },
            0.1
          );
        }

        // 2. Red text slides in from RIGHT
        if (accentText) {
          gsap.set(accentText, { x: xVal, opacity: 0 });
          tl.to(
            accentText,
            {
              x: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power3.out',
              onComplete: () => {
                accentText.style.transform = 'none';
                accentText.style.opacity = '1';
              }
            },
            0.35
          );
        }
      }
    });
  }

  // Scroll Trigger or Scope Animation Initialization
  function animateContainer(container) {
    const scope = container || document;

    // Trigger hero section title entrance animation
    animateHeroSectionTitles(scope);

    if (typeof ScrollTrigger !== 'undefined' && scope === document) {
      // Find each service detail block and bind independent ScrollTrigger
      const serviceBlocks = scope.querySelectorAll('.service-detail-block');
      if (serviceBlocks.length > 0) {
        serviceBlocks.forEach((block) => {
          ScrollTrigger.create({
            trigger: block,
            start: 'top 82%',
            once: true,
            onEnter: () => animateSingleServiceBlock(block),
            onEnterBack: () => animateSingleServiceBlock(block)
          });
        });
      }

      // Initialize project cards per-row ScrollTriggers for real-time scroll entrance
      animateProjectsCrissCross(scope);

      // Initialize 8-Stage Execution Protocol animation on services page
      animateStagesExecutionProtocol(scope);

      // Initialize Three-Card Shuffle animations across sections
      animateThreeCardShuffle(scope);

      // Initialize 4-Card Awards Criss-Cross animation on about page
      animateAwardsCrissCross(scope);

      // Initialize Contact Split Form & Info Cards animation on contact.html
      animateContactSplitSection(scope);

      // Initialize Consultation Options 3-Card Center-Down / Left-Right Diagonal animation on contact.html
      animateConsultationOptionsSection(scope);

      // Initialize FAQ Accordion Alternating Left/Right animation on contact.html
      animateFaqAccordionSection(scope);

      // Find sections or module views for scroll-based triggering
      const sections = scope.querySelectorAll('.module-view, .dashboard-main, section, .hero-section');
      if (sections.length > 0) {
        sections.forEach((sec) => {
          // If section contains service-detail-block, stages-section, 3-card-shuffle, awards-criss-cross, contact-split, consultation-diagonal, or faq-alternating, let individual handlers handle them
          if (
            !sec.classList.contains('page-hero') &&
            !sec.classList.contains('hero-section') &&
            !sec.querySelector('.page-hero-content') &&
            !sec.querySelector('.service-detail-block') &&
            !sec.classList.contains('stages-section') &&
            !sec.querySelector('.stages-grid') &&
            !sec.querySelector('[data-anim="3card-shuffle"]') &&
            !sec.querySelector('.typologies-grid') &&
            !sec.querySelector('[data-anim="awards-criss-cross"]') &&
            !sec.querySelector('.awards-grid') &&
            !sec.querySelector('.contact-layout-grid') &&
            !sec.querySelector('[data-anim="contact-split"]') &&
            !sec.querySelector('.consultation-options-grid') &&
            !sec.querySelector('[data-anim="consultation-diagonal-cards"]') &&
            !sec.querySelector('.faq-accordion-list') &&
            !sec.querySelector('[data-anim="faq-alternating"]') &&
            !sec.classList.contains('faq-section')
          ) {
            ScrollTrigger.create({
              trigger: sec,
              start: 'top 85%',
              once: true,
              onEnter: () => animateSequence(sec),
              onEnterBack: () => animateSequence(sec)
            });
          }
        });
        return;
      }
    }

    // Fallback when ScrollTrigger is not present
    const serviceBlocks = (scope || document).querySelectorAll('.service-detail-block');
    if (serviceBlocks.length > 0) {
      serviceBlocks.forEach((block) => animateSingleServiceBlock(block));
    }

    animateSequence(scope);
  }

  // Initialize on DOM Ready
  function initAll() {
    animateContainer(document);
  }

  // Expose Global Object
  window.STACKLY_MOTION = {
    initAll,
    animateContainer,
    animateSequence,
    animateHeroSectionTitles,
    animateThreeCardGrids,
    animateThreeCardShuffle,
    animateSplitImageSections,
    animateAboutPreviewSection,
    animateProcessSection,
    animatePillarsSection,
    animateTypologiesShuffle,
    animateSingleServiceBlock,
    animateLeadershipSection,
    animateSpatialDisciplinesSection,
    animateProjectsCrissCross,
    animateStagesExecutionProtocol,
    animateAwardsCrissCross,
    animateContactSplitSection,
    animateConsultationOptionsSection,
    animateFaqAccordionSection,
    parseNumberFormat,
    formatNumberValue
  };

  document.addEventListener('DOMContentLoaded', () => {
    initAll();
  });
})();
