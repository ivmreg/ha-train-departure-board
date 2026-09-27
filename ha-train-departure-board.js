function e(e,t,r,i){var n,o=arguments.length,a=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,r,a):n(t,r))||a);return o>3&&a&&Object.defineProperty(t,r,a),a}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,r=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;class o{constructor(e,t,r){if(this._$cssResult$=!0,r!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(r&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=n.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&n.set(t,e))}return e}toString(){return this.cssText}}const a=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,i))(t)})(e):e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s;const l=window,d=l.trustedTypes,c=d?d.emptyScript:"",p=l.reactiveElementPolyfillSupport,u={toAttribute(e,t){switch(t){case Boolean:e=e?c:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},h=(e,t)=>t!==e&&(t==t||e==e),m={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:h},g="finalized";class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),(null!==(t=this.h)&&void 0!==t?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach((t,r)=>{const i=this._$Ep(r,t);void 0!==i&&(this._$Ev.set(i,r),e.push(i))}),e}static createProperty(e,t=m){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const r="symbol"==typeof e?Symbol():"__"+e,i=this.getPropertyDescriptor(e,r,t);void 0!==i&&Object.defineProperty(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(i){const n=this[e];this[t]=i,this.requestUpdate(e,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||m}static finalize(){if(this.hasOwnProperty(g))return!1;this[g]=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),void 0!==e.h&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const r of t)this.createProperty(r,e[r])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Ep(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(e=this.constructor.h)||void 0===e||e.forEach(e=>e(this))}addController(e){var t,r;(null!==(t=this._$ES)&&void 0!==t?t:this._$ES=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(r=e.hostConnected)||void 0===r||r.call(e))}removeController(e){var t;null===(t=this._$ES)||void 0===t||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;const i=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,i)=>{r?e.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet):i.forEach(r=>{const i=document.createElement("style"),n=t.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=r.cssText,e.appendChild(i)})})(i,this.constructor.elementStyles),i}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this._$ES)||void 0===e||e.forEach(e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)})}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this._$ES)||void 0===e||e.forEach(e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=m){var i;const n=this.constructor._$Ep(e,r);if(void 0!==n&&!0===r.reflect){const o=(void 0!==(null===(i=r.converter)||void 0===i?void 0:i.toAttribute)?r.converter:u).toAttribute(t,r.type);this._$El=e,null==o?this.removeAttribute(n):this.setAttribute(n,o),this._$El=null}}_$AK(e,t){var r;const i=this.constructor,n=i._$Ev.get(e);if(void 0!==n&&this._$El!==n){const e=i.getPropertyOptions(n),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null===(r=e.converter)||void 0===r?void 0:r.fromAttribute)?e.converter:u;this._$El=n,this[n]=o.fromAttribute(t,e.type),this._$El=null}}requestUpdate(e,t,r){let i=!0;void 0!==e&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||h)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),!0===r.reflect&&this._$El!==e&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(e,r))):i=!1),!this.isUpdatePending&&i&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((e,t)=>this[t]=e),this._$Ei=void 0);let t=!1;const r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),null===(e=this._$ES)||void 0===e||e.forEach(e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)}),this.update(r)):this._$Ek()}catch(e){throw t=!1,this._$Ek(),e}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;null===(t=this._$ES)||void 0===t||t.forEach(e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){void 0!==this._$EC&&(this._$EC.forEach((e,t)=>this._$EO(t,this[t],e)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var v;f[g]=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:f}),(null!==(s=l.reactiveElementVersions)&&void 0!==s?s:l.reactiveElementVersions=[]).push("1.6.3");const b=window,y=b.trustedTypes,_=y?y.createPolicy("lit-html",{createHTML:e=>e}):void 0,x="$lit$",$=`lit$${(Math.random()+"").slice(9)}$`,w="?"+$,k=`<${w}>`,A=document,S=()=>A.createComment(""),E=e=>null===e||"object"!=typeof e&&"function"!=typeof e,z=Array.isArray,C="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,P=/>/g,j=RegExp(`>|${C}(?:([^\\s"'>=/]+)(${C}*=${C}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,R=/"/g,U=/^(?:script|style|textarea|title)$/i,O=(e=>(t,...r)=>({_$litType$:e,strings:t,values:r}))(1),M=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),H=new WeakMap,I=A.createTreeWalker(A,129,null,!1);function L(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==_?_.createHTML(t):t}const K=(e,t)=>{const r=e.length-1,i=[];let n,o=2===t?"<svg>":"",a=D;for(let t=0;t<r;t++){const r=e[t];let s,l,d=-1,c=0;for(;c<r.length&&(a.lastIndex=c,l=a.exec(r),null!==l);)c=a.lastIndex,a===D?"!--"===l[1]?a=T:void 0!==l[1]?a=P:void 0!==l[2]?(U.test(l[2])&&(n=RegExp("</"+l[2],"g")),a=j):void 0!==l[3]&&(a=j):a===j?">"===l[0]?(a=null!=n?n:D,d=-1):void 0===l[1]?d=-2:(d=a.lastIndex-l[2].length,s=l[1],a=void 0===l[3]?j:'"'===l[3]?R:N):a===R||a===N?a=j:a===T||a===P?a=D:(a=j,n=void 0);const p=a===j&&e[t+1].startsWith("/>")?" ":"";o+=a===D?r+k:d>=0?(i.push(s),r.slice(0,d)+x+r.slice(d)+$+p):r+$+(-2===d?(i.push(void 0),t):p)}return[L(e,o+(e[r]||"<?>")+(2===t?"</svg>":"")),i]};class F{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let n=0,o=0;const a=e.length-1,s=this.parts,[l,d]=K(e,t);if(this.el=F.createElement(l,r),I.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(i=I.nextNode())&&s.length<a;){if(1===i.nodeType){if(i.hasAttributes()){const e=[];for(const t of i.getAttributeNames())if(t.endsWith(x)||t.startsWith($)){const r=d[o++];if(e.push(t),void 0!==r){const e=i.getAttribute(r.toLowerCase()+x).split($),t=/([.?@])?(.*)/.exec(r);s.push({type:1,index:n,name:t[2],strings:e,ctor:"."===t[1]?J:"?"===t[1]?Z:"@"===t[1]?G:X})}else s.push({type:6,index:n})}for(const t of e)i.removeAttribute(t)}if(U.test(i.tagName)){const e=i.textContent.split($),t=e.length-1;if(t>0){i.textContent=y?y.emptyScript:"";for(let r=0;r<t;r++)i.append(e[r],S()),I.nextNode(),s.push({type:2,index:++n});i.append(e[t],S())}}}else if(8===i.nodeType)if(i.data===w)s.push({type:2,index:n});else{let e=-1;for(;-1!==(e=i.data.indexOf($,e+1));)s.push({type:7,index:n}),e+=$.length-1}n++}}static createElement(e,t){const r=A.createElement("template");return r.innerHTML=e,r}}function V(e,t,r=e,i){var n,o,a,s;if(t===M)return t;let l=void 0!==i?null===(n=r._$Co)||void 0===n?void 0:n[i]:r._$Cl;const d=E(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(e),l._$AT(e,r,i)),void 0!==i?(null!==(a=(s=r)._$Co)&&void 0!==a?a:s._$Co=[])[i]=l:r._$Cl=l),void 0!==l&&(t=V(e,l._$AS(e,t.values),l,i)),t}class W{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:r},parts:i}=this._$AD,n=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:A).importNode(r,!0);I.currentNode=n;let o=I.nextNode(),a=0,s=0,l=i[0];for(;void 0!==l;){if(a===l.index){let t;2===l.type?t=new q(o,o.nextSibling,this,e):1===l.type?t=new l.ctor(o,l.name,l.strings,this,e):6===l.type&&(t=new Q(o,this,e)),this._$AV.push(t),l=i[++s]}a!==(null==l?void 0:l.index)&&(o=I.nextNode(),a++)}return I.currentNode=A,n}v(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class q{constructor(e,t,r,i){var n;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cp=null===(n=null==i?void 0:i.isConnected)||void 0===n||n}get _$AU(){var e,t;return null!==(t=null===(e=this._$AM)||void 0===e?void 0:e._$AU)&&void 0!==t?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(null==e?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=V(this,e,t),E(e)?e===B||null==e||""===e?(this._$AH!==B&&this._$AR(),this._$AH=B):e!==this._$AH&&e!==M&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):(e=>z(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]))(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==B&&E(this._$AH)?this._$AA.nextSibling.data=e:this.$(A.createTextNode(e)),this._$AH=e}g(e){var t;const{values:r,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=F.createElement(L(i.h,i.h[0]),this.options)),i);if((null===(t=this._$AH)||void 0===t?void 0:t._$AD)===n)this._$AH.v(r);else{const e=new W(n,this),t=e.u(this.options);e.v(r),this.$(t),this._$AH=e}}_$AC(e){let t=H.get(e.strings);return void 0===t&&H.set(e.strings,t=new F(e)),t}T(e){z(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const n of e)i===t.length?t.push(r=new q(this.k(S()),this.k(S()),this,this.options)):r=t[i],r._$AI(n),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var r;for(null===(r=this._$AP)||void 0===r||r.call(this,!1,!0,t);e&&e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cp=e,null===(t=this._$AP)||void 0===t||t.call(this,e))}}class X{constructor(e,t,r,i,n){this.type=1,this._$AH=B,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=n,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,i){const n=this.strings;let o=!1;if(void 0===n)e=V(this,e,t,0),o=!E(e)||e!==this._$AH&&e!==M,o&&(this._$AH=e);else{const i=e;let a,s;for(e=n[0],a=0;a<n.length-1;a++)s=V(this,i[r+a],t,a),s===M&&(s=this._$AH[a]),o||(o=!E(s)||s!==this._$AH[a]),s===B?e=B:e!==B&&(e+=(null!=s?s:"")+n[a+1]),this._$AH[a]=s}o&&!i&&this.j(e)}j(e){e===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}}class J extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===B?void 0:e}}const Y=y?y.emptyScript:"";class Z extends X{constructor(){super(...arguments),this.type=4}j(e){e&&e!==B?this.element.setAttribute(this.name,Y):this.element.removeAttribute(this.name)}}class G extends X{constructor(e,t,r,i,n){super(e,t,r,i,n),this.type=5}_$AI(e,t=this){var r;if((e=null!==(r=V(this,e,t,0))&&void 0!==r?r:B)===M)return;const i=this._$AH,n=e===B&&i!==B||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==B&&(i===B||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;"function"==typeof this._$AH?this._$AH.call(null!==(r=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==r?r:this.element,e):this._$AH.handleEvent(e)}}class Q{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){V(this,e)}}const ee=b.litHtmlPolyfillSupport;null==ee||ee(F,q),(null!==(v=b.litHtmlVersions)&&void 0!==v?v:b.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var te,re;class ie extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;const r=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=r.firstChild),r}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{var i,n;const o=null!==(i=null==r?void 0:r.renderBefore)&&void 0!==i?i:t;let a=o._$litPart$;if(void 0===a){const e=null!==(n=null==r?void 0:r.renderBefore)&&void 0!==n?n:null;o._$litPart$=a=new q(t.insertBefore(S(),e),e,void 0,null!=r?r:{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this._$Do)||void 0===e||e.setConnected(!1)}render(){return M}}ie.finalized=!0,ie._$litElement$=!0,null===(te=globalThis.litElementHydrateSupport)||void 0===te||te.call(globalThis,{LitElement:ie});const ne=globalThis.litElementPolyfillSupport;null==ne||ne({LitElement:ie}),(null!==(re=globalThis.litElementVersions)&&void 0!==re?re:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe=e=>t=>"function"==typeof t?((e,t)=>(customElements.define(e,t),t))(e,t):((e,t)=>{const{kind:r,elements:i}=t;return{kind:r,elements:i,finisher(t){customElements.define(e,t)}}})(e,t),ae=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?{...t,finisher(r){r.createProperty(t.key,e)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(r){r.createProperty(t.key,e)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function se(e){return(t,r)=>void 0!==r?((e,t,r)=>{t.constructor.createProperty(r,e)})(e,t,r):ae(e,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function le(e){return se({...e,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var de;null===(de=window.HTMLSlotElement)||void 0===de||de.prototype.assignedElements;const ce={category:"standard",label:""},pe={southeastern:[{matches:["city beam","707"],category:"modern",label:"CITY BEAM"},{matches:["javelin","395"],category:"javelin",label:"JAVELIN"},{matches:["376"],category:"refurb",label:"REFURB 376"},{matches:["465","466","networker"],category:"older",label:"CLASS 465"}]};function ue(e,t){for(const r of e)if(r.matches.some(e=>t.includes(e)))return{category:r.category,label:r.label};return null}function he(e,t){const r=(e||"").toLowerCase();if(!r)return ce;const i=(t||"").toLowerCase().trim();if(i){const e=Object.keys(pe).find(e=>i.includes(e));return e&&ue(pe[e],r)||ce}for(const e of Object.values(pe)){const t=ue(e,r);if(t)return t}return ce}function me(e,t){var r;if(!e)return null;if(t&&t.has(e))return null!==(r=t.get(e))&&void 0!==r?r:null;let i=null;const n=new Date(e);return Number.isNaN(n.getTime())||(i=n),t&&t.set(e,i),i}const ge=new Set(["on_time","delayed","early","cancelled"]),fe=new Set(["on-time","delayed","early","cancelled"]);function ve(e){if("object"!=typeof e||null===e)return!1;const t=e;return"string"==typeof t.destination_name&&"string"==typeof t.scheduled&&"string"==typeof t.scheduled_time&&ge.has(t.status)&&fe.has(t.status_class)&&"string"==typeof t.status_label&&"boolean"==typeof t.is_cancelled&&Array.isArray(t.calling_points)&&t.calling_points.every(e=>function(e){if("object"!=typeof e||null===e)return!1;const t=e;return"string"==typeof t.station_name&&("string"==typeof t.crs||null===t.crs)&&("string"==typeof t.tiploc||null===t.tiploc)&&"string"==typeof t.scheduled&&("string"==typeof t.estimated||null===t.estimated)&&"string"==typeof t.time&&ge.has(t.status)&&fe.has(t.status_class)&&"string"==typeof t.status_label&&("number"==typeof t.delay_minutes||null===t.delay_minutes)&&"boolean"==typeof t.is_passed&&"boolean"==typeof t.is_current&&"boolean"==typeof t.is_between_previous}(e))}const be=[{name:"entity",required:!0,selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"attribute",selector:{text:{}}},{name:"stops_identifier",selector:{select:{options:[{value:"description",label:"Description (Default)"},{value:"tiploc",label:"TIPLOC"},{value:"crs",label:"CRS"}],mode:"dropdown"}}}]},{type:"grid",name:"",schema:[{name:"row_size",selector:{select:{options:[{value:"compact",label:"Compact"},{value:"normal",label:"Normal (Default)"},{value:"comfortable",label:"Comfortable"}],mode:"dropdown"}}},{name:"time_display",selector:{select:{options:[{value:"scheduled",label:"Scheduled time (Default)"},{value:"relative",label:'Countdown ("4 min")'},{value:"both",label:"Scheduled + countdown"}],mode:"dropdown"}}}]},{type:"grid",name:"",schema:[{name:"walk_time_minutes",selector:{number:{min:0,max:120,mode:"box",unit_of_measurement:"min"}}},{name:"show_carriages",selector:{boolean:{}}},{name:"stale_indicator",selector:{boolean:{}}}]},{type:"grid",name:"",schema:[{name:"show_announcements",selector:{boolean:{}}},{name:"announcement_position",selector:{select:{options:[{value:"top",label:"Top (Default)"},{value:"bottom",label:"Bottom"}],mode:"dropdown"}}}]},{type:"grid",name:"",schema:[{name:"font_size_time",selector:{text:{}}},{name:"font_size_destination",selector:{text:{}}},{name:"font_size_status",selector:{text:{}}}]}],ye={entity:"Entity",title:"Card Title",attribute:"Data Attribute",stops_identifier:"Station Identifier",row_size:"Row Size",time_display:"Time Display",walk_time_minutes:"Walk Time to Station",font_size_time:"Time Font Size",font_size_destination:"Destination Font Size",font_size_status:"Status Pill Font Size",show_carriages:"Show Carriage Count",stale_indicator:"Show Stale-Data Warning",show_announcements:"Show Announcements Banner",announcement_position:"Announcement Position"},_e={entity:"Select a realtime trains sensor",attribute:"Attribute with departure data (default: next_trains)",stops_identifier:"How stations are identified in the data",row_size:"Vertical padding of the departure rows",time_display:"Show clock time, a countdown, or both",walk_time_minutes:"Highlight the first train you can still reach; earlier ones are dimmed",font_size_time:"e.g. 1.5rem (default: 1.25rem)",font_size_destination:"e.g. 1.2rem (default: 1rem)",font_size_status:"e.g. 0.85rem (default: 0.75rem)",show_carriages:"Display carriage/length details when available",stale_indicator:"Warn when the data source is stale or a refresh is overdue",show_announcements:"Display scrolling/cycling announcements banner for station messages and disruptions",announcement_position:"Position of the announcements banner: top (default) or bottom"};let xe=class extends ie{constructor(){super(...arguments),this._computeLabel=e=>ye[e.name]||e.name,this._computeHelper=e=>_e[e.name]}setConfig(e){this._config=e}render(){return this.hass&&this._config?O`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${be}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `:B}_valueChanged(e){e.stopPropagation();const t=e.detail.value,r=Object.assign(Object.assign(Object.assign({},this._config),t),{attribute:t.attribute||"next_trains",stops_identifier:t.stops_identifier||"description"});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r},bubbles:!0,composed:!0}))}};e([se({attribute:!1})],xe.prototype,"hass",void 0),e([le()],xe.prototype,"_config",void 0),xe=e([oe("train-departure-board-editor")],xe);let $e=class extends ie{constructor(){super(...arguments),this.nextTrains=[],this._selectedDeparture=null,this._selectedAlert=null,this._activeAnnouncementIndex=0,this.dateCache=new Map,this.lastEntityId=null,this._returnFocusTo=null,this._prevRowValues=new Map,this._flapCounters=new Map,this._handleKeyDown=e=>{"Escape"===e.key&&(this._selectedAlert?this._closeAlertPopup():this._selectedDeparture&&this._closePopup())},this._handleAlertPopupKeyDown=e=>{var t,r;if("Tab"!==e.key)return;const i=Array.from((null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelectorAll(".alert-popup-card button, .alert-popup-card a"))||[]).filter(e=>!e.hasAttribute("disabled"));if(0===i.length)return;const n=i[0],o=i[i.length-1],a=(null===(r=this.shadowRoot)||void 0===r?void 0:r.activeElement)||e.composedPath&&e.composedPath()[0]||null;e.shiftKey?a!==n&&i.includes(a)||(e.preventDefault(),o.focus()):a!==o&&i.includes(a)||(e.preventDefault(),n.focus())},this._handlePopupKeyDown=e=>{var t;if("Tab"!==e.key)return;const r=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".popup-close");r&&(e.preventDefault(),r.focus())}}static getConfigElement(){return document.createElement("train-departure-board-editor")}static getStubConfig(){return{type:"custom:train-departure-board",title:"Train Departures",entity:"",attribute:"next_trains"}}setConfig(e){if(!e)throw new Error("Invalid configuration");const t=Object.assign({attribute:"next_trains"},e);"string"==typeof t.attribute?t.attribute=t.attribute.trim()||"next_trains":t.attribute="next_trains",this.config=t}_renderMessage(e,t,r=!1){var i;return O`
      <ha-card>
        ${(null===(i=this.config)||void 0===i?void 0:i.title)?O`<div class="card-header">${this.config.title}</div>`:""}
        <div class="card">
          <div class="board-message ${r?"error":""}">
            <span class="message-icon" aria-hidden="true">${e.startsWith("mdi:")?O`<ha-icon .icon=${e}></ha-icon>`:e}</span>
            <span class="message-text">${t}</span>
          </div>
        </div>
      </ha-card>
    `}_isDataStale(e){var t,r;if(!1===this.config.stale_indicator)return!1;if(!0===(null===(t=e.attributes)||void 0===t?void 0:t.data_stale))return!0;const i=null===(r=e.attributes)||void 0===r?void 0:r.next_update_at;if("string"==typeof i){const e=new Date(i).getTime();if(!Number.isNaN(e)&&Date.now()>e+6e4)return!0}return!1}render(){var e,t,r,i,n,o,a,s,l;if(!this.config)return this._renderMessage("🚆","No configuration provided",!0);if(!this.config.entity)return this._renderMessage("🚆","Please configure an entity");const d=null===(t=null===(e=this.hass)||void 0===e?void 0:e.states)||void 0===t?void 0:t[this.config.entity];if(!d)return this._renderMessage("🚆",`Entity not found: ${this.config.entity}`,!0);if("unavailable"===d.state)return this._renderMessage("🚆",`Entity ${this.config.entity} is currently unavailable`);if("unknown"===d.state){if(!(2===(null===(r=d.attributes)||void 0===r?void 0:r.contract_version)&&Array.isArray(null===(i=d.attributes)||void 0===i?void 0:i.next_trains))){const e=(null===(n=d.attributes)||void 0===n?void 0:n.error)?` (${d.attributes.error})`:"";return this._renderMessage("⚠",`Data currently unavailable for entity ${this.config.entity}${e}`,!0)}}const c=null===(o=d.attributes)||void 0===o?void 0:o.contract_version;if(2!==c){const e=void 0===c?"missing":`found v${String(c)}`;return this._renderMessage("⚠",`Integration contract version 2 required (${e}). Please update both realtime_trains_api and ha-train-departure-board together.`,!0)}this.lastEntityId!==this.config.entity&&(this.dateCache.clear(),this.lastEntityId=this.config.entity),this.dateCache.size>500&&this.dateCache.clear();const p=this.config.attribute||"next_trains",u=null===(a=d.attributes)||void 0===a?void 0:a[p];if(void 0===u)return this._renderMessage("⚠",`Attribute "${p}" not found on entity ${this.config.entity}`,!0);if(!Array.isArray(u))return this._renderMessage("⚠",`Attribute "${p}" on entity ${this.config.entity} is not an array`,!0);const h=u;if(h.some(e=>!ve(e)))return this._renderMessage("⚠",`Malformed Contract v2 departure data on entity ${this.config.entity}`,!0);const m=d.last_updated?new Date(d.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"",g=[this.config.font_size_time?`--train-board-time-size: ${this.config.font_size_time}`:"",this.config.font_size_destination?`--train-board-destination-size: ${this.config.font_size_destination}`:"",this.config.font_size_status?`--train-board-status-size: ${this.config.font_size_status}`:""].filter(Boolean).join("; "),f=new Date,v=Number(this.config.walk_time_minutes)||0;let b=0;v>0&&(b=h.findIndex(e=>function(e,t,r,i){const n=me(e.estimated||e.scheduled,i);return!n||n.getTime()-r.getTime()>=6e4*t}(e,v,f,this.dateCache)));const y=this._isDataStale(d);this._updateFlapCounters(h);const _=this._getAnnouncements(),x=this._isAnnouncementsEnabled()&&_.length>0,$=this._getAnnouncementPosition();return O`
      <ha-card style="${g}">
        ${this.config.title?O`<div class="card-header">${this.config.title}</div>`:""}
        <div class="card">
          ${x&&"top"===$&&h.length>0?this._renderAnnouncementsBanner(_,"top"):""}
          ${v>0&&-1===b&&h.length>0?O`<div class="walk-time-notice">
                No listed departures reachable within ${v} min walk
              </div>`:""}
          ${h.length>0?O`<div
                class="departure-list"
                role="list"
                aria-label="Train departures"
              >
                ${h.map((e,t)=>this.renderDepartureRow(e,t,b,f))}
              </div>`:this._renderEmptyState(d,f)}
          ${x&&"bottom"===$&&h.length>0?this._renderAnnouncementsBanner(_,"bottom"):""}
          ${m||y||(null===(s=d.attributes)||void 0===s?void 0:s.error)?O`<div class="footer">
                ${y?O`<span class="stale-chip" role="status"
                      >⚠ Showing last-known data</span
                    >`:""}
                ${(null===(l=d.attributes)||void 0===l?void 0:l.error)?O`<span class="enrichment-error-chip" role="status"
                      >ℹ Limited journey details</span
                    >`:""}
                ${m?O`Last updated: ${m}`:""}
              </div>`:""}
        </div>
      </ha-card>
      ${this._renderDetailsPopup()}
      ${this._renderAlertPopup()}
    `}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._handleKeyDown),this._tickTimer=window.setInterval(()=>{var e;const t=null===(e=this.config)||void 0===e?void 0:e.time_display;"relative"!==t&&"both"!==t||this.requestUpdate()},3e4),this._announcementTimer=window.setInterval(()=>{if(this._selectedAlert)return;const e=this._getAnnouncements();e.length>1&&(this._activeAnnouncementIndex=(this._activeAnnouncementIndex+1)%e.length,this.requestUpdate())},7e3)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._handleKeyDown),void 0!==this._tickTimer&&(window.clearInterval(this._tickTimer),this._tickTimer=void 0),void 0!==this._announcementTimer&&(window.clearInterval(this._announcementTimer),this._announcementTimer=void 0)}_departureKey(e){return e.service_uid||`${e.scheduled}-${e.destination_name}`}_updateFlapCounters(e){this._prevRowValues.size>200&&(this._prevRowValues.clear(),this._flapCounters.clear());for(const t of e){const e=this._departureKey(t),r={time:t.estimated_time||t.scheduled_time||"",platform:t.platform||"",status:t.status_label||""},i=this._prevRowValues.get(e);if(i)for(const t of["time","platform","status"])if(i[t]!==r[t]){const r=`${e}:${t}`;this._flapCounters.set(r,(this._flapCounters.get(r)||0)+1)}this._prevRowValues.set(e,r)}}_flapClass(e,t){const r=this._flapCounters.get(`${this._departureKey(e)}:${t}`)||0;return 0===r?"":r%2?"flap-a":"flap-b"}_handleRowKeyDown(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showDetails(t,e))}_showDetails(e,t){var r;this._returnFocusTo=null!==(r=null==t?void 0:t.currentTarget)&&void 0!==r?r:null,this._selectedDeparture=e}_closePopup(){var e;this._selectedDeparture=null,null===(e=this._returnFocusTo)||void 0===e||e.focus(),this._returnFocusTo=null}updated(e){var t,r;if(super.updated(e),e.has("_selectedDeparture")&&this._selectedDeparture){const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector(".popup-close:not(.alert-popup-close)");null==e||e.focus()}if(e.has("_selectedAlert")&&this._selectedAlert){const e=null===(r=this.shadowRoot)||void 0===r?void 0:r.querySelector(".alert-popup-close");null==e||e.focus()}}_isAnnouncementsEnabled(){return!this.config||!1!==this.config.show_announcements&&"off"!==this.config.announcements}_getAnnouncementPosition(){return this.config?this.config.announcement_position?this.config.announcement_position:"bottom"===this.config.announcements?"bottom":"top":"top"}_getAnnouncements(){var e,t,r;const i=(null===(e=this.config)||void 0===e?void 0:e.entity)?null===(r=null===(t=this.hass)||void 0===t?void 0:t.states)||void 0===r?void 0:r[this.config.entity]:null;if(!(null==i?void 0:i.attributes))return[];const n=[],o=i.attributes.station_messages;Array.isArray(o)&&o.forEach((e,t)=>{"string"==typeof e&&e.trim()&&n.push({id:`msg-${t}`,text:e.trim(),isDisruption:!1})});const a=i.attributes.disruptions;return Array.isArray(a)&&a.forEach((e,t)=>{if(e&&"object"==typeof e){const r=e,i=r.title||this._getBriefSummary(r.summary)||"Disruption alert";n.push({id:r.id||`disr-${t}`,text:i.trim(),isDisruption:!0,disruption:r})}}),n}_getBriefSummary(e,t=160){if(!e||"string"!=typeof e)return"";const r=e.replace(/\s+/g," ").trim();if(r.length<=t)return r;const i=r.match(/^(.+?[.!?])(?:\s|$)/);if(i&&i[1]&&i[1].length<=t)return i[1];const n=r.substring(0,t),o=n.lastIndexOf(" ");return(o>40?n.substring(0,o):n)+"..."}_showAlertDetails(e,t){var r;this._returnFocusTo=null!==(r=null==t?void 0:t.currentTarget)&&void 0!==r?r:null,e.disruption?this._selectedAlert={title:e.disruption.title||"Disruption Alert",is_planned:e.disruption.is_planned,summary:e.disruption.summary,description:e.disruption.description,alternative_travel:e.disruption.alternative_travel,url:e.disruption.url,disruptions:[e.disruption]}:this._selectedAlert={title:"Station Announcement",summary:e.text,is_planned:!1,alternative_travel:null,url:null}}_handleEmptyStateKeyDown(e,t,r,i,n,o){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._showEmptyStateDetails(t,r,i,n,o,e))}_showEmptyStateDetails(e,t,r,i,n,o){var a;this._returnFocusTo=null!==(a=null==o?void 0:o.currentTarget)&&void 0!==a?a:null;const s=1===t.length&&t[0].title?t[0].title:e;this._selectedAlert={title:s,is_planned:n,disruptions:t,station_messages:r,alternative_travels:i}}_closeAlertPopup(){var e;this._selectedAlert=null,null===(e=this._returnFocusTo)||void 0===e||e.focus(),this._returnFocusTo=null}_handleAlertOverlayClick(e){e.target.classList.contains("popup-overlay")&&this._closeAlertPopup()}_handleBannerKeyDown(e,t,r){e.target===e.currentTarget&&("Enter"===e.key||" "===e.key?(e.preventDefault(),this._showAlertDetails(t,e)):"ArrowRight"===e.key?(e.preventDefault(),this._activeAnnouncementIndex=(this._activeAnnouncementIndex+1)%r.length,this.requestUpdate()):"ArrowLeft"===e.key&&(e.preventDefault(),this._activeAnnouncementIndex=(this._activeAnnouncementIndex-1+r.length)%r.length,this.requestUpdate()))}_isSafeUrl(e){if(!e||"string"!=typeof e)return!1;const t=e.trim().toLowerCase();return t.startsWith("https://")||t.startsWith("http://")}_renderAnnouncementsBanner(e,t){if(0===e.length)return B;const r=this._activeAnnouncementIndex%e.length,i=e[r],n=e.length>1?`Announcement ${r+1} of ${e.length}: ${i.text}`:`Station announcement: ${i.text}`;return O`
      <div
        class="announcements-banner position-${t}"
        role="button"
        aria-label="${n}"
        tabindex="0"
        aria-haspopup="dialog"
        @click=${e=>this._showAlertDetails(i,e)}
        @keydown=${t=>this._handleBannerKeyDown(t,i,e)}
      >
        <div class="announcement-main">
          <span class="announcement-icon" aria-hidden="true"
            ><ha-icon icon="mdi:bullhorn"></ha-icon
          ></span>
          <div class="announcement-body">
            ${e.length>1?O`<span
                  class="announcement-counter"
                  aria-label="Announcement ${r+1} of ${e.length}"
                  >${r+1}/${e.length}</span
                >`:""}
            <div class="announcement-ticker-wrap">
              <span class="announcement-ticker">${i.text}</span>
            </div>
          </div>
        </div>
      </div>
    `}_isNighttime(e=new Date){try{const t=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",hour:"numeric",hourCycle:"h23"}).format(e),r=parseInt(t,10);return r>=1&&r<5}catch(t){const r=e.getHours();return r>=1&&r<5}}_renderEmptyState(e,t=new Date){const r=e.attributes||{},i=r.service_status||"no_departures",n=Array.isArray(r.disruptions)?r.disruptions:[],o=(Array.isArray(r.station_messages)?r.station_messages:[]).filter(e=>Boolean(e&&"string"==typeof e&&e.trim())),a=n.map(e=>e.alternative_travel).filter(e=>Boolean(e&&"string"==typeof e&&e.trim())),s=n.length>0?n[0]:null;let l="mdi:clock-outline",d="No Departures",c="No departures in the current window";"station_closed"===i?(l="mdi:train",d="Station Closed",c="This station is currently closed. No train services are operating."):"engineering_work"===i?(l="mdi:wrench-clock",d="Engineering Work",c="Engineering work is affecting services at this station."):"disrupted"===i?(l="mdi:alert-circle-outline",d="Service Disrupted",c="Train services are disrupted. Please check announcements for details."):(l=this._isNighttime(t)?"mdi:weather-night":"mdi:clock-outline",d="No Departures",c=this._isNighttime(t)?"No departures scheduled overnight. Services may have finished for the night.":"No departures in the current window");const p=i.replace(/_/g,"-"),u=Boolean(n.some(e=>Boolean(e.title)||Boolean(e.summary)||Boolean(e.description)||Boolean(e.alternative_travel)||Boolean(e.url))||a.length>0||o.length>0),h=s&&(s.title||this._getBriefSummary(s.summary))||c;return O`
      <div
        class="board-message board-empty-state ${u?"is-interactive":""} ${p} ${i}"
        role="${u?"button":"status"}"
        tabindex="${u?"0":B}"
        aria-haspopup="${u?"dialog":B}"
        aria-label="${u?`${d}: ${h}`:B}"
        @click=${u?e=>this._showEmptyStateDetails(d,n,o,a,Boolean(null==s?void 0:s.is_planned),e):B}
        @keydown=${u?e=>this._handleEmptyStateKeyDown(e,d,n,o,a,Boolean(null==s?void 0:s.is_planned)):B}
      >
        <div class="empty-state-header">
          <div class="empty-state-title-row">
            <span class="message-icon" aria-hidden="true">${l.startsWith("mdi:")?O`<ha-icon .icon=${l}></ha-icon>`:l}</span>
            <div class="board-empty-title">${d}</div>
            ${(null==s?void 0:s.is_planned)?O`<span class="alert-badge planned">Planned Work</span>`:""}
          </div>
        </div>
        <div class="empty-compact-summary">${h}</div>
        ${a.length>0?O`
              <div class="alternative-travel-box">
                <div class="alternative-travel-header">
                  <ha-icon icon="mdi:bus" style="--mdc-icon-size: 1.1em; vertical-align: middle; margin-right: 4px;"></ha-icon> ${"engineering_work"===i?"Replacement Bus & Ticket Acceptance":"Alternative Travel & Ticket Acceptance"}
                </div>
                <div class="alternative-travel-content">
                  ${a.map(e=>O`<div class="alternative-travel-item">${e}</div>`)}
                </div>
              </div>
            `:""}
      </div>
    `}_renderAlertPopup(){if(!this._selectedAlert)return B;const e=this._selectedAlert,t=Boolean(e.is_planned),r=e.title||"Station Notice",i=e.disruptions||[],n=[];e.alternative_travels&&e.alternative_travels.length>0&&n.push(...e.alternative_travels),e.alternative_travel&&n.push(e.alternative_travel);for(const e of i)e.alternative_travel&&n.push(e.alternative_travel);const o=Array.from(new Set(n.filter(e=>Boolean(e&&"string"==typeof e&&e.trim())))),a=(e.station_messages||[]).filter(e=>Boolean(e&&"string"==typeof e&&e.trim())),s=i.length>0;return O`
      <div
        class="popup-overlay alert-popup-overlay"
        @click=${this._handleAlertOverlayClick}
        @keydown=${this._handleAlertPopupKeyDown}
      >
        <div
          class="alert-popup-card"
          role="dialog"
          aria-modal="true"
          aria-label="${r}"
        >
          <div class="alert-popup-header">
            <div>
              <h2 class="alert-popup-title">${r}</h2>
              ${s?O`<div class="alert-badge ${t?"planned":"unplanned"}">
                    ${t?"Planned Work":"Disruption Alert"}
                  </div>`:""}
            </div>
            <button
              class="popup-close alert-popup-close"
              @click=${this._closeAlertPopup}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          ${i.length>0?i.map((e,t)=>O`
                  <div class="empty-disruption-details">
                    ${e.title&&(i.length>1||e.title!==r)?O`<h4 class="empty-disruption-title">
                          ${e.title||`Disruption Notice ${t+1}`}
                        </h4>`:""}
                    ${e.summary?O`<p class="alert-summary">${e.summary}</p>`:""}
                    ${e.description&&e.description!==e.summary?O`<p class="alert-description">${e.description}</p>`:""}
                    ${this._isSafeUrl(e.url)?O`
                          <div class="alert-link-container">
                            <a
                              href="${e.url}"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="alert-link"
                            >
                              More information on National Rail ↗
                            </a>
                          </div>
                        `:""}
                  </div>
                `):O`
                ${e.summary?O`<p class="alert-summary">${e.summary}</p>`:""}
                ${e.description&&e.description!==e.summary?O`<p class="alert-description">${e.description}</p>`:""}
                ${this._isSafeUrl(e.url)?O`
                      <div class="alert-link-container">
                        <a
                          href="${e.url}"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="alert-link"
                        >
                          More information on National Rail ↗
                        </a>
                      </div>
                    `:""}
              `}
          ${a.length>0?O`
                <div class="empty-station-messages">
                  ${a.map(e=>O`<div class="empty-station-message"><ha-icon icon="mdi:bullhorn" style="--mdc-icon-size: 1.1em; vertical-align: text-bottom; margin-right: 4px;"></ha-icon>${e}</div>`)}
                </div>
              `:""}
          ${o.length>0?O`
                <div class="alert-alternative-section">
                  <div class="alert-alternative-title">
                    <ha-icon
                      icon="mdi:bus"
                      style="--mdc-icon-size: 1.1em; vertical-align: middle; margin-right: 4px;"
                    ></ha-icon>
                    Alternative Travel &amp; Ticket Acceptance
                  </div>
                  <div>
                    ${o.map(e=>O`<div class="alternative-travel-item">${e}</div>`)}
                  </div>
                </div>
              `:""}
        </div>
      </div>
    `}_handleOverlayClick(e){e.target.classList.contains("popup-overlay")&&this._closePopup()}_renderDetailsPopup(){var e,t,r;if(!this._selectedDeparture)return B;const i=this._selectedDeparture,n=i.status_class,o=i.status_label,a=i.scheduled_time,s=i.calling_points||[],l=i.is_cancelled||"cancelled"===n,d=he(i.stock,i.operator_name),c=this.config.entity?null===(t=null===(e=this.hass)||void 0===e?void 0:e.states)||void 0===t?void 0:t[this.config.entity]:null,p=Boolean(null===(r=null==c?void 0:c.attributes)||void 0===r?void 0:r.error),u="on-time"===n?"status-ok":"cancelled"===n?"status-cancelled":"status-delayed",h=s.some(e=>e.is_passed);return O`
      <div
        class="popup-overlay"
        @click=${this._handleOverlayClick}
        @keydown=${this._handlePopupKeyDown}
      >
        <div
          class="popup-card"
          role="dialog"
          aria-modal="true"
          aria-label="Details for the ${a} to ${i.destination_name}"
        >
          <div class="modern-header">
            <div class="modern-header-top">
              <div class="modern-dest-group">
                <div class="modern-time-group">
                  <span
                    class="modern-scheduled ${l?"time-cancelled":""}"
                    >${a}</span
                  >
                  ${i.operator_name?O`<span class="modern-operator"
                        >${i.operator_name}</span
                      >`:""}
                </div>
                <h2 class="modern-dest">${i.destination_name}</h2>
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
              <div class="modern-badge ${u}">
                <span style="font-size: 1.2em; line-height: 1;">●</span>
                ${o}
              </div>
              ${i.platform?O` <div class="modern-badge platform">
                    Platform ${i.platform}
                  </div>`:""}
              ${i.length?O` <div class="modern-badge carriages">
                    ${i.length} carriages
                  </div>`:""}
              ${"standard"!==d.category?O` <div
                    class="modern-badge stock-badge stock-${d.category}"
                  >
                    ${d.label}
                  </div>`:""}
            </div>
            ${p?O`<div class="enrichment-popup-notice">
                  ℹ Limited journey details
                </div>`:""}
            ${this._renderJourneySummary(i)}
            ${i.last_report_station?O`<div class="last-seen">
                  Last seen at ${i.last_report_station}${i.last_report_time_label?` (${i.last_report_time_label})`:""}
                </div>`:""}
          </div>

          <div class="modern-content">
            ${s.length>0?O` <div class="timeline-container">
                  <div
                    class="modern-stops-list ${h?"has-passed":""}"
                  >
                    ${s.map(e=>O`
                        ${e.is_between_previous?O`
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
                          class="modern-stop ${e.is_passed?"passed":""} ${e.is_current?"current":""}"
                        >
                          <div class="modern-stop-graphic">
                            <div class="modern-stop-circle"></div>
                          </div>
                          <div class="modern-stop-content">
                            <span class="modern-stop-time">${e.time}</span>
                            <div class="modern-stop-info">
                              <span class="modern-stop-name">${function(e,t="description"){return"tiploc"===t?(e.tiploc||e.crs||e.station_name||"").trim():"crs"===t?(e.crs||e.station_name||"").trim():(e.station_name||e.crs||e.tiploc||"").trim()}(e,this.config.stops_identifier||"description")}</span>
                              ${!e.is_passed&&e.status_label?O`<span
                                    class="modern-stop-status ${e.status_class}"
                                    >${e.status_label}</span
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
    `}_renderJourneySummary(e){const t=e.destination_arrival_time,r=[];return null!=e.journey_duration_minutes&&r.push(`${e.journey_duration_minutes} min journey`),null!=e.stops_count&&e.stops_count>0&&r.push(`${e.stops_count} ${1===e.stops_count?"stop":"stops"}`),t&&r.push(`arrives ${t}`),0===r.length?B:O`<div class="journey-summary">${r.join(" · ")}</div>`}renderDepartureRow(e,t,r=0,i=new Date){const n=e.scheduled_time,o=e.status_class,a=e.status_label,s=e.offset_label,l=e.platform?e.platform:null,d=r>=0&&t===r,c=(Number(this.config.walk_time_minutes)||0)>0&&(-1===r||t<r),p=e.is_cancelled||"cancelled"===o,u=he(e.stock,e.operator_name),h=p?"time-cancelled":"",m=`row-size-${this.config.row_size||"normal"}`,g=!1!==this.config.show_carriages,f=["modern","javelin","refurb"].includes(u.category)?`stock-row-${u.category}`:"",v=this.config.time_display||"scheduled",b="relative"===v||"both"===v?function(e,t,r){const i=me(e.estimated||e.scheduled,r);if(!i)return null;const n=Math.floor((i.getTime()-t.getTime())/6e4);return n<=0?"Due":`${n} min`}(e,i,this.dateCache):null,y="relative"===v&&b?b:n,_=this._flapClass(e,"status");let x=O``;if(p)x=O`<span class="status-pill cancelled ${_}"
        >Cancelled</span
      >`;else if(s){const e="early"===o;x=O`<span
        class="status-pill ${e?"early":"delayed"} ${_}"
        >${e?"Early ":""}${s}</span
      >`}const $=[`${e.destination_name} at ${n}`,a];l&&$.push(`Platform ${l}`),g&&e.length&&$.push(`${e.length} carriages`),u.label&&$.push(u.label),c&&$.push("likely out of reach");const w=$.join(", ");return O`
      <div
        class="train ${d?"next-train":""} ${p?"cancelled-row":""} ${c?"unreachable":""} ${f} ${m}"
        role="listitem"
        tabindex="0"
        aria-haspopup="dialog"
        aria-label="${w}"
        title="${w}"
        @click=${t=>this._showDetails(e,t)}
        @keydown=${t=>this._handleRowKeyDown(t,e)}
      >
        <div class="time-wrapper ${h}">
          <span
            class="scheduled ${this._flapClass(e,"time")}"
            aria-label="Scheduled time"
            >${y}</span
          >
          ${"both"===v&&b?O`<span class="relative-time"
                >${"Due"===b?b:`in ${b}`}</span
              >`:""}
        </div>
        <div class="info-box">
          <div class="destination-row">
            <h3 class="terminus">
              ${e.is_pinned?O`<span
                    class="pin-marker"
                    title="Your pinned train"
                    aria-label="Pinned train"
                    >📌</span
                  >`:""}${e.destination_name}
            </h3>
            <div class="row-meta">
              ${x}
              ${g&&e.length?O`<span class="carriages-badge">${e.length}-car</span>`:""}
              ${l?O`<span
                    class="platform-badge ${this._flapClass(e,"platform")}"
                    aria-label="Platform ${l}"
                    >${l}</span
                  >`:""}
            </div>
          </div>
        </div>
      </div>
    `}};$e.styles=((e,...t)=>{const r=1===e.length?e[0]:t.reduce((t,r,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[i+1],e[0]);return new o(r,e,i)})`
    ha-card {
      height: 100%;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #111);
      display: flex;
      flex-direction: column;
      container-type: inline-size;
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
      flex: 0 0 4.25rem;
      width: 4.25rem;
      min-width: 4.25rem;
      font-variant-numeric: tabular-nums;
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
    .platform-badge {
      font-size: 0.75em;
      font-weight: 700;
      padding: 2px 6px;
      min-width: 28px;
      height: 22px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      flex-shrink: 0;
      box-sizing: border-box;
      font-variant-numeric: tabular-nums;
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
    .row-meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      flex-shrink: 0;
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
      min-width: 44px;
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
      text-align: center;
      box-sizing: border-box;
      font-variant-numeric: tabular-nums;
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
    .walk-time-notice {
      padding: 6px 12px;
      margin: 8px 8px 0 8px;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .enrichment-error-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--secondary-text-color, #666);
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .enrichment-popup-notice {
      font-size: 0.8rem;
      color: var(--secondary-text-color, #666);
      padding: 4px 8px;
      margin-bottom: 8px;
      border-radius: 4px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    @container (max-width: 380px) {
      .carriages-badge {
        display: none;
      }
      .relative-time {
        display: none;
      }
    }
    @media (max-width: 380px) {
      .carriages-badge {
        display: none;
      }
      .relative-time {
        display: none;
      }
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
      font-size: 1.25em;
      line-height: 1;
      opacity: 0.9;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .board-message .message-icon ha-icon {
      --mdc-icon-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
    .board-empty-state.station-closed .message-icon {
      color: var(--error-color, #d32f2f);
    }
    .board-empty-state.engineering-work .message-icon,
    .board-empty-state.disrupted .message-icon {
      color: var(--warning-color, #e65100);
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
    /* Announcements banner */
    .announcements-banner {
      background: var(--announcement-banner-background, rgba(255, 170, 0, 0.08));
      color: var(--primary-text-color, #212121);
      border-bottom: 1px solid var(--divider-color, rgba(128, 128, 128, 0.2));
      border-left: 3px solid var(--warning-color, #e65100);
      padding: 8px 12px;
      font-size: 0.85rem;
      font-weight: 500;
      letter-spacing: 0.2px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      box-sizing: border-box;
      position: relative;
      flex-wrap: wrap;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    .announcements-banner:hover {
      background: rgba(255, 170, 0, 0.14);
    }
    .announcements-banner.position-bottom {
      border-bottom: none;
      border-top: 1px solid var(--divider-color, rgba(128, 128, 128, 0.2));
    }
    .announcements-banner:focus-visible {
      outline: 2px solid var(--warning-color, #ffaa00);
      outline-offset: -2px;
    }
    .announcement-icon {
      color: var(--warning-color, #e65100);
      font-size: 1.1em;
      line-height: 1;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
    }
    .announcement-icon ha-icon {
      --mdc-icon-size: 1.15em;
      width: 1.15em;
      height: 1.15em;
    }
    .announcement-main {
      flex: 1 1 200px;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .announcement-body {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }
    .announcement-ticker-wrap {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
    }
    .announcement-ticker {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      color: var(--primary-text-color, #212121);
      font-weight: 600;
    }
    .announcement-counter {
      font-size: 0.75em;
      opacity: 0.85;
      flex-shrink: 0;
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.3));
      border-radius: 3px;
      padding: 1px 4px;
      color: var(--secondary-text-color, #666);
    }
    .announcement-action {
      font-size: 0.75em;
      text-decoration: underline;
      opacity: 0.9;
      flex-shrink: 0;
    }

    .board-empty-state {
      padding: 12px 14px;
      text-align: left;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 8px;
      flex: 1;
      box-sizing: border-box;
      border-left: 3px solid transparent;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      color: var(--primary-text-color, #212121);
    }
    .board-empty-state .message-icon {
      font-size: 1.15em;
      line-height: 1;
      opacity: 1;
      display: inline-flex;
      align-items: center;
      justify-content: flex-start;
      flex-shrink: 0;
    }
    .board-empty-state .message-icon ha-icon {
      --mdc-icon-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }
    .board-empty-state.station-closed {
      border-left-color: var(--error-color, #d32f2f);
      background: rgba(211, 47, 47, 0.05);
    }
    .board-empty-state.station-closed .message-icon {
      color: var(--error-color, #d32f2f);
    }
    .board-empty-state.station-closed .board-empty-title {
      color: var(--error-color, #d32f2f);
    }
    .board-empty-state.engineering-work,
    .board-empty-state.disrupted {
      border-left-color: var(--warning-color, #e65100);
      background: rgba(255, 152, 0, 0.05);
    }
    .board-empty-state.engineering-work .message-icon,
    .board-empty-state.disrupted .message-icon {
      color: var(--warning-color, #e65100);
    }
    .board-empty-state.engineering-work .board-empty-title,
    .board-empty-state.disrupted .board-empty-title {
      color: var(--warning-color, #e65100);
    }
    .board-empty-state.no-departures {
      background: transparent;
      border-left-color: transparent;
    }
    .board-empty-state.no-departures .message-icon {
      color: var(--secondary-text-color, #888);
    }
    .board-empty-state.no-departures .board-empty-title {
      color: var(--primary-text-color, #111);
    }
    .empty-state-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
      width: 100%;
    }
    .empty-state-title-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      min-width: 0;
      flex: 1 1 200px;
    }
    .board-empty-title {
      font-size: 0.95rem;
      font-weight: 700;
      line-height: 1.3;
      color: var(--primary-text-color, #111);
      margin: 0;
      text-align: left;
      word-break: break-word;
    }
    .empty-compact-summary {
      font-size: 0.85rem;
      line-height: 1.4;
      color: var(--secondary-text-color, #666);
      margin: 0;
      text-align: left;
      width: 100%;
      word-break: break-word;
    }
    .board-empty-state.is-interactive {
      cursor: pointer;
      transition: background-color 0.15s ease;
    }
    .board-empty-state.is-interactive:hover {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
    }
    .board-empty-state.station-closed.is-interactive:hover {
      background: rgba(211, 47, 47, 0.08);
    }
    .board-empty-state.engineering-work.is-interactive:hover,
    .board-empty-state.disrupted.is-interactive:hover {
      background: rgba(255, 152, 0, 0.09);
    }
    .board-empty-state.is-interactive:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: -2px;
    }
    .alternative-travel-box {
      margin-top: 4px;
      width: 100%;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.2));
      border-left: 3px solid var(--warning-color, #e65100);
      border-radius: 4px;
      padding: 8px 12px;
      text-align: left;
      box-sizing: border-box;
    }
    .alternative-travel-header {
      font-weight: 600;
      font-size: 0.82rem;
      color: var(--warning-color, #e65100);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;
      flex-wrap: wrap;
    }
    .alternative-travel-item {
      font-size: 0.82rem;
      color: var(--primary-text-color, #222);
      line-height: 1.4;
      word-break: break-word;
    }
    .alternative-travel-item + .alternative-travel-item {
      margin-top: 4px;
      padding-top: 4px;
      border-top: 1px dashed var(--divider-color, rgba(128, 128, 128, 0.2));
    }
    .empty-disruption-details {
      margin-top: 4px;
      width: 100%;
      text-align: left;
    }
    .empty-disruption-details + .empty-disruption-details {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px dashed var(--divider-color, rgba(128, 128, 128, 0.25));
    }
    .empty-disruption-title {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--primary-text-color, #111);
      margin: 0 0 2px 0;
      text-align: left;
    }
    .empty-state-summary,
    .empty-state-description {
      font-size: 0.82rem;
      line-height: 1.4;
      color: var(--secondary-text-color, #555);
      margin: 0 0 4px 0;
      text-align: left;
      word-break: break-word;
    }
    .empty-station-messages {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 100%;
    }
    .empty-station-message {
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--primary-text-color, #333);
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.06));
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.15));
      padding: 6px 10px;
      border-radius: 4px;
      text-align: left;
      word-break: break-word;
    }
    .alert-popup-card {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      max-width: 460px;
      width: 100%;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .alert-popup-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .alert-popup-title {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--primary-text-color, #111);
      line-height: 1.3;
    }
    .alert-badge {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 0.72rem;
      font-weight: 500;
      line-height: 1.3;
    }
    .alert-badge.planned {
      background: var(--secondary-background-color, rgba(128, 128, 128, 0.1));
      color: var(--secondary-text-color, #666);
      border: 1px solid var(--divider-color, rgba(128, 128, 128, 0.25));
    }
    .alert-badge.unplanned {
      background: rgba(230, 81, 0, 0.08);
      color: var(--warning-color, #e65100);
      border: 1px solid rgba(230, 81, 0, 0.25);
    }
    .alert-summary {
      font-size: 0.9rem;
      line-height: 1.45;
      color: var(--primary-text-color, #222);
      margin: 0;
      white-space: pre-wrap;
    }
    .alert-alternative-section {
      background: rgba(255, 193, 7, 0.08);
      border-left: 4px solid var(--warning-color, #ff9800);
      padding: 10px 12px;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .alert-alternative-title {
      font-weight: 700;
      color: var(--warning-color, #e65100);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .alert-link {
      color: var(--primary-color, #03a9f4);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .alert-link:hover {
      text-decoration: underline;
    }
  `,e([se({type:Object})],$e.prototype,"hass",void 0),e([se({type:Object})],$e.prototype,"config",void 0),e([se({type:Array})],$e.prototype,"nextTrains",void 0),e([le()],$e.prototype,"_selectedDeparture",void 0),e([le()],$e.prototype,"_selectedAlert",void 0),e([le()],$e.prototype,"_activeAnnouncementIndex",void 0),$e=e([oe("train-departure-board")],$e),window.customCards=window.customCards||[],window.customCards.push({type:"custom:train-departure-board",name:"Train Departure Board",description:"Display train departure information in a TFL-style board",preview:!0,support_url:"https://github.com/ivmreg/ha-train-departure-board/issues"});export{$e as TrainDepartureBoard};
//# sourceMappingURL=ha-train-departure-board.js.map
