module("Sanity");

test("jQuery", 3, function() {
    ok( $ , "$ should exist" );
    ok( jQuery , "jQuery should exist" );
    strictEqual( $ , jQuery , "$ should be jQuery" );
});

test("jQuery.keys", 2, function() {
    ok( $.keys , "jQuery.keys should exist" );
    ok(is( "Object", $.keys ), "jQuery.keys is an Object" );
});

module("Functions");

test("normalise", 7, function() {
    ok(is( "Function", $.keys.normalise ), "jQuery.keys.normalise is a Function" );
    same( $.keys.normalise("shift-alt") , "alt-shift" );
    same( $.keys.normalise("shift-alt-a") , "alt-shift-a" );
    same( $.keys.normalise("ctrl") , "meta" );
    same( $.keys.normalise("shift-ctrl-z") , "meta-shift-z" );
    same( $.keys.normalise("shift-a-alt") , "alt-shift-a" );
    same( $.keys.normalise("return-ctrl") , "meta-enter" );
});

test("combo", 12, function() {
    ok(is( "Function", $.keys.combo ), "jQuery.keys.combo is a Function" );
    same( $.keys.combo({ altKey: true }) , "alt" );
    same( $.keys.combo({ metaKey: true }) , "meta" );
    same( $.keys.combo({ shiftKey: true }) , "shift" );
    same( $.keys.combo({ keyCode: 8 }) , "backspace" );
    same( $.keys.combo({ keyCode: 222 }) , "tick" );
    same( $.keys.combo({ keyCode: 65, altKey: true }) , "alt-a" );
    same( $.keys.combo({ keyCode: 66, shiftKey: true }) , "shift-b" );
    same( $.keys.combo({ keyCode: 67, metaKey: true }) , "meta-c" );
    same( $.keys.combo({ keyCode: 68, metaKey: true, altKey: true, shiftKey: true }) , "alt-meta-shift-d" );
    same( $.keys.combo({ }) , "none" );
    same( $.keys.combo({ keyCode: 1000 }) , "none" );
});

test("register", 4, function() {
    ok(is( "Function", $.keys.register ), "jQuery.keys.register is a Function");
    ok( !$.event.special.madeupevent , "jQuery.event.special.madeupevent is not supposed to exist yet" );
    $.keys.register("madeupevent");
    ok( $.event.special.madeupevent , "jQuery.event.special.madeupevent should now exist" );
    ok( $.event.special.madeupevent.add , "jQuery.event.special.madeupevent.add should now exist" );
});

module("Binding");

test("bind click+shift", 3, function() {
    $('#bind-target').one('click.key:shift', function(event) {
        same( event.type, "click" );
        ok( event.shiftKey, "Expected shift key" );
        same( event.keyCombo, "shift" );
        start();
    });

    stop();    
    $('#bind-target').trigger({ type: 'click', shiftKey: true });
});

test("bind keyup alt-f1", 4, function() {
    $('#bind-target').one('keyup.key:alt-f1', function(event) {
        same( event.type, "keyup" );
        same( event.keyCode, 112, "Expected keyCode 112" );
        ok( event.altKey, "Expected alt key" );
        same( event.keyCombo, "alt-f1" );
        start();
    });

    stop();    
    $('#bind-target').trigger({ type: 'keyup', keyCode: 112, altKey: true });
});

test("bind keydown", 0, function() {
    $('#bind-target')
        .one('keydown.key:shift-esc', function(event) {
            ok( false, "not expecting this" );
            start();
        })
        .one('keydown', function(event) {
            ok( true, "Expecting any key" );
            start();
        });

    stop();
    $('#bind-target').trigger({ type: 'keydown', keyCode: 32, shiftKey: true });
    $('#bind-target').unbind('keydown');
});

test("bind multiple namespaces", 3, function() {
    $('#bind-target').one('click.key:ctrl.key:shift.testme', function(event) {
        same( event.type, "click" );
        ok( event.shiftKey , "Expected shift key" );
        same( event.keyCombo, "shift" );
        start();
    });

    stop();
    $('#bind-target').trigger({ type: 'click', shiftKey: true });
});

