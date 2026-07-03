function e(e,t,i,r){var s,o=arguments.length,n=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(s=e[a])&&(n=(o<3?s(n):o>3?s(t,i,n):s(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),s=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}}const n=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,r))(t)})(e):e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var a;const l=window,d=l.trustedTypes,c=d?d.emptyScript:"",p=l.reactiveElementPolyfillSupport,u={toAttribute(e,t){switch(t){case Boolean:e=e?c:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},h=(e,t)=>t!==e&&(t==t||e==e),f={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:h},m="finalized";class g extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach((t,i)=>{const r=this._$Ep(i,t);void 0!==r&&(this._$Ev.set(r,i),e.push(r))}),e}static createProperty(e,t=f){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const i="symbol"==typeof e?Symbol():"__"+e,r=this.getPropertyDescriptor(e,i,t);void 0!==r&&Object.defineProperty(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){return{get(){return this[t]},set(r){const s=this[e];this[t]=r,this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||f}static finalize(){if(this.hasOwnProperty(m))return!1;this[m]=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const i of t)this.createProperty(i,e[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(n(e))}else void 0!==e&&t.push(n(e));return t}static _$Ep(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach(e=>e(this))}addController(e){var t,i;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(i=e.hostConnected)||void 0===i||i.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;const r=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,r)=>{i?e.adoptedStyleSheets=r.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):r.forEach(i=>{const r=document.createElement("style"),s=t.litNonce;void 0!==s&&r.setAttribute("nonce",s),r.textContent=i.cssText,e.appendChild(r)})})(r,this.constructor.elementStyles),r}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach(e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)})}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach(e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t,i=f){var r;const s=this.constructor._$Ep(e,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==(null===(r=i.converter)||void 0===r?void 0:r.toAttribute)?i.converter:u).toAttribute(t,i.type);this._$El=e,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$El=null}}_$AK(e,t){var i;const r=this.constructor,s=r._$Ev.get(e);if(void 0!==s&&this._$El!==s){const e=r.getPropertyOptions(s),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(i=e.converter)||void 0===i?void 0:i.fromAttribute)?e.converter:u;this._$El=s,this[s]=o.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,i){let r=!0;void 0!==e&&(((i=i||this.constructor.getPropertyOptions(e)).hasChanged||h)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,i))):r=!1),!this.isUpdatePending&&r&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((e,t)=>this[t]=e),this._$Ei=void 0);let t=!1;const i=this._$AL;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),null===(e=this._$ES)||void 0===e||e.forEach(e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)}),this.update(i)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(i)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach(e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach((e,t)=>this._$EO(t,this[t],e)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var v;g[m]=!0,g.elementProperties=new Map,g.elementStyles=[],g.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:g}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const b=window,_=b.trustedTypes,y=_?_.createPolicy("lit-html",{createHTML:e=>e}):void 0,$="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,w="?"+x,A=`<${w}>`,k=document,C=()=>k.createComment(""),S=e=>null===e||"object"!=typeof e&&"function"!=typeof e,E=Array.isArray,z="[ \t\n\f\r]",P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,D=/>/g,N=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,R=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),U=Symbol.for("lit-noChange"),H=Symbol.for("lit-nothing"),M=new WeakMap,I=k.createTreeWalker(k,129,null,!1);function B(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==y?y.createHTML(t):t}const V=(e,t)=>{const i=e.length-1,r=[];let s,o=2===t?"<svg>":"",n=P;for(let t=0;t<i;t++){const i=e[t];let a,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===P?"!--"===l[1]?n=T:void 0!==l[1]?n=D:void 0!==l[2]?(L.test(l[2])&&(s=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=null!=s?s:P,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?N:'"'===l[3]?j:O):n===j||n===O?n=N:n===T||n===D?n=P:(n=N,s=void 0);const p=n===N&&e[t+1].startsWith("/>")?" ":"";o+=n===P?i+A:d>=0?(r.push(a),i.slice(0,d)+$+i.slice(d)+x+p):i+x+(-2===d?(r.push(void 0),t):p)}return[B(e,o+(e[i]||"<?>")+(2===t?"</svg>":"")),r]};class F{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let s=0,o=0;const n=e.length-1,a=this.parts,[l,d]=V(e,t);if(this.el=F.createElement(l,i),I.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(r=I.nextNode())&&a.length<n;){if(1===r.nodeType){if(r.hasAttributes()){const e=[];for(const t of r.getAttributeNames())if(t.endsWith($)||t.startsWith(x)){const i=d[o++];if(e.push(t),void 0!==i){const e=r.getAttribute(i.toLowerCase()+$).split(x),t=/([.?@])?(.*)/.exec(i);a.push({type:1,index:s,name:t[2],strings:e,ctor:"."===t[1]?J:"?"===t[1]?Z:"@"===t[1]?G:X})}else a.push({type:6,index:s})}for(const t of e)r.removeAttribute(t)}if(L.test(r.tagName)){const e=r.textContent.split(x),t=e.length-1;if(t>0){r.textContent=_?_.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],C()),I.nextNode(),a.push({type:2,index:++s});r.append(e[t],C())}}}else if(8===r.nodeType)if(r.data===w)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=r.data.indexOf(x,e+1));)a.push({type:7,index:s}),e+=x.length-1}s++}}static createElement(e,t){const i=k.createElement("template");return i.innerHTML=e,i}}function K(e,t,i=e,r){var s,o,n,a;if(t===U)return t;let l=void 0!==r?null===(s=i._$Co)||void 0===s?void 0:s[r]:i._$Cl;const d=S(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(e),l._$AT(e,i,r)),void 0!==r?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[r]=l:i._$Cl=l),void 0!==l&&(t=K(e,l._$AS(e,t.values),l,r)),t}class q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:i},parts:r}=this._$AD,s=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:k).importNode(i,!0);I.currentNode=s;let o=I.nextNode(),n=0,a=0,l=r[0];for(;void 0!==l;){if(n===l.index){let t;2===l.type?t=new W(o,o.nextSibling,this,e):1===l.type?t=new l.ctor(o,l.name,l.strings,this,e):6===l.type&&(t=new Q(o,this,e)),this._$AV.push(t),l=r[++a]}n!==(null==l?void 0:l.index)&&(o=I.nextNode(),n++)}return I.currentNode=k,s}v(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class W{constructor(e,t,i,r){var s;this.type=2,this._$AH=H,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cp=null===(s=null==r?void 0:r.isConnected)||void 0===s||s}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(null==e?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=K(this,e,t),S(e)?e===H||null==e||""===e?(this._$AH!==H&&this._$AR(),this._$AH=H):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):(e=>E(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]))(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==H&&S(this._$AH)?this._$AA.nextSibling.data=e:this.$(k.createTextNode(e)),this._$AH=e}g(e){var t;const{values:i,_$litType$:r}=e,s="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=F.createElement(B(r.h,r.h[0]),this.options)),r);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===s)this._$AH.v(i);else{const e=new q(s,this),t=e.u(this.options);e.v(i),this.$(t),this._$AH=e}}_$AC(e){let t=M.get(e.strings);return void 0===t&&M.set(e.strings,t=new F(e)),t}T(e){E(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const s of e)r===t.length?t.push(i=new W(this.k(C()),this.k(C()),this,this.options)):i=t[r],i._$AI(s),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cp=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class X{constructor(e,t,i,r,s){this.type=1,this._$AH=H,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=H}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,i,r){const s=this.strings;let o=!1;if(void 0===s)e=K(this,e,t,0),o=!S(e)||e!==this._$AH&&e!==U,o&&(this._$AH=e);else{const r=e;let n,a;for(e=s[0],n=0;n<s.length-1;n++)a=K(this,r[i+n],t,n),a===U&&(a=this._$AH[n]),o||(o=!S(a)||a!==this._$AH[n]),a===H?e=H:e!==H&&(e+=(null!=a?a:"")+s[n+1]),this._$AH[n]=a}o&&!r&&this.j(e)}j(e){e===H?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class J extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===H?void 0:e}}const Y=_?_.emptyScript:"";class Z extends X{constructor(){super(...arguments),this.type=4}j(e){e&&e!==H?this.element.setAttribute(this.name,Y):this.element.removeAttribute(this.name)}}class G extends X{constructor(e,t,i,r,s){super(e,t,i,r,s),this.type=5}_$AI(e,t=this){var i;if((e=null!==(i=K(this,e,t,0))&&void 0!==i?i:H)===U)return;const r=this._$AH,s=e===H&&r!==H||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==H&&(r===H||s);s&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==i?i:this.element,e):this._$AH.handleEvent(e)}}class Q{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){K(this,e)}}const ee=b.litHtmlPolyfillSupport;null==ee||ee(F,W),(null!==(v=b.litHtmlVersions)&&void 0!==v?v:b.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var te,ie;class re extends g{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const i=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=i.firstChild),i}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{var r,s;const o=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:t;let n=o._$litPart$;if(void 0===n){const e=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;o._$litPart$=n=new W(t.insertBefore(C(),e),e,void 0,null!=i?i:{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return U}}re.finalized=!0,re._$litElement$=!0,null===(te=globalThis.litElementHydrateSupport)||void 0===te||te.call(globalThis,{LitElement:re});const se=globalThis.litElementPolyfillSupport;null==se||se({LitElement:re}),(null!==(ie=globalThis.litElementVersions)&&void 0!==ie?ie:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe=e=>t=>"function"==typeof t?((e,t)=>(customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:i,elements:r}=t;return{kind:i,elements:r,finisher(t){customElements.define(e,t)}}})(e,t),ne=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(i){i.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(i){i.createProperty(t.key,e)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ae(e){return(t,i)=>void 0!==i?((e,t,i)=>{t.constructor.createProperty(i,e)})(e,t,i):ne(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function le(e){return ae({...e,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var de;null===(de=window.HTMLSlotElement)||void 0===de||de.prototype.assignedElements;const ce={category:"standard",label:""},pe={southeastern:[{matches:["city beam","707"],category:"modern",label:"CITY BEAM"},{matches:["javelin","395"],category:"javelin",label:"JAVELIN"},{matches:["376"],category:"refurb",label:"REFURB 376"},{matches:["465","466","networker"],category:"older",label:"CLASS 465"}]};function ue(e,t){for(const i of e)if(i.matches.some(e=>t.includes(e)))return{category:i.category,label:i.label};return null}function he(e,t){const i=(e||"").toLowerCase();if(!i)return ce;const r=(t||"").toLowerCase().trim();if(r){const e=Object.keys(pe).find(e=>r.includes(e));return e&&ue(pe[e],i)||ce}for(const e of Object.values(pe)){const t=ue(e,i);if(t)return t}return ce}function fe(e){if(!e)return"—";const t=e.trim();if(!t)return"—";const i=t.split(" ");return 2===i.length&&/^\d{2}:\d{2}$/.test(i[1])?i[1]:/^\d{2}:\d{2}$/.test(t)?t:2===i.length?i[1]||i[0]:t}function me(e,t){if(!/^\d{2}:\d{2}$/.test(e)||!/^\d{2}:\d{2}$/.test(t))return 0;const[i,r]=e.split(":").map(Number),[s,o]=t.split(":").map(Number);let n=60*s+o-(60*i+r);return n<-720&&(n+=1440),n>720&&(n-=1440),n}function ge(e,t){var i;if(!e)return null;if(t&&t.has(e))return null!==(i=t.get(e))&&void 0!==i?i:null;const[r,s]=e.split(" ");let o=null;if(r&&s){const e=`${r.split("-").reverse().join("-")}T${s}`,t=new Date(e);o=Number.isNaN(t.getTime())?null:t}else if(/^\d{2}:\d{2}$/.test(e)){const t=`${(new Date).toISOString().split("T")[0]}T${e}`,i=new Date(t);o=Number.isNaN(i.getTime())?null:i}return t&&t.set(e,o),o}function ve(e){var t,i;const r=e.scheduled||"",s=e.estimated||"",o=fe(r),n=fe(s);if(e.is_cancelled||(null===(t=e.status)||void 0===t?void 0:t.toLowerCase().includes("cancel"))||(null===(i=e.etd)||void 0===i?void 0:i.toLowerCase().includes("cancel"))||e.planned_cancel||e.cancel_reason||s.toLowerCase().includes("cancel"))return{statusLabel:"Cancelled",statusClass:"cancelled"};if(!s)return{statusLabel:"Awaiting",statusClass:"delayed"};if("on time"===s.toLowerCase())return{statusLabel:"On Time",statusClass:"on-time"};if(n&&o&&n!==o){const e=me(o,n);if(Math.abs(e)<=1)return{statusLabel:"On Time",statusClass:"on-time"};let t="delayed",i="Exp",r=`+${e}m`;return e<0&&(t="early",i="Early",r=`${e}m`),/^\d{2}:\d{2}$/.test(n)?{statusLabel:`${i} ${n}`,statusClass:t,offsetStr:r}:{statusLabel:n,statusClass:t,offsetStr:r}}return{statusLabel:"On Time",statusClass:"on-time"}}const be=[{name:"entity",required:!0,selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"attribute",selector:{text:{}}},{name:"stops_identifier",selector:{select:{options:[{value:"description",label:"Description (Default)"},{value:"tiploc",label:"TIPLOC"},{value:"crs",label:"CRS"}],mode:"dropdown"}}}]},{type:"grid",name:"",schema:[{name:"row_size",selector:{select:{options:[{value:"compact",label:"Compact"},{value:"normal",label:"Normal (Default)"},{value:"comfortable",label:"Comfortable"}],mode:"dropdown"}}},{name:"time_display",selector:{select:{options:[{value:"scheduled",label:"Scheduled time (Default)"},{value:"relative",label:'Countdown ("4 min")'},{value:"both",label:"Scheduled + countdown"}],mode:"dropdown"}}}]},{type:"grid",name:"",schema:[{name:"walk_time_minutes",selector:{number:{min:0,max:120,mode:"box",unit_of_measurement:"min"}}},{name:"show_carriages",selector:{boolean:{}}},{name:"stale_indicator",selector:{boolean:{}}}]},{type:"grid",name:"",schema:[{name:"font_size_time",selector:{text:{}}},{name:"font_size_destination",selector:{text:{}}},{name:"font_size_status",selector:{text:{}}}]}],_e={entity:"Entity",title:"Card Title",attribute:"Data Attribute",stops_identifier:"Station Identifier",row_size:"Row Size",time_display:"Time Display",walk_time_minutes:"Walk Time to Station",font_size_time:"Time Font Size",font_size_destination:"Destination Font Size",font_size_status:"Status Pill Font Size",show_carriages:"Show Carriage Count",stale_indicator:"Show Stale-Data Warning"},ye={entity:"Select a realtime trains sensor",attribute:"Attribute with departure data (default: next_trains)",stops_identifier:"How stations are identified in the data",row_size:"Vertical padding of the departure rows",time_display:"Show clock time, a countdown, or both",walk_time_minutes:"Highlight the first train you can still reach; earlier ones are dimmed",font_size_time:"e.g. 1.5rem (default: 1.25rem)",font_size_destination:"e.g. 1.2rem (default: 1rem)",font_size_status:"e.g. 0.85rem (default: 0.75rem)",show_carriages:"Display carriage/length details when available",stale_indicator:"Warn when the data source is stale or a refresh is overdue"};let $e=class extends re{constructor(){super(...arguments),this._computeLabel=e=>_e[e.name]||e.name,this._computeHelper=e=>ye[e.name]}setConfig(e){this._config=e}render(){return this.hass&&this._config?R`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${be}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:H}_valueChanged(e){e.stopPropagation();const t=e.detail.value,i=Object.assign(Object.assign(Object.assign({},this._config),t),{attribute:t.attribute||"next_trains",stops_identifier:t.stops_identifier||"description"});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}};e([ae({attribute:!1})],$e.prototype,"hass",void 0),e([le()],$e.prototype,"_config",void 0),$e=e([oe("train-departure-board-editor")],$e);let xe=class extends re{constructor(){super(...arguments),this.nextTrains=[],this._selectedDeparture=null,this.dateCache=new Map,this.lastEntityId=null,this._returnFocusTo=null,this._prevRowValues=new Map,this._flapCounters=new Map,this._handleKeyDown=e=>{"Escape"===e.key&&this._selectedDeparture&&this._closePopup()},this._handlePopupKeyDown=e=>{var t;if("Tab"!==e.key)return;const i=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".popup-close");i&&(e.preventDefault(),i.focus())}}static getConfigElement(){return document.createElement("train-departure-board-editor")}static getStubConfig(){return{type:"custom:train-departure-board",title:"Train Departures",entity:"",attribute:"next_trains"}}setConfig(e){if(!e)throw new Error("Invalid configuration");const t=Object.assign({attribute:"next_trains"},e);"string"==typeof t.attribute?t.attribute=t.attribute.trim()||"next_trains":t.attribute="next_trains",this.config=t}_renderMessage(e,t,i=!1){var r;return R`
      <ha-card>
        ${(null===(r=this.config)||void 0===r?void 0:r.title)?R`<div class="card-header">${this.config.title}</div>`:""}
        <div class="card">
          <div class="board-message ${i?"error":""}">
            <span class="message-icon" aria-hidden="true">${e}</span>
            <span class="message-text">${t}</span>
          </div>
        </div>
      </ha-card>
    `}_isDataStale(e){var t,i;if(!1===this.config.stale_indicator)return!1;if(!0===(null===(t=e.attributes)||void 0===t?void 0:t.data_stale))return!0;const r=null===(i=e.attributes)||void 0===i?void 0:i.next_update_at;if("string"==typeof r){const e=new Date(r).getTime();if(!Number.isNaN(e)&&Date.now()>e+6e4)return!0}return!1}render(){var e,t,i;if(!this.config)return this._renderMessage("🚆","No configuration provided",!0);if(!this.config.entity)return this._renderMessage("🚆","Please configure an entity");const r=null===(t=null===(e=this.hass)||void 0===e?void 0:e.states)||void 0===t?void 0:t[this.config.entity];if(!r)return this._renderMessage("🚆",`Entity not found: ${this.config.entity}`,!0);this.lastEntityId!==this.config.entity&&(this.dateCache.clear(),this.lastEntityId=this.config.entity),this.dateCache.size>500&&this.dateCache.clear();const s=this.config.attribute||"next_trains",o=null===(i=r.attributes)||void 0===i?void 0:i[s],n=Array.isArray(o)?o:[],a=r.last_updated?new Date(r.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";void 0===o&&console.warn(`train-departure-board: attribute "${s}" was not found on entity ${this.config.entity}`),Array.isArray(o)||void 0===o||console.warn(`train-departure-board: attribute "${s}" is not an array, falling back to empty list`);const l=[this.config.font_size_time?`--train-board-time-size: ${this.config.font_size_time}`:"",this.config.font_size_destination?`--train-board-destination-size: ${this.config.font_size_destination}`:"",this.config.font_size_status?`--train-board-status-size: ${this.config.font_size_status}`:""].filter(Boolean).join("; "),d=new Date,c=Number(this.config.walk_time_minutes)||0;let p=0;c>0&&(p=n.findIndex(e=>function(e,t,i,r){const s=ge(e.estimated||e.scheduled,r);return!s||s.getTime()-i.getTime()>=6e4*t}(e,c,d,this.dateCache)));const u=this._isDataStale(r);return this._updateFlapCounters(n),R`
      <ha-card style="${l}">
        ${this.config.title?R`<div class="card-header">${this.config.title}</div>`:""}
        <div class="card">
          ${n.length>0?R`<div
                class="departure-list"
                role="list"
                aria-label="Train departures"
              >
                ${n.map((e,t)=>this.renderDepartureRow(e,t,p,d))}
              </div>`:R`<div class="board-message">
                <span class="message-icon" aria-hidden="true">🚉</span>
                <span class="message-text">No departures available</span>
              </div>`}
          ${a||u?R`<div class="footer">
                ${u?R`<span class="stale-chip" role="status"
                      >⚠ Showing last-known data</span
                    >`:""}
                ${a?R`Last updated: ${a}`:""}
              </div>`:""}
        </div>
      </ha-card>
      ${this._renderDetailsPopup()}
    `}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._handleKeyDown),this._tickTimer=window.setInterval(()=>{var e;const t=null===(e=this.config)||void 0===e?void 0:e.time_display;"relative"!==t&&"both"!==t||this.requestUpdate()},3e4)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._handleKeyDown),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0)}_departureKey(e){return e.service_uid||`${e.scheduled}-${e.destination_name}`}_updateFlapCounters(e){this._prevRowValues.size>200&&(this._prevRowValues.clear(),this._flapCounters.clear());for(const t of e){const e=this._departureKey(t),i={time:t.estimated||t.scheduled||"",platform:t.platform||"",status:ve(t).statusLabel},r=this._prevRowValues.get(e);if(r)for(const t of["time","platform","status"])if(r[t]!==i[t]){const i=`${e}:${t}`;this._flapCounters.set(i,(this._flapCounters.get(i)||0)+1)}this._prevRowValues.set(e,i)}}_flapClass(e,t){const i=this._flapCounters.get(`${this._departureKey(e)}:${t}`)||0;return 0===i?"":i%2?"flap-a":"flap-b"}_handleRowKeyDown(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showDetails(t,e))}_showDetails(e,t){var i;this._returnFocusTo=null!==(i=null==t?void 0:t.currentTarget)&&void 0!==i?i:null,this._selectedDeparture=e}_closePopup(){var e;this._selectedDeparture=null,null===(e=this._returnFocusTo)||void 0===e||e.focus(),this._returnFocusTo=null}updated(e){var t;if(super.updated(e),e.has("_selectedDeparture")&&this._selectedDeparture){const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".popup-close");null==e||e.focus()}}_handleOverlayClick(e){e.target.classList.contains("popup-overlay")&&this._closePopup()}_renderDetailsPopup(){if(!this._selectedDeparture)return H;const e=this._selectedDeparture,{statusClass:t,statusLabel:i}=ve(e),r=fe(e.scheduled),s=function(e,t="description",i){var r;const s=(e.subsequent_stops||[]).map(e=>{var r;let s="";s="tiploc"===t?(e.stop||"").trim():"crs"===t?(e.name||"").trim():(e.name||e.stop||"").trim();const o=e.scheduled||e.estimated,n=ge(o,i),a=null!==(r=null==n?void 0:n.getTime())&&void 0!==r?r:Number.POSITIVE_INFINITY,l=e.estimated,d=e.scheduled;let c="On time",p="on-time";if(l&&d){const e=fe(l),t=fe(d);if("—"!==e&&"—"!==t&&e!==t){const i=me(t,e);if(Math.abs(i)<=1)p="on-time",c="On time";else{p="delayed";let t="Exp";i<0&&(p="early",t="Early"),c=/^\d{2}:\d{2}$/.test(e)?`${t} ${e}`:e}}}return((null==l?void 0:l.toLowerCase().includes("cancel"))||e.is_cancelled)&&(c="Cancelled",p="cancelled"),{name:s,time:o?(o.split(" ")[1]||"").trim():"",timestamp:a,stopCode:e.stop||"",isPassed:!1,isCurrent:!1,isBetweenPrevious:!1,statusLabel:c,statusClass:p}}).filter(e=>e.name).sort((e,t)=>e.timestamp-t.timestamp);if(!e.last_report_station||!e.last_report_type)return s;const o=e.last_report_station,n=e.last_report_type,a=e.last_report_time?null===(r=ge(e.last_report_time,i))||void 0===r?void 0:r.getTime():void 0,l=s.findIndex(e=>e.stopCode===o);if(-1!==l){for(let e=0;e<l;e++)s[e].isPassed=!0;"Arrival"===n?(s[l].isCurrent=!0,s[l].isPassed=!1):(s[l].isPassed=!0,l+1<s.length?s[l+1].isBetweenPrevious=!0:s[l].isPassed=!0)}else if(void 0!==a&&!Number.isNaN(a)){let e=-1;for(let t=0;t<s.length&&s[t].timestamp<=a;t++)s[t].isPassed=!0,e=t;-1!==e&&e+1<s.length?s[e+1].isBetweenPrevious=!0:-1===e&&s.length>0&&(s[0].isBetweenPrevious=!0)}if(s.length>0&&s[0].isBetweenPrevious&&-1===l&&o){const t=e.last_report_time?fe(e.last_report_time):"";s.unshift({name:o,time:t,timestamp:a||0,stopCode:o,isPassed:!0,isCurrent:!1,isBetweenPrevious:!1,statusLabel:"",statusClass:""})}return s}(e,this.config.stops_identifier||"description",this.dateCache),o="cancelled"===t,n=he(e.stock,e.operator_name),a="on-time"===t?"status-ok":"cancelled"===t?"status-cancelled":"status-delayed",l=s.some(e=>e.isPassed);return R`
      <div
        class="popup-overlay"
        @click=${this._handleOverlayClick}
        @keydown=${this._handlePopupKeyDown}
      >
        <div
          class="popup-card"
          role="dialog"
          aria-modal="true"
          aria-label="Details for the ${r} to ${e.destination_name}"
        >
          <div class="modern-header">
            <div class="modern-header-top">
              <div class="modern-dest-group">
                <div class="modern-time-group">
                  <span
                    class="modern-scheduled ${o?"time-cancelled":""}"
                    >${r}</span
                  >
                  ${e.operator_name?R`<span class="modern-operator"
                        >${e.operator_name}</span
                      >`:""}
                </div>
                <h2 class="modern-dest">${e.destination_name}</h2>
              </div>
              <button
                class="popup-close"
                @click=${this._closePopup}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div class="modern-badges">
              <div class="modern-badge ${a}">
                <span style="font-size: 1.2em; line-height: 1;">●</span>
                ${i}
              </div>
              ${e.platform?R` <div class="modern-badge platform">
                    Platform ${e.platform}
                  </div>`:""}
              ${e.length?R` <div class="modern-badge carriages">
                    ${e.length} carriages
                  </div>`:""}
              ${"standard"!==n.category?R` <div
                    class="modern-badge stock-badge stock-${n.category}"
                  >
                    ${n.label}
                  </div>`:""}
            </div>
            ${this._renderJourneySummary(e)}
            ${e.last_report_station?R`<div class="last-seen">
                  Last seen at ${e.last_report_station}${e.last_report_time?` (${fe(e.last_report_time)})`:""}
                </div>`:""}
          </div>

          <div class="modern-content">
            ${s.length>0?R` <div class="timeline-container">
                  <div
                    class="modern-stops-list ${l?"has-passed":""}"
                  >
                    ${s.map(e=>R`
                        ${e.isBetweenPrevious?R`
                              <div
                                class="modern-train-pos-wrapper"
                                aria-hidden="true"
                              >
                                <div class="modern-stop-graphic">
                                  <div class="modern-train-pos">🚆</div>
                                </div>
                                <div></div>
                              </div>
                            `:""}
                        <div
                          class="modern-stop ${e.isPassed?"passed":""} ${e.isCurrent?"current":""}"
                        >
                          <div class="modern-stop-graphic">
                            <div class="modern-stop-circle"></div>
                          </div>
                          <div class="modern-stop-content">
                            <span class="modern-stop-time">${e.time}</span>
                            <div class="modern-stop-info">
                              <span class="modern-stop-name">${e.name}</span>
                              ${!e.isPassed&&e.statusLabel?R`<span
                                    class="modern-stop-status ${e.statusClass}"
                                    >${e.statusLabel}</span
                                  >`:""}
                            </div>
                          </div>
                        </div>
                      `)}
                  </div>
                </div>`:""}
          </div>
        </div>
      </div>
    `}_renderJourneySummary(e){const t=e.estimate_arrival||e.scheduled_arrival,i=[];return null!=e.journey_time_mins&&i.push(`${e.journey_time_mins} min journey`),null!=e.stops&&e.stops>0&&i.push(`${e.stops} ${1===e.stops?"stop":"stops"}`),t&&i.push(`arrives ${fe(t)}`),0===i.length?H:R`<div class="journey-summary">${i.join(" · ")}</div>`}renderDepartureRow(e,t,i=0,r=new Date){const s=fe(e.scheduled),{statusClass:o,statusLabel:n,offsetStr:a}=ve(e),l=e.platform?e.platform:null,d=t===i,c=i>0&&t<i,p="cancelled"===o,u=he(e.stock,e.operator_name),h=p?"time-cancelled":"",f=`row-size-${this.config.row_size||"normal"}`,m=!1!==this.config.show_carriages,g=["modern","javelin","refurb"].includes(u.category)?`stock-row-${u.category}`:"",v=this.config.time_display||"scheduled",b="relative"===v||"both"===v?function(e,t,i){const r=ge(e.estimated||e.scheduled,i);if(!r)return null;const s=Math.floor((r.getTime()-t.getTime())/6e4);return s<=0?"Due":`${s} min`}(e,r,this.dateCache):null,_="relative"===v&&b?b:s,y=this._flapClass(e,"status");let $=R``;if(p)$=R`<span class="status-pill cancelled ${y}"
        >Cancelled</span
      >`;else if(a){const e="early"===o;$=R`<span
        class="status-pill ${e?"early":"delayed"} ${y}"
        >${e?"Early ":""}${a}</span
      >`}return R`
      <div
        class="train ${d?"next-train":""} ${p?"cancelled-row":""} ${c?"unreachable":""} ${g} ${f}"
        role="listitem"
        tabindex="0"
        aria-haspopup="dialog"
        aria-label="${e.destination_name} at ${s}, ${n}${l?`, Platform ${l}`:""}${c?", likely out of reach":""}"
        @click=${t=>this._showDetails(e,t)}
        @keydown=${t=>this._handleRowKeyDown(t,e)}
      >
        <div class="time-wrapper ${h}">
          <span
            class="scheduled ${this._flapClass(e,"time")}"
            aria-label="Scheduled time"
            >${_}</span
          >
          ${"both"===v&&b?R`<span class="relative-time"
                >${"Due"===b?b:`in ${b}`}</span
              >`:""}
        </div>
        <div class="info-box">
          <div class="destination-col">
            <div class="destination-row">
              <h3 class="terminus">
                ${e.is_pinned?R`<span
                      class="pin-marker"
                      title="Your pinned train"
                      aria-label="Pinned train"
                      >📌</span
                    >`:""}${e.destination_name}
              </h3>
              ${$}
              ${m&&e.length?R`<span class="carriages-badge">${e.length}-car</span>`:""}
              ${l?R`<span
                    class="platform-badge ${this._flapClass(e,"platform")}"
                    aria-label="Platform ${l}"
                    >${l}</span
                  >`:""}
            </div>
          </div>
        </div>
      </div>
    `}};xe.styles=((e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new o(i,e,r)})`
    ha-card {
      height: 100%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #111);
      display: flex;
      flex-direction: column;
    }
    .card-header {
      padding: 12px 16px;
      font-size: 1.2em;
      font-weight: 500;
      color: var(--primary-text-color);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .card {
      padding: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .departure-list {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 8px;
      flex: 1;
    }
    .train {
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      padding: 8px 12px;
      background: var(--card-background-color, #fff);
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 16px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    .train:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .train:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    .train:last-child {
      border-bottom: none;
    }
    /* Row density */
    .train.row-size-compact {
      padding-top: 3px;
      padding-bottom: 3px;
      gap: 10px;
    }
    .train.row-size-comfortable {
      padding-top: 16px;
      padding-bottom: 16px;
    }
    /* Departures the viewer can no longer reach given walk_time_minutes */
    .train.unreachable {
      opacity: 0.55;
    }
    .train.next-train {
      background: var(--secondary-background-color, rgba(255, 193, 7, 0.1));
      border-left: 4px solid var(--warning-color, #ff9800);
      padding-left: 8px; /* Compensate for border */
    }
    .train.next-train:hover {
      background: rgba(255, 193, 7, 0.18);
    }
    .train.cancelled-row {
      border-left: 4px solid var(--error-color, #f44336);
      padding-left: 8px;
    }
    .train.cancelled-row.next-train {
      border-left: 4px solid var(--error-color, #f44336);
    }

    /* Right border for train type / stock */
    .train.stock-row-modern {
      border-right: 4px solid #00aeef;
      padding-right: 8px;
    }
    .train.stock-row-javelin {
      border-right: 4px solid #002d72;
      padding-right: 8px;
    }
    .train.stock-row-refurb {
      border-right: 4px solid #003366;
      padding-right: 8px;
    }
    .time-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 2px;
      flex: 0 0 auto;
      min-width: auto;
    }
    .scheduled {
      display: inline-block; /* transformable for the flap animation */
      font-size: var(--train-board-time-size, 1.25rem);
      font-weight: 700;
      line-height: 1;
      color: var(--primary-text-color, #111);
      font-family: var(--primary-font-family, sans-serif);
      font-variant-numeric: tabular-nums;
    }
    .time-cancelled .scheduled {
      color: var(--error-color, #f44336);
      text-decoration: line-through;
    }
    .relative-time {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-text-color, #666);
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }
    .scheduled.relative-primary {
      font-size: var(--train-board-time-size, 1.25rem);
    }
    .offset-pill {
      font-size: 0.85rem;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .offset-pill.late {
      background: var(--warning-color, #ffe0b2);
      color: #d32f2f;
    }
    .offset-pill.early {
      background: var(--success-color, #c8e6c9);
      color: #2e7d32;
    }
    .platform-badge {
      font-size: 0.75em;
      font-weight: 700;
      padding: 2px 6px;
      min-width: 26px;
      height: 22px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .info-box {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .destination-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
    }
    .terminus {
      margin: 0;
      font-size: var(--train-board-destination-size, 1rem);
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      color: var(--primary-text-color, #111);
    }
    .carriages-badge {
      font-size: 0.75em;
      font-weight: 700;
      padding: 2px 4px;
      width: 44px;
      height: 22px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .status-pill {
      font-size: var(--train-board-status-size, 0.75rem);
      font-weight: 700;
      padding: 2px 6px;
      height: 22px;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .status-pill.on-time {
      background: rgba(46, 125, 50, 0.1);
      color: var(--success-color, #2e7d32);
      border: 1px solid rgba(46, 125, 50, 0.25);
    }
    .status-pill.delayed {
      background: rgba(230, 81, 0, 0.1);
      color: var(--warning-color, #e65100);
      border: 1px solid rgba(230, 81, 0, 0.25);
    }
    .status-pill.early {
      background: rgba(33, 150, 243, 0.1);
      color: var(--info-color, #2196f3);
      border: 1px solid rgba(33, 150, 243, 0.25);
    }
    .status-pill.cancelled {
      background: rgba(211, 47, 47, 0.1);
      color: var(--error-color, #d32f2f);
      border: 1px solid rgba(211, 47, 47, 0.25);
    }
    /* Popup overlay styles */
    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .popup-card {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      max-width: 400px;
      width: 100%;
      max-height: 80vh;
      overflow: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    /* --- MODERN POPUP (DENSE JOURNEY FOCUS) --- */
    .modern-header {
      padding: 12px 16px;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.05),
        transparent
      );
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      position: relative;
      border-radius: 12px 12px 0 0;
    }
    .modern-header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .modern-dest-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .modern-time-group {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .modern-scheduled {
      font-size: 1.4em;
      color: var(--primary-text-color);
      font-weight: 700;
      letter-spacing: 0.5px;
      font-variant-numeric: tabular-nums;
    }
    .modern-operator {
      font-size: 0.85em;
      color: var(--secondary-text-color, #666);
      font-weight: 500;
    }
    .modern-dest {
      margin: 0;
      font-size: 1.15em;
      font-weight: 600;
      line-height: 1.2;
      color: var(--primary-text-color);
    }
    .modern-badges {
      display: flex;
      gap: 6px;
      align-items: center;
      margin-top: 8px;
    }
    .modern-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.8em;
      font-weight: 600;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
    }
    .modern-badge.status-ok {
      background: rgba(76, 175, 80, 0.15);
      color: var(--success-color, #4caf50);
    }
    .modern-badge.status-delayed {
      background: rgba(255, 152, 0, 0.15);
      color: var(--warning-color, #ff9800);
    }
    .modern-badge.status-cancelled {
      background: rgba(244, 67, 54, 0.15);
      color: var(--error-color, #f44336);
    }
    .modern-badge.platform {
      background: rgba(255, 255, 255, 0.1);
    }
    .modern-badge.stock-badge {
      font-size: 0.85em;
      padding: 4px 8px;
    }

    /* Dense Timeline */
    .timeline-container {
      padding: 12px 16px;
      background: rgba(0, 0, 0, 0.02);
    }
    .modern-stops-list {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* The Line */
    .modern-stops-list::before {
      content: '';
      position: absolute;
      left: 15px;
      transform: translateX(-50%);
      top: 14px;
      bottom: 14px;
      width: 4px;
      background: var(--info-color, #03a9f4);
      border-radius: 2px;
      z-index: 1;
    }

    /* Passed portion of the line */
    .modern-stops-list.has-passed::after {
      content: '';
      position: absolute;
      left: 15px;
      transform: translateX(-50%);
      top: 14px;
      bottom: 14px;
      width: 4px;
      background: var(--secondary-text-color, #666);
      border-radius: 2px 2px 0 0;
      z-index: 2;
      opacity: 0.5;
    }

    /* Stop rows */
    .modern-stop,
    .modern-train-pos-wrapper {
      display: grid;
      grid-template-columns: 30px 1fr;
      gap: 12px;
      align-items: center;
      position: relative;
      z-index: 3;
    }

    .modern-stop {
      padding: 8px 0;
    }
    .modern-train-pos-wrapper {
      height: 6px;
      padding: 0;
    }

    /* Graphics column */
    .modern-stop-graphic {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
    }

    /* Station Nodes */
    .modern-stop-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--card-background-color, #fff);
      border: 3px solid var(--info-color, #03a9f4);
      z-index: 4;
      transition: all 0.2s ease;
    }

    .modern-stop.passed .modern-stop-circle {
      border-color: var(--secondary-text-color, #666);
      background: var(--secondary-text-color, #666);
      width: 8px;
      height: 8px;
    }

    .modern-stop.current .modern-stop-circle {
      border-color: var(--warning-color, #ff9800);
      background: var(--warning-color, #ff9800);
    }

    /* Train Position Indicator */
    .modern-train-pos {
      width: 22px;
      height: 22px;
      background: var(--warning-color, #ff9800);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      box-shadow: 0 0 0 3px var(--card-background-color, #fff),
        0 2px 6px rgba(0, 0, 0, 0.5);
      z-index: 5;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% {
        box-shadow: 0 0 0 3px var(--card-background-color, #fff),
          0 0 0 0 rgba(255, 152, 0, 0.4);
      }
      70% {
        box-shadow: 0 0 0 3px var(--card-background-color, #fff),
          0 0 0 8px rgba(255, 152, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 3px var(--card-background-color, #fff),
          0 0 0 0 rgba(255, 152, 0, 0);
      }
    }

    .modern-stop-content {
      display: flex;
      align-items: baseline;
      gap: 12px;
      min-width: 0;
    }

    .modern-stop-time {
      font-size: 0.95em;
      font-weight: 700;
      min-width: 45px;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }

    .modern-stop-info {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      flex: 1;
      gap: 8px;
      justify-content: space-between;
      min-width: 0;
    }
    .modern-stop-name {
      font-size: 0.95em;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .modern-stop-status {
      font-size: 0.75em;
      font-weight: 600;
      white-space: nowrap;
    }
    .modern-stop-status.on-time {
      color: var(--success-color, #4caf50);
    }
    .modern-stop-status.delayed {
      color: var(--warning-color, #ff9800);
    }
    .modern-stop-status.early {
      color: var(--info-color, #2196f3);
    }
    .modern-stop-status.cancelled {
      color: var(--error-color, #f44336);
    }

    .modern-stop.passed .modern-stop-time,
    .modern-stop.passed .modern-stop-name {
      color: var(--secondary-text-color, #666);
      font-weight: 400;
    }
    .modern-stop.passed .modern-stop-status {
      display: none;
    }

    /* Terminus special styling */
    .modern-stop:last-child .modern-stop-name {
      font-weight: 700;
    }
    .modern-stop:last-child .modern-stop-circle {
      border-radius: 3px; /* Square for terminus */
      width: 14px;
      height: 14px;
    }
    .footer {
      padding: 8px 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      font-size: 0.85em;
      color: var(--secondary-text-color, #666);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      background: var(--card-background-color, #fff);
      border-radius: 0 0 8px 8px;
    }
    .stale-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 0.85em;
      font-weight: 600;
      background: rgba(230, 81, 0, 0.12);
      color: var(--warning-color, #e65100);
      border: 1px solid rgba(230, 81, 0, 0.3);
      margin-right: auto;
    }
    .board-message {
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color, #999);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .board-message .message-icon {
      font-size: 1.8em;
      line-height: 1;
      opacity: 0.7;
    }
    .board-message .message-text {
      font-size: 0.95em;
    }
    .board-message.error .message-text {
      color: var(--error-color, #d32f2f);
    }
    .popup-close {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      color: var(--primary-text-color, #111);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 1.2em;
      line-height: 1;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .popup-close:hover {
      background: var(--divider-color, rgba(0, 0, 0, 0.12));
    }
    .popup-close:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    .last-seen {
      margin-top: 8px;
      font-size: 0.8em;
      color: var(--secondary-text-color, #666);
    }
    .journey-summary {
      margin-top: 10px;
      font-size: 0.9em;
      font-weight: 500;
      color: var(--primary-text-color, #111);
    }
    .pin-marker {
      font-size: 0.8em;
      margin-right: 4px;
    }
    /* Split-flap-style flip when a displayed value changes. Two identical
       animations so consecutive changes both restart the effect. */
    @keyframes flap-a {
      0% {
        transform: rotateX(0);
      }
      50% {
        transform: rotateX(90deg);
        opacity: 0.25;
      }
      100% {
        transform: rotateX(0);
      }
    }
    @keyframes flap-b {
      0% {
        transform: rotateX(0);
      }
      50% {
        transform: rotateX(90deg);
        opacity: 0.25;
      }
      100% {
        transform: rotateX(0);
      }
    }
    .flap-a {
      animation: flap-a 0.5s ease;
    }
    .flap-b {
      animation: flap-b 0.5s ease;
    }
    @media (prefers-reduced-motion: reduce) {
      .modern-train-pos {
        animation: none;
      }
      .train {
        transition: none;
      }
      .modern-stop-circle {
        transition: none;
      }
      .flap-a,
      .flap-b {
        animation: none;
      }
    }
    .stock-badge {
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .stock-modern {
      background: linear-gradient(135deg, #00aeef 0%, #0054a6 100%);
      color: white;
    }
    .stock-javelin {
      background: #002d72;
      color: white;
      border-left: 3px solid #c0c0c0;
    }
    .stock-refurb {
      background: #003366;
      color: white;
      border-right: 3px solid #ff8200;
    }
    .stock-older {
      color: var(--secondary-text-color);
      font-weight: 600;
    }
  `,e([ae({type:Object})],xe.prototype,"hass",void 0),e([ae({type:Object})],xe.prototype,"config",void 0),e([ae({type:Array})],xe.prototype,"nextTrains",void 0),e([le()],xe.prototype,"_selectedDeparture",void 0),xe=e([oe("train-departure-board")],xe),window.customCards=window.customCards||[],window.customCards.push({type:"custom:train-departure-board",name:"Train Departure Board",description:"Display train departure information in a TFL-style board",preview:!0,support_url:"https://github.com/ivmreg/ha-train-departure-board/issues"});export{xe as TrainDepartureBoard};
//# sourceMappingURL=ha-train-departure-board.js.map
