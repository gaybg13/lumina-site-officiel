import {initializeApp} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {getAuth,signInAnonymously,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {getFirestore,collection,doc,setDoc,getDoc,onSnapshot,query,orderBy,serverTimestamp} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const form=document.querySelector("#review-form");
const status=document.querySelector("#review-status");
const list=document.querySelector("#reviews-list");
const summary=document.querySelector("#reviews-summary");
const submit=form.querySelector('button[type="submit"]');
const inputs=[...document.querySelectorAll('input[name="rating"]')];
const config=window.LUMINA_REVIEWS_FIREBASE_CONFIG;
let currentUser=null;
function notice(message){status.textContent=message}
function drawRating(){const selected=inputs.find(i=>i.checked);const rating=selected?Number(selected.value):0;inputs.forEach(i=>i.closest("label").classList.toggle("filled",Number(i.value)<=rating));document.querySelector("#rating-label").textContent=rating?rating+" étoile"+(rating>1?"s":"")+" sur 5":"Choisissez une note de 1 à 5 étoiles."}
inputs.forEach(i=>i.addEventListener("change",drawRating));
function el(tag,cls,text){const item=document.createElement(tag);if(cls)item.className=cls;if(text!==undefined)item.textContent=text;return item}
function showReviews(items){
  list.replaceChildren();
  if(!items.length){list.append(el("p","avis-empty","Aucun avis publié pour le moment. Soyez la première personne à partager votre expérience."));summary.hidden=true;return}
  summary.hidden=false;
  const average=items.reduce((total,r)=>total+r.rating,0)/items.length;
  document.querySelector("#reviews-average").textContent=average.toLocaleString("fr-FR",{minimumFractionDigits:1,maximumFractionDigits:1})+"/5";
  document.querySelector("#reviews-count").textContent=items.length+" avis publié"+(items.length>1?"s":"");
  items.forEach(r=>{
    const article=el("article","review-item");
    const top=el("div","review-top");
    top.append(el("strong","",r.name),el("span","review-stars","★".repeat(r.rating)+"☆".repeat(5-r.rating)));
    const sub=el("p","review-category",r.event);
    const p=el("p","review-comment",r.comment);
    article.append(top,sub,p);list.append(article)
  })
}
const toggle=document.querySelector(".menu-toggle"),menu=document.querySelector("#site-menu");
if(toggle&&menu)toggle.addEventListener("click",()=>{const opened=menu.classList.toggle("is-open");toggle.setAttribute("aria-expanded",String(opened));toggle.querySelector("span").textContent=opened?"×":"☰"});
if(!config||!config.apiKey||!config.projectId||config.apiKey.startsWith("A_COMPLETER")){
  submit.disabled=true;
  notice("L'espace d'avis est en cours de configuration. La publication sera activée prochainement.");
  list.replaceChildren(el("p","avis-empty","Les avis publics seront disponibles après l'activation du service."));
}else{
  try{
    const app=initializeApp(config,"lumina-public-reviews");
    const auth=getAuth(app);
    const db=getFirestore(app);
    const reviews=collection(db,"publicReviews");
    onSnapshot(query(reviews,orderBy("createdAt","desc")),(snapshot)=>{
      showReviews(snapshot.docs.map(d=>d.data()).filter(r=>Number.isInteger(r.rating)&&r.rating>=1&&r.rating<=5).slice(0,100));
    },()=>{list.replaceChildren(el("p","avis-empty","Les avis sont temporairement indisponibles."))});
    onAuthStateChanged(auth,(user)=>{currentUser=user;submit.disabled=!user;if(!user)notice("Connexion anonyme en cours…");else notice("")});
    signInAnonymously(auth).catch(()=>{notice("Impossible d'activer l'envoi d'avis pour le moment. Réessayez plus tard.");submit.disabled=true});
    form.addEventListener("submit",async(event)=>{
      event.preventDefault();
      if(!form.reportValidity()||!currentUser)return;
      const data=new FormData(form),name=String(data.get("name")||"").trim(),type=String(data.get("event")||""),rating=Number(data.get("rating")),comment=String(data.get("comment")||"").trim();
      const allowed=["Mariage","Messe ou cérémonie religieuse","Concert","Hommage ou requiem","Événement privé ou associatif","Autre prestation"];
      if(name.length<2||name.length>100||comment.length<10||comment.length>2000||!allowed.includes(type)||!Number.isInteger(rating)||rating<1||rating>5||!data.get("consent")){notice("Vérifiez le nom, la note, la catégorie et le commentaire (au moins 10 caractères).");return}
      submit.disabled=true;notice("Publication de votre avis…");
      try{
        const ref=doc(db,"publicReviews",currentUser.uid);
        if((await getDoc(ref)).exists()){notice("Un avis a déjà été publié depuis ce navigateur. Contactez-nous pour demander une modification.");return}
        await setDoc(ref,{name,event:type,rating,comment,createdAt:serverTimestamp()});
        form.reset();drawRating();notice("Votre avis est publié. Merci pour votre retour !");
      }catch(error){notice(error.code==="permission-denied"?"Envoi refusé : un avis existe peut-être déjà, ou le service doit encore être activé.":"Publication impossible pour le moment. Merci de réessayer.");}
      finally{submit.disabled=false}
    });
  }catch(error){submit.disabled=true;notice("Le service d'avis n'est pas encore disponible.");list.replaceChildren(el("p","avis-empty","Les avis sont temporairement indisponibles."))}
}
