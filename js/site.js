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

  // Logo: on hover the gradients in the symbol drift and flow; a cycle always finishes before it stops
  (function(){
    var link=document.querySelector('.site-head .logo');if(!link||!link.querySelector('animateTransform'))return;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    var anims=[].slice.call(link.querySelectorAll('animateTransform.logo-flow')),hovering=false,timers=[];
    anims.forEach(function(a){a._on=false;a.addEventListener('endEvent',function(){if(hovering){try{a.beginElement();}catch(e){}}else a._on=false;});});
    function start(){hovering=true;anims.forEach(function(a){if(a._on)return;var d=+a.getAttribute('data-delay')||0;
      timers.push(setTimeout(function(){if(!hovering||a._on)return;a._on=true;try{a.beginElement();}catch(e){}},d));});}
    function stop(){hovering=false;timers.forEach(clearTimeout);timers=[];}
    link.addEventListener('mouseenter',start);link.addEventListener('mouseleave',stop);
    link.addEventListener('focus',start);link.addEventListener('blur',stop);
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
