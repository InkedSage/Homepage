(function(){
  'use strict';

  const $ = (id) => document.getElementById(id);
  const TASK_KEY = 'sage_tasks_v8';

  const CONFIG = {
    weatherLocation: {lat: 38.9517, lon: -92.3341},
    weatherLocationName: 'Columbia, MO',
    googleCalendar: {
      clientId: '644801431816-9f7u70h62fipmebva3llupi2o17b1g80.apps.googleusercontent.com',
      calendarId: 'primary',
      scopes: 'https://www.googleapis.com/auth/calendar',
      maxResults: 8
    }
  };

  const aiLinks = [
    {name:'ChatGPT', url:'https://chatgpt.com/', host:'chatgpt.com', accent:'#6ee7a8'},
    {name:'Claude', url:'https://claude.ai/', host:'claude.ai', accent:'#ffb77d'},
    {name:'Gemini', url:'https://gemini.google.com/app', host:'gemini.google.com', accent:'#8fb8ff'},
    {name:'Grok', url:'https://grok.com/', host:'grok.com', accent:'#f3f6f2'}
  ];

  const toolLinks = [
    {name:'NetSuite', url:'https://system.netsuite.com/', host:'netsuite.com', accent:'#ffffff'},
    {name:'Slack', url:'https://slack.com/signin', host:'slack.com', accent:'#58d0b4'},
    {name:'BigCommerce', url:'https://login.bigcommerce.com/', host:'bigcommerce.com', accent:'#e9f0ff'},
    {name:'Vercel', url:'https://vercel.com/login', host:'vercel.com', accent:'#ffffff'},
    {name:'Jira', url:'https://id.atlassian.com/login', host:'atlassian.com', accent:'#4f95ff'},
    {name:'Confluence', url:'https://id.atlassian.com/login', host:'confluence.atlassian.com', accent:'#67a5ff'},
    {name:'Dotdigital', url:'https://login.dotdigital.com/', host:'dotdigital.com', accent:'#33e890'},
    {name:'Zoom', url:'https://zoom.us/signin', host:'zoom.us', accent:'#62b7ff'},
    {name:'GitHub', url:'https://github.com/abdickers/HomePage', host:'github.com', accent:'#f0f0f0'},
    {name:'Google Admin', url:'https://admin.google.com/', host:'admin.google.com', accent:'#84b7ff'},
    {name:'Cloudflare', url:'https://dash.cloudflare.com/', host:'cloudflare.com', accent:'#ffb348'}
  ];

  const quickLinks = [
    {name:'My Drive', url:'https://drive.google.com/drive/my-drive', host:'drive.google.com'},
    {name:'Gmail', url:'https://mail.google.com/', host:'gmail.com'},
    {name:'Google Calendar', url:'https://calendar.google.com/calendar/u/0/r', host:'calendar.google.com'},
    {name:'Google Docs', url:'https://docs.google.com/', host:'docs.google.com'},
    {name:'Google Sheets', url:'https://sheets.google.com/', host:'sheets.google.com'},
    {name:'Google Keep', url:'https://keep.google.com/', host:'keep.google.com'},
    {name:'Google Photos', url:'https://photos.google.com/', host:'photos.google.com'},
    {name:'Recent Files', url:'https://drive.google.com/drive/recent', host:'drive.google.com'}
  ];

  const defaultTasks = [
    {text:'Review marketing plan', done:false, star:true},
    {text:'Finish YouTube script', done:false, star:false},
    {text:'Email client feedback', done:false, star:false},
    {text:'Update website copy', done:false, star:true},
    {text:'Gym and content ideas', done:false, star:false}
  ];

  const upcomingTasks = [
    {text:'Project Proposal', date:'May 24'},
    {text:'Content Calendar', date:'May 26'},
    {text:'Strategy Review', date:'May 27'},
    {text:'Newsletter Draft', date:'May 28'},
    {text:'Client Call', date:'May 29'}
  ];

  const fellowship = [
    {name:'Frodo', img:'assets/avatars/avatar-11-row3-col3.png'},
    {name:'Gandalf', img:'assets/avatars/avatar-06-row2-col2.png'},
    {name:'Aragorn', img:'assets/avatars/avatar-10-row3-col2.png'},
    {name:'Legolas', img:'assets/avatars/avatar-09-row3-col1.png'},
    {name:'Gimli', img:'assets/avatars/avatar-07-row2-col3.png'},
    {name:'Samwise', img:'assets/avatars/avatar-12-row3-col4.png'},
    {name:'Merry & Pippin', img:'assets/avatars/avatar-13-row4-col4.png'}
  ];

  const notes = [
    {title:'Content Ideas', lines:['LOTR themed productivity systems.', 'AI tool reviews.', 'Middle-earth storytelling.']},
    {title:'Project Ideas', lines:['Build command dashboard.', 'Sage brand strategy.', 'Digital product ideas.']},
    {title:'Quick Notes', lines:['Focus on deep work.', 'Protect mornings.', 'Walk daily.', 'Read nightly.']}
  ];

  const statuses = [
    ['NetSuite', 'Operational'],
    ['BigCommerce', 'Operational'],
    ['Website (Vercel)', 'Operational'],
    ['Email', 'Operational'],
    ['AI Services', 'Operational']
  ];

  const feeds = {
    fox: {url:'https://feeds.foxnews.com/foxnews/latest?format=xml', source:'https://www.foxnews.com/'},
    wowhead: {url:'https://www.wowhead.com/news/rss/all', source:'https://www.wowhead.com/news'},
    tech: {url:'https://hnrss.org/frontpage', source:'https://news.ycombinator.com/'}
  };

  const fallbackNews = [
    {title:'Markets rally on cooler inflation data and rate cut hopes', link:'https://www.foxnews.com/', pubDate:new Date().toISOString()},
    {title:'Supreme Court hears major free speech case', link:'https://www.foxnews.com/', pubDate:new Date().toISOString()},
    {title:'Severe storms threaten plains region this week', link:'https://www.foxnews.com/', pubDate:new Date().toISOString()},
    {title:'New tools reshape daily AI workflows', link:'https://news.ycombinator.com/', pubDate:new Date().toISOString()}
  ];

  const quotes = [
    ['All we have to decide is what to do with the time that is given us.', 'Gandalf'],
    ['Not all those who wander are lost.', 'J.R.R. Tolkien'],
    ['There is some good in this world, and it is worth fighting for.', 'Samwise'],
    ['Deeds will not be less valiant because they are unpraised.', 'Aragorn']
  ];

  let tasks = loadTasks();
  let activeFeed = 'fox';
  let calendarTokenClient = null;
  let calendarAccessToken = '';

  function escapeHtml(value){
    return String(value).replace(/[&<>'"]/g, (char) => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      "'":'&#39;',
      '"':'&quot;'
    }[char]));
  }

  function favicon(host){
    return 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=96';
  }

  function initials(name){
    return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  }

  function iconMarkup(item, className){
    const label = initials(item.name);
    return `
      <span class="${className || 'link-icon'}">
        <img src="${favicon(item.host)}" alt="" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false" />
        <span hidden>${escapeHtml(label)}</span>
      </span>
    `;
  }

  function renderApps(targetId, items){
    const target = $(targetId);
    if(!target) return;
    target.innerHTML = items.map((item) => `
      <a class="app-card" href="${item.url}" target="_blank" rel="noopener" style="--accent:${item.accent}">
        ${iconMarkup(item, 'app-icon')}
        <span>${escapeHtml(item.name)}</span>
      </a>
    `).join('');
  }

  function renderQuick(){
    const target = $('quickList');
    if(!target) return;
    target.innerHTML = quickLinks.map((item) => `
      <a class="quick-item" href="${item.url}" target="_blank" rel="noopener">
        ${iconMarkup(item, 'quick-icon')}
        <b>${escapeHtml(item.name)}</b>
        <span class="chevron">&rsaquo;</span>
      </a>
    `).join('');
  }

  function loadExternalScript(src){
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if(existing){
        if(existing.dataset.loaded === 'true') resolve();
        else existing.addEventListener('load', resolve, {once:true});
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.dataset.loaded = 'false';
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true';
        resolve();
      }, {once:true});
      script.addEventListener('error', reject, {once:true});
      document.head.appendChild(script);
    });
  }

  function setCalendarState(message, tone){
    const state = $('calendarState');
    if(!state) return;
    state.textContent = message || '';
    state.dataset.tone = tone || 'neutral';
    state.hidden = !message;
  }

  function calendarWindow(date){
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
    return {start, end};
  }

  function eventDate(event, side){
    const value = event[side] || {};
    return value.dateTime ? new Date(value.dateTime) : null;
  }

  function eventTimeLabel(event){
    if(event.start && event.start.date) return 'All day';
    const start = eventDate(event, 'start');
    if(!start) return 'Any time';
    return start.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  }

  function eventLengthLabel(event){
    if(event.start && event.start.date) return '';
    const start = eventDate(event, 'start');
    const end = eventDate(event, 'end');
    if(!start || !end) return '';
    const minutes = Math.max(0, Math.round((end - start) / 60000));
    if(minutes < 60) return minutes + 'm';
    const hours = minutes / 60;
    return Number.isInteger(hours) ? hours + 'h' : hours.toFixed(1) + 'h';
  }

  function eventColor(event, index){
    const palette = ['#f29d38', '#d1b06f', '#58b5bc', '#a76dda', '#4189ff', '#76d36e', '#f1715e'];
    const numeric = Number(event.colorId);
    return palette[Number.isFinite(numeric) ? numeric % palette.length : index % palette.length];
  }

  function renderCalendarEvents(items){
    const target = $('eventList');
    if(!target) return;
    if(!items.length){
      target.innerHTML = '';
      setCalendarState('No events scheduled today.', 'ok');
      return;
    }
    setCalendarState('', 'ok');
    target.innerHTML = items.map((event, index) => `
      <a class="event-row" href="${event.htmlLink || 'https://calendar.google.com/calendar/u/0/r'}" target="_blank" rel="noopener">
        <span class="event-dot" style="--event:${eventColor(event, index)}"></span>
        <time>${escapeHtml(eventTimeLabel(event))}</time>
        <strong>${escapeHtml(event.summary || 'Untitled event')}</strong>
        <em>${escapeHtml(eventLengthLabel(event))}</em>
      </a>
    `).join('');
  }

  async function loadGoogleCalendarEvents(){
    if(!calendarAccessToken){
      setCalendarState('Connect Google Calendar to load today.', 'neutral');
      return;
    }
    const target = $('eventList');
    if(target) target.innerHTML = '';
    setCalendarState('Loading your calendar...', 'neutral');
    const {start, end} = calendarWindow(new Date());
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: String(CONFIG.googleCalendar.maxResults || 8),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago'
    });
    const calendarId = encodeURIComponent(CONFIG.googleCalendar.calendarId || 'primary');
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`, {
      headers: {Authorization: 'Bearer ' + calendarAccessToken}
    });
    if(response.status === 401){
      calendarAccessToken = '';
      setCalendarState('Calendar session expired. Connect again.', 'warn');
      return;
    }
    if(!response.ok){
      setCalendarState('Calendar could not load. Check your Google OAuth setup.', 'warn');
      return;
    }
    const data = await response.json();
    renderCalendarEvents((data.items || []).filter((event) => event.status !== 'cancelled'));
  }

  async function initGoogleCalendar(){
    const button = $('calendarConnect');
    if(!button) return;
    const clientId = CONFIG.googleCalendar.clientId.trim();
    if(!clientId){
      button.disabled = true;
      button.textContent = 'Setup needed';
      setCalendarState('Add your Google OAuth Client ID in js/app.js to use live calendar events.', 'warn');
      return;
    }
    try{
      await loadExternalScript('https://accounts.google.com/gsi/client');
      calendarTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: CONFIG.googleCalendar.scopes,
        callback: async (response) => {
          if(response.error){
            setCalendarState('Google Calendar authorization was not completed.', 'warn');
            return;
          }
          calendarAccessToken = response.access_token;
          button.textContent = 'Refresh';
          await loadGoogleCalendarEvents();
        },
        error_callback: (error) => {
          const type = error && (error.type || error.message) ? ' (' + (error.type || error.message) + ')' : '';
          setCalendarState('Google sign-in was blocked. Open the page in Chrome or Edge, then try again.' + type, 'warn');
        }
      });
      button.disabled = false;
      button.textContent = 'Connect Calendar';
      setCalendarState('Open this page in Chrome or Edge, then click Connect Calendar.', 'neutral');
    } catch(error){
      button.disabled = true;
      setCalendarState('Could not load Google sign-in scripts. Check network or browser blocking.', 'warn');
    }
  }

  function connectGoogleCalendar(){
    if(!calendarTokenClient) return;
    if(calendarAccessToken){
      loadGoogleCalendarEvents();
      return;
    }
    calendarTokenClient.requestAccessToken({prompt: calendarAccessToken ? '' : 'consent'});
  }

  function renderFellowship(){
    const target = $('fellowshipList');
    if(!target) return;
    target.innerHTML = fellowship.map((member) => `
      <figure class="fellowship-member">
        <img src="${member.img}" alt="${escapeHtml(member.name)} avatar" />
        <figcaption>${escapeHtml(member.name)}</figcaption>
      </figure>
    `).join('');
  }

  function renderNotes(){
    const target = $('noteGrid');
    if(!target) return;
    target.innerHTML = notes.map((note) => `
      <article class="note">
        <h3>${escapeHtml(note.title)}</h3>
        ${note.lines.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}
      </article>
    `).join('');
  }

  function renderStatus(){
    const target = $('statusList');
    if(!target) return;
    target.innerHTML = statuses.map(([name, state]) => `
      <div class="status-row">
        <span class="status-dot"></span>
        <span>${escapeHtml(name)}</span>
        <b>${escapeHtml(state)}</b>
      </div>
    `).join('');
  }

  function loadTasks(){
    try {
      const stored = JSON.parse(localStorage.getItem(TASK_KEY));
      if(Array.isArray(stored)) return stored;
    } catch(error) {}
    return defaultTasks.slice();
  }

  function saveTasks(){
    localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
  }

  function renderTasks(){
    const today = $('todayTasks');
    const upcoming = $('upcomingTasks');
    if(today){
      if(calendarAccessToken){
        today.innerHTML = '<p style="color:#a89978;font-size:.9rem">Loading tasks from your calendar...</p>';
        loadGoogleCalendarTasks();
        return;
      }
      today.innerHTML = tasks.map((task, index) => `
        <label class="task-row ${task.done ? 'done' : ''}">
          <input type="checkbox" ${task.done ? 'checked' : ''} data-toggle="${index}" />
          <span>${escapeHtml(task.text)}</span>
          <b>${task.star ? '*' : ''}</b>
        </label>
      `).join('');
    }
    if(upcoming){
      upcoming.innerHTML = upcomingTasks.map((task) => `
        <label class="task-row upcoming">
          <input type="checkbox" />
          <span>${escapeHtml(task.text)}</span>
          <time>${escapeHtml(task.date)}</time>
        </label>
      `).join('');
    }
  }

  async function loadGoogleCalendarTasks(){
    if(!calendarAccessToken) return;
    const today = $('todayTasks');
    if(!today) return;
    try {
      const {start, end} = calendarWindow(new Date());
      const params = new URLSearchParams({
        singleEvents: 'true',
        orderBy: 'startTime',
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        maxResults: '20',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago'
      });
      const calendarId = encodeURIComponent(CONFIG.googleCalendar.calendarId || 'primary');
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params}`, {
        headers: {Authorization: 'Bearer ' + calendarAccessToken}
      });
      if(!response.ok) throw new Error('Failed to load tasks');
      const data = await response.json();
      const events = (data.items || []).filter((event) => event.status !== 'cancelled');
      today.innerHTML = events.map((event) => `
        <label class="task-row" data-event-id="${escapeHtml(event.id)}">
          <input type="checkbox" data-event-id="${escapeHtml(event.id)}" />
          <span>${escapeHtml(event.summary || 'Untitled')}</span>
          <button class="delete-task" type="button" data-event-id="${escapeHtml(event.id)}" title="Remove task">×</button>
        </label>
      `).join('');
      today.addEventListener('change', handleTaskToggle);
      today.addEventListener('click', handleTaskDelete);
    } catch(error) {
      console.error('Task load error:', error);
    }
  }

  async function handleTaskToggle(event){
    if(event.target.type !== 'checkbox') return;
    const eventId = event.target.getAttribute('data-event-id');
    if(!eventId || !calendarAccessToken) return;
    try {
      const calendarId = encodeURIComponent(CONFIG.googleCalendar.calendarId || 'primary');
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`, {
        method: 'DELETE',
        headers: {Authorization: 'Bearer ' + calendarAccessToken}
      });
      renderTasks();
    } catch(error) {
      console.error('Task completion error:', error);
      event.target.checked = false;
    }
  }

  async function handleTaskDelete(event){
    const button = event.target.closest('.delete-task');
    if(!button || !calendarAccessToken) return;
    const eventId = button.getAttribute('data-event-id');
    if(!eventId) return;
    try {
      const calendarId = encodeURIComponent(CONFIG.googleCalendar.calendarId || 'primary');
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`, {
        method: 'DELETE',
        headers: {Authorization: 'Bearer ' + calendarAccessToken}
      });
      renderTasks();
    } catch(error) {
      console.error('Task delete error:', error);
    }
  }

  function addTask(){
    const input = $('taskInput');
    if(!input) return;
    const value = input.value.trim();
    if(!value) return;
    if(calendarAccessToken){
      addGoogleCalendarTask(value);
    } else {
      tasks.push({text:value, done:false, star:false});
      saveTasks();
      renderTasks();
    }
    input.value = '';
  }

  async function addGoogleCalendarTask(title){
    if(!calendarAccessToken) return;
    try {
      const now = new Date();
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
      const endTime = new Date(startTime.getTime() + 30 * 60000);
      const event = {
        summary: title,
        start: {dateTime: startTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago'},
        end: {dateTime: endTime.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago'}
      };
      const calendarId = encodeURIComponent(CONFIG.googleCalendar.calendarId || 'primary');
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + calendarAccessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
      if(!response.ok) throw new Error('Failed to create task');
      renderTasks();
    } catch(error) {
      console.error('Create task error:', error);
      alert('Could not create task. Check your calendar permissions.');
    }
  }

  function updateTime(){
    const now = new Date();
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
    $('greeting').textContent = greeting + ', Sage';
    $('clockDate').textContent = now.toLocaleDateString([], {weekday:'long', month:'long', day:'numeric', year:'numeric'});
    $('clockTime').textContent = now.toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
    $('weekday').textContent = now.toLocaleDateString([], {weekday:'long'});
    $('daynum').textContent = String(now.getDate());
    $('monthyear').textContent = now.toLocaleDateString([], {month:'long', year:'numeric'});
  }

  function routeSearch(query){
    const value = query.trim();
    if(!value) return;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(value), '_blank');
  }

  function askAi(){
    const query = $('searchInput').value.trim();
    const target = query ? 'https://chatgpt.com/?q=' + encodeURIComponent(query) : 'https://chatgpt.com/';
    window.open(target, '_blank');
  }

  function setQuote(){
    const [text, by] = quotes[Math.floor(Math.random() * quotes.length)];
    $('quoteText').textContent = '"' + text + '"';
    $('quoteBy').textContent = by;
  }

  function renderNewsItems(items){
    const list = $('newsList');
    list.innerHTML = items.slice(0, 4).map((item) => {
      let host = feeds[activeFeed].source;
      try { host = new URL(item.link || feeds[activeFeed].source).hostname; } catch(error) {}
      const date = item.pubDate ? new Date(item.pubDate) : new Date();
      return `
        <article class="news-item">
          <img class="news-logo" src="${favicon(host)}" alt="" loading="lazy" />
          <a href="${item.link || feeds[activeFeed].source}" target="_blank" rel="noopener">${escapeHtml(item.title || 'Untitled story')}</a>
          <small>${date.toLocaleString([], {hour:'numeric', minute:'2-digit', month:'short', day:'numeric'})}</small>
        </article>
      `;
    }).join('');
  }

  async function loadNews(){
    const list = $('newsList');
    if(!list) return;
    list.textContent = 'Summoning ravens...';
    try {
      const endpoint = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(feeds[activeFeed].url);
      const response = await fetch(endpoint);
      const data = await response.json();
      const items = data.items || [];
      if(!items.length) throw new Error('No feed items');
      renderNewsItems(items);
    } catch(error) {
      renderNewsItems(fallbackNews);
    }
  }

  async function loadWeather(){
    const degree = '\u00b0F';
    const pointUrl = `https://api.weather.gov/points/${CONFIG.weatherLocation.lat},${CONFIG.weatherLocation.lon}`;
    try {
      const pointResponse = await fetch(pointUrl);
      const pointData = await pointResponse.json();
      const stationListUrl = pointData.properties?.observationStations;
      if(!stationListUrl) throw new Error('No station list');

      const stationsResponse = await fetch(stationListUrl);
      const stationsData = await stationsResponse.json();
      const stationId = stationsData.features?.[0]?.properties?.stationIdentifier;
      if(!stationId) throw new Error('No station id');

      const obsResponse = await fetch(`https://api.weather.gov/stations/${stationId}/observations/latest`);
      const obsData = await obsResponse.json();
      const obs = obsData.properties;
      if(!obs) throw new Error('No observation returned');

      const tempF = obs.temperature?.value != null ? Math.round(obs.temperature.value * 9/5 + 32) : null;
      const humidity = obs.relativeHumidity?.value != null ? Math.round(obs.relativeHumidity.value) : null;
      const windValue = obs.windSpeed?.value;
      const windMph = windValue != null ? Math.round(windValue * 2.23694) : null;
      const precipValue = obs.precipitationLastHour?.value;
      const precipIn = precipValue != null ? Math.round((precipValue / 25.4) * 100) / 100 : null;
      const conditions = obs.textDescription || 'Current conditions';
      const updated = obs.timestamp ? new Date(obs.timestamp).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'}) : '--';

      $('weatherTemp').textContent = tempF != null ? tempF + degree : '--' + degree;
      $('weatherDesc').textContent = conditions;
      $('weatherHumidity').textContent = humidity != null ? humidity + '%' : '--';
      $('weatherWind').textContent = windMph != null ? windMph + ' mph' : '--';
      $('weatherRain').textContent = precipIn != null ? precipIn + ' in' : '--';
      $('weatherUpdated').textContent = updated;
      $('weatherSource').textContent = 'Source: NWS / ' + CONFIG.weatherLocationName;
    } catch(error) {
      $('weatherTemp').textContent = '--' + degree;
      $('weatherDesc').textContent = 'Unable to load NWS data';
      $('weatherHumidity').textContent = '--';
      $('weatherWind').textContent = '--';
      $('weatherRain').textContent = '--';
      $('weatherUpdated').textContent = 'NWS unavailable';
      $('weatherSource').textContent = 'Source: National Weather Service';
    }
  }

  function hydrateTheme(){
    const saved = localStorage.getItem('sage_theme');
    if(saved === 'ember') document.body.classList.add('ember-mode');
  }

  function toggleTheme(){
    document.body.classList.toggle('ember-mode');
    localStorage.setItem('sage_theme', document.body.classList.contains('ember-mode') ? 'ember' : 'night');
  }

  document.addEventListener('DOMContentLoaded', function(){
    hydrateTheme();
    renderApps('aiGrid', aiLinks);
    renderApps('toolGrid', toolLinks);
    renderQuick();
    initGoogleCalendar();
    renderFellowship();
    renderNotes();
    renderStatus();
    renderTasks();
    updateTime();
    setQuote();
    loadNews();
    loadWeather();
    setInterval(updateTime, 1000);
    setInterval(loadWeather, 10 * 60 * 1000);

    $('searchForm').addEventListener('submit', function(event){
      event.preventDefault();
      routeSearch($('searchInput').value);
    });
    $('askAi').addEventListener('click', askAi);
    $('calendarConnect').addEventListener('click', connectGoogleCalendar);
    $('newTask').addEventListener('click', function(){
      $('taskInput').focus();
      $('tasksPanel').scrollIntoView({behavior:'smooth', block:'center'});
    });
    $('addTask').addEventListener('click', addTask);
    $('taskInput').addEventListener('keydown', function(event){
      if(event.key === 'Enter') addTask();
    });
    $('clearDone').addEventListener('click', function(){
      tasks = tasks.filter((task) => !task.done);
      saveTasks();
      renderTasks();
    });
    $('todayTasks').addEventListener('change', function(event){
      if(!event.target.type || event.target.type !== 'checkbox') return;
      const index = event.target.getAttribute('data-toggle');
      if(index !== null){
        tasks[Number(index)].done = event.target.checked;
        saveTasks();
        renderTasks();
      }
    });
    $('todayTasks').addEventListener('click', function(event){
      const button = event.target.closest('.delete-task');
      if(!button) return;
      event.preventDefault();
      if(calendarAccessToken) handleTaskDelete.call({}, event);
    });
    $('themeToggle').addEventListener('click', toggleTheme);
    $('newsTabs').addEventListener('click', function(event){
      const button = event.target.closest('button[data-feed]');
      if(!button) return;
      document.querySelectorAll('#newsTabs button').forEach((tab) => tab.classList.remove('active'));
      button.classList.add('active');
      activeFeed = button.dataset.feed;
      loadNews();
    });
    $('refreshNews').addEventListener('click', loadNews);
    $('viewSource').addEventListener('click', function(){
      window.open(feeds[activeFeed].source, '_blank');
    });
    $('viewAllNews').addEventListener('click', function(){
      window.open(feeds[activeFeed].source, '_blank');
    });
  });
})();
