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
