import calc from '../calc';
import parserData from './_parserdata';

const hiddenPropertyPrefix = `${Math.random()}`.replace('0.', 'hidden');
let hiddenPropertyIndex = 0;

// defines hiden (without accessors) computed property that dependent on given properties as text template describes
// eg if text='{{x}} {{y}}', x='foo', y='bar' then the property should have value 'foo bar'
export default function defineHiddenContentProperty({
    object,
    keys,
    text
}) {
    const key = `${hiddenPropertyPrefix}${hiddenPropertyIndex++}`;
    const regs = {};
    const { escLeftBracket, escRightBracket } = parserData;

    // create and cache regular expressions which will help us to
    // change target property value when sources are changed
    for(let i = 0; i < keys.length; i++) {
        regs[keys[i]] = new RegExp(escLeftBracket + keys[i] + escRightBracket, 'g');
    }

    calc(object, key, keys, function calcHandler() {
        let value = text;

        // replace things like {{x}} by actual values
        for(let i = 0; i < keys.length; i++) {
            value = value.replace(regs[keys[i]], arguments[i]);
        }

        return value;
    }, {
        isTargetPropertyHidden: true
    });

    return key;
}
