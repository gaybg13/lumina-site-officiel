document.addEventListener("DOMContentLoaded",()=>{
 const year=document.getElementById("year");if(year)year.textContent=String(new Date().getFullYear());
 const toggle=document.querySelector(".site-header .menu-toggle");
 const nav=document.querySelector(".site-header .site-menu");
 if(toggle&&nav){
   toggle.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");toggle.setAttribute("aria-expanded",String(open));const symbol=toggle.querySelector("span");if(symbol)symbol.textContent=open?"×":"☰"});
   nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("is-open");toggle.setAttribute("aria-expanded","false");const symbol=toggle.querySelector("span");if(symbol)symbol.textContent="☰"}));
   document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("is-open")){nav.classList.remove("is-open");toggle.setAttribute("aria-expanded","false");const symbol=toggle.querySelector("span");if(symbol)symbol.textContent="☰";toggle.focus()}});
 }
 if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.09});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el))}
 else document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
 const form=document.getElementById("contact-form");
 if(form)form.addEventListener("submit",e=>{e.preventDefault();const data=new FormData(form);const body="Nom : "+data.get("nom")+"\nEmail : "+data.get("email")+"\nDemande : "+data.get("type")+"\n\n"+data.get("message");const mailto=document.querySelector(".contact-mail")?.getAttribute("href");const recipient=mailto&&/^mailto:[^?]+$/.test(mailto)?mailto:"mailto:contact@choeurlumina.fr";window.location.href=recipient+"?subject="+encodeURIComponent("Site Lumina — "+data.get("type"))+"&body="+encodeURIComponent(body)});
});
