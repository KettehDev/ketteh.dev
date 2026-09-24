(function(){
  "use strict";

  /* ============ DISCORD ID ============ */
  var DISCORD_ID = "1484976113255190733";

  /* ============ LIVE CLOCK ============ */
  var clock = document.getElementById('clock');
  function tick(){
    var d = new Date();
    var h = String(d.getHours()).padStart(2,'0');
    var m = String(d.getMinutes()).padStart(2,'0');
    var s = String(d.getSeconds()).padStart(2,'0');
    if(clock) clock.textContent = h + ':' + m + ':' + s;
  }
  tick(); setInterval(tick, 1000);

  /* ============ CURSOR ============ */
  var cur = document.getElementById('cur');
  var ring = document.getElementById('curRing');
  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function(e){
    mx = e.clientX; my = e.clientY;
    if(cur){ cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
    var overBig = e.target.closest('a, button, .work-item, .photo, .contact-links a, .stamp, .discord-card, .music-player, .music-btn');
    if(cur) cur.classList.toggle('big', !!overBig);
    if(ring) ring.classList.toggle('big', !!overBig);
  });
  function loopCursor(){
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if(ring){ ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(loopCursor);
  }
  loopCursor();

  /* ============ GRID CANVAS ============ */
  var canvas = document.getElementById('grid-canvas');
  if(canvas){
    var ctx = canvas.getContext('2d');
    var W, H, dots = [];
    var spacing = 44;
    var mouse = { x: -1000, y: -1000 };

    function resize(){
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      dots = [];
      for(var x = 0; x < W + spacing; x += spacing){
        for(var y = 0; y < H + spacing; y += spacing){
          dots.push({ x: x, y: y, cx: x, cy: y });
        }
      }
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function(e){
      mouse.x = e.clientX; mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', function(){
      mouse.x = -1000; mouse.y = -1000;
    });

    function draw(){
      ctx.clearRect(0, 0, W, H);
      for(var i = 0; i < dots.length; i++){
        var d = dots[i];
        var dx = d.x - mouse.x;
        var dy = d.y - mouse.y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        var influence = Math.max(0, 1 - dist / 220);

        var tx = d.x + (dx / (dist + 1)) * influence * 22;
        var ty = d.y + (dy / (dist + 1)) * influence * 22;
        d.cx += (tx - d.cx) * 0.15;
        d.cy += (ty - d.cy) * 0.15;

        ctx.fillStyle = influence > 0.05
          ? 'rgba(255, 59, 31, ' + (0.15 + influence * 0.7) + ')'
          : 'rgba(10, 10, 10, 0.14)';

        var size = 1 + influence * 2.5;
        ctx.fillRect(d.cx - size/2, d.cy - size/2, size, size);
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ============ NAME SPLIT ============ */
  var nameEl = document.getElementById('name');
  if(nameEl){
    var outline = nameEl.querySelector('.outline');
    if(outline){
      var text = outline.textContent;
      outline.innerHTML = '';
      for(var i = 0; i < text.length; i++){
        var sp = document.createElement('span');
        sp.className = 'char';
        sp.textContent = text[i];
        outline.appendChild(sp);
      }
    }
  }

  /* ============ SCROLL FADE ============ */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.work-item, .about h2, .photo, .contact h2, .stack-list li, .contact-links a, .mini-card').forEach(function(el, i){
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .9s cubic-bezier(.2,.9,.3,1) ' + (i * 0.04) + 's, transform .9s cubic-bezier(.2,.9,.3,1) ' + (i * 0.04) + 's';
    io.observe(el);
  });

  /* ============ MARQUEE PAUSE ============ */
  var track = document.querySelector('.marquee-track');
  var marq = document.querySelector('.marquee');
  if(marq && track){
    marq.addEventListener('mouseenter', function(){ track.style.animationPlayState = 'paused'; });
    marq.addEventListener('mouseleave', function(){ track.style.animationPlayState = 'running'; });
  }

  /* ============ WORK ITEM MAGNETIC ============ */
  document.querySelectorAll('.work-item').forEach(function(item){
    var title = item.querySelector('.work-title');
    item.addEventListener('mousemove', function(e){
      if(!title) return;
      var r = item.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      title.style.transform = 'translateX(' + (x * 14) + 'px)';
      title.style.transition = 'transform .35s cubic-bezier(.2,.9,.3,1)';
    });
    item.addEventListener('mouseleave', function(){
      if(title) title.style.transform = '';
    });
  });

  /* ============ KONAMI ============ */
  var konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  var ki = 0;
  document.addEventListener('keydown', function(e){
    if(e.key === konami[ki]){
      ki++;
      if(ki === konami.length){
        ki = 0;
        document.body.style.transition = 'filter 1s';
        document.body.style.filter = 'hue-rotate(180deg)';
        setTimeout(function(){
          document.body.style.filter = 'hue-rotate(360deg)';
          setTimeout(function(){ document.body.style.filter = ''; }, 1000);
        }, 100);
      }
    } else { ki = 0; }
  });

  /* ============ DISCORD LIVE PRESENCE (Lanyard) ============ */
  var statusMap = {
    online: 'online',
    idle: 'idle',
    dnd: 'dnd',
    offline: 'offline'
  };

  var activityTypeLabel = {
    0: 'Playing',
    1: 'Streaming',
    2: 'Listening to',
    3: 'Watching',
    4: 'Custom',
    5: 'Competing in'
  };

  function discordAvatarUrl(user){
    if(!user) return '';
    if(user.avatar){
      var ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
      return 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.' + ext + '?size=128';
    }
    var idx = user.discriminator && user.discriminator !== '0'
      ? (parseInt(user.discriminator, 10) % 5)
      : ((BigInt(user.id) >> 22n) % 6n);
    return 'https://cdn.discordapp.com/embed/avatars/' + idx + '.png';
  }

  function activityAssetUrl(appId, assetId){
    if(!appId || !assetId) return '';
    if(assetId.startsWith('mp:external/')) return '';
    if(assetId.startsWith('spotify:')) return 'https://i.scdn.co/image/' + assetId.replace('spotify:', '');
    return 'https://cdn.discordapp.com/app-assets/' + appId + '/' + assetId + '.png';
  }

  function fmtTime(ms){
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + String(sec).padStart(2, '0');
  }

  function renderDiscord(data){
    var content = document.getElementById('dcContent');
    if(!content) return;

    if(!data){
      content.innerHTML = '<div class="dc-error">◉ Could not reach Discord API</div>';
      return;
    }

    var user = data.discord_user || {};
    var status = statusMap[data.discord_status] || 'offline';
    var activities = data.activities || [];
    var customStatus = null;
    var mainActivity = null;

    for(var i = 0; i < activities.length; i++){
      var a = activities[i];
      if(a.type === 4){
        customStatus = a;
      } else if(!mainActivity && a.type !== 4){
        mainActivity = a;
      }
    }

    if(!mainActivity && data.listening_to_spotify && data.spotify){
      mainActivity = {
        type: 2,
        name: 'Spotify',
        details: data.spotify.song,
        state: data.spotify.artist,
        assets: { large_image: data.spotify.album_art_url },
        _isSpotify: true,
        _spotify: data.spotify
      };
    }

    var avUrl = discordAvatarUrl(user);
    var displayName = user.global_name || user.display_name || user.username || 'unknown';
    var username = user.username || 'unknown';
    var nitroBadge = user.avatar && user.avatar.startsWith('a_') ? '<span class="dc-nitro">NITRO</span>' : '';

    var html = '';

    html += '<div class="dc-header">';
    html += '  <div class="dc-avatar-wrap">';
    html += '    <img class="dc-avatar" src="' + avUrl + '" alt="avatar" onerror="this.style.display=\'none\'">';
    html += '    <span class="dc-status-dot ' + status + '"></span>';
    html += '  </div>';
    html += '  <div class="dc-info">';
    html += '    <div class="dc-name-row">';
    html += '      <span class="dc-display">' + escapeHtml(displayName) + '</span>' + nitroBadge;
    html += '    </div>';
    html += '    <div class="dc-username">@' + escapeHtml(username) + '</div>';
    if(customStatus){
      var emoji = '';
      if(customStatus.emoji){
        if(customStatus.emoji.id){
          emoji = '<img src="https://cdn.discordapp.com/emojis/' + customStatus.emoji.id + '.' + (customStatus.emoji.animated ? 'gif' : 'png') + '" alt="">';
        } else {
          emoji = '<span>' + (customStatus.emoji.name || '') + '</span>';
        }
      }
      html += '    <div class="dc-custom-status">' + emoji + '<span>' + escapeHtml(customStatus.state || '') + '</span></div>';
    }
    html += '  </div>';
    html += '</div>';

    if(mainActivity){
      html += '<div class="dc-divider"></div>';
      var typeLabel = activityTypeLabel[mainActivity.type] || 'Activity';
      html += '<div class="dc-activity-label">' + typeLabel + '</div>';
      html += '<div class="dc-activity">';

      var imgUrl = '';
      if(mainActivity._isSpotify){
        imgUrl = mainActivity._spotify.album_art_url || '';
      } else if(mainActivity.assets){
        imgUrl = activityAssetUrl(mainActivity.application_id, mainActivity.assets.large_image);
      }
      if(imgUrl){
        html += '  <img class="dc-activity-img" src="' + imgUrl + '" alt="" onerror="this.style.background=\'#2b2d31\';this.removeAttribute(\'src\')">';
      } else {
        html += '  <div class="dc-activity-img"></div>';
      }

      html += '  <div style="flex:1;min-width:0">';
      html += '    <div class="dc-activity-name">' + escapeHtml(mainActivity.name || 'Unknown') + '</div>';
      if(mainActivity.details) html += '<div class="dc-activity-detail">' + escapeHtml(mainActivity.details) + '</div>';
      if(mainActivity.state) html += '<div class="dc-activity-state">' + escapeHtml(mainActivity.state) + '</div>';

      if(mainActivity._isSpotify){
        var sp = mainActivity._spotify;
        var now = sp.timestamps ? Date.now() : 0;
        var start = sp.timestamps ? sp.timestamps.start : 0;
        var end = sp.timestamps ? sp.timestamps.end : 0;
        var total = end - start;
        var elapsed = Math.max(0, Math.min(total, now - start));
        var pct = total > 0 ? (elapsed / total) * 100 : 0;
        html += '<div class="dc-spotify-bar"><div class="dc-spotify-fill" data-pct="' + pct + '" data-start="' + start + '" data-end="' + end + '"></div></div>';
        html += '<div class="dc-spotify-times"><span data-cur>' + fmtTime(elapsed) + '</span><span>' + fmtTime(total) + '</span></div>';
      } else if(mainActivity.timestamps && mainActivity.timestamps.start){
        var elapsed2 = Date.now() - mainActivity.timestamps.start;
        html += '<div class="dc-activity-time">⏱ ' + fmtTime(elapsed2) + ' elapsed</div>';
      }

      html += '  </div>';
      html += '</div>';
    } else {
      html += '<div class="dc-divider"></div>';
      html += '<div class="dc-activity-label">Status</div>';
      html += '<div style="font-size:.9rem;color:#b5bac1">No active activity right now.</div>';
    }

    content.innerHTML = html;

    content.querySelectorAll('.dc-spotify-fill').forEach(function(fill){
      fill.style.width = fill.getAttribute('data-pct') + '%';
    });

    if(mainActivity && mainActivity._isSpotify){
      startSpotifyTick(mainActivity._spotify);
    }
  }

  var spotifyInterval = null;
  function startSpotifyTick(spotify){
    if(spotifyInterval) clearInterval(spotifyInterval);
    spotifyInterval = setInterval(function(){
      var fills = document.querySelectorAll('.dc-spotify-fill');
      var timeEls = document.querySelectorAll('[data-cur]');
      if(!fills.length) { clearInterval(spotifyInterval); return; }
      var start = parseInt(fills[0].getAttribute('data-start'), 10);
      var end = parseInt(fills[0].getAttribute('data-end'), 10);
      var total = end - start;
      var elapsed = Math.max(0, Math.min(total, Date.now() - start));
      var pct = total > 0 ? (elapsed / total) * 100 : 0;
      fills[0].style.width = pct + '%';
      if(timeEls[0]) timeEls[0].textContent = fmtTime(elapsed);
    }, 1000);
  }

  function escapeHtml(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  function fetchDiscord(){
    fetch('https://api.lanyard.rest/v1/users/' + DISCORD_ID, { cache: 'no-store' })
      .then(function(r){ return r.json(); })
      .then(function(json){
        if(json && json.success && json.data){
          renderDiscord(json.data);
        } else {
          renderDiscord(null);
        }
      })
      .catch(function(){
        renderDiscord(null);
      });
  }

  fetchDiscord();
  setInterval(fetchDiscord, 15000);

  /* ============ SITE MUSIC ============ */
  (function initMusic(){
    var player = document.getElementById('musicPlayer');
    var audio = document.getElementById('siteAudio');
    var btn = document.getElementById('musicBtn');

    if(!player || !audio || !btn) return;

    // Fixed volume — change this number if you want it louder/quieter (0 to 1)
    audio.volume = 0.35;

    var savedTime = parseFloat(localStorage.getItem('kt_music_time') || '0');

    audio.addEventListener('loadedmetadata', function(){
      if(savedTime > 0 && savedTime < audio.duration - 3){
        audio.currentTime = savedTime;
      }
    }, { once: true });

    setTimeout(function(){ player.classList.add('show'); }, 900);

    btn.addEventListener('click', function(){
      if(audio.paused){
        audio.play().then(function(){
          btn.classList.add('playing');
          btn.setAttribute('aria-label', 'Pause music');
        }).catch(function(err){
          console.warn('Play failed:', err);
        });
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.setAttribute('aria-label', 'Play music');
      }
    });

    setInterval(function(){
      if(!audio.paused && audio.currentTime > 0){
        localStorage.setItem('kt_music_time', audio.currentTime.toFixed(2));
      }
    }, 3000);

    window.addEventListener('beforeunload', function(){
      if(audio.currentTime > 0){
        localStorage.setItem('kt_music_time', audio.currentTime.toFixed(2));
      }
    });

    document.addEventListener('keydown', function(e){
      if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if(e.key === 'm' || e.key === 'M'){
        btn.click();
      }
      if(e.code === 'Space'){
        e.preventDefault();
        btn.click();
      }
    });
  })();

  console.log('%c ketteh © 2026 ', 'background:#ff3b1f; color:#0a0a0a; font-weight:900; padding:4px 8px;');
  console.log('%c discord id: ' + DISCORD_ID, 'color:#5865f2; font-weight:700;');

})();
