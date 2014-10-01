/*global describe, it, expect, dust*/
describe('Handlebars Intl Helper', function () {

    it('Formats numbers correctly', function (done) {
        var tmpl = '<b>{@formatNumber val="40000.004" locales="en-US" /}</b>';
        var compiled = dust.compile(tmpl, 'test1');

        dust.loadSource(compiled);

        dust.render('test1', {}, function (err, out) {
            if (err) {
                return done(err);
            }

            expect(out).to.equal('<b>40,000.004</b>');
            done();
        });
    });

    it('Formats dates correctly', function (done) {
        var tmpl = '<time>{@formatDate val="{timeStamp}" weekday="long" year="numeric" timeZone="UTC" locales="es-AR" /}</time>';
        var compiled = dust.compile(tmpl, 'test2');

        dust.loadSource(compiled);

        var timeStamp = new Date(Date.UTC(2014, 8, 22, 0, 0, 0, 0));

        dust.render('test2', { timeStamp: timeStamp }, function (err, out) {
            if (err) {
                return done(err);
            }

            expect(out).to.equal('<time>2014 lunes</time>');
            done();
        });
    });

    it('Formats messages correctly', function (done) {
        var tmpl = '<p>{@formatMessage _msg=MSG firstName=firstName lastName=lastName locales="en-US" /}</p>',
            ctx = {
                MSG: 'Hi, my name is {firstName} {lastName}.',
                firstName: 'Slim',
                lastName: 'Shady'
            };

        var compiled = dust.compile(tmpl, 'test3');

        dust.loadSource(compiled);

        dust.render('test3', ctx, function (err, out) {
            if (err) {
                return done(err);
            }

            expect(out).to.equal('<p>Hi, my name is Slim Shady.</p>');
            done();
        });
    });

});
