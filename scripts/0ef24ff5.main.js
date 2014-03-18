!function(){"use strict";var a={uuid:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0,c="x"===a?b:3&b|8;return c.toString(16)})}},b=function(a){this.classNames={isFull:"is-full",isChanging:"is-changing"},this.template=function(a){return'<li class="rating-component__item '+(a?"is-full":"")+'"></li>'},this.el=null,this.isChanging=!1,this.isChanged=!1,this.setValue(a)};b.prototype=Object.create({create:function(){var a=document.createElement("div");return a.innerHTML=this.template(this.value),this.el=a.firstElementChild,this.el},redraw:function(){this.el.classList.remove(this.classNames.isFull,this.classNames.isChanging),1===this._value?(this.el.classList.add(this.classNames.isFull),this.isChanging&&this.el.classList.add(this.classNames.isChanging)):this.isChanged&&this.el.classList.add(this.classNames.isFull)},setEl:function(a){this.el=a},getValue:function(){return this._value},setValue:function(a){this.isChanging=!1,this._value=1===a?1:0},toJSON:function(){return{value:this._value}}});var c=function(b){return this.uuid=a.uuid(),this.MIN_VALUE=0,this.MAX_VALUE=b&&b.itemsCount>0?b.itemsCount:5,this._items=[],this._value=b&&b.value>=this.MIN_VALUE&&b.value<=this.MAX_VALUE?b.value:this.MIN_VALUE,this.template=function(){return'<div class="rating-component"><span class="rating-component__min-handle"></span><ul class="rating-component__list"></ul><span class="rating-component__max-handle"></span></div>'},this.el=null,this._init()};c.prototype=Object.create({_init:function(){this._createItems()},_createItems:function(){for(var a=[],c=this.MIN_VALUE;c<this.MAX_VALUE;c++)a.push(new b(+(c<this._value)));this._items=a},create:function(){return this._render(),this._addEventListeners(),this.el},_render:function(){var a=document.createElement("div"),b=document.createDocumentFragment();a.innerHTML=this.template(),this.el=a.firstElementChild,this._items.forEach(function(a){b.appendChild(a.create())}),this.el.querySelector("ul").appendChild(b)},redraw:function(){for(var a=this._items.length-1;a>=0;a--)this._items[a].redraw()},_addEventListeners:function(){var a=this,b=this.el.firstElementChild,c=this.el.lastElementChild;this.el.addEventListener("mouseover",function(b){var c=b.target;if("LI"===c.tagName){var d=Array.prototype.slice.call(c.parentNode.children),e=d.indexOf(c);a._items.forEach(function(b,c){b.isChanging=!1,b.isChanged=!1,a._value>a.MIN_VALUE?c>e?b.isChanging=!0:b.isChanged=!0:e>=c&&(b.isChanged=!0)}),a.redraw()}}),this.el.addEventListener("click",function(b){var c=b.target;if("LI"===c.tagName){var d=Array.prototype.slice.call(c.parentNode.children);a.setValue(d.indexOf(c)+1)}},!1),this.el.addEventListener("mouseleave",function(){a._items.forEach(function(a){a.isChanged=!1,a.isChanging=!1}),a.redraw()},!1),b.addEventListener("mouseover",function(){a._items.forEach(function(a){a.isChanging=!0,a.isChanged=!1}),a.redraw()},!1),b.addEventListener("click",function(){a.setValue(a.MIN_VALUE)},!1),c.addEventListener("mouseover",function(){a._items.forEach(function(a){a.isChanged=!0}),a.redraw()},!1),c.addEventListener("click",function(){a.setValue(a.MAX_VALUE)})},toJSON:function(){return{value:this.getValue(),items:this._items.map(function(a){return a.toJSON()})}},getValue:function(){for(var a=0,b=this._items.length-1;b>=0;b--)if(1===this._items[b].getValue()){a=b+1;break}return a},setValue:function(a){if(!(a>=this.MIN_VALUE&&a<=this.MAX_VALUE))throw new Error("The value provided is greater than maximum possible!");this._items.forEach(function(b,c){b.setValue(+(a>c))}),this._value=this.getValue(),this.redraw()}}),window.RatingComponent=c}(),function(a){"use strict";for(var b=document.querySelectorAll(".rating"),c=b.length-1;c>=0;c--)b[c].appendChild((new a).create())}(RatingComponent);