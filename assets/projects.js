(() => {
  'use strict';

  const projects = [
    {
      id: 'merge-army', title: 'Merge Army', category: 'games', icon: '⚔', tone: 'violet',
      status: 'Live', version: 'v1.0', updated: 'Aug 2026', order: 110,
      description: 'Merge matching soldiers into powerful evolutions, position your army, and hold three lanes against escalating waves and bosses.',
      short: 'Merge, position, and defend three chaotic lanes.',
      url: '/games/merge-army/', action: 'Play game', featured: true, recent: true,
      tags: ['Strategy', 'Quick play']
    },
    {
      id: 'block-blast-arena', title: 'Block Blast Arena', category: 'games', icon: '◆', tone: 'coral',
      status: 'Live', version: 'v1.0', updated: 'Aug 2026', order: 105,
      description: 'A falling-block battle game where line clears become attacks. Build combos, use hero powers, and defeat arena bosses.',
      short: 'Turn line clears into attacks and boss damage.',
      url: '/games/block-blast-arena/', action: 'Enter arena', recent: true,
      tags: ['Arcade', 'Puzzle']
    },
    {
      id: 'one-bullet', title: 'One Bullet', category: 'games', icon: '◎', tone: 'gold',
      status: 'Live', version: 'v1.0', updated: 'Aug 2026', order: 100,
      description: 'Study each room, line up a ricochet or chain reaction, fire once, and make every object work for you.',
      short: 'One shot. One room. Find the perfect chain reaction.',
      url: '/games/one-bullet/', action: 'Fire one bullet', recent: true,
      tags: ['Physics', 'Puzzle']
    },
    {
      id: 'elevator-panic', title: 'Elevator Panic', category: 'games', icon: '↕', tone: 'cyan',
      status: 'Live', version: 'v1.0', updated: 'Aug 2026', order: 95,
      description: 'Route impatient passengers, protect your reputation, chase huge combos, and survive emergencies in increasingly chaotic towers.',
      short: 'Keep the building moving as the chaos climbs.',
      url: '/games/elevator-panic/', action: 'Run the elevators', recent: true,
      tags: ['Management', 'Arcade']
    },
    {
      id: 'dungeon', title: 'Dungeon in 60 Seconds', category: 'games', icon: '✦', tone: 'red',
      status: 'Live', version: 'v1.7.2', updated: 'Aug 2026', order: 90,
      description: 'A one-minute arcade roguelite. Fight, loot, choose risky routes, unlock heroes, and push deeper before time runs out.',
      short: 'Fight, loot, and escape before the minute is up.',
      url: '/games/dungeon-in-60-seconds/', action: 'Enter dungeon',
      tags: ['Roguelite', '60 seconds']
    },
    {
      id: 'last-train', title: 'Last Train to Blackwood', category: 'games', icon: '▰', tone: 'navy',
      status: 'Live', version: '', updated: 'Aug 2026', order: 85,
      description: 'An atmospheric detective mystery aboard a night train. Search for evidence, question eight suspects, and solve the case before dawn.',
      short: 'Solve a locked-room mystery before the last stop.',
      url: 'https://last-train-blackwood.huithomas.chatgpt.site', action: 'Board the train', external: true,
      tags: ['Mystery', 'Detective']
    },
    {
      id: 'case-files', title: 'Case Files', category: 'games', icon: '⌕', tone: 'brown',
      status: 'Live', version: 'Case 001', updated: 'Aug 2026', order: 80,
      description: 'Short interactive detective mysteries built around fair clues, tight timelines, suspect interviews, and evidence-based deductions.',
      short: 'Fair clues, tight timelines, and evidence-based deductions.',
      url: '/games/case-files/', action: 'Open case files',
      tags: ['Mystery', 'Deduction']
    },
    {
      id: 'kingdom-defense', title: 'Kingdom Defense', category: 'games', icon: '♜', tone: 'green',
      status: 'Live', version: '', updated: 'Aug 2026', order: 75,
      description: 'A full browser tower-defense game with nine towers, multiple battlefields, upgrades, abilities, achievements, and saved progress.',
      short: 'Build, upgrade, and defend across multiple battlefields.',
      url: '/kingdom-defense/', action: 'Defend the kingdom',
      tags: ['Tower defense', 'Strategy']
    },
    {
      id: 'retirement', title: 'Retirement Simulator', category: 'tools', icon: '↗', tone: 'blue',
      status: 'Live', version: 'v3.8', updated: 'Aug 2026', order: 70,
      description: 'An interactive BC retirement planning simulator for exploring assumptions, spending, portfolio allocations, taxes, and market outcomes.',
      short: 'Explore spending, taxes, portfolios, and market outcomes.',
      url: '/Retirement-simulatoor/', action: 'Open simulator', featured: true,
      tags: ['Finance', 'Planning']
    },
    {
      id: 'appliances', title: 'Home Appliance Library', category: 'home', icon: '⌂', tone: 'orange',
      status: 'Live', version: '', updated: 'Aug 2026', order: 65,
      description: 'A household reference for appliance model numbers, official manuals, maintenance schedules, replacement parts, and troubleshooting notes.',
      short: 'Manuals, maintenance, parts, and troubleshooting notes.',
      url: '/appliances/', action: 'Open home library', featured: true,
      tags: ['Reference', 'Maintenance']
    },
    {
      id: 'echo-heist', title: 'Echo Heist', category: 'games', icon: '◌', tone: 'lavender',
      status: 'Coming soon', version: '', updated: '', order: 10,
      description: 'A time-loop stealth puzzle where your previous actions become Echoes that help pull off the next part of the heist.',
      short: 'Use your past actions to complete the perfect heist.',
      url: '', action: 'Coming soon', comingSoon: true,
      tags: ['Stealth', 'Puzzle']
    }
  ];

  const categoryNames = { tools: 'Tools & Simulators', games: 'Games', home: 'Home Library' };
  const root = document.body.dataset.page === 'projects' ? '..' : '.';
  const live = projects.filter(project => !project.comingSoon);

  const absoluteUrl = project => {
    if (!project.url) return '';
    if (/^https?:/.test(project.url)) return project.url;
    return `${root}${project.url}`;
  };

  const badge = project => {
    const secondary = project.version ? `<span>${project.version}</span>` : '';
    return `<div class="card-badges"><span class="status${project.comingSoon ? ' soon' : ''}">${project.status}</span>${secondary}</div>`;
  };

  const projectCard = (project, { compact = false, favourite = false } = {}) => {
    const href = absoluteUrl(project);
    const external = project.external ? ' target="_blank" rel="noopener"' : '';
    const action = project.comingSoon
      ? '<span class="card-action muted">In development</span>'
      : `<a class="card-action" href="${href}"${external}>${project.action} <span aria-hidden="true">→</span></a>`;
    const favouriteButton = favourite
      ? `<button class="favourite-button" type="button" data-favourite="${project.id}" aria-label="Add ${project.title} to favourites" aria-pressed="false"><span aria-hidden="true">☆</span></button>`
      : '';
    return `<article class="project-card tone-${project.tone}${compact ? ' compact-card' : ''}" data-project-id="${project.id}">
      <div class="card-top"><span class="project-icon" aria-hidden="true">${project.icon}</span>${favouriteButton}</div>
      ${badge(project)}
      <p class="card-category">${categoryNames[project.category]}</p>
      <h3>${project.title}</h3>
      <p class="card-description">${compact ? project.short : project.description}</p>
      <div class="card-footer">${action}${project.updated ? `<span class="updated">Updated ${project.updated}</span>` : ''}</div>
    </article>`;
  };

  const initMenu = () => {
    const button = document.querySelector('.menu-button');
    const nav = document.querySelector('.site-nav');
    if (!button || !nav) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
  };

  const setCounts = () => {
    const counts = {
      tools: live.filter(p => p.category === 'tools').length,
      games: live.filter(p => p.category === 'games').length,
      home: live.filter(p => p.category === 'home').length
    };
    document.querySelectorAll('[data-live-count]').forEach(el => { el.textContent = live.length; });
    document.querySelectorAll('[data-game-count]').forEach(el => { el.textContent = counts.games; });
    document.querySelectorAll('[data-tool-count]').forEach(el => { el.textContent = counts.tools; });
    document.querySelectorAll('[data-home-count]').forEach(el => { el.textContent = counts.home; });
    document.querySelectorAll('[data-game-total]').forEach(el => { el.textContent = projects.filter(p => p.category === 'games').length; });
    document.querySelectorAll('[data-all-count]').forEach(el => { el.textContent = projects.length; });
  };

  const initHome = () => {
    const featured = document.querySelector('#featured-projects');
    const recent = document.querySelector('#recent-projects');
    if (featured) featured.innerHTML = projects.filter(p => p.featured).map(p => projectCard(p)).join('');
    if (recent) recent.innerHTML = projects.filter(p => p.recent).map(p => projectCard(p, { compact: true })).join('');
  };

  const initLibrary = () => {
    const library = document.querySelector('#project-library');
    if (!library) return;
    const search = document.querySelector('#project-search');
    const sort = document.querySelector('#project-sort');
    const empty = document.querySelector('#empty-state');
    const resultCount = document.querySelector('#result-count');
    const resultContext = document.querySelector('#result-context');
    const favouriteToggle = document.querySelector('.favourites-toggle');
    const filters = [...document.querySelectorAll('.filter-button')];
    const params = new URLSearchParams(window.location.search);
    const validCategories = ['all', 'tools', 'games', 'home'];
    let activeCategory = validCategories.includes(params.get('category')) ? params.get('category') : 'all';
    let favouritesOnly = false;
    let favourites = new Set();
    try { favourites = new Set(JSON.parse(localStorage.getItem('thomas-playground-favourites') || '[]')); } catch (_) {}

    const saveFavourites = () => {
      try { localStorage.setItem('thomas-playground-favourites', JSON.stringify([...favourites])); } catch (_) {}
    };

    const updateFilterButtons = () => {
      filters.forEach(button => {
        const active = button.dataset.filter === activeCategory;
        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', String(active));
      });
    };

    const render = () => {
      const term = search.value.trim().toLowerCase();
      let visible = projects.filter(project => {
        const categoryMatch = activeCategory === 'all' || project.category === activeCategory;
        const favouriteMatch = !favouritesOnly || favourites.has(project.id);
        const haystack = [project.title, project.description, categoryNames[project.category], ...project.tags].join(' ').toLowerCase();
        return categoryMatch && favouriteMatch && (!term || haystack.includes(term));
      });
      if (sort.value === 'az') visible.sort((a, b) => a.title.localeCompare(b.title));
      else if (sort.value === 'category') visible.sort((a, b) => a.category.localeCompare(b.category) || b.order - a.order);
      else visible.sort((a, b) => b.order - a.order);

      library.innerHTML = visible.map(p => projectCard(p, { favourite: true })).join('');
      empty.hidden = visible.length !== 0;
      resultCount.textContent = `${visible.length} ${visible.length === 1 ? 'project' : 'projects'}`;
      const pieces = [];
      if (activeCategory !== 'all') pieces.push(`in ${categoryNames[activeCategory]}`);
      if (term) pieces.push(`matching “${search.value.trim()}”`);
      if (favouritesOnly) pieces.push('in favourites');
      resultContext.textContent = pieces.length ? ` ${pieces.join(' · ')}` : ' across the complete collection';
      updateFavouriteButtons();
    };

    const updateFavouriteButtons = () => {
      document.querySelectorAll('[data-favourite]').forEach(button => {
        const selected = favourites.has(button.dataset.favourite);
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
        button.setAttribute('aria-label', `${selected ? 'Remove' : 'Add'} ${projects.find(p => p.id === button.dataset.favourite).title} ${selected ? 'from' : 'to'} favourites`);
        button.querySelector('span').textContent = selected ? '★' : '☆';
      });
      const selectedCount = favourites.size;
      favouriteToggle.querySelector('span').textContent = favouritesOnly ? '★' : '☆';
      favouriteToggle.title = selectedCount ? `${selectedCount} saved favourite${selectedCount === 1 ? '' : 's'}` : 'No favourites saved yet';
    };

    filters.forEach(button => button.addEventListener('click', () => {
      activeCategory = button.dataset.filter;
      const next = new URL(window.location.href);
      if (activeCategory === 'all') next.searchParams.delete('category'); else next.searchParams.set('category', activeCategory);
      history.replaceState({}, '', next);
      updateFilterButtons();
      render();
    }));
    search.addEventListener('input', render);
    sort.addEventListener('change', render);
    favouriteToggle.addEventListener('click', () => {
      favouritesOnly = !favouritesOnly;
      favouriteToggle.classList.toggle('active', favouritesOnly);
      favouriteToggle.setAttribute('aria-pressed', String(favouritesOnly));
      render();
    });
    library.addEventListener('click', event => {
      const button = event.target.closest('[data-favourite]');
      if (!button) return;
      const id = button.dataset.favourite;
      if (favourites.has(id)) favourites.delete(id); else favourites.add(id);
      saveFavourites();
      if (favouritesOnly) render(); else updateFavouriteButtons();
    });
    document.querySelector('#clear-filters').addEventListener('click', () => {
      search.value = '';
      activeCategory = 'all';
      favouritesOnly = false;
      favouriteToggle.classList.remove('active');
      favouriteToggle.setAttribute('aria-pressed', 'false');
      history.replaceState({}, '', window.location.pathname);
      updateFilterButtons();
      render();
    });
    document.addEventListener('keydown', event => {
      if (event.key === '/' && document.activeElement !== search) {
        event.preventDefault();
        search.focus();
      }
      if (event.key === 'Escape' && document.activeElement === search) {
        search.value = '';
        search.blur();
        render();
      }
    });

    if (params.get('sort') === 'az' || params.get('sort') === 'category') sort.value = params.get('sort');
    updateFilterButtons();
    render();
    if (window.location.hash === '#project-search') setTimeout(() => search.focus(), 80);
  };

  initMenu();
  setCounts();
  if (document.body.dataset.page === 'home') initHome();
  if (document.body.dataset.page === 'projects') initLibrary();
})();
