import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static instance: AudioController;
    public static checkSoud: boolean = false;
    @property(AudioClip)
    soundList: AudioClip[] = [];
    @property(AudioSource)
    audioSource: AudioSource | null = null;
    start() {
        AudioController.checkSoud = true;
    }

    play(name: string) {
        if (AudioController.checkSoud) {
            if (this.audioSource == null) {
                this.audioSource = this.node.addComponent(AudioSource);
            }
            this.audioSource.playOneShot(this.soundList[name],1.0);
        }
    }
    Setsound(value: boolean) {
        AudioController.checkSoud = value;
    }
}

