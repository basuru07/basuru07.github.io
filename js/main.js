(function () {
	'use strict';

	var root = document.documentElement;
	root.classList.add('js');

	// ----- Theme toggle -----
	var themeBtn = document.getElementById('theme-toggle');

	function currentTheme() {
		var set = root.getAttribute('data-theme');
		if (set) return set;
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	themeBtn.addEventListener('click', function () {
		var next = currentTheme() === 'dark' ? 'light' : 'dark';
		root.setAttribute('data-theme', next);
		try { localStorage.setItem('theme', next); } catch (e) { }
	});

	// ----- Nav: scrolled state + mobile menu -----
	var nav = document.getElementById('nav');
	var menuBtn = document.getElementById('menu-toggle');
	var links = document.getElementById('nav-links');

	function onScroll() {
		nav.classList.toggle('is-scrolled', window.scrollY > 10);
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	function setMenu(open) {
		links.classList.toggle('is-open', open);
		nav.classList.toggle('menu-open', open);
		menuBtn.setAttribute('aria-expanded', String(open));
		menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	}

	menuBtn.addEventListener('click', function () {
		setMenu(!links.classList.contains('is-open'));
	});

	links.addEventListener('click', function (e) {
		if (e.target.closest('a')) setMenu(false);
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') setMenu(false);
	});

	// ----- Active section highlighting -----
	var navLinks = Array.prototype.slice.call(links.querySelectorAll('a'));
	var sections = navLinks
		.map(function (a) { return document.querySelector(a.getAttribute('href')); })
		.filter(Boolean);

	if ('IntersectionObserver' in window) {
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				navLinks.forEach(function (a) {
					a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
				});
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		sections.forEach(function (s) { spy.observe(s); });

		// ----- Reveal on scroll -----
		var revealer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					revealer.unobserve(entry.target);
				}
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

		document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });
	} else {
		document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
	}

	// ----- Project filters -----
	var filters = document.querySelectorAll('.filter');
	var projects = document.querySelectorAll('.project');

	filters.forEach(function (btn) {
		btn.addEventListener('click', function () {
			var f = btn.getAttribute('data-filter');
			filters.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
			projects.forEach(function (p) {
				var cats = p.getAttribute('data-cat').split(' ');
				var show = f === 'all' || cats.indexOf(f) !== -1;
				p.classList.toggle('is-hidden', !show);
				if (show) p.classList.add('is-visible');
			});
		});
	});

	// ----- Copy email -----
	var toast = document.getElementById('toast');
	var toastTimer;

	function showToast(msg) {
		toast.textContent = msg;
		toast.classList.add('is-visible');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
	}

	var copyBtn = document.getElementById('copy-email');
	copyBtn.addEventListener('click', function () {
		var email = copyBtn.getAttribute('data-email');
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(email).then(
				function () { showToast('Email copied to clipboard'); },
				function () { showToast(email); }
			);
		} else {
			showToast(email);
		}
	});

	// ----- Local time in Colombo -----
	var timeEl = document.getElementById('local-time');

	function tick() {
		try {
			timeEl.textContent = new Date().toLocaleTimeString('en-GB', {
				hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Colombo'
			});
		} catch (e) { }
	}
	tick();
	setInterval(tick, 30000);

	// ----- Contact terminal -----
	var EMAIL = 'yasaruwanbasuruofficial@gmail.com';
	var channels = {
		email: { label: EMAIL, url: 'mailto:' + EMAIL },
		linkedin: { label: 'linkedin.com/in/basuru-yasaruwan', url: 'https://www.linkedin.com/in/basuru-yasaruwan-805820235/' },
		github: { label: 'github.com/basuru07', url: 'https://github.com/basuru07' },
		medium: { label: 'medium.com/@FlutBack', url: 'https://medium.com/@FlutBack' },
		instagram: { label: 'instagram.com/basuruu', url: 'https://www.instagram.com/basuruu/' }
	};

	var termForm = document.getElementById('term-form');
	var termInput = document.getElementById('term-cmd');
	var termLog = document.getElementById('term-log');
	var termBody = document.getElementById('term-body');
	var history = [];
	var histPos = 0;

	function line(text, cls) {
		var p = document.createElement('p');
		if (cls) p.className = cls;
		p.textContent = text;
		termLog.appendChild(p);
		return p;
	}

	function linkLine(prefix, ch) {
		var p = line(prefix, 'out');
		var a = document.createElement('a');
		a.href = ch.url;
		a.textContent = ch.label;
		if (ch.url.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener'; }
		p.appendChild(a);
	}

	function copyEmail() {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			return navigator.clipboard.writeText(EMAIL).then(
				function () { showToast('Email copied to clipboard'); return true; },
				function () { return false; }
			);
		}
		return Promise.resolve(false);
	}

	function run(raw) {
		var cmd = raw.trim().toLowerCase().replace(/^(open|cat|\.\/)\s*/, '');
		var echo = line('', '');
		echo.innerHTML = '<span class="prompt">$</span> ';
		echo.appendChild(document.createTextNode(raw));

		if (!cmd) return;

		if (cmd === 'help' || cmd === 'ls') {
			line('channels: ' + Object.keys(channels).join(', '), 'out');
			line('also: whoami, copy, hire, clear', 'out');
		} else if (cmd === 'clear') {
			termLog.innerHTML = '';
		} else if (cmd === 'whoami') {
			line('Basuru Yasaruwan, Associate Systems Engineer at Zone24x7', 'out');
		} else if (cmd === 'copy' || cmd === 'copy email') {
			copyEmail().then(function (ok) {
				line(ok ? 'copied ' + EMAIL + ' to clipboard' : EMAIL, 'out');
			});
		} else if (cmd === 'hire' || cmd === 'sudo hire') {
			linkLine('great choice. start here: ', channels.email);
		} else if (channels[cmd]) {
			linkLine('connecting to ' + cmd + '... ', channels[cmd]);
			window.open(channels[cmd].url, cmd === 'email' ? '_self' : '_blank', 'noopener');
		} else {
			line('command not found: ' + cmd + '. Try help', 'out');
		}
		termBody.scrollTop = termBody.scrollHeight;
	}

	termForm.addEventListener('submit', function (e) {
		e.preventDefault();
		var v = termInput.value;
		if (v.trim()) { history.push(v); }
		histPos = history.length;
		termInput.value = '';
		run(v);
	});

	termInput.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowUp' && histPos > 0) {
			histPos--;
			termInput.value = history[histPos];
			e.preventDefault();
		} else if (e.key === 'ArrowDown' && histPos < history.length) {
			histPos++;
			termInput.value = history[histPos] || '';
			e.preventDefault();
		} else if (e.key === 'Tab' && termInput.value) {
			var all = Object.keys(channels).concat(['help', 'whoami', 'copy', 'hire', 'clear']);
			var match = all.filter(function (c) { return c.indexOf(termInput.value.toLowerCase()) === 0; });
			if (match.length === 1) { termInput.value = match[0]; e.preventDefault(); }
		}
	});

	// ----- Footer year -----
	document.getElementById('year').textContent = new Date().getFullYear();
})();
