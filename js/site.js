(function(){
  // Re-align to #section links once fonts and images have settled the layout
  if(location.hash.length>1){window.addEventListener('load',function(){var t=document.getElementById(location.hash.slice(1));if(t)t.scrollIntoView({block:'start'});});}
  // Sticky header: full size at the top of the page, compact once scrolled
  var head=document.querySelector('.site-head');
  function onScroll(){head.classList.toggle('is-scrolled',window.scrollY>24);}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  var nav=document.getElementById('nav'),menuBtn=document.getElementById('menuBtn');
  menuBtn.addEventListener('click',function(){var o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o?'true':'false');});

  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var txt=b.getAttribute('data-copy');
      function done(){b.textContent='Copied';setTimeout(function(){b.textContent='Copy email';},1800);}
      try{navigator.clipboard.writeText(txt).then(done,function(){sel(b.previousElementSibling);});}catch(e){sel(b.previousElementSibling);}
    });
  });
  function sel(el){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);}


  // Scroll reveals: elements ease in as they enter the viewport, staggered within each batch
  (function(){
    var root=document.documentElement;window.__rv=1;
    // images fade in once loaded
    document.querySelectorAll('img[loading="lazy"]').forEach(function(img){
      function ok(){img.classList.add('is-loaded');}
      if(img.complete&&img.naturalWidth)ok();else{img.addEventListener('load',ok);img.addEventListener('error',ok);}
    });
    if(!root.classList.contains('motion')||!('IntersectionObserver' in window)){root.classList.remove('motion');return;}
    var sel='main section:not(.hero) :is(.eyebrow,.hw-eyebrow,h1,h2,.lede,.prose,.body-hw,.hardest-body,.hw-body,.purpose,.quote,.textlink,.cap-grid>*,.diff>li,.three>*,.timeline>*,.people>*,.stat,.rp-card,div:has(>.btn),form),.hw-rule,.eitl-media,.frame,.side-photo,.rp,.hw-graphic,.hardest,.diff-band';
    var els;try{els=[].slice.call(document.querySelectorAll(sel));}catch(e){root.classList.remove('motion');return;}
    var io=new IntersectionObserver(function(entries){
      var inView=entries.filter(function(e){return e.isIntersecting;}).map(function(e){return e.target;});
      inView.sort(function(a,b){return a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1;});
      inView.forEach(function(el,i){el.style.setProperty('--rd',Math.min(i*90,630)+'ms');el.classList.add('rv-anim','is-in');io.unobserve(el);
        setTimeout(function(){el.classList.remove('rv-anim');el.style.removeProperty('--rd');},2200);});
    },{rootMargin:'0px 0px -8% 0px',threshold:0.12});
    // the layered graphic waits until most of it is on screen so the build is seen
    var io2=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io2.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px',threshold:0.6});
    els.forEach(function(el){if(el.classList.contains('hw-graphic'))io2.observe(el);else io.observe(el);});
  })();

  // Hero: starts framed, then eases out to full bleed (and the photo zooms in) as you scroll
  (function(){
    var hero=document.querySelector('.hero');if(!hero||!document.documentElement.classList.contains('motion'))return;
    var ticking=false,last=-1;
    function upd(){ticking=false;
      var w=hero.clientWidth||innerWidth,dist=Math.max(280,innerHeight*.6);
      var t=Math.min(1,Math.max(0,scrollY/dist));t=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
      var p=1-t; /* 1 = framed (at rest), 0 = full bleed (scrolled) */
      if(p===last)return;last=p;hero.style.setProperty('--hp',p.toFixed(3));}
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd);}},{passive:true});
    window.addEventListener('resize',upd);upd();
  })();

  // Logo: on hover the gradients in the symbol flow through once and settle back
  (function(){
    var link=document.querySelector('.site-head .logo');if(!link||!link.querySelector('animateTransform'))return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var anims=[].slice.call(link.querySelectorAll('animateTransform.logo-flow'));
    anims.forEach(function(a){a._on=false;a.addEventListener('endEvent',function(){a._on=false;});});
    function play(){if(anims.some(function(a){return a._on;}))return;
      anims.forEach(function(a){a._on=true;setTimeout(function(){try{a.beginElement();}catch(e){a._on=false;}},+a.getAttribute('data-delay')||0);});}
    link.addEventListener('mouseenter',play);link.addEventListener('focus',play);
  })();

  // Closing CTA + footer share one background mark: measure them so it lines up across both
  (function(){
    var foot=document.querySelector('.site-foot');if(!foot)return;var cta=document.querySelector('.cta');var root=document.documentElement;
    function m(){var ch=cta?cta.getBoundingClientRect().height:0,fh=foot.getBoundingClientRect().height;
      root.style.setProperty('--cta-h',ch+'px');root.style.setProperty('--end-h',(ch+fh)+'px');}
    m();window.addEventListener('load',m);if('ResizeObserver' in window){var ro=new ResizeObserver(m);ro.observe(foot);if(cta)ro.observe(cta);}else window.addEventListener('resize',m);
  })();

  // Capabilities: highlight the capability whose section is in view, and keep its chip visible in the bar
  (function(){
    var bar=document.querySelector('.cap-index');if(!bar||!('IntersectionObserver' in window))return;
    var links=[].slice.call(bar.querySelectorAll('a')),map={};
    links.forEach(function(a){var id=a.getAttribute('href').split('#')[1];var sec=document.getElementById(id);if(sec)map[id]=a;});
    function set(id){links.forEach(function(a){a.classList.toggle('is-active',a===map[id]);if(a===map[id])a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
      var a=map[id];if(a){var l=a.offsetLeft-bar.offsetLeft,r=l+a.offsetWidth;if(l<bar.scrollLeft||r>bar.scrollLeft+bar.clientWidth)bar.scrollTo({left:l-16,behavior:'smooth'});}}
    // the active capability is the last section whose top has passed a line just under the bar;
    // as soon as the bar pins, the first capability is active
    var wrapBar=bar.closest('.cap-index-bar'),ids=Object.keys(map),cur,tick=false;
    function upd(){tick=false;var bb=wrapBar.getBoundingClientRect(),line=bb.bottom+Math.min(200,innerHeight*.25),pinned=bb.top<=parseFloat(getComputedStyle(wrapBar).top)+1,id=null;
      ids.forEach(function(k){if(document.getElementById(k).getBoundingClientRect().top<=line)id=k;});
      if(!pinned)id=null;else if(!id)id=ids[0];if(id!==cur){cur=id;set(id);}}
    window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
    window.addEventListener('resize',upd);upd();
  })();
  var f=document.getElementById('contactForm');if(!f)return;var err=document.getElementById('cf-err'),st=document.getElementById('cf-status');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var el=f.elements,name=el['name'].value.trim(),email=el['email'].value.trim(),msg=el['message'].value.trim(),miss=[];
    if(!name)miss.push('your name');
    if(!email||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))miss.push('a valid email');
    if(!msg)miss.push('a message');
    st.hidden=true;
    if(miss.length){err.textContent='Please add '+miss.join(', ').replace(/, ([^,]*)$/,' and $1')+'.';err.hidden=false;return;}
    err.hidden=true;
    st.textContent='Thanks, '+name.split(' ')[0]+'. This is a preview, so nothing was sent. At launch this form will deliver to hello@inclinedanalytics.com.';
    st.hidden=false;
  });
})();
