import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static _ins: AudioController;
    public static checkSoud: boolean = false;
    @property(AudioClip)
    soundList: AudioClip[] = [];
    @property(AudioSource)
    audioSource: AudioSource | null = null;
    soundVolume: number = 1;
    static get instance () {
        if (this._ins) {
            return this._ins;
        }
        this._ins = new AudioController();
        return this._ins;
    }
    start() {

    }
    
    Setsound(value: boolean) {
        AudioController.checkSoud = value;
    }
}

