function t(t,e,i,s){var o,r=arguments.length,n=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,i,n):o(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var a;const l=window,p=l.trustedTypes,d=p?p.emptyScript:"",c=l.reactiveElementPolyfillSupport,u={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},h=(t,e)=>e!==t&&(e==e||t==t),f={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:h},m="finalized";class v extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=f){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||f}static finalize(){if(this.hasOwnProperty(m))return!1;this[m]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(i=>{const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=f){var s;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const r=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:u).toAttribute(e,i.type);this._$El=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=s.getPropertyOptions(o),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:u;this._$El=o,this[o]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||h)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var g;v[m]=!0,v.elementProperties=new Map,v.elementStyles=[],v.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:v}),(null!==(a=l.reactiveElementVersions)&&void 0!==a?a:l.reactiveElementVersions=[]).push("1.6.3");const _=window,b=_.trustedTypes,$=b?b.createPolicy("lit-html",{createHTML:t=>t}):void 0,y="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,w="?"+x,A=`<${w}>`,C=document,S=()=>C.createComment(""),E=t=>null===t||"object"!=typeof t&&"function"!=typeof t,k=Array.isArray,P="[ \t\n\f\r]",T=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,z=/-->/g,O=/>/g,N=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),U=/'/g,D=/"/g,L=/^(?:script|style|textarea|title)$/i,H=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),R=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),j=new WeakMap,B=C.createTreeWalker(C,129,null,!1);function I(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==$?$.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":"",n=T;for(let e=0;e<i;e++){const i=t[e];let a,l,p=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===T?"!--"===l[1]?n=z:void 0!==l[1]?n=O:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=N):void 0!==l[3]&&(n=N):n===N?">"===l[0]?(n=null!=o?o:T,p=-1):void 0===l[1]?p=-2:(p=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?N:'"'===l[3]?D:U):n===D||n===U?n=N:n===z||n===O?n=T:(n=N,o=void 0);const c=n===N&&t[e+1].startsWith("/>")?" ":"";r+=n===T?i+A:p>=0?(s.push(a),i.slice(0,p)+y+i.slice(p)+x+c):i+x+(-2===p?(s.push(void 0),e):c)}return[I(t,r+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class F{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,p]=V(t,e);if(this.el=F.createElement(l,i),B.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=B.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(y)||e.startsWith(x)){const i=p[r++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+y).split(x),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?J:"?"===e[1]?G:"@"===e[1]?Q:Y})}else a.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(L.test(s.tagName)){const t=s.textContent.split(x),e=t.length-1;if(e>0){s.textContent=b?b.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],S()),B.nextNode(),a.push({type:2,index:++o});s.append(t[e],S())}}}else if(8===s.nodeType)if(s.data===w)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(x,t+1));)a.push({type:7,index:o}),t+=x.length-1}o++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){var o,r,n,a;if(e===R)return e;let l=void 0!==s?null===(o=i._$Co)||void 0===o?void 0:o[s]:i._$Cl;const p=E(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==p&&(null===(r=null==l?void 0:l._$AO)||void 0===r||r.call(l,!1),void 0===p?l=void 0:(l=new p(t),l._$AT(t,i,s)),void 0!==s?(null!==(n=(a=i)._$Co)&&void 0!==n?n:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=K(t,l._$AS(t,e.values),l,s)),e}class W{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:C).importNode(i,!0);B.currentNode=o;let r=B.nextNode(),n=0,a=0,l=s[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new q(r,r.nextSibling,this,t):1===l.type?e=new l.ctor(r,l.name,l.strings,this,t):6===l.type&&(e=new X(r,this,t)),this._$AV.push(e),l=s[++a]}n!==(null==l?void 0:l.index)&&(r=B.nextNode(),n++)}return B.currentNode=C,o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class q{constructor(t,e,i,s){var o;this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),E(t)?t===M||null==t||""===t?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==R&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>k(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==M&&E(this._$AH)?this._$AA.nextSibling.data=t:this.$(C.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=F.createElement(I(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new W(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=j.get(t.strings);return void 0===e&&j.set(t.strings,e=new F(t)),e}T(t){k(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new q(this.k(S()),this.k(S()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Y{constructor(t,e,i,s,o){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=M}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=K(this,t,e,0),r=!E(t)||t!==this._$AH&&t!==R,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=K(this,s[i+n],e,n),a===R&&(a=this._$AH[n]),r||(r=!E(a)||a!==this._$AH[n]),a===M?t=M:t!==M&&(t+=(null!=a?a:"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class J extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}}const Z=b?b.emptyScript:"";class G extends Y{constructor(){super(...arguments),this.type=4}j(t){t&&t!==M?this.element.setAttribute(this.name,Z):this.element.removeAttribute(this.name)}}class Q extends Y{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=K(this,t,e,0))&&void 0!==i?i:M)===R)return;const s=this._$AH,o=t===M&&s!==M||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==M&&(s===M||o);o&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class X{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const tt=_.litHtmlPolyfillSupport;null==tt||tt(F,q),(null!==(g=_.litHtmlVersions)&&void 0!==g?g:_.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et,it;class st extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,o;const r=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let n=r._$litPart$;if(void 0===n){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;r._$litPart$=n=new q(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return R}}st.finalized=!0,st._$litElement$=!0,null===(et=globalThis.litElementHydrateSupport)||void 0===et||et.call(globalThis,{LitElement:st});const ot=globalThis.litElementPolyfillSupport;null==ot||ot({LitElement:st}),(null!==(it=globalThis.litElementVersions)&&void 0!==it?it:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),nt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
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
 */var pt;null===(pt=window.HTMLSlotElement)||void 0===pt||pt.prototype.assignedElements;const dt=[{name:"entity",required:!0,selector:{entity:{filter:[{domain:"sensor"}]}}},{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"attribute",selector:{text:{}}},{name:"stops_identifier",selector:{select:{options:[{value:"description",label:"Description (Default)"},{value:"tiploc",label:"TIPLOC"},{value:"crs",label:"CRS"}],mode:"dropdown"}}}]},{type:"expandable",name:"filters",schema:[{name:"destination",selector:{text:{}}},{name:"time_offset_minutes",selector:{number:{min:0,mode:"box"}}},{name:"stops_input",selector:{text:{}}},{name:"platforms_input",selector:{text:{}}}]},{type:"expandable",name:"",schema:[{type:"grid",name:"",schema:[{name:"font_size_time",selector:{text:{}}},{name:"font_size_destination",selector:{text:{}}},{name:"font_size_status",selector:{text:{}}}]}]}],ct={entity:"Entity",title:"Card Title",attribute:"Data Attribute",stops_identifier:"Station Identifier",filters:"Filtering Options",destination:"Destination Station (CRS Code)",time_offset_minutes:"Time Offset (minutes)",stops_input:"Stops of Interest (CSV)",platforms_input:"Platforms of Interest (CSV)","":"Font Sizes",font_size_time:"Time",font_size_destination:"Destination",font_size_status:"Status Pill"},ut={entity:"Select a realtime trains sensor",attribute:"Attribute with departure data (default: departures)",stops_identifier:"How stations are identified in the data",destination:"Only show trains calling at this station",time_offset_minutes:"Hide trains departing sooner than this",stops_input:"Only show these stops in the timeline",platforms_input:"Only show trains on these platforms",font_size_time:"e.g. 1.5rem (default: 1.25rem)",font_size_destination:"e.g. 1.2rem (default: 1rem)",font_size_status:"e.g. 0.85rem (default: 0.75rem)"};let ht=class extends st{constructor(){super(...arguments),this._computeLabel=t=>ct[t.name]||t.name,this._computeHelper=t=>ut[t.name]}setConfig(t){this._config=t}render(){return this.hass&&this._config?H`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${dt}
                .computeLabel=${this._computeLabel}
                .computeHelper=${this._computeHelper}
                @value-changed=${this._valueChanged}
            ></ha-form>
        `:M}_valueChanged(t){t.stopPropagation();const e=t.detail.value,i=Object.assign(Object.assign(Object.assign({},this._config),e),{attribute:e.attribute||"departures",stops_identifier:e.stops_identifier||"description"});this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}};t([at({attribute:!1})],ht.prototype,"hass",void 0),t([lt()],ht.prototype,"_config",void 0),ht=t([rt("train-departure-board-editor")],ht);let ft=class extends st{constructor(){super(...arguments),this.departures=[],this._selectedDeparture=null,this.dateCache=new Map,this.lastEntityId=null,this._handleKeyDown=t=>{"Escape"===t.key&&this._selectedDeparture&&this._closePopup()}}static getConfigElement(){return document.createElement("train-departure-board-editor")}static getStubConfig(){return{type:"custom:train-departure-board",title:"Train Departures",entity:"",attribute:"departures"}}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=Object.assign({attribute:"departures"},t);"string"==typeof e.attribute?e.attribute=e.attribute.trim()||"departures":e.attribute="departures",this.config=e}render(){var t,e,i;if(!this.config)return H`<div class="card">No configuration provided</div>`;if(!this.config.entity)return H`<div class="card">Please configure an entity</div>`;const s=null===(e=null===(t=this.hass)||void 0===t?void 0:t.states)||void 0===e?void 0:e[this.config.entity];if(!s)return H`<div class="card">Entity not found: ${this.config.entity}</div>`;this.lastEntityId!==this.config.entity&&(this.dateCache.clear(),this.lastEntityId=this.config.entity);const o=this.config.attribute||"departures",r=null===(i=s.attributes)||void 0===i?void 0:i[o];let n=Array.isArray(r)?r:[];const a=s.last_updated?new Date(s.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";if(void 0===r&&console.warn(`train-departure-board: attribute "${o}" was not found on entity ${this.config.entity}`),Array.isArray(r)||void 0===r||console.warn(`train-departure-board: attribute "${o}" is not an array, falling back to empty list`),void 0!==this.config.time_offset_minutes&&this.config.time_offset_minutes>0){const t=this.config.time_offset_minutes;n=n.filter(e=>{const i=this.parseDateTime(e.estimated||e.scheduled);if(!i)return!0;const s=new Date;return(i.getTime()-s.getTime())/6e4>=t})}if(this.config.destination){const t=this.config.destination.toUpperCase().trim();t&&(n=n.filter(e=>{var i,s;return(null===(i=e.destination_name)||void 0===i?void 0:i.toUpperCase())===t||(null===(s=e.stops_of_interest)||void 0===s?void 0:s.some(e=>{var i;return e.stop===t||(null===(i=e.name)||void 0===i?void 0:i.toUpperCase())===t}))}))}if(this.config.platforms_input){const t=this.config.platforms_input.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean);t.length>0&&(n=n.filter(e=>{var i;return t.includes((null===(i=e.platform)||void 0===i?void 0:i.toLowerCase())||"")}))}if(this.config.stops_input){const t=this.config.stops_input.split(",").map(t=>t.trim().toUpperCase()).filter(Boolean);t.length>0&&(n=n.filter(e=>{var i;return null===(i=e.stops_of_interest)||void 0===i?void 0:i.some(e=>{var i;return t.includes(e.stop)||t.includes(null===(i=e.name)||void 0===i?void 0:i.toUpperCase())})}))}const l=[this.config.font_size_time?`--train-board-time-size: ${this.config.font_size_time}`:"",this.config.font_size_destination?`--train-board-destination-size: ${this.config.font_size_destination}`:"",this.config.font_size_status?`--train-board-status-size: ${this.config.font_size_status}`:""].filter(Boolean).join("; ");return H`
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
        `}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._handleKeyDown)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._handleKeyDown)}_showDetails(t){this._selectedDeparture=t}_closePopup(){this._selectedDeparture=null}_handleOverlayClick(t){t.target.classList.contains("popup-overlay")&&this._closePopup()}_renderDetailsPopup(){if(!this._selectedDeparture)return M;const t=this._selectedDeparture,{statusClass:e,statusLabel:i}=this.getStatusMeta(t),s=this.extractTimeLabel(t.scheduled),o=this._getStopsForPopup(t),r="cancelled"===e;return H`
            <div class="popup-overlay" @click=${this._handleOverlayClick} role="dialog" aria-modal="true" aria-label="Train details">
                <div class="popup-card">
                    <div class="popup-header">
                        <h2>${t.destination_name}</h2>
                        <button class="popup-close" @click=${this._closePopup} aria-label="Close">&times;</button>
                    </div>
                    <div class="popup-content">
                        <div class="popup-meta">
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Scheduled</span>
                                <span class="popup-meta-value ${r?"popup-time-cancelled":""}">${s}</span>
                            </div>
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Status</span>
                                <span class="status-pill ${e}">${i}</span>
                            </div>
                            ${t.platform?H`
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Platform</span>
                                <span class="popup-meta-value">${t.platform}</span>
                            </div>`:""}
                            ${t.origin_name?H`
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">From</span>
                                <span class="popup-meta-value">${t.origin_name}</span>
                            </div>`:""}
                            ${t.operator_name?H`
                            <div class="popup-meta-item">
                                <span class="popup-meta-label">Operator</span>
                                <span class="popup-meta-value">${t.operator_name}</span>
                            </div>`:""}
                        </div>
                        ${o.length>0?H`
                        <div class="popup-stops-title">Calling at</div>
                        <div class="popup-stops-list ${o[0].isBetweenPrevious?"first-is-between":""}">
                            ${o.map(t=>t.isStationCountNode?H`
                                <div class="popup-stop passed">
                                    <div class="popup-stop-circle" style="border: 2px dashed var(--divider-color, #e0e0e0); background: transparent;"></div>
                                    <span class="popup-stop-time" style="opacity: 0.5;">⋮</span>
                                    <span class="popup-stop-name" style="font-style: italic; color: var(--secondary-text-color, #666); font-size: 0.9em;">${t.name}</span>
                                </div>
                            `:H`
                                <div class="popup-stop ${t.isPassed?"passed":""} ${t.isCurrent?"current":""} ${t.isBetweenPrevious?"between-previous":""}">
                                    <div class="popup-stop-circle">
                                        <div class="popup-train-indicator"></div>
                                    </div>
                                    <span class="popup-stop-time">${t.time}</span>
                                    <span class="popup-stop-name">${t.name}</span>
                                </div>
                            `)}
                        </div>`:""}
                    </div>
                </div>
            </div>
        `}_getStopsForPopup(t){var e;const i=t.stops_of_interest||[],s=this.config.stops_identifier||"description";let o=i.map(t=>{var e;let i="";i="tiploc"===s?(t.stop||"").trim():"crs"===s?(t.crs||t.name||"").trim():(t.name||t.stop||"").trim();const o=t.estimate_stop||t.scheduled_stop,r=o?(o.split(" ")[1]||"").trim():"",n=this.parseDateTime(o);return{name:i,time:r,timestamp:null!==(e=null==n?void 0:n.getTime())&&void 0!==e?e:Number.POSITIVE_INFINITY,stopCode:t.stop||"",isPassed:!1,isCurrent:!1,isBetweenPrevious:!1,isStationCountNode:!1}}).filter(t=>t.name).sort((t,e)=>t.timestamp-e.timestamp);if(this.config.stops_input){const t=this.config.stops_input.split(",").map(t=>t.trim().toUpperCase()).filter(Boolean);t.length>0&&(o=o.filter(e=>t.includes(e.stopCode.toUpperCase())||t.includes(e.name.toUpperCase())))}if(!t.last_report_station||!t.last_report_type)return o;const r=t.last_report_station,n=t.last_report_station_name||r,a=t.last_report_type,l=t.last_report_time?null===(e=this.parseDateTime(t.last_report_time))||void 0===e?void 0:e.getTime():void 0,p=o.findIndex(t=>t.stopCode===r);if(-1!==p){for(let t=0;t<p;t++)o[t].isPassed=!0;"Arrival"===a?(o[p].isCurrent=!0,o[p].isPassed=!1):(o[p].isPassed=!0,p+1<o.length?o[p+1].isBetweenPrevious=!0:o[p].isPassed=!0)}else if(void 0!==l&&!Number.isNaN(l)){let t=-1;for(let e=0;e<o.length&&o[e].timestamp<=l;e++)o[e].isPassed=!0,t=e;-1!==t&&t+1<o.length?o[t+1].isBetweenPrevious=!0:-1===t&&o.length>0&&(o[0].isBetweenPrevious=!0)}if(o.length>0&&o[0].isBetweenPrevious&&-1===p&&r){const e=t.last_report_time?this.extractTimeLabel(t.last_report_time):"";o.unshift({name:n,time:e,timestamp:l||0,stopCode:r,isPassed:!0,isCurrent:!1,isBetweenPrevious:!1,isStationCountNode:!1})}if(t.last_report_index&&t.last_report_index>0){const e=t.last_report_index;o.unshift({name:`+ ${e} stations from origin`,time:"",timestamp:-1,stopCode:"_COUNT_",isPassed:!0,isCurrent:!1,isBetweenPrevious:!1,isStationCountNode:!0})}return o}renderDepartureRow(t,e){const i=this.extractTimeLabel(t.scheduled),{statusClass:s,statusLabel:o}=this.getStatusMeta(t),r=t.platform?t.platform:null,n="cancelled"===s,a=n?"time-cancelled":"";return H`
            <div 
                class="train ${0===e?"next-train":""} ${n?"cancelled-row":""}"
                role="listitem" 
                aria-label="${t.destination_name} at ${i}, ${o}${r?`, Platform ${r}`:""}"
                @click=${()=>this._showDetails(t)}
            >
                <div class="time-wrapper ${a}">
                    <span class="scheduled" aria-label="Scheduled time">${i}</span>
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${t.destination_name}</h3>
                        <span class="status-pill ${s}" aria-label="Status: ${o}">${o}</span>
                        ${r?H`<span class="platform-badge" aria-label="Platform ${r}">${r}</span>`:""}
                    </div>
                </div>
            </div>
        `}getStatusMeta(t){var e,i;const s=t.scheduled||"",o=t.estimated||"",r=this.extractTimeLabel(s),n=this.extractTimeLabel(o);if((null===(e=t.status)||void 0===e?void 0:e.toLowerCase().includes("cancel"))||(null===(i=t.etd)||void 0===i?void 0:i.toLowerCase().includes("cancel"))||t.planned_cancel||t.cancel_reason||o.toLowerCase().includes("cancel"))return{statusLabel:"Cancelled",statusClass:"cancelled"};if(!o)return{statusLabel:"Awaiting",statusClass:"delayed"};return"on time"===o.toLowerCase()?{statusLabel:"On Time",statusClass:"on-time"}:n&&r&&n!==r?/\d{2}:\d{2}/.test(n)?{statusLabel:`Exp ${n}`,statusClass:"delayed"}:{statusLabel:n,statusClass:"delayed"}:{statusLabel:"On Time",statusClass:"on-time"}}extractTimeLabel(t){if(!t)return"—";const e=t.trim();if(!e)return"—";const i=e.split(" ");return 2===i.length&&/^\d{2}:\d{2}$/.test(i[1])?i[1]:/^\d{2}:\d{2}$/.test(e)?e:2===i.length?i[1]||i[0]:e}parseDateTime(t){var e;if(!t)return null;if(this.dateCache.has(t))return null!==(e=this.dateCache.get(t))&&void 0!==e?e:null;const[i,s]=t.split(" ");let o=null;if(i&&s){const t=`${i.split("-").reverse().join("-")}T${s}`,e=new Date(t);o=Number.isNaN(e.getTime())?null:e}else if(/^\d{2}:\d{2}$/.test(t)){const e=`${(new Date).toISOString().split("T")[0]}T${t}`,i=new Date(e);o=Number.isNaN(i.getTime())?null:i}return this.dateCache.set(t,o),o}};ft.styles=((t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)})`
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
            flex-direction: row;
            align-items: baseline;
            gap: 4px;
            min-width: 55px;
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
        .status-pill {
            font-size: var(--train-board-status-size, 0.75rem);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            white-space: nowrap;
            padding: 3px 10px;
            border-radius: 12px;
            flex-shrink: 0;
        }
        .status-pill.on-time {
            background: var(--success-color, #4caf50);
            color: #fff;
        }
        .status-pill.delayed {
            background: var(--warning-color, #ff9800);
            color: #000;
        }
        .status-pill.cancelled {
            background: var(--error-color, #f44336);
            color: #fff;
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
            gap: 10px;
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
            color: var(--primary-text-color, #111);
            flex: 1;
            min-width: 0;
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
        .popup-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
            position: sticky;
            top: 0;
            background: var(--card-background-color, #fff);
            border-radius: 12px 12px 0 0;
        }
        .popup-header h2 {
            margin: 0;
            font-size: 1.2em;
            font-weight: 600;
            color: var(--primary-text-color);
        }
        .popup-close {
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: var(--secondary-text-color, #666);
            padding: 4px 8px;
            border-radius: 4px;
            line-height: 1;
        }
        .popup-close:hover {
            background: var(--secondary-background-color, rgba(0, 0, 0, 0.1));
        }
        .popup-content {
            padding: 16px;
        }
        .popup-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid var(--divider-color, #e0e0e0);
        }
        .popup-meta-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .popup-meta-label {
            font-size: 0.85em;
            color: var(--secondary-text-color, #666);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .popup-meta-value {
            font-size: 1.1em;
            font-weight: 500;
            color: var(--primary-text-color);
        }
        .popup-stops-title {
            font-size: 0.95em;
            font-weight: 600;
            color: var(--secondary-text-color, #666);
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .popup-stops-list {
            display: flex;
            flex-direction: column;
            position: relative;
            padding-left: 36px;
        }
        .popup-stops-list::before {
            content: '';
            position: absolute;
            left: 14px;
            top: 18px;
            bottom: 18px;
            width: 4px;
            background: var(--divider-color, #e0e0e0);
            z-index: 1;
        }
        /* Extend line upwards if the very first item is between-previous (rare but possible) */
        .popup-stops-list.first-is-between::before {
            top: 0;
        }
        .popup-stop {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 10px 0;
            position: relative;
            z-index: 2;
        }
        .popup-stop-circle {
            position: absolute;
            left: -28px;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--card-background-color, #fff);
            border: 4px solid var(--divider-color, #e0e0e0);
            z-index: 2;
        }
        .popup-stop.passed .popup-stop-circle {
            background: var(--primary-text-color, #111);
            border-color: var(--primary-text-color, #111);
        }
        .popup-stop.current .popup-stop-circle {
            background: var(--warning-color, #ff9800);
            border-color: var(--warning-color, #ff9800);
            transform: translateY(-50%) scale(1.2);
            box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--warning-color, #ff9800);
        }
        .popup-stop-time {
            font-size: 1.0em;
            font-weight: 600;
            font-variant-numeric: tabular-nums;
            min-width: 50px;
            color: var(--primary-text-color);
        }
        .popup-stop-name {
            font-size: 1.0em;
            color: var(--primary-text-color);
            flex: 1;
        }
        .popup-train-indicator {
            display: none;
            position: absolute;
            left: 50%;
            top: -18px;
            transform: translate(-50%, -50%) scale(1.2);
            background: var(--warning-color, #ff9800);
            width: 12px;
            height: 12px;
            border-radius: 50%;
            z-index: 3;
            box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--warning-color, #ff9800);
        }
        .popup-stop.between-previous .popup-train-indicator {
            display: block;
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
    `,t([at({type:Object})],ft.prototype,"hass",void 0),t([at({type:Object})],ft.prototype,"config",void 0),t([at({type:Array})],ft.prototype,"departures",void 0),t([lt()],ft.prototype,"_selectedDeparture",void 0),ft=t([rt("train-departure-board")],ft),window.customCards=window.customCards||[],window.customCards.push({type:"custom:train-departure-board",name:"Train Departure Board",description:"Display train departure information in a TFL-style board",preview:!0,support_url:"https://github.com/ivmreg/ha-train-departure-board/issues"});export{ft as TrainDepartureBoard};
//# sourceMappingURL=ha-train-departure-board.js.map
