/*!
 * jQuery Advanced Key Binding @VERSION (@DATE)
 *
 * Copyright (c) 2009 Adaptavist.com Ltd
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Mark Gibson (jollytoad at gmail dot com)
 */
/* Allow filtering of keyboard events using a special namespace syntax:
 *  .bind('keydown.key:shift-home', ...);
 *  .bind('click.key:shift', ...);
 */
(jQuery.keys || (function($) {

var k;
k = $.keys = {
	modifiers: ['alt','meta','shift'],
	
	modifierRegex: /^(alt|meta|shift)$/,
	
	namespaceRegex: /^key:(.+)$/,
	mnemonicDelim: '-',
	
	// keyCode => mnemonic (assigned later)
	codes: [],
	
	// mnemonic aliases
	aliases: {
		'ctrl': 'meta',
		'return': 'enter'
	},

	// Construct a key combination string from an event
	combo: function( event ) {
		var mns = [], key = k.codes[event.keyCode];
		$.each(k.modifiers, function() {
			if ( event[this+'Key'] ) {
				mns.push(this);
			}
		});
		if ( key ) {
			mns.push(key);
		}
		return mns.length ? mns.join(k.mnemonicDelim) : 'none';
	},
	
	normalise: function( combo ) {
		var re = k.modifierRegex, al = k.aliases;
		return $.map(combo.replace(/\s/g,'').toLowerCase().split(k.mnemonicDelim),
						function(n) { return al[n] || n; })
				.sort(function(a,b) {
					a = re.test(a) ? ' '+a : a;
					b = re.test(b) ? ' '+b : b;
					return a > b ? 1 : (a < b ? -1 : 0);
				})
				.join(k.mnemonicDelim);
	},
	
	// Register event types to allow keycombo filtering via namespaces
	register: function() {
		var special = $.event.special;
		$.each(arguments, function(i, type) {
			if ( !special[type] ) {
				special[type] = {};
			}
			special[type].add = add;
		});
	}
};

function add(handler, data, namespaces) {
/*DEBUG*add*
	var $$elem = this;
*DEBUG*add*/

	// Interpret namespaces in parenthesis (...) as a key combo.
	if ( namespaces.length ) {
		var combos = {}, proxy;
		
		$.each(namespaces, function() {
			var m = k.namespaceRegex.exec(this);
			if ( m ) {
				var c = k.normalise(m[1]);
				combos[c] = true;
				proxy = true;
/*DEBUG*add*
				console.log('keys add:', $$elem, c);
*DEBUG*add*/
			}
		});
		
		if ( proxy ) {
			proxy = function(event) {
				if ( !event.keyCombo ) {
					event.keyCombo = k.combo(event);
/*DEBUG*event*
					console.log('keys event:', event, event.keyCombo);
*DEBUG*event*/
				}
				if ( combos[event.keyCombo] ) {
					return handler.apply(this, arguments);
				}
			};
			proxy.type = handler.type;
			return proxy;
		}
	}
}

function kc() {
	var i = Array.prototype.shift.apply(arguments), c;
	do {
		if ( (c = Array.prototype.shift.apply(arguments)) ) {
			k.codes[i++] = c;
		}
	} while (c);	
}

// Add key mnemonics
kc(8,   'backspace', 'tab');
kc(13,  'enter');
kc(16,  'shift', 'ctrl', 'alt', 'pause', 'capslock');
kc(27,  'esc');
kc(32,  'space', 'pageup', 'pagedown', 'end', 'home', 'left', 'up', 'right', 'down');
kc(44,  'printscreen', 'insert', 'delete');
kc(48,  '0','1','2','3','4','5','6','7','8','9');
kc(65,  'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z');
kc(91,  'leftstart', 'rightstart', 'menu');
kc(96,  'np0','np1','np2','np3','np4','np5','np6','np7','np8','np9');
kc(106, 'npasterisk', 'npplus');
kc(109, 'npminus', 'npdot', 'npslash');
kc(112, 'f1','f2','f3','f4','f5','f6','f7','f8','f9','f10','f11','f12');
kc(144, 'numlock', 'scrlock');
kc(187, 'equal', 'comma', 'minus', 'dot', 'slash', 'quote');
kc(219, 'openbracket', 'backslash', 'closebracket', 'tick');

// Register a default set of events
k.register('keydown', 'keyup', 'click');

})(jQuery)
);

