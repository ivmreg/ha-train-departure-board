/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=window,e$4=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$3=Symbol(),n$5=new WeakMap;class o$3{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$4&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$5.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$5.set(s,t));}return t}toString(){return this.cssText}}const r$2=t=>new o$3("string"==typeof t?t:t+"",void 0,s$3),i$2=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$3(n,t,s$3)},S$1=(s,n)=>{e$4?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$1.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$1=e$4?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$2;const e$3=window,r$1=e$3.trustedTypes,h$1=r$1?r$1.emptyScript:"",o$2=e$3.reactiveElementPolyfillSupport,n$4={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$2={attribute:!0,type:String,converter:n$4,reflect:!1,hasChanged:a$1},d$1="finalized";class u$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$2){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$2}static finalize(){if(this.hasOwnProperty(d$1))return !1;this[d$1]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$1(i));}else void 0!==i&&s.push(c$1(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$2){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$4).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$4;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}u$1[d$1]=!0,u$1.elementProperties=new Map,u$1.elementStyles=[],u$1.shadowRootOptions={mode:"open"},null==o$2||o$2({ReactiveElement:u$1}),(null!==(s$2=e$3.reactiveElementVersions)&&void 0!==s$2?s$2:e$3.reactiveElementVersions=[]).push("1.6.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;const i$1=window,s$1=i$1.trustedTypes,e$2=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$1="$lit$",n$3=`lit$${(Math.random()+"").slice(9)}$`,l$1="?"+n$3,h=`<${l$1}>`,r=document,u=()=>r.createComment(""),d=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c=Array.isArray,v=t=>c(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r.createTreeWalker(r,129,null,!1);function P(t,i){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$2?e$2.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,e=[];let l,r=2===i?"<svg>":"",u=f;for(let i=0;i<s;i++){const s=t[i];let d,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f?"!--"===c[1]?u=_:void 0!==c[1]?u=m:void 0!==c[2]?(y.test(c[2])&&(l=RegExp("</"+c[2],"g")),u=p):void 0!==c[3]&&(u=p):u===p?">"===c[0]?(u=null!=l?l:f,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,d=c[1],u=void 0===c[3]?p:'"'===c[3]?$:g):u===$||u===g?u=p:u===_||u===m?u=f:(u=p,l=void 0);const w=u===p&&t[i+1].startsWith("/>")?" ":"";r+=u===f?s+h:v>=0?(e.push(d),s.slice(0,v)+o$1+s.slice(v)+n$3+w):s+n$3+(-2===v?(e.push(void 0),i):w);}return [P(t,r+(t[s]||"<?>")+(2===i?"</svg>":"")),e]};class N{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,d=0;const c=t.length-1,v=this.parts,[a,f]=V(t,i);if(this.el=N.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$1)||i.startsWith(n$3)){const s=f[d++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$1).split(n$3),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?H:"?"===i[1]?L:"@"===i[1]?z:k});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$3),i=t.length-1;if(i>0){h.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],u()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],u());}}}else if(8===h.nodeType)if(h.data===l$1)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$3,t+1));)v.push({type:7,index:r}),t+=n$3.length-1;}r++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const u=d(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==u&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===u?r=void 0:(r=new u(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=S(t,r._$AS(t,i.values),r,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,u=e[0];for(;void 0!==u;){if(l===u.index){let i;2===u.type?i=new R(n,n.nextSibling,this,t):1===u.type?i=new u.ctor(n,u.name,u.strings,this,t):6===u.type&&(i=new Z(n,this,t)),this._$AV.push(i),u=e[++h];}l!==(null==u?void 0:u.index)&&(n=C.nextNode(),l++);}return C.currentNode=r,o}v(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cp=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),d(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):v(t)?this.T(t):this._(t);}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t));}_(t){this._$AH!==A&&d(this._$AH)?this._$AA.nextSibling.data=t:this.$(r.createTextNode(t)),this._$AH=t;}g(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=N.createElement(P(e.h,e.h[0]),this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.v(s);else {const t=new M(o,this),i=t.u(this.options);t.v(s),this.$(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new N(t)),i}T(t){c(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new R(this.k(u()),this.k(u()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cp=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class k{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=S(this,t,i,0),n=!d(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=S(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!d(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const I=s$1?s$1.emptyScript:"";class L extends k{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,I):this.element.removeAttribute(this.name);}}class z extends k{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=S(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const B=i$1.litHtmlPolyfillSupport;null==B||B(N,R),(null!==(t=i$1.litHtmlVersions)&&void 0!==t?t:i$1.litHtmlVersions=[]).push("2.8.0");const D=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new R(i.insertBefore(u(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l,o;class s extends u$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s.finalized=!0,s._$litElement$=!0,null===(l=globalThis.litElementHydrateSupport)||void 0===l||l.call(globalThis,{LitElement:s});const n$2=globalThis.litElementPolyfillSupport;null==n$2||n$2({LitElement:s});(null!==(o=globalThis.litElementVersions)&&void 0!==o?o:globalThis.litElementVersions=[]).push("3.3.3");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$1=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}},e=(i,e,n)=>{e.constructor.createProperty(n,i);};function n$1(n){return (t,o)=>void 0!==o?e(n,t,o):i(n,t)}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));

let TrainDepartureEditor = class TrainDepartureEditor extends s {
    setConfig(config) {
        this.config = config;
    }
    render() {
        return x `
            <div class="editor">
                <div class="config-section">
                    <label for="title">Card Title:</label>
                    <input 
                        id="title"
                        type="text"
                        .value="${this.config.title || ''}"
                        @change="${this._onTitleChange}"
                        placeholder="Train Departures"
                    />
                </div>
                <div class="config-section">
                    <label for="entity">Select Entity:</label>
                    <select 
                        id="entity"
                        .value="${this.config.entity || ''}"
                        @change="${this._onEntityChange}"
                    >
                        <option value="">-- Select Entity --</option>
                        ${this._getAvailableEntities().map((entity) => x `
                            <option value="${entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
                        `)}
                    </select>
                </div>
                <div class="config-section">
                    <label for="attribute">Attribute (optional):</label>
                    <input 
                        id="attribute"
                        type="text"
                        .value="${this.config.attribute || 'departures'}"
                        @change="${this._onAttributeChange}"
                        placeholder="departures"
                    />
                </div>
                <div class="config-section">
                    <label for="stops_identifier">Stops Identifier:</label>
                    <select 
                        id="stops_identifier"
                        .value="${this.config.stops_identifier || 'description'}"
                        @change="${this._onStopsIdentifierChange}"
                    >
                        <option value="description">Description (Default)</option>
                        <option value="tiploc">TIPLOC</option>
                        <option value="crs">CRS</option>
                    </select>
                </div>
            </div>
        `;
    }
    _getAvailableEntities() {
        var _a;
        if (!((_a = this.hass) === null || _a === void 0 ? void 0 : _a.states))
            return [];
        return Object.values(this.hass.states)
            .filter((entity) => entity && typeof entity === 'object' && typeof entity.entity_id === 'string' && entity.entity_id.startsWith('sensor.'))
            .slice(0, 20);
    }
    _onTitleChange(event) {
        const input = event.target;
        this._fireConfigChanged({ title: input.value });
    }
    _onEntityChange(event) {
        const select = event.target;
        this._fireConfigChanged({ entity: select.value });
    }
    _onAttributeChange(event) {
        const input = event.target;
        this._fireConfigChanged({ attribute: input.value });
    }
    _onStopsIdentifierChange(event) {
        const select = event.target;
        this._fireConfigChanged({ stops_identifier: select.value });
    }
    _fireConfigChanged(updates) {
        const newConfig = Object.assign(Object.assign({}, this.config), updates);
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    }
};
TrainDepartureEditor.styles = i$2 `
        .editor {
            padding: 16px;
            background-color: var(--card-background-color);
            border-radius: 8px;
        }
        .config-section {
            display: flex;
            flex-direction: column;
            margin-bottom: 16px;
        }
        .checkbox-section {
            flex-direction: row;
            align-items: center;
            gap: 8px;
        }
        .checkbox-section input {
            width: auto;
        }
        .checkbox-section label {
            margin-bottom: 0;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--primary-text-color);
        }
        input,
        select {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--divider-color);
            border-radius: 4px;
            background-color: var(--card-background-color);
            color: var(--primary-text-color);
            font-family: inherit;
        }
        input:focus,
        select:focus {
            outline: none;
            border-color: var(--primary-color);
        }
    `;
__decorate([
    n$1({ type: Object })
], TrainDepartureEditor.prototype, "config", void 0);
__decorate([
    n$1({ type: Object })
], TrainDepartureEditor.prototype, "hass", void 0);
TrainDepartureEditor = __decorate([
    e$1('train-departure-board-editor')
], TrainDepartureEditor);

let TrainDepartureBoard = class TrainDepartureBoard extends s {
    constructor() {
        super(...arguments);
        this.departures = [];
        this.dateCache = new Map();
    }
    static getConfigElement() {
        return document.createElement('train-departure-board-editor');
    }
    static getStubConfig() {
        return {
            type: 'custom:train-departure-board',
            title: 'Train Departures',
            entity: '',
            attribute: 'departures'
        };
    }
    setConfig(config) {
        if (!config) {
            throw new Error('Invalid configuration');
        }
        const mergedConfig = Object.assign({ attribute: 'departures' }, config);
        if (typeof mergedConfig.attribute === 'string') {
            mergedConfig.attribute = mergedConfig.attribute.trim() || 'departures';
        }
        else {
            mergedConfig.attribute = 'departures';
        }
        this.config = mergedConfig;
    }
    static get properties() {
        return {
            hass: {},
            config: {},
            departures: { type: Array }
        };
    }
    render() {
        var _a, _b, _c;
        if (!this.config) {
            return x `<div class="card">No configuration provided</div>`;
        }
        if (!this.config.entity) {
            return x `<div class="card">Please configure an entity</div>`;
        }
        const entity = (_b = (_a = this.hass) === null || _a === void 0 ? void 0 : _a.states) === null || _b === void 0 ? void 0 : _b[this.config.entity];
        if (!entity) {
            return x `<div class="card">Entity not found: ${this.config.entity}</div>`;
        }
        this.dateCache.clear();
        const attributeName = this.config.attribute || 'departures';
        const attributeValue = (_c = entity.attributes) === null || _c === void 0 ? void 0 : _c[attributeName];
        const departures = Array.isArray(attributeValue) ? attributeValue : [];
        const lastUpdated = entity.last_updated ? new Date(entity.last_updated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        if (attributeValue === undefined) {
            // eslint-disable-next-line no-console
            console.warn(`train-departure-board: attribute "${attributeName}" was not found on entity ${this.config.entity}`);
        }
        if (!Array.isArray(attributeValue) && attributeValue !== undefined) {
            // eslint-disable-next-line no-console
            console.warn(`train-departure-board: attribute "${attributeName}" is not an array, falling back to empty list`);
        }
        return x `
            <ha-card>
                <div class="card">
                    ${departures.length > 0
            ? x `<div class="departure-list">
                            ${departures.map((departure, index) => this.renderDepartureRow(departure, index))}
                        </div>`
            : x `<div class="no-departures">No departures available</div>`}
                    ${lastUpdated ? x `<div class="footer">Last updated: ${lastUpdated}</div>` : ''}
                </div>
            </ha-card>
        `;
    }
    cleanStationName(name) {
        if (name.startsWith('London ')) {
            return name.substring(7);
        }
        return name;
    }
    renderDepartureRow(departure, index) {
        const scheduledTime = this.extractTimeLabel(departure.scheduled);
        const { statusClass, statusLabel } = this.getStatusMeta(departure);
        const callingAt = this.getCallingAtSummary(departure);
        const platform = departure.platform ? departure.platform : null;
        const isNextTrain = index === 0;
        return x `
            <div class="train ${isNextTrain ? 'next-train' : ''}">
                <div class="time-wrapper">
                    <span class="scheduled">${scheduledTime}</span>
                    ${platform ? x `<span class="platform-badge">Plat ${platform}</span>` : ''}
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${this.cleanStationName(departure.destination_name)}</h3>
                        <span class="status-pill ${statusClass}">${statusLabel}</span>
                    </div>
                    ${callingAt ? x `
                    <div class="marquee-container">
                        <div class="marquee-content">Calling at: ${callingAt}</div>
                    </div>` : ''}
                </div>
            </div>
        `;
    }
    getCallingAtSummary(departure) {
        const stops = departure.stops_of_interest || [];
        const dedupedStops = new Map();
        stops.forEach((stop, index) => {
            var _a;
            let label = '';
            const identifier = this.config.stops_identifier || 'description';
            if (identifier === 'tiploc') {
                label = (stop.stop || '').trim();
            }
            else if (identifier === 'crs') {
                label = (stop.crs || stop.name || '').trim();
            }
            else {
                label = (stop.name || stop.stop || '').trim();
            }
            if (!label) {
                return;
            }
            label = this.cleanStationName(label);
            const datetime = stop.estimate_stop || stop.scheduled_stop;
            const parsedDate = this.parseDateTime(datetime);
            const timestamp = (_a = parsedDate === null || parsedDate === void 0 ? void 0 : parsedDate.getTime()) !== null && _a !== void 0 ? _a : Number.POSITIVE_INFINITY;
            const timeText = datetime ? (datetime.split(' ')[1] || '').trim() : '';
            const existing = dedupedStops.get(label);
            if (!existing || timestamp < existing.time) {
                dedupedStops.set(label, {
                    label,
                    time: timestamp,
                    timeText,
                    order: index,
                });
            }
        });
        const sortedStops = Array.from(dedupedStops.values()).sort((a, b) => {
            if (a.time === b.time) {
                return a.order - b.order;
            }
            return a.time - b.time;
        });
        let destinationName = (departure.destination_name || '').trim();
        if (destinationName) {
            destinationName = this.cleanStationName(destinationName);
            const lastStop = sortedStops[sortedStops.length - 1];
            if (!lastStop || lastStop.label.toLowerCase() !== destinationName.toLowerCase()) {
                sortedStops.push({
                    label: destinationName,
                    time: Number.POSITIVE_INFINITY,
                    timeText: '',
                    order: sortedStops.length
                });
            }
        }
        if (sortedStops.length === 0) {
            return null;
        }
        return sortedStops.map(info => `${info.label}${info.timeText ? ' ' + info.timeText : ''}`).join(', ');
    }
    getStatusMeta(departure) {
        var _a, _b;
        const scheduledRaw = departure.scheduled || '';
        const estimatedRaw = departure.estimated || '';
        const scheduledTime = this.extractTimeLabel(scheduledRaw);
        const estimatedTime = this.extractTimeLabel(estimatedRaw);
        if (((_a = departure.status) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('cancel')) ||
            ((_b = departure.etd) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('cancel')) ||
            departure.planned_cancel ||
            departure.cancel_reason ||
            estimatedRaw.toLowerCase().includes('cancel')) {
            return { statusLabel: 'Cancelled', statusClass: 'cancelled' };
        }
        if (!estimatedRaw) {
            return { statusLabel: 'Awaiting', statusClass: 'delayed' };
        }
        const normalizedEstimate = estimatedRaw.toLowerCase();
        if (normalizedEstimate === 'on time') {
            return { statusLabel: 'On Time', statusClass: 'on-time' };
        }
        if (estimatedTime && scheduledTime && estimatedTime !== scheduledTime) {
            if (/\d{2}:\d{2}/.test(estimatedTime)) {
                return { statusLabel: `Exp ${estimatedTime}`, statusClass: 'delayed' };
            }
            return { statusLabel: estimatedTime, statusClass: 'delayed' };
        }
        return { statusLabel: 'On Time', statusClass: 'on-time' };
    }
    extractTimeLabel(datetime) {
        if (!datetime) {
            return '—';
        }
        const trimmed = datetime.trim();
        if (!trimmed) {
            return '—';
        }
        const parts = trimmed.split(' ');
        if (parts.length === 2 && /^\d{2}:\d{2}$/.test(parts[1])) {
            return parts[1];
        }
        if (/^\d{2}:\d{2}$/.test(trimmed)) {
            return trimmed;
        }
        return parts.length === 2 ? parts[1] || parts[0] : trimmed;
    }
    parseDateTime(datetime) {
        var _a;
        if (!datetime) {
            return null;
        }
        if (this.dateCache.has(datetime)) {
            return (_a = this.dateCache.get(datetime)) !== null && _a !== void 0 ? _a : null;
        }
        const [datePart, timePart] = datetime.split(' ');
        let parsed = null;
        if (datePart && timePart) {
            const isoDate = `${datePart.split('-').reverse().join('-')}T${timePart}`;
            const candidate = new Date(isoDate);
            parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
        }
        else if (/^\d{2}:\d{2}$/.test(datetime)) {
            const today = new Date();
            const iso = `${today.toISOString().split('T')[0]}T${datetime}`;
            const candidate = new Date(iso);
            parsed = Number.isNaN(candidate.getTime()) ? null : candidate;
        }
        this.dateCache.set(datetime, parsed);
        return parsed;
    }
};
TrainDepartureBoard.styles = i$2 `
        ha-card {
            height: 100%;
            background: var(--ha-card-background, var(--card-background-color, #fff));
            color: var(--primary-text-color, #111);
            display: flex;
            flex-direction: column;
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
        }
        .train:last-child {
            border-bottom: none;
        }
        .train.next-train {
            background: var(--secondary-background-color, rgba(255, 193, 7, 0.1));
            border-left: 4px solid var(--warning-color, #ff9800);
            padding-left: 8px; /* Compensate for border */
        }
        .time-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            min-width: 55px;
            flex-shrink: 0;
        }
        .scheduled {
            font-size: 1.4em;
            font-weight: 700;
            line-height: 1;
            color: var(--primary-text-color, #111);
            font-family: var(--primary-font-family, sans-serif);
            font-variant-numeric: tabular-nums;
        }
        .platform-badge {
            background: var(--primary-color, #03a9f4);
            color: #fff;
            font-size: 0.75em;
            font-weight: 600;
            padding: 2px 6px;
            border-radius: 10px;
            line-height: 1;
        }
        .info-box {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
            gap: 2px;
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
            font-size: 1.1em;
            font-weight: 600;
            line-height: 1.2;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--primary-text-color, #111);
            flex: 1;
        }
        .status-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.85em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
            flex-shrink: 0;
            min-width: 80px;
            text-align: center;
        }
        .status-pill.on-time {
            color: var(--success-color, #4caf50);
            background: rgba(76, 175, 80, 0.1);
        }
        .status-pill.delayed {
            color: var(--warning-color, #ff9800);
            background: rgba(255, 152, 0, 0.1);
        }
        .status-pill.cancelled {
            color: var(--error-color, #f44336);
            background: rgba(244, 67, 54, 0.1);
        }
        .marquee-container {
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            width: 100%;
        }
        .marquee-content {
            display: inline-block;
            padding-left: 100%;
            animation: marquee 20s linear infinite;
            font-size: 0.85em;
            color: var(--secondary-text-color, #666);
        }
        .marquee-container:hover .marquee-content {
            animation-play-state: paused;
        }
        @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
        .footer {
            padding: 8px 12px;
            border-top: 1px solid var(--divider-color, #e0e0e0);
            font-size: 0.75em;
            color: var(--secondary-text-color, #666);
            text-align: right;
            background: var(--card-background-color, #fff);
            border-radius: 0 0 8px 8px;
        }
        .no-departures {
            padding: 24px 0;
            text-align: center;
            color: var(--secondary-text-color, #999);
        }
    `;
__decorate([
    n$1({ type: Object })
], TrainDepartureBoard.prototype, "hass", void 0);
__decorate([
    n$1({ type: Object })
], TrainDepartureBoard.prototype, "config", void 0);
__decorate([
    n$1({ type: Array })
], TrainDepartureBoard.prototype, "departures", void 0);
TrainDepartureBoard = __decorate([
    e$1('train-departure-board')
], TrainDepartureBoard);
// Register with Home Assistant's card registry
window.customCards = window.customCards || [];
window.customCards.push({
    // Register with the `custom:` prefix so Home Assistant's card picker
    // recognizes the YAML type `custom:train-departure-board`.
    type: 'custom:train-departure-board',
    name: 'Train Departure Board',
    description: 'Display train departure information in a TFL-style board',
    // Enable preview so the card is discoverable in the card picker
    // and shows a preview in the UI.
    preview: true,
    support_url: 'https://github.com/ivmreg/ha-train-departure-board/issues'
});

export { TrainDepartureBoard };
//# sourceMappingURL=ha-train-departure-board.js.map
