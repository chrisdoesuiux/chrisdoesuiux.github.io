'use strict';
const assets='../assets/munchTimer/';
let language=new URLSearchParams(location.search).get('lang')==='ja'?'ja':'en';
let buddy='mouse';
const buddies={
 mouse:{en:['Meet Mouse.','A tiny friend with an appetite for apples. And one last piece of cheese to look forward to.','Your free countdown companion'],ja:['ねずみに、こんにちは。','りんごが大好きな、小さな相棒。最後のチーズを楽しみに、ひとくちずつ。','無料で使える相棒']},
 dog:{en:['Meet Dog.','A cheerful little companion who munches through apples, with a chicken treat waiting at the finish.','Included with the one-time Premium unlock'],ja:['いぬに、こんにちは。','元気いっぱいの相棒。りんごのあとは、ごほうびのチキンが待っています。','買い切りのプレミアムに含まれます']},
 rabbit:{en:['Meet Rabbit.','A sweet little buddy who hops between apples. The last treat? A crunchy carrot, of course.','Included with the one-time Premium unlock'],ja:['うさぎに、こんにちは。','りんごの間をぴょんぴょん進む相棒。最後のごほうびは、もちろんにんじん。','買い切りのプレミアムに含まれます']}
};
function renderBuddy(){const copy=buddies[buddy][language];document.querySelector('#buddy-art').src=assets+buddy+'.webp';document.querySelector('#buddy-art').alt=language==='en'?buddy+' buddy':copy[0];['buddy-name','buddy-text','buddy-tier'].forEach((id,i)=>document.getElementById(id).textContent=copy[i]);document.querySelectorAll('[data-buddy]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.buddy===buddy)));}
function renderLanguage(){document.documentElement.lang=language;document.querySelectorAll('[data-en]').forEach(el=>{el.innerHTML=el.dataset[language]});document.querySelectorAll('[data-screen]').forEach(img=>{img.src=assets+language+'-'+img.dataset.screen+'.webp'});document.querySelector('[data-ipad]').src=assets+language+'-ipad.webp';document.querySelector('#language').textContent=language==='en'?'日本語':'English';document.querySelector('#language').setAttribute('aria-label',language==='en'?'日本語に切り替える':'Switch to English');document.title=language==='en'?'Munch Timer | A little time, together.':'ごくもぐタイマー | 小さな時間を、一緒に。';document.querySelectorAll('.brand').forEach(el=>{const span=el.querySelector('span');if(span)span.textContent=language==='en'?'Munch Timer':'ごくもぐタイマー';else el.textContent=language==='en'?'Munch Timer':'ごくもぐタイマー'});renderBuddy();}
document.querySelector('#language').addEventListener('click',()=>{language=language==='en'?'ja':'en';const url=new URL(location.href);if(language==='ja')url.searchParams.set('lang','ja');else url.searchParams.delete('lang');history.replaceState(null,'',url);renderLanguage()});
document.querySelectorAll('[data-buddy]').forEach(button=>button.addEventListener('click',()=>{buddy=button.dataset.buddy;renderBuddy()}));
renderLanguage();
