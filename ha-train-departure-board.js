function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;class o{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var a;const l=window,d=l.trustedTypes,c=d?d.emptyScript:"",p=l.reactiveElementPolyfillSupport,h={toAttribute(t,e){switch(e){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},u=(t,e)=>e!==t&&(e==e||t==t),f={attribute:!0,type:String,converter:h,reflect:!1,hasChanged:u},m="finalized";class v extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=f){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||f}static finalize(){if(this.hasOwnProperty(m))return!1;this[m]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(i=>{const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=f){var s;const r=this.constructor._$Ep(t,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:h).toAttribute(e,i.type);this._$El=t,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=s.getPropertyOptions(r),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:h;this._$El=r,this[r]=o.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;v[m]=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==p||p({ReactiveElement:v}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const b=window,_=b.trustedTypes,$=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,y="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,w="?"+x,A=`<${w}>`,E=document,C=()=>E.createComment(""),S=t=>null===t||"object"!=typeof t&&"function"!=typeof t,k=Array.isArray,P="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,L=/>/g,N=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,D=/"/g,U=/^(?:script|style|textarea|title)$/i,H=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),R=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),j=new WeakMap,I=E.createTreeWalker(E,129,null,!1);function B(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==$?$.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":"",n=T;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(n.lastIndex=c,l=n.exec(i),null!==l);)c=n.lastIndex,n===T?"!--"===l[1]?n=z:void 0!==l[1]?n=L:void 0!==l[2]?(U.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=null!=r?r:T,d=-1):void 0===l[1]?d=-2:(d=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?N:'"'===l[3]?D:O):n===D||n===O?n=N:n===z||n===L?n=T:(n=N,r=void 0);const p=n===N&&t[e+1].startsWith("/>")?" ":"";o+=n===T?i+A:d>=0?(s.push(a),i.slice(0,d)+y+i.slice(d)+x+p):i+x+(-2===d?(s.push(void 0),e):p)}return[B(t,o+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,d]=V(t,e);if(this.el=F.createElement(l,i),I.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=I.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(y)||e.startsWith(x)){const i=d[o++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+y).split(x),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?Y:"?"===e[1]?Z:"@"===e[1]?G:J})}else a.push({type:6,index:r})}for(const e of t)s.removeAttribute(e)}if(U.test(s.tagName)){const t=s.textContent.split(x),e=t.length-1;if(e>0){s.textContent=_?_.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],C()),I.nextNode(),a.push({type:2,index:++r});s.append(t[e],C())}}}else if(8===s.nodeType)if(s.data===w)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(x,t+1));)a.push({type:7,index:r}),t+=x.length-1}r++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,s){var r,o,n,a;if(e===R)return e;let l=void 0!==s?null===(r=i._$Co)||void 0===r?void 0:r[s]:i._$Cl;const d=S(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(o=null==l?void 0:l._$AO)||void 0===o||o.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=q(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);I.currentNode=r;let o=I.nextNode(),n=0,a=0,l=s[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new W(o,o.nextSibling,this,t):1===l.type?e=new l.ctor(o,l.name,l.strings,this,t):6===l.type&&(e=new Q(o,this,t)),this._$AV.push(e),l=s[++a]}n!==(null==l?void 0:l.index)&&(o=I.nextNode(),n++)}return I.currentNode=E,r}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class W{constructor(t,e,i,s){var r;this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(r=null==s?void 0:s.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),S(t)?t===M||null==t||""===t?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==R&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>k(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==M&&S(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(B(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.v(i);else{const t=new K(r,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=j.get(t.strings);return void 0===e&&j.set(t.strings,e=new F(t)),e}T(t){k(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new W(this.k(C()),this.k(C()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class J{constructor(t,e,i,s,r){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=M}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=q(this,t,e,0),o=!S(t)||t!==this._$AH&&t!==R,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=q(this,s[i+n],e,n),a===R&&(a=this._$AH[n]),o||(o=!S(a)||a!==this._$AH[n]),a===M?t=M:t!==M&&(t+=(null!=a?a:"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Y extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}}const X=_?_.emptyScript:"";class Z extends J{constructor(){super(...arguments),this.type=4}j(t){t&&t!==M?this.element.setAttribute(this.name,X):this.element.removeAttribute(this.name)}}class G extends J{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=q(this,t,e,0))&&void 0!==i?i:M)===R)return;const s=this._$AH,r=t===M&&s!==M||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==M&&(s===M||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Q{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const tt=b.litHtmlPolyfillSupport;null==tt||tt(F,W),(null!==(g=b.litHtmlVersions)&&void 0!==g?g:b.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et,it;class st extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,r;const o=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let n=o._$litPart$;if(void 0===n){const t=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;o._$litPart$=n=new W(e.insertBefore(C(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}}st.finalized=!0,st._$litElement$=!0,null===(et=globalThis.litElementHydrateSupport)||void 0===et||et.call(globalThis,{LitElement:st});const rt=globalThis.litElementPolyfillSupport;null==rt||rt({LitElement:st}),(null!==(it=globalThis.litElementVersions)&&void 0!==it?it:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),nt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function at(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):nt(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lt(t){return at({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var dt;null===(dt=window.HTMLSlotElement)||void 0===dt||dt.prototype.assignedElements;const ct=[{name:"entity",required:!0,selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"attribute",selector:{text:{}}},{name:"stops_identifier",selector:{select:{options:[{value:"description",label:"Description (Default)"},{value:"tiploc",label:"TIPLOC"},{value:"crs",label:"CRS"}],mode:"dropdown"}}}]},{type:"expandable",name:"",schema:[{type:"grid",name:"",schema:[{name:"font_size_time",selector:{text:{}}},{name:"font_size_destination",selector:{text:{}}},{name:"font_size_status",selector:{text:{}}}]}]}],pt={entity:"Entity",title:"Card Title",attribute:"Data Attribute",stops_identifier:"Station Identifier","":"Font Sizes",font_size_time:"Time",font_size_destination:"Destination",font_size_status:"Status Pill"},ht={entity:"Select a realtime trains sensor",attribute:"Attribute with departure data (default: next_trains)",stops_identifier:"How stations are identified in the data",font_size_time:"e.g. 1.5rem (default: 1.25rem)",font_size_destination:"e.g. 1.2rem (default: 1rem)",font_size_status:"e.g. 0.85rem (default: 0.75rem)"};let ut=class extends st{constructor(){super(...arguments),this._computeLabel=t=>pt[t.name]||t.name,this._computeHelper=t=>ht[t.name]}setConfig(t){this._config=t}render(){return this.hass&&this._config?H`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${ct}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${this._valueChanged}
            ></ha-form>
        `:M}_valueChanged(t){t.stopPropagation();const e=t.detail.value,i=Object.assign(Object.assign(Object.assign({},this._config),e),{attribute:e.attribute||"next_trains",stops_identifier:e.stops_identifier||"description"});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}};t([at({attribute:!1})],ut.prototype,"hass",void 0),t([lt()],ut.prototype,"_config",void 0),ut=t([ot("train-departure-board-editor")],ut);let ft=class extends st{constructor(){super(...arguments),this.nextTrains=[],this._selectedDeparture=null,this.dateCache=new Map,this.lastEntityId=null,this._handleKeyDown=t=>{"Escape"===t.key&&this._selectedDeparture&&this._closePopup()}}static getConfigElement(){return document.createElement("train-departure-board-editor")}static getStubConfig(){return{type:"custom:train-departure-board",title:"Train Departures",entity:"",attribute:"next_trains"}}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=Object.assign({attribute:"next_trains"},t);"string"==typeof e.attribute?e.attribute=e.attribute.trim()||"next_trains":e.attribute="next_trains",this.config=e}render(){var t,e,i;if(!this.config)return H`<div class="card">No configuration provided</div>`;if(!this.config.entity)return H`<div class="card">Please configure an entity</div>`;const s=null===(e=null===(t=this.hass)||void 0===t?void 0:t.states)||void 0===e?void 0:e[this.config.entity];if(!s)return H`<div class="card">Entity not found: ${this.config.entity}</div>`;this.lastEntityId!==this.config.entity&&(this.dateCache.clear(),this.lastEntityId=this.config.entity);const r=this.config.attribute||"next_trains",o=null===(i=s.attributes)||void 0===i?void 0:i[r],n=Array.isArray(o)?o:[],a=s.last_updated?new Date(s.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";void 0===o&&console.warn(`train-departure-board: attribute "${r}" was not found on entity ${this.config.entity}`),Array.isArray(o)||void 0===o||console.warn(`train-departure-board: attribute "${r}" is not an array, falling back to empty list`);const l=[this.config.font_size_time?`--train-board-time-size: ${this.config.font_size_time}`:"",this.config.font_size_destination?`--train-board-destination-size: ${this.config.font_size_destination}`:"",this.config.font_size_status?`--train-board-status-size: ${this.config.font_size_status}`:""].filter(Boolean).join("; ");return H`
            <ha-card style="${l}">
                ${this.config.title?H`<div class="card-header">${this.config.title}</div>`:""}
                <div class="card">
                    ${n.length>0?H`<div class="departure-list" role="list" aria-label="Train departures">
                            ${n.map((t,e)=>this.renderDepartureRow(t,e))}
                        </div>`:H`<div class="no-departures">No departures available</div>`}
                    ${a?H`<div class="footer">Last updated: ${a}</div>`:""}
                </div>
            </ha-card>
            ${this._renderDetailsPopup()}
        `}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._handleKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._handleKeyDown)}_showDetails(t){this._selectedDeparture=t}_closePopup(){this._selectedDeparture=null}_handleOverlayClick(t){t.target.classList.contains("popup-overlay")&&this._closePopup()}_renderStockBadge(t){const e=function(t){const e=(t||"").toLowerCase();return e.includes("city beam")||e.includes("707")?{category:"modern",label:"CITY BEAM"}:e.includes("javelin")||e.includes("395")?{category:"javelin",label:"JAVELIN"}:e.includes("376")?{category:"refurb",label:"REFURB 376"}:e.includes("465")||e.includes("466")||e.includes("networker")?{category:"older",label:"CLASS 465"}:{category:"standard",label:""}}(t.stock);return"standard"===e.category?M:H`
            <div class="stock-badge stock-${e.category}">
                ${e.label}
            </div>
        `}_renderDetailsPopup(){if(!this._selectedDeparture)return M;const t=this._selectedDeparture,{statusClass:e,statusLabel:i}=this.getStatusMeta(t),s=this.extractTimeLabel(t.scheduled),r=this._getStopsForPopup(t),o="cancelled"===e,n="on-time"===e?"status-ok":"cancelled"===e?"status-cancelled":"status-delayed",a=r.some(t=>t.isPassed);return H`
            <div class="popup-overlay" @click=${this._handleOverlayClick} role="dialog" aria-modal="true" aria-label="Train details">
                <div class="popup-card">
                    <div class="modern-header">
                        <div class="modern-header-top">
                            <div class="modern-dest-group">
                                <div class="modern-time-group">
                                    <span class="modern-scheduled ${o?"time-cancelled":""}">${s}</span>
                                    ${t.operator_name?H`<span class="modern-operator">${t.operator_name}</span>`:""}
                                </div>
                                <h2 class="modern-dest">${t.destination_name}</h2>
                            </div>
                            <button class="popup-close" @click=${this._closePopup} aria-label="Close">&times;</button>
                        </div>
                        <div class="modern-badges">
                            <div class="modern-badge ${n}">
                                <span style="font-size: 1.2em; line-height: 1;">●</span> ${i}
                            </div>
                            ${t.platform?H`
                            <div class="modern-badge platform">
                                Platform ${t.platform}
                            </div>`:""}
                        </div>
                    </div>
                    
                    <div class="modern-content">
                        ${r.length>0?H`
                        <div class="timeline-container">
                            <div class="modern-stops-list ${a?"has-passed":""}">
                                ${r.map(t=>H`
                                    ${t.isBetweenPrevious?H`
                                    <div class="modern-train-pos-wrapper" aria-hidden="true">
                                        <div class="modern-stop-graphic">
                                            <div class="modern-train-pos">🚆</div>
                                        </div>
                                        <div></div>
                                    </div>
                                    `:""}
                                    <div class="modern-stop ${t.isPassed?"passed":""} ${t.isCurrent?"current":""}">
                                        <div class="modern-stop-graphic">
                                            <div class="modern-stop-circle"></div>
                                        </div>
                                        <div class="modern-stop-content">
                                            <span class="modern-stop-time">${t.time}</span>
                                            <div class="modern-stop-info">
                                                <span class="modern-stop-name">${t.name}</span>
                                                ${!t.isPassed&&t.statusLabel?H`<span class="modern-stop-status ${t.statusClass}">${t.statusLabel}</span>`:""}
                                            </div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>`:""}
                    </div>
                </div>
            </div>
        `}_getStopsForPopup(t){var e;const i=t.subsequent_stops||[],s=this.config.stops_identifier||"description",r=i.map(t=>{var e;let i="";i="tiploc"===s?(t.stop||"").trim():"crs"===s?(t.name||"").trim():(t.name||t.stop||"").trim();const r=t.scheduled||t.estimated,o=this.parseDateTime(r),n=null!==(e=null==o?void 0:o.getTime())&&void 0!==e?e:Number.POSITIVE_INFINITY,a=t.estimated,l=t.scheduled;let d="On time",c="on-time";if(a&&l){const t=this.extractTimeLabel(a),e=this.extractTimeLabel(l);if("—"!==t&&"—"!==e&&t!==e){const i=this.calculateDelayMins(e,t);if(Math.abs(i)<=1)c="on-time",d="On time";else{c="delayed";let e="Exp";i<0&&(c="early",e="Early"),d=/^\d{2}:\d{2}$/.test(t)?`${e} ${t}`:t}}}return((null==a?void 0:a.toLowerCase().includes("cancel"))||t.is_cancelled)&&(d="Cancelled",c="cancelled"),{name:i,time:r?(r.split(" ")[1]||"").trim():"",timestamp:n,stopCode:t.stop||"",isPassed:!1,isCurrent:!1,isBetweenPrevious:!1,statusLabel:d,statusClass:c}}).filter(t=>t.name).sort((t,e)=>t.timestamp-e.timestamp);if(!t.last_report_station||!t.last_report_type)return r;const o=t.last_report_station,n=t.last_report_type,a=t.last_report_time?null===(e=this.parseDateTime(t.last_report_time))||void 0===e?void 0:e.getTime():void 0,l=r.findIndex(t=>t.stopCode===o);if(-1!==l){for(let t=0;t<l;t++)r[t].isPassed=!0;"Arrival"===n?(r[l].isCurrent=!0,r[l].isPassed=!1):(r[l].isPassed=!0,l+1<r.length?r[l+1].isBetweenPrevious=!0:r[l].isPassed=!0)}else if(void 0!==a&&!Number.isNaN(a)){let t=-1;for(let e=0;e<r.length&&r[e].timestamp<=a;e++)r[e].isPassed=!0,t=e;-1!==t&&t+1<r.length?r[t+1].isBetweenPrevious=!0:-1===t&&r.length>0&&(r[0].isBetweenPrevious=!0)}if(r.length>0&&r[0].isBetweenPrevious&&-1===l&&o){const e=t.last_report_time?this.extractTimeLabel(t.last_report_time):"";r.unshift({name:o,time:e,timestamp:a||0,stopCode:o,isPassed:!0,isCurrent:!1,isBetweenPrevious:!1,statusLabel:"",statusClass:""})}return r}renderDepartureRow(t,e){const i=this.extractTimeLabel(t.scheduled),{statusClass:s,statusLabel:r,offsetStr:o}=this.getStatusMeta(t),n=t.platform?t.platform:null,a="cancelled"===s,l=a?"time-cancelled":"";return H`
            <div 
                class="train ${0===e?"next-train":""} ${a?"cancelled-row":""}"
                role="listitem" 
                aria-label="${t.destination_name} at ${i}, ${r}${n?`, Platform ${n}`:""}"
                @click=${()=>this._showDetails(t)}
            >
                <div class="time-wrapper ${l}">
                    <span class="scheduled" aria-label="Scheduled time">${i}</span>
                    ${o?H`<span class="offset-pill ${"early"===s?"early":"late"}">${o}</span>`:""}
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${t.destination_name}</h3>
                        ${this._renderStockBadge(t)}
                        ${n?H`<span class="platform-badge" aria-label="Platform ${n}">${n}</span>`:""}
                    </div>
                </div>
            </div>
        `}getStatusMeta(t){var e,i;const s=t.scheduled||"",r=t.estimated||"",o=this.extractTimeLabel(s),n=this.extractTimeLabel(r);if(t.is_cancelled||(null===(e=t.status)||void 0===e?void 0:e.toLowerCase().includes("cancel"))||(null===(i=t.etd)||void 0===i?void 0:i.toLowerCase().includes("cancel"))||t.planned_cancel||t.cancel_reason||r.toLowerCase().includes("cancel"))return{statusLabel:"Cancelled",statusClass:"cancelled"};if(!r)return{statusLabel:"Awaiting",statusClass:"delayed"};if("on time"===r.toLowerCase())return{statusLabel:"On Time",statusClass:"on-time"};if(n&&o&&n!==o){const t=this.calculateDelayMins(o,n);if(Math.abs(t)<=1)return{statusLabel:"On Time",statusClass:"on-time"};let e="delayed",i="Exp",s=`+${t}m`;return t<0&&(e="early",i="Early",s=`${t}m`),/^\d{2}:\d{2}$/.test(n)?{statusLabel:`${i} ${n}`,statusClass:e,offsetStr:s}:{statusLabel:n,statusClass:e,offsetStr:s}}return{statusLabel:"On Time",statusClass:"on-time"}}extractTimeLabel(t){if(!t)return"—";const e=t.trim();if(!e)return"—";const i=e.split(" ");return 2===i.length&&/^\d{2}:\d{2}$/.test(i[1])?i[1]:/^\d{2}:\d{2}$/.test(e)?e:2===i.length?i[1]||i[0]:e}calculateDelayMins(t,e){if(!/^\d{2}:\d{2}$/.test(t)||!/^\d{2}:\d{2}$/.test(e))return 0;const[i,s]=t.split(":").map(Number),[r,o]=e.split(":").map(Number);let n=60*r+o-(60*i+s);return n<-720&&(n+=1440),n>720&&(n-=1440),n}parseDateTime(t){var e;if(!t)return null;if(this.dateCache.has(t))return null!==(e=this.dateCache.get(t))&&void 0!==e?e:null;const[i,s]=t.split(" ");let r=null;if(i&&s){const t=`${i.split("-").reverse().join("-")}T${s}`,e=new Date(t);r=Number.isNaN(e.getTime())?null:e}else if(/^\d{2}:\d{2}$/.test(t)){const e=`${(new Date).toISOString().split("T")[0]}T${t}`,i=new Date(e);r=Number.isNaN(i.getTime())?null:i}return this.dateCache.set(t,r),r}};ft.styles=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)})`
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
        .train:last-child {
            border-bottom: none;
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
        .time-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100px;
            flex-shrink: 0;
        }
        .scheduled {
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
            background: var(--disabled-color, #9e9e9e);
            color: #fff;
            font-size: 0.95em;
            font-weight: 700;
            width: 26px;
            height: 26px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
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
            gap: 8px;
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
            background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
            position: relative;
            border-radius: 12px 12px 0 0;
        }
        .modern-header-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .modern-dest-group { display: flex; flex-direction: column; gap: 4px; }
        .modern-time-group { display: flex; align-items: baseline; gap: 8px; }
        .modern-scheduled { font-size: 1.4em; color: var(--primary-text-color); font-weight: 700; letter-spacing: 0.5px; font-variant-numeric: tabular-nums; }
        .modern-operator { font-size: 0.85em; color: var(--secondary-text-color, #666); font-weight: 500; }
        .modern-dest { margin: 0; font-size: 1.15em; font-weight: 600; line-height: 1.2; color: var(--primary-text-color); }
        .modern-badges { display: flex; gap: 6px; align-items: center; margin-top: 8px; }
        .modern-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 6px; font-size: 0.8em; font-weight: 600; background: var(--secondary-background-color, rgba(0,0,0,0.05)); }
        .modern-badge.status-ok { background: rgba(76, 175, 80, 0.15); color: var(--success-color, #4caf50); }
        .modern-badge.status-delayed { background: rgba(255, 152, 0, 0.15); color: var(--warning-color, #ff9800); }
        .modern-badge.status-cancelled { background: rgba(244, 67, 54, 0.15); color: var(--error-color, #f44336); }
        .modern-badge.platform { background: rgba(255, 255, 255, 0.1); }
        
        /* Dense Timeline */
        .timeline-container { padding: 12px 16px; background: rgba(0,0,0,0.02); }
        .modern-stops-list { display: flex; flex-direction: column; position: relative; }
        
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
        .modern-stop, .modern-train-pos-wrapper {
            display: grid;
            grid-template-columns: 30px 1fr;
            gap: 12px;
            align-items: center;
            position: relative;
            z-index: 3;
        }

        .modern-stop { padding: 8px 0; }
        .modern-train-pos-wrapper { height: 6px; padding: 0; }

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
            box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 2px 6px rgba(0,0,0,0.5);
            z-index: 5;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 0 rgba(255, 152, 0, 0.4); }
            70% { box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 8px rgba(255, 152, 0, 0); }
            100% { box-shadow: 0 0 0 3px var(--card-background-color, #fff), 0 0 0 0 rgba(255, 152, 0, 0); }
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
        
        .modern-stop-info { display: flex; flex-direction: row; align-items: baseline; flex: 1; gap: 8px; justify-content: space-between; min-width: 0; }
        .modern-stop-name { font-size: 0.95em; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .modern-stop-status { font-size: 0.75em; font-weight: 600; white-space: nowrap; }
        .modern-stop-status.on-time { color: var(--success-color, #4caf50); }
        .modern-stop-status.delayed { color: var(--warning-color, #ff9800); }
        .modern-stop-status.early { color: var(--info-color, #2196f3); }
        .modern-stop-status.cancelled { color: var(--error-color, #f44336); }
        
        .modern-stop.passed .modern-stop-time, 
        .modern-stop.passed .modern-stop-name { 
            color: var(--secondary-text-color, #666); 
            font-weight: 400;
        }
        .modern-stop.passed .modern-stop-status { display: none; }

        /* Terminus special styling */
        .modern-stop:last-child .modern-stop-name { font-weight: 700; }
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
            text-align: right;
            background: var(--card-background-color, #fff);
            border-radius: 0 0 8px 8px;
        }
        .no-departures {
            padding: 24px 0;
            text-align: center;
            color: var(--secondary-text-color, #999);
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
            background: linear-gradient(135deg, #00AEEF 0%, #0054A6 100%);
            color: white;
        }
        .stock-javelin {
            background: #002D72;
            color: white;
            border-left: 3px solid #C0C0C0;
        }
        .stock-refurb {
            background: #003366;
            color: white;
            border-right: 3px solid #FF8200;
        }
        .stock-older {
            color: var(--secondary-text-color);
            font-weight: 600;
        }
    `,t([at({type:Object})],ft.prototype,"hass",void 0),t([at({type:Object})],ft.prototype,"config",void 0),t([at({type:Array})],ft.prototype,"nextTrains",void 0),t([lt()],ft.prototype,"_selectedDeparture",void 0),ft=t([ot("train-departure-board")],ft),window.customCards=window.customCards||[],window.customCards.push({type:"custom:train-departure-board",name:"Train Departure Board",description:"Display train departure information in a TFL-style board",preview:!0,support_url:"https://github.com/ivmreg/ha-train-departure-board/issues"});export{ft as TrainDepartureBoard};
//# sourceMappingURL=ha-train-departure-board.js.map
