import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
    public static instance: AudioController = null;
    public static checkSoud: boolean = false;
    @property(AudioClip)
    soundList: AudioClip[] = [];
    @property(AudioSource)
    audioSource:AudioSource | null = null;
    start() {
        
    }

    update(deltaTime: number) {
        
    }
}


