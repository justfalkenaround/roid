'use strict';

/*------WEB AUDIO API MANAGER CLASS------*/
class AudioManager extends ObjectList {
    constructor(id = 'ANON-AUDIO-MANAGER') {
        super(id);
        this.audioContext = new AudioContext();
        this.mainGainNode = this.audioContext.createGain();
        this.mainGainNode.connect(this.audioContext.destination);
        this.mainGainNode.gain.value = 1;
        this.notes = AudioManager.notes;
        this.createStatic();
    }

    /*------PLAY AUDIO TRACK------*/
    playTrack(audioBuffer, options = []) {
        const track = this.audioContext.createBufferSource();
        track.buffer = audioBuffer;
        track.connect(this.mainGainNode);
        track.start(...options);
        return track;
    }

    /*------LOOP AN AUDIO TRACK------*/
    loopTrack(audioBuffer, options = []) {
        if (options.length < 3) {
            this.log('INVALID INPUT', 'WARN');
            return null;
        }
        const track = this.audioContext.createBufferSource();
        track.buffer = audioBuffer;

        track.connect(this.mainGainNode);
        track.loop = true;
        track.loopStart = options[1];
        track.loopEnd = options[1] + options[2];
        track.start(0, options[1]);
        return track;
    }

    /*------GENERATE A STATIC BUFFER------*/
    createStatic() {
        this.staticBuffer = this.audioContext.createBuffer(2, this.audioContext.sampleRate * 3, this.audioContext.sampleRate);
        for (let channel = 0; channel < this.staticBuffer.numberOfChannels; channel++) {
            let nowBuffering = this.staticBuffer.getChannelData(channel);
            for (let i = 0; i < this.staticBuffer.length; i++) {
                nowBuffering[i] = Math.random() * 2 - 1;
            }
        }
    }

    /*------PLAY THE STATIC BUFFER------*/
    playStatic(volume = 0.5, options = []) {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.staticBuffer;
        const gain = this.audioContext.createGain();
        gain.gain.value = volume;
        source.connect(gain);
        gain.connect(this.mainGainNode);
        source.start(...options);
        return source;
    }

    /*------PLAY A TONE BASED ON THE KEY OR OTHER PARAMS------*/
    playTone(freq = [4, 'C'], duration = 1, delay = 0, volume = 1, type = 'square') {
        const tone = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        gain.gain.value = volume;
        tone.connect(gain);
        gain.connect(this.mainGainNode);
        tone.type = type;
        tone.frequency.value = this.notes[freq[0]][freq[1]];
        tone.start(this.audioContext.currentTime + delay);
        tone.stop(this.audioContext.currentTime + duration + delay);
        return tone;
    }

    /*------STOP A GENERATED TONE------*/
    stopTone(tone) {
        tone.stop();
        return tone;
    }

    /*-----------SPECIAL THANKS TO MDN FOR THIS FREQUENCY TABLE-----------*/
    static get notes() {
        const n = [];
        for (let i = 0; i < 9; i++) {
            n[i] = [];
        }
        n[0]['A'] = 27.500000000000000;
        n[0]['A#'] = 29.135235094880619;
        n[0]['B'] = 30.867706328507756;
        n[1]['C'] = 32.703195662574829;
        n[1]['C#'] = 34.647828872109012;
        n[1]['D'] = 36.708095989675945;
        n[1]['D#'] = 38.890872965260113;
        n[1]['E'] = 41.203444614108741;
        n[1]['F'] = 43.653528929125485;
        n[1]['F#'] = 46.249302838954299;
        n[1]['G'] = 48.999429497718661;
        n[1]['G#'] = 51.913087197493142;
        n[1]['A'] = 55.000000000000000;
        n[1]['A#'] = 58.270470189761239;
        n[1]['B'] = 61.735412657015513;
        n[2]['C'] = 65.406391325149658;
        n[2]['C#'] = 69.295657744218024;
        n[2]['D'] = 73.416191979351890;
        n[2]['D#'] = 77.781745930520227;
        n[2]['E'] = 82.406889228217482;
        n[2]['F'] = 87.307057858250971;
        n[2]['F#'] = 92.498605677908599;
        n[2]['G'] = 97.998858995437323;
        n[2]['G#'] = 103.826174394986284;
        n[2]['A'] = 110.000000000000000;
        n[2]['A#'] = 116.540940379522479;
        n[2]['B'] = 123.470825314031027;
        n[3]['C'] = 130.812782650299317;
        n[3]['C#'] = 138.591315488436048;
        n[3]['D'] = 146.832383958703780;
        n[3]['D#'] = 155.563491861040455;
        n[3]['E'] = 164.813778456434964;
        n[3]['F'] = 174.614115716501942;
        n[3]['F#'] = 184.997211355817199;
        n[3]['G'] = 195.997717990874647;
        n[3]['G#'] = 207.652348789972569;
        n[3]['A'] = 220.000000000000000;
        n[3]['A#'] = 233.081880759044958;
        n[3]['B'] = 246.941650628062055;
        n[4]['C'] = 261.625565300598634;
        n[4]['C#'] = 277.182630976872096;
        n[4]['D'] = 293.664767917407560;
        n[4]['D#'] = 311.126983722080910;
        n[4]['E'] = 329.627556912869929;
        n[4]['F'] = 349.228231433003884;
        n[4]['F#'] = 369.994422711634398;
        n[4]['G'] = 391.995435981749294;
        n[4]['G#'] = 415.304697579945138;
        n[4]['A'] = 440.000000000000000;
        n[4]['A#'] = 466.163761518089916;
        n[4]['B'] = 493.883301256124111;
        n[5]['C'] = 523.251130601197269;
        n[5]['C#'] = 554.365261953744192;
        n[5]['D'] = 587.329535834815120;
        n[5]['D#'] = 622.253967444161821;
        n[5]['E'] = 659.255113825739859;
        n[5]['F'] = 698.456462866007768;
        n[5]['F#'] = 739.988845423268797;
        n[5]['G'] = 783.990871963498588;
        n[5]['G#'] = 830.609395159890277;
        n[5]['A'] = 880.000000000000000;
        n[5]['A#'] = 932.327523036179832;
        n[5]['B'] = 987.766602512248223;
        n[6]['C'] = 1046.502261202394538;
        n[6]['C#'] = 1108.730523907488384;
        n[6]['D'] = 1174.659071669630241;
        n[6]['D#'] = 1244.507934888323642;
        n[6]['E'] = 1318.510227651479718;
        n[6]['F'] = 1396.912925732015537;
        n[6]['F#'] = 1479.977690846537595;
        n[6]['G'] = 1567.981743926997176;
        n[6]['G#'] = 1661.218790319780554;
        n[6]['A'] = 1760.000000000000000;
        n[6]['A#'] = 1864.655046072359665;
        n[6]['B'] = 1975.533205024496447;
        n[7]['C'] = 2093.004522404789077;
        n[7]['C#'] = 2217.461047814976769;
        n[7]['D'] = 2349.318143339260482;
        n[7]['D#'] = 2489.015869776647285;
        n[7]['E'] = 2637.020455302959437;
        n[7]['F'] = 2793.825851464031075;
        n[7]['F#'] = 2959.955381693075191;
        n[7]['G'] = 3135.963487853994352;
        n[7]['G#'] = 3322.437580639561108;
        n[7]['A'] = 3520.000000000000000;
        n[7]['A#'] = 3729.310092144719331;
        n[7]['B'] = 3951.066410048992894;
        n[8]['C'] = 4186.009044809578154;
        return n;
    }
}