import { _decorator, Component, director, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass,property } = _decorator;

@ccclass('LoseUI')
export class LoseUI extends Component {
    @property(Sprite)
    iconcry: Sprite | null= null;
    @property(SpriteFrame)
    listiconcry: SpriteFrame[] = [];
    start(){
        this.setLose();
    }

    private ReloadButtonCallback;
    setUp(ReloadButtonCallback){
        this.ReloadButtonCallback = ReloadButtonCallback;
    }
    
    OnReload(){
        director.loadScene('game');
        if(this.ReloadButtonCallback){
            this.ReloadButtonCallback;
        }
    }
 
    public setLose(){
        //set lose
        if(this.iconcry){
            this.iconcry.spriteFrame = this.listiconcry[Math.floor(Math.random()*this.listiconcry.length)];
        } 
       //icon effect    
        tween(this.iconcry.node).sequence(
                tween(this.iconcry.node).parallel(
                    tween(this.iconcry.node).to(0.5,{scale:new Vec3(0.7,0.7,1)}),
                    tween(this.iconcry.node).to(0.5,{eulerAngles:new Vec3(0,0,-30)}),),
                tween(this.iconcry.node).parallel(
                    tween(this.iconcry.node).to(0.5, { scale: new Vec3(1, 1, 1) }),
                    tween(this.iconcry.node).by(0.5, { eulerAngles: new Vec3(0, 0, 30) })
            ),
            tween().delay(0.5),
            ).repeatForever().start();
            //skip
            
    }
}


