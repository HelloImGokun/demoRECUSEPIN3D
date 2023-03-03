import { _decorator, Collider, Component, ICollisionEvent, Node, SkeletalAnimationComponent, tween, Tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NCP')
export class NCP extends Component {
    playerAnimator:SkeletalAnimationComponent | null = null;
    isFinish:boolean=false;
    start () {
        // [3]
        this.playerAnimator = this.getComponent(SkeletalAnimationComponent);
        //this.playerAnimator.play('walk');
        this.playerAnimator.play('wave')
        // let collider = this.getComponent(Collider);
        // collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }
    public wave(){
        tween(this.node).sequence(
            tween(this.node).to(0.2,{eulerAngles:new Vec3(0,90,0)}),
            tween(this.node).call(()=>{
                this.playerAnimator.play('victory');
            })
   
        ).start();

    }
    // private onCollisionEnter(event: ICollisionEvent){
    //     if(this.isFinish) return;
    //     let name = event.otherCollider.node.name;
    //     if(name.includes('player1')){
    //         //cheer up
    //         this.isFinish=true;
    //         tween(this.node).by(0.5,{eulerAngles:new Vec3(0,90,0)}).start();
    //         this.playerAnimator.play('victory');
    //     }
    // }
}


