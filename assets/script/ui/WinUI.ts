import { _decorator, Component, instantiate, Label, Prefab, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WinUI')
export class WinUI extends Component {
    //
    COMPLETED_COMMENT: string[] = ['Great!', 'Epic!', 'Fantasic!', 'Impressive!', 'Fabulous!', 'Beautiful!', 'Wonderful!', 'Awesome!', 'Incredible!', 'Phenomenal!', 'Brilliant!'];
    //winUI
    @property(Label)
    winLabel: Label | null = null;
    @property(Sprite)
    iconWin: Sprite | null = null;
    @property(SpriteFrame)
    smileFrames: SpriteFrame[] = [];
    @property(Prefab)
    confettiPrefab: Prefab = null;
    start() {
        this.setWin();
    }

    private nextButtonCallback;
    setUp(nextButtonCallback) {
        this.nextButtonCallback = nextButtonCallback;
    }
    onNextLevel() {
        this.node.destroy();
        //
        if (this.nextButtonCallback) {
            this.nextButtonCallback();
        }
    }
    public setWin() {
        //set win complete lb
        let complete = this.COMPLETED_COMMENT[Math.floor(Math.random() * this.COMPLETED_COMMENT.length)];
        if (this.winLabel) {
            this.winLabel.string = complete;
        }
        //random icon Win
        let smileFrames = this.smileFrames[Math.floor(Math.random() * this.smileFrames.length)];
        this.iconWin.spriteFrame = smileFrames;
        //icon effect
        tween(this.iconWin.node).sequence(
            tween(this.iconWin.node).parallel(
                tween(this.iconWin.node).to(0.5, { scale: new Vec3(0.7, 0.7, 1) }),
                tween(this.iconWin.node).to(0.5, { eulerAngles: new Vec3(0, 0, -30) }),
                ),
            tween(this.iconWin.node).parallel(
                tween(this.iconWin.node).to(0.5, { scale: new Vec3(1, 1, 1) }),
                tween(this.iconWin.node).by(0.5, { eulerAngles: new Vec3(0, 0, 30) })
            ),
            tween().delay(0.5),
        ).repeatForever().start();

        //con effect
        let conf = instantiate(this.confettiPrefab);
        this.node.addChild(conf);
        //coin value
        let coinValue = Math.floor(Math.random() * 200);
    }

}


