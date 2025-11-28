function t(t,e,i,s){var r,n=arguments.length,o=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(n<3?r(o):n>3?r(e,i,o):r(e,i))||o);return n>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l;const d=window,c=d.trustedTypes,h=c?c.emptyScript:"",u=d.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,e)=>e!==t&&(e==e||t==t),v={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:f},g="finalized";class m extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const r=this[t];this[e]=s,this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty(g))return!1;this[g]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(i=>{const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=v){var s;const r=this.constructor._$Ep(t,i);if(void 0!==r&&!0===i.reflect){const n=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(r):this.setAttribute(r,n),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,r=s._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=s.getPropertyOptions(r),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=r,this[r]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||f)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var $;m[g]=!0,m.elementProperties=new Map,m.elementStyles=[],m.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:m}),(null!==(l=d.reactiveElementVersions)&&void 0!==l?l:d.reactiveElementVersions=[]).push("1.6.3");const y=window,_=y.trustedTypes,b=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,w="?"+x,C=`<${w}>`,E=document,S=()=>E.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,k=Array.isArray,P="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,U=/>/g,L=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,R=/"/g,M=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),j=Symbol.for("lit-noChange"),D=Symbol.for("lit-nothing"),q=new WeakMap,z=E.createTreeWalker(E,129,null,!1);function B(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==b?b.createHTML(e):e}const V=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":"",o=O;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===O?"!--"===l[1]?o=N:void 0!==l[1]?o=U:void 0!==l[2]?(M.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=L):void 0!==l[3]&&(o=L):o===L?">"===l[0]?(o=null!=r?r:O,d=-1):void 0===l[1]?d=-2:(d=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?L:'"'===l[3]?R:H):o===R||o===H?o=L:o===N||o===U?o=O:(o=L,r=void 0);const h=o===L&&t[e+1].startsWith("/>")?" ":"";n+=o===O?i+C:d>=0?(s.push(a),i.slice(0,d)+A+i.slice(d)+x+h):i+x+(-2===d?(s.push(void 0),e):h)}return[B(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class W{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,d]=V(t,e);if(this.el=W.createElement(l,i),z.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=z.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(A)||e.startsWith(x)){const i=d[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+A).split(x),e=/([.?@])?(.*)/.exec(i);a.push({type:1,index:r,name:e[2],strings:t,ctor:"."===e[1]?Z:"?"===e[1]?Q:"@"===e[1]?X:Y})}else a.push({type:6,index:r})}for(const e of t)s.removeAttribute(e)}if(M.test(s.tagName)){const t=s.textContent.split(x),e=t.length-1;if(e>0){s.textContent=_?_.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],S()),z.nextNode(),a.push({type:2,index:++r});s.append(t[e],S())}}}else if(8===s.nodeType)if(s.data===w)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(x,t+1));)a.push({type:7,index:r}),t+=x.length-1}r++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function F(t,e,i=t,s){var r,n,o,a;if(e===j)return e;let l=void 0!==s?null===(r=i._$Co)||void 0===r?void 0:r[s]:i._$Cl;const d=T(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==d&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===d?l=void 0:(l=new d(t),l._$AT(t,i,s)),void 0!==s?(null!==(o=(a=i)._$Co)&&void 0!==o?o:a._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=F(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,r=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);z.currentNode=r;let n=z.nextNode(),o=0,a=0,l=s[0];for(;void 0!==l;){if(o===l.index){let e;2===l.type?e=new J(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new tt(n,this,t)),this._$AV.push(e),l=s[++a]}o!==(null==l?void 0:l.index)&&(n=z.nextNode(),o++)}return z.currentNode=E,r}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{constructor(t,e,i,s){var r;this.type=2,this._$AH=D,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(r=null==s?void 0:s.isConnected)||void 0===r||r}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),T(t)?t===D||null==t||""===t?(this._$AH!==D&&this._$AR(),this._$AH=D):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>k(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==D&&T(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,r="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=W.createElement(B(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===r)this._$AH.v(i);else{const t=new K(r,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new W(t)),e}T(t){k(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new J(this.k(S()),this.k(S()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Y{constructor(t,e,i,s,r){this.type=1,this._$AH=D,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=D}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=F(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==j,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=F(this,s[i+o],e,o),a===j&&(a=this._$AH[o]),n||(n=!T(a)||a!==this._$AH[o]),a===D?t=D:t!==D&&(t+=(null!=a?a:"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===D?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Z extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===D?void 0:t}}const G=_?_.emptyScript:"";class Q extends Y{constructor(){super(...arguments),this.type=4}j(t){t&&t!==D?this.element.setAttribute(this.name,G):this.element.removeAttribute(this.name)}}class X extends Y{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=F(this,t,e,0))&&void 0!==i?i:D)===j)return;const s=this._$AH,r=t===D&&s!==D||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==D&&(s===D||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}}const et=y.litHtmlPolyfillSupport;null==et||et(W,J),(null!==($=y.litHtmlVersions)&&void 0!==$?$:y.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var it,st;class rt extends m{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,r;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let o=n._$litPart$;if(void 0===o){const t=null!==(r=null==i?void 0:i.renderBefore)&&void 0!==r?r:null;n._$litPart$=o=new J(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return j}}rt.finalized=!0,rt._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:rt});const nt=globalThis.litElementPolyfillSupport;null==nt||nt({LitElement:rt}),(null!==(st=globalThis.litElementVersions)&&void 0!==st?st:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),at=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lt(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):at(t,e)}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var dt;null===(dt=window.HTMLSlotElement)||void 0===dt||dt.prototype.assignedElements;let ct=class extends rt{setConfig(t){this.config=t}render(){return I`
            <div class="editor">
                <div class="config-section">
                    <label for="title">Card Title:</label>
                    <input 
                        id="title"
                        type="text"
                        .value="${this.config.title||""}"
                        @change="${this._onTitleChange}"
                        placeholder="Train Departures"
                    />
                </div>
                <div class="config-section">
                    <label for="entity">Select Entity:</label>
                    <select 
                        id="entity"
                        @change="${this._onEntityChange}"
                    >
                        <option value="" ?selected="${!this.config.entity}">-- Select Entity --</option>
                        ${this._getAvailableEntities().map(t=>I`
                            <option value="${t.entity_id}" ?selected="${this.config.entity===t.entity_id}">${t.friendly_name||t.entity_id}</option>
                        `)}
                    </select>
                </div>
                <div class="config-section">
                    <label for="attribute">Attribute (optional):</label>
                    <input 
                        id="attribute"
                        type="text"
                        .value="${this.config.attribute||"departures"}"
                        @change="${this._onAttributeChange}"
                        placeholder="departures"
                    />
                </div>
                <div class="config-section">
                    <label for="stops_identifier">Stops Identifier:</label>
                    <select 
                        id="stops_identifier"
                        @change="${this._onStopsIdentifierChange}"
                    >
                        <option value="description" ?selected="${"description"===(this.config.stops_identifier||"description")}">Description (Default)</option>
                        <option value="tiploc" ?selected="${"tiploc"===this.config.stops_identifier}">TIPLOC</option>
                        <option value="crs" ?selected="${"crs"===this.config.stops_identifier}">CRS</option>
                    </select>
                </div>
            </div>
        `}_getAvailableEntities(){var t;return(null===(t=this.hass)||void 0===t?void 0:t.states)?Object.values(this.hass.states).filter(t=>t&&"object"==typeof t&&"string"==typeof t.entity_id&&t.entity_id.startsWith("sensor.")).map(t=>{var e;return{entity_id:t.entity_id,friendly_name:null===(e=t.attributes)||void 0===e?void 0:e.friendly_name}}).sort((t,e)=>(t.friendly_name||t.entity_id).localeCompare(e.friendly_name||e.entity_id)):[]}_onTitleChange(t){const e=t.target;this._fireConfigChanged({title:e.value})}_onEntityChange(t){const e=t.target;this._fireConfigChanged({entity:e.value})}_onAttributeChange(t){const e=t.target;this._fireConfigChanged({attribute:e.value})}_onStopsIdentifierChange(t){const e=t.target;this._fireConfigChanged({stops_identifier:e.value})}_fireConfigChanged(t){const e=Object.assign(Object.assign({},this.config),t);this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};ct.styles=o`
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
    `,t([lt({type:Object})],ct.prototype,"config",void 0),t([lt({type:Object})],ct.prototype,"hass",void 0),ct=t([ot("train-departure-board-editor")],ct);let ht=class extends rt{constructor(){super(...arguments),this.departures=[],this.dateCache=new Map,this.lastEntityId=null}static getConfigElement(){return document.createElement("train-departure-board-editor")}static getStubConfig(){return{type:"custom:train-departure-board",title:"Train Departures",entity:"",attribute:"departures"}}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=Object.assign({attribute:"departures"},t);"string"==typeof e.attribute?e.attribute=e.attribute.trim()||"departures":e.attribute="departures",this.config=e}render(){var t,e,i;if(!this.config)return I`<div class="card">No configuration provided</div>`;if(!this.config.entity)return I`<div class="card">Please configure an entity</div>`;const s=null===(e=null===(t=this.hass)||void 0===t?void 0:t.states)||void 0===e?void 0:e[this.config.entity];if(!s)return I`<div class="card">Entity not found: ${this.config.entity}</div>`;this.lastEntityId!==this.config.entity&&(this.dateCache.clear(),this.lastEntityId=this.config.entity);const r=this.config.attribute||"departures",n=null===(i=s.attributes)||void 0===i?void 0:i[r],o=Array.isArray(n)?n:[],a=s.last_updated?new Date(s.last_updated).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}):"";return void 0===n&&console.warn(`train-departure-board: attribute "${r}" was not found on entity ${this.config.entity}`),Array.isArray(n)||void 0===n||console.warn(`train-departure-board: attribute "${r}" is not an array, falling back to empty list`),I`
            <ha-card>
                ${this.config.title?I`<div class="card-header">${this.config.title}</div>`:""}
                <div class="card">
                    ${o.length>0?I`<div class="departure-list" role="list" aria-label="Train departures">
                            ${o.map((t,e)=>this.renderDepartureRow(t,e))}
                        </div>`:I`<div class="no-departures">No departures available</div>`}
                    ${a?I`<div class="footer">Last updated: ${a}</div>`:""}
                </div>
            </ha-card>
        `}updated(t){super.updated(t),this.checkMarqueeOverflow()}checkMarqueeOverflow(){var t;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelectorAll(".marquee-container");null==e||e.forEach(t=>{const e=t.querySelector(".marquee-content");if(t&&e){t.classList.remove("should-scroll");const i=t.clientWidth;e.scrollWidth>i&&t.classList.add("should-scroll")}})}renderDepartureRow(t,e){const i=this.extractTimeLabel(t.scheduled),{statusClass:s,statusLabel:r}=this.getStatusMeta(t),n=this.getCallingAtSummary(t),o=t.platform?t.platform:null;return I`
            <div class="train ${0===e?"next-train":""}" role="listitem" aria-label="${t.destination_name} at ${i}, ${r}${o?`, Platform ${o}`:""}">
                ${o?I`<span class="platform-badge" aria-label="Platform ${o}">${o}</span>`:""}
                <div class="time-wrapper">
                    <span class="scheduled" aria-label="Scheduled time">${i}</span>
                    <span class="status-badge ${s}" aria-label="Status: ${r}">${r}</span>
                </div>
                <div class="info-box">
                    <div class="destination-row">
                        <h3 class="terminus">${t.destination_name}</h3>
                    </div>
                    ${n?I`
                    <div class="marquee-container" aria-label="Calling at: ${n}">
                        <div class="marquee-content">Calling at: ${n}</div>
                    </div>`:""}
                </div>
            </div>
        `}getCallingAtSummary(t){const e=t.stops_of_interest||[],i=new Map;e.forEach((t,e)=>{var s;let r="";const n=this.config.stops_identifier||"description";if(r="tiploc"===n?(t.stop||"").trim():"crs"===n?(t.crs||t.name||"").trim():(t.name||t.stop||"").trim(),!r)return;const o=t.estimate_stop||t.scheduled_stop,a=this.parseDateTime(o),l=null!==(s=null==a?void 0:a.getTime())&&void 0!==s?s:Number.POSITIVE_INFINITY,d=o?(o.split(" ")[1]||"").trim():"",c=i.get(r);(!c||l<c.time)&&i.set(r,{label:r,time:l,timeText:d,order:e})});const s=Array.from(i.values()).sort((t,e)=>t.time===e.time?t.order-e.order:t.time-e.time),r=(t.destination_name||"").trim();if(r){const t=s[s.length-1];t&&t.label.toLowerCase()===r.toLowerCase()||s.push({label:r,time:Number.POSITIVE_INFINITY,timeText:"",order:s.length})}return 0===s.length?null:s.map(t=>`${t.label}${t.timeText?" "+t.timeText:""}`).join(", ")}getStatusMeta(t){var e,i;const s=t.scheduled||"",r=t.estimated||"",n=this.extractTimeLabel(s),o=this.extractTimeLabel(r);if((null===(e=t.status)||void 0===e?void 0:e.toLowerCase().includes("cancel"))||(null===(i=t.etd)||void 0===i?void 0:i.toLowerCase().includes("cancel"))||t.planned_cancel||t.cancel_reason||r.toLowerCase().includes("cancel"))return{statusLabel:"Cancelled",statusClass:"cancelled"};if(!r)return{statusLabel:"Awaiting",statusClass:"delayed"};return"on time"===r.toLowerCase()?{statusLabel:"On Time",statusClass:"on-time"}:o&&n&&o!==n?/\d{2}:\d{2}/.test(o)?{statusLabel:`Exp ${o}`,statusClass:"delayed"}:{statusLabel:o,statusClass:"delayed"}:{statusLabel:"On Time",statusClass:"on-time"}}extractTimeLabel(t){if(!t)return"—";const e=t.trim();if(!e)return"—";const i=e.split(" ");return 2===i.length&&/^\d{2}:\d{2}$/.test(i[1])?i[1]:/^\d{2}:\d{2}$/.test(e)?e:2===i.length?i[1]||i[0]:e}parseDateTime(t){var e;if(!t)return null;if(this.dateCache.has(t))return null!==(e=this.dateCache.get(t))&&void 0!==e?e:null;const[i,s]=t.split(" ");let r=null;if(i&&s){const t=`${i.split("-").reverse().join("-")}T${s}`,e=new Date(t);r=Number.isNaN(e.getTime())?null:e}else if(/^\d{2}:\d{2}$/.test(t)){const e=`${(new Date).toISOString().split("T")[0]}T${t}`,i=new Date(e);r=Number.isNaN(i.getTime())?null:i}return this.dateCache.set(t,r),r}};ht.styles=o`
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
        .status-badge {
            font-size: 0.7em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            white-space: nowrap;
        }
        .status-badge.on-time {
            color: var(--success-color, #4caf50);
        }
        .status-badge.delayed {
            color: var(--warning-color, #ff9800);
        }
        .status-badge.cancelled {
            color: var(--error-color, #f44336);
        }
        .platform-badge {
            background: var(--disabled-color, #9e9e9e);
            color: #fff;
            font-size: 0.9em;
            font-weight: 700;
            width: 24px;
            height: 24px;
            border-radius: 4px;
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
        .marquee-container {
            overflow: hidden;
            white-space: nowrap;
            position: relative;
            width: 100%;
        }
        .marquee-container.should-scroll {
            mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .marquee-content {
            display: inline-block;
            font-size: 0.85em;
            color: var(--secondary-text-color, #666);
        }
        .marquee-container.should-scroll .marquee-content {
            padding-left: 100%;
            animation: marquee 20s linear infinite;
        }
        .marquee-container:hover .marquee-content {
            animation-play-state: paused;
        }
        @keyframes marquee {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
            .marquee-container.should-scroll .marquee-content {
                animation: none;
                padding-left: 0;
            }
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
    `,t([lt({type:Object})],ht.prototype,"hass",void 0),t([lt({type:Object})],ht.prototype,"config",void 0),t([lt({type:Array})],ht.prototype,"departures",void 0),ht=t([ot("train-departure-board")],ht),window.customCards=window.customCards||[],window.customCards.push({type:"custom:train-departure-board",name:"Train Departure Board",description:"Display train departure information in a TFL-style board",preview:!0,support_url:"https://github.com/ivmreg/ha-train-departure-board/issues"});export{ht as TrainDepartureBoard};
//# sourceMappingURL=ha-train-departure-board.js.map
